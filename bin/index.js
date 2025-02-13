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
import {
    getServicesData,
    generateDockerComposeFile,
    userPrompts,
} from "./util/docker.js";
import { initMenu } from "./util/menu.js";
import { clearCWD } from "./util/clear.js";

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
    .option(
        commands.init.options[4].flags,
        commands.init.options[4].description,
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
                    `- ${commandInfo.command}${commandInfo.description
                        ? ": " + commandInfo.description
                        : ""
                    }`,
                );
            }

            if (commandInfo.options) {
                commandInfo.options.forEach((option) => {
                    console.log(
                        `  (Options: ${option.flags}${option.description ? " - " + option.description : ""
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
        clearCWD();
    });

program
    .command(commands.add.command)
    .description(commands.add.description)
    .action((template) => {
        const parentDir = path.resolve(__dirname, "..");
        const templatePath = path.join(parentDir, "templates", template);
        const currentPath = process.cwd();
        const currentPackageJsonPath = path.join(currentPath, "package.json");
        const currentPackageJson = fs.existsSync(currentPackageJsonPath)
            ? JSON.parse(fs.readFileSync(currentPackageJsonPath, "utf-8"))
            : {};
        const currentTemplateName = currentPackageJson.name;

        if (!fs.existsSync(templatePath)) {
            console.error(`Template "${template}" not found.`);
            process.exit(1);
        }

        const templateItems = fs.readdirSync(templatePath);
        const currentItems = fs.readdirSync(currentPath);
        const commonItems = currentItems.filter((item) => templateItems.includes(item));

        commonItems.forEach((item) => {
            const templateItemPath = path.join(templatePath, item);
            const currentItemPath = path.join(currentPath, item);

            if (fs.statSync(templateItemPath).isDirectory() && fs.statSync(currentItemPath).isDirectory()) {
                const templateSubDir = path.join(currentPath, item, `${template}`);
                const currentSubDir = path.join(currentPath, item, `${currentTemplateName}`);

                fs.ensureDirSync(templateSubDir);
                fs.ensureDirSync(currentSubDir);

                fs.copySync(templateItemPath, templateSubDir, { overwrite: true });

                fs.readdirSync(currentItemPath).forEach((subItem) => {
                    const srcPath = path.join(currentItemPath, subItem);
                    const destPath = path.join(currentSubDir, subItem);
                    if (subItem !== template && subItem !== currentTemplateName) {
                        fs.moveSync(srcPath, destPath, { overwrite: true });
                    }
                });
            } else {
                // console.log(`${item} is a common file`);
            }
        });

        const updateImports = (dirPath) => {
            fs.readdirSync(dirPath).forEach((item) => {
                const fullPath = path.join(dirPath, item);

                if (fs.statSync(fullPath).isDirectory()) {
                    if (item !== "node_modules") {
                        updateImports(fullPath); 
                    }
                    return;
                }

                if (!/\.(js|ts|jsx|tsx)$/.test(item)) {
                    return;
                }

                let content = fs.readFileSync(fullPath, "utf-8");
                let lines = content.split("\n");
                let updated = false;

                lines = lines.map((line) => {
                    if (!line.trim().startsWith("import")) {
                        return line;
                    }
                    // console.log(line);

                    return line.replace(/from ['"](.+\.js)['"]/, (match, importPath) => {
                        console.log("Matched:", match);
                        console.log("Original Import Path:", importPath);

                        const currentDir = path.dirname(fullPath);
                        const templateName = path.basename(currentDir);
                        console.log("Base name: ", path.basename(currentDir));

                        const adjustedImportPath = path.join(
                            path.dirname(importPath),
                            templateName,
                            path.basename(importPath)
                        );
                        console.log("testttt: ",currentDir, path.dirname(importPath));

                        const absoluteImportPath = path.resolve(currentDir, adjustedImportPath);

                        console.log("Adjusted Import Path:", adjustedImportPath);
                        console.log("Resolved Absolute Path:", absoluteImportPath);
                        console.log();

                        if (!fs.existsSync(absoluteImportPath)) {
                            console.log("File does not exist after adjustment, keeping original import.");
                            return match;
                        }

                        // Compute the new relative import path
                        const newRelativePath = path.relative(currentDir, absoluteImportPath).replace(/\\/g, "/");

                        console.log("Updated Import Path:", newRelativePath);
                        console.log();

                        updated = true;

                        return `from '${newRelativePath}'`;
                    });

                });

                if (updated) {
                    fs.writeFileSync(fullPath, lines.join("\n"), "utf-8");
                    console.log(`Updated imports in: ${fullPath}`);
                }
            });
        };

        updateImports(currentPath);
        console.log("Import paths updated successfully.");
    });

async function initCommand(options) {
    const selectedTemplate = options.template || "basic"; // Default to 'basic' if no template is specified
    const packageName = options.name || "qse-server"; // Default to 'qse-server' if no name is specified
    const removeNodemon = options.removeNodemon;
    const removeDependencies = options.removeDeps;
    const dockerCompose = options.dockerCompose;

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

    const targetDir = process.cwd();
    const templatePath = path.join(
        parentDir,
        "templates",
        templates[selectedTemplate].name,
    );

    const isUrl = templates[selectedTemplate].isUrl;
    const needDB = templates[selectedTemplate].needDB;
    let runtimeNeedDB = false;

    let dockerTemplate =
        selectedTemplate.split("_")[0] === "express" ||
            selectedTemplate.split("_")[0] === "basic"
            ? "express"
            : selectedTemplate.split("_")[0];

    const dockerTemplatePath = path.join(
        parentDir,
        "templates",
        "Docker",
        dockerTemplate,
        "Dockerfile",
    );

    const destinationPath = path.join(targetDir);
    const dockerFileDestination = path.join(destinationPath, "Dockerfile");

    if (dockerCompose) {
        try {
            const userPrompt = await userPrompts(needDB);
            if (needDB) {
                runtimeNeedDB = userPrompt.runtimeNeedDB;
            }

            const serviceData = await getServicesData(
                packageName,
                selectedTemplate,
                runtimeNeedDB,
                userPrompt.addCacheService,
            );

            console.log("Starting server initialization...");

            const dockerSpinner = createSpinner(
                `Creating Docker Compose File with Entered Services...`,
            ).start();

            const composeFileContent = generateDockerComposeFile(
                runtimeNeedDB,
                serviceData,
                packageName,
                selectedTemplate,
            );
            const composeFilePath = path.join(targetDir, "docker-compose.yml");

            fs.writeFileSync(composeFilePath, composeFileContent);
            dockerSpinner.success({
                text: `Docker Compose file generated successfully.`,
            });
        } catch (error) {
            console.log(chalk.red("Error generating Docker Compose file"));
            console.error(error.message);
            return;
        }
    } else {
        console.log("Starting server initialization...");
    }

    const copySpinner = createSpinner("Creating server files...").start();
    try {
        await fs.copy(templatePath, destinationPath);
        if (dockerCompose) {
            try {
                await fs.copyFile(dockerTemplatePath, dockerFileDestination);
            } catch (error) {
                copySpinner.error({ text: "Error creating Dockerfile.\n" });
                console.error(error.message);
            }
        }

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
    if (dockerCompose) {
        console.log(
            chalk.yellow("To start your services with Docker Compose:"),
            chalk.white.bold("docker compose up -d"),
        );
    }

    if (dockerCompose && isUrl === true && runtimeNeedDB === true) {
        console.log(
            chalk.yellow("Important Note:"),
            chalk.white("Use"),
            chalk.blueBright.bold("host.docker.internal"),
            chalk.white("instead of"),
            chalk.blueBright.bold("localhost/127.0.0.1"),
            chalk.white("in your Database Connection URL in the"),
            chalk.blueBright.bold(".env"),
            chalk.white("file for Docker to work correctly."),
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
