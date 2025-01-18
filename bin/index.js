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
import { initMenu } from "./util/menu.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const parentDir = path.dirname(__dirname);

program
    .name(metadata.command)
    .version(metadata.version, commands.version.command)
    .description(metadata.description);

program
    .command(commands.init.command)
    .description(commands.init.description)
    .option(
        commands.init.options[0].flags,
        commands.init.options[0].description,
    )
    .option(
        commands.init.options[1].flags,
        commands.init.options[1].description,
    )
    .option(
        commands.init.options[2].flags,
        commands.init.options[2].description,
    )
    .option(
        commands.init.options[3].flags,
        commands.init.options[3].description,
    )
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
                        commandInfo.description
                            ? ": " + commandInfo.description
                            : ""
                    }`,
                );
            }

            if (commandInfo.options) {
                commandInfo.options.forEach((option) => {
                    console.log(
                        `  (Options: ${option.flags}${
                            option.description ? " - " + option.description : ""
                        })`,
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
        const clearingDirectory = createSpinner(
            "Deleting All Files...",
        ).start();
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
            clearingDirectory.error({
                text: "Error clearing project directory",
            });
            console.error(error);
        }
    });

async function initCommand(options) {
    const selectedTemplate = options.template || "basic"; // Default to 'basic' if no template is specified
    const packageName = options.name || "qse-server"; // Default to 'qse-server' if no name is specified
    const removeNodemon = options.removeNodemon;
    const removeDependencies = options.removeDeps;

    if (!options.template) {
        initMenu(initCommand);
        return;
    }

    if (packageName) {
        const validateResult = validate(packageName);
        if (validateResult.validForNewPackages === false) {
            const errors = validateResult.errors || validateResult.warnings;
            console.error(
                chalk.red.bold(
                    `Invalid package name: ${errors.join(
                        ", ",
                    )}. Please provide a valid package name.`,
                ),
            );
            return;
        }
    }

    if (!templates[selectedTemplate]) {
        console.error(
            chalk.red(
                `Template ${chalk.bgRed.bold(
                    selectedTemplate,
                )} does not exist. To see available templates use ${chalk.yellow(
                    '"qse list"',
                )}.`,
            ),
        );
        return;
    }

    console.log("Starting server initialization...");

    const targetDir = process.cwd();
    const templatePath = path.join(
        parentDir,
        "templates",
        templates[selectedTemplate].name,
    );

    const destinationPath = path.join(targetDir);

    const copySpinner = createSpinner("Creating server files...").start();
    try {
        await fs.copy(templatePath, destinationPath);

        copySpinner.success({ text: "Created server files successfully." });

        if (removeNodemon) {
            const nodemonSpinner = createSpinner("Removing nodemon...").start();
            try {
                const packageJsonPath = path.join(
                    destinationPath,
                    "package.json",
                );
                const packageJsonContent = fs.readFileSync(
                    packageJsonPath,
                    "utf8",
                );
                const packageJson = JSON.parse(packageJsonContent);

                if (
                    packageJson.devDependencies &&
                    packageJson.devDependencies.nodemon
                ) {
                    delete packageJson.devDependencies.nodemon;
                    if (!Object.keys(packageJson.devDependencies).length) {
                        delete packageJson.devDependencies;
                    }
                }
                if (packageJson.scripts && packageJson.scripts.dev) {
                    delete packageJson.scripts.dev;
                }

                fs.writeFileSync(
                    packageJsonPath,
                    JSON.stringify(packageJson, null, 2),
                );

                nodemonSpinner.success({
                    text: "Removed nodemon successfully.",
                });
            } catch (err) {
                nodemonSpinner.error({ text: "Error removing nodemon.\n" });
                console.error(err.message);
            }
        }
    } catch (err) {
        copySpinner.error({ text: "Error creating server files.\n" });
        console.error(err.message);
    }

    const addNameAndTypeSpinner = createSpinner(
        "Adding name and type declaration...",
    ).start();
    try {
        const packageJsonPath = path.join(targetDir, "package.json");
        const packageJsonContent = fs.readFileSync(packageJsonPath, "utf8");
        const packageJson = JSON.parse(packageJsonContent);
        packageJson.name = packageName; // Set custom package name
        packageJson.type = "module"; // Define type as module
        fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

        addNameAndTypeSpinner.success({
            text: "Added name and type declaration successfully.",
        });
    } catch (err) {
        addNameAndTypeSpinner.error({
            text: "Error adding type declaration.\n",
        });
        console.error(err.message);
    }

    if (!removeDependencies) {
        const installDependencies = createSpinner(
            "Installing dependency packages...",
        ).start();
        try {
            execSync("npm i", { stdio: "ignore", cwd: targetDir });

            installDependencies.success({
                text: "Installed dependencies successfully.",
            });
        } catch (err) {
            installDependencies.error({
                text: "Error installing dependencies.\n",
            });
            console.error(err);
        }
    }

    console.log(chalk.green.bold("\nSetup complete! To run your server:"));
    if (removeDependencies) {
        console.log(
            chalk.yellow("Install dependencies: "),
            chalk.white.bold("npm i"),
        );
    }
    console.log(chalk.yellow("Run:"), chalk.white.bold("npm start"));
    if (!removeNodemon) {
        console.log(
            chalk.yellow("Run with hot reloading:"),
            chalk.white.bold("npm run dev"),
        );
    }
}

const toolIntro = () => {
    console.log(
        figlet.textSync(metadata.name, {
            font: "Standard",
            horizontalLayout: "default",
            verticalLayout: "default",
            width: 90,
            whitespaceBreak: true,
        }),
    );

    console.log(chalk.green.bold(metadata.oneLineDescription));
};

program.parse(process.argv);
