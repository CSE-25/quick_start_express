import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import { createSpinner } from "nanospinner";
import { confirm } from "@inquirer/prompts";

// clearCWD deletes all files and folders the current working directory.
export async function clearCWD() {
    const targetDir = process.cwd();
    console.log(
        chalk.yellow.bold("\nWARNING: This operation is irreversible."),
    );
    console.log(
        chalk.white("You are about to delete all files in the directory:"),
        chalk.red.bold(targetDir),
        "\n",
    );

    const clearConfirmation = await confirm({
        message: "Are you sure you want to proceed? (Default: No)",
        default: false,
    });

    if (clearConfirmation) {
        const clearingDirectory = createSpinner(
            "Scanning project directory...",
        ).start();
        try {
            const files = fs.readdirSync(targetDir);

            clearingDirectory.update({
                text: "Deleting all files...",
            });

            for (const file of files) {
                const filePath = path.join(targetDir, file);
                fs.removeSync(filePath);
            }

            clearingDirectory.success({
                text: chalk.green.bold(
                    "Successfully cleared project directory.",
                ),
            });
        } catch (error) {
            clearingDirectory.error({
                text: chalk.red.bold("Error clearing project directory."),
            });
            console.error(error);
        }
    } else {
        const cancelSpinner = createSpinner("Cancelling operation...").start();
        cancelSpinner.success({
            text: chalk.white("Operation cancelled successfully."),
        });
    }
}
