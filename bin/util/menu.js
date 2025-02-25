import { select, input, confirm } from "@inquirer/prompts";
import { templates } from "../configs.js";

// `initMenu` function is used to prompt the user for input when the `init` command is run.
export async function initMenu(initCommand, options) {
    console.log();

    options.template = await select({
        message: "Select a template to use (default: basic)",
        choices: Object.values(templates).map((template) => ({
            name: template.name,
            value: template.name,
        })),
        default: "basic",
    });

    options.name = await input({
        message: "Enter a name for your server app (default: qse-server)",
        default: "qse-server",
    });

    options.dockerCompose = await confirm({
        message:
            "Do you want to generate a Docker Compose file? (default: Yes)",
        default: true,
    });

    options.removeNodemon = !(await confirm({
        message: "Do you want nodemon hot-reload support? (default: Yes)",
        default: true,
    }));

    options.removeDeps = !(await confirm({
        message:
            "Do you wish to install dependencies after template generation? (default: Yes)",
        default: true,
    }));

    initCommand(options);
}
