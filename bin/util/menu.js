import { select, input, confirm } from "@inquirer/prompts";
import { templates } from "../configs.js";

// `initMenu` function is used to prompt the user for input when the `init` command is run.
export async function initMenu(initCommand) {
    console.log();

    const selectedTemplate = await select({
        message: "Select a template to use (default: basic)",
        choices: Object.values(templates).map((template) => ({
            name: template.name,
            value: template.name,
        })),
        default: "basic",
    });

    const packageName = await input({
        message: "Enter a name for your server app (default: qse-server)",
        default: "qse-server",
    });

    const addDockerCompose = await confirm({
        message:
            "Do you want to generate a Docker Compose file? (default: Yes)",
        default: true,
    });

    const needNodemon = await confirm({
        message: "Do you want nodemon hot-reload support? (default: Yes)",
        default: true,
    });

    const installDeps = await confirm({
        message:
            "Do you wish to install dependencies after template generation? (default: Yes)",
        default: true,
    });

    const options = {
        template: selectedTemplate,
        name: packageName,
        removeNodemon: !needNodemon,
        removeDeps: !installDeps,
        dockerCompose: addDockerCompose,
    };

    console.log();

    initCommand(options);
}
