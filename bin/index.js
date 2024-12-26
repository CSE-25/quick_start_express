#!/usr/bin/env node

import { program } from "commander";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";
import figlet from "figlet";
import chalk from "chalk";
import { createSpinner } from "nanospinner";
import { metadata, commands, templates } from "./configs.js";
import validate from "validate-npm-package-name";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

program
  .name(metadata.command)
  .version(metadata.version, commands.version.command)
  .description(metadata.description);

program
  .command(commands.init.command)
  .description(commands.init.description)
  .option(commands.init.options[0].flags, commands.init.options[0].description)
  .option(commands.init.options[1].flags, commands.init.options[1].description)
  .action((options) => {
    toolIntro();
    initCommand(options);
  });

program
  .command(commands.list.command)
  .description(commands.list.description)
  .action(() => {
    console.log("Available Commands:");
    Object.keys(commands).forEach((cmd) => {
      const commandInfo = commands[cmd];
      if (commandInfo.command) {
        console.log(
          `- ${commandInfo.command}${
            commandInfo.description ? ": " + commandInfo.description : ""
          }`
        );
      }

      if (commandInfo.options) {
        commandInfo.options.forEach((option) => {
          console.log(
            `  (Options: ${option.flags}${
              option.description ? " - " + option.description : ""
            })`
          );
        });
      }
    });

    console.log("\nAvailable Templates:");
    Object.keys(templates).forEach((template) => {
      console.log(`- ${templates[template].name}`);
    });
  });

program
  .command(commands.clear.command)
  .description(commands.clear.description)
  .action(() => {
    const targetDir = process.cwd();
    console.log("Clearing Directory...", chalk.bgRed.white(targetDir));
    const clearingDirectory = createSpinner("Deleting All Files...").start();
    try {
      // Read the directory.
      const files = fs.readdirSync(targetDir);

      for (const file of files) {
        const filePath = path.join(targetDir, file);
        // if (file !== '.' && file !== '..') {
        fs.removeSync(filePath);
        // }
      }

      clearingDirectory.success({
        text: "Successfully cleared project directory.",
      });
    } catch (error) {
      clearingDirectory.error({ text: "Error clearing project directory" });
      console.error(error);
    }
  });

function initCommand(options) {
  const selectedTemplate = options.template || "basic"; // Default to 'basic' if no template is specified
  const packageName = options.name || "quick-start-express-server"; // Default to 'quick-start-express-server' if no name is specified

  if (packageName) {
    const validateResult = validate(packageName);
    if (validateResult.validForNewPackages === false) {
      if (validateResult.errors) {
        console.error(
          chalk.red.bold(
            `Invalid package name: ${validateResult.errors}. Please provide a valid package name.`
          )
        );
      } else if (validateResult.warnings) {
        console.error(
          chalk.red.bold(
            `Invalid package name: ${validateResult.warnings}. Please provide a valid package name.`
          )
        );
      }
      return;
    }
  }

  if (!templates[selectedTemplate]) {
    console.error(
      chalk.red(
        `Template ${chalk.bgRed.bold(
          selectedTemplate
        )} does not exist. To see available templates use ${chalk.yellow(
          '"qse list"'
        )}.`
      )
    );
    return;
  }

  console.log("Starting server initialization...");

  const targetDir = process.cwd();
  const parentDir = path.dirname(__dirname);
  const templatePath = path.join(
    parentDir,
    "templates",
    templates[selectedTemplate].name
  );
  const destinationPath = path.join(targetDir);
  const npmInit = chalk.yellow.bold("npm init");

  // Initialize package.json
  const initSpinner = createSpinner(`Running ${npmInit}...`).start();
  try {
    execSync("npm init -y", { stdio: "ignore", cwd: targetDir });

    const packageJsonPath = path.join(targetDir, "package.json");
    const packageJsonContent = fs.readFileSync(packageJsonPath, "utf8");
    const packageJson = JSON.parse(packageJsonContent);
    packageJson.name = packageName;
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

    initSpinner.success({ text: `${npmInit} completed successfully.` });
  } catch (err) {
    initSpinner.error({ text: `Error running ${npmInit}:\n` });
    console.error(err.message);
    return;
  }

  const copySpinner = createSpinner("Creating server files...").start();
  try {
    fs.copySync(templatePath, destinationPath);

    copySpinner.success({ text: "Created server files successfully." });
  } catch (err) {
    copySpinner.error({ text: "Error creating server files.\n" });
    console.error(err.message);
  }

  const addTypeDeclaration = createSpinner(
    "Adding type declaration..."
  ).start();
  try {
    const packageJsonPath = path.join(targetDir, "package.json");
    const packageJsonContent = fs.readFileSync(packageJsonPath, "utf8");
    const packageJson = JSON.parse(packageJsonContent);
    packageJson.type = "module";
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

    addTypeDeclaration.success({
      text: "Added type declaration successfully.",
    });
  } catch (err) {
    addTypeDeclaration.error({ text: "Error adding type declaration.\n" });
    console.error(err.message);
  }

  const addDependencies = createSpinner(
    "Adding dependency packages..."
  ).start();
  try {
    const packageJsonPath = path.join(targetDir, "package.json");
    const packageJsonContent = fs.readFileSync(packageJsonPath, "utf8");
    const packageJson = JSON.parse(packageJsonContent);
    packageJson.dependencies = packageJson.dependencies || {};

    templates[selectedTemplate].dependencies.forEach((dependency) => {
      packageJson.dependencies[`${dependency.name}`] = dependency.version;
    });
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

    addDependencies.success({
      text: "Added dependency packages successfully.",
    });
  } catch (err) {
    addDependencies.error("Error adding dependency packages.\n");
    console.error(err.message);
  }

  const installDependencies = createSpinner(
    "Installing dependency packages..."
  ).start();
  try {
    execSync("npm i", { stdio: "ignore", cwd: targetDir });

    installDependencies.success({
      text: "Installed dependencies successfully.",
    });
  } catch (err) {
    installDependencies.error({ text: "Error installing dependencies.\n" });
    console.error(err);
  }

  console.log(chalk.green.bold("\nSetup complete! To run your server:"));
  console.log(chalk.yellow("Run:"), chalk.white.bold("npm start"));
}

const toolIntro = () => {
  console.log(
    figlet.textSync(metadata.name, {
      font: "Standard",
      horizontalLayout: "default",
      verticalLayout: "default",
      width: 90,
      whitespaceBreak: true,
    })
  );

  console.log(chalk.green.bold(metadata.oneLineDescription));
};

program.parse(process.argv);
