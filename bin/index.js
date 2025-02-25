#!/usr/bin/env node

import { Option, program } from "commander";
import figlet from "figlet";
import chalk from "chalk";
import {
    metadata,
    commands,
    templates,
    supportedDockerComposeCacheImages,
} from "./configs.js";
import { clearCWD } from "./util/clear.js";
import { initCommand } from "./init.js";

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
    .addOption(
        // Option is used to automatically generate the help message
        // and to validate the input.
        new Option(
            commands.init.options[3].flags,
            commands.init.options[3].description,
        ).choices(supportedDockerComposeCacheImages.concat("skip")),
    )
    .option(
        commands.init.options[4].flags,
        commands.init.options[4].description,
    )
    .option(
        commands.init.options[5].flags,
        commands.init.options[5].description,
    )
    .option(
        commands.init.options[6].flags,
        commands.init.options[6].description,
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
        clearCWD();
    });

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
