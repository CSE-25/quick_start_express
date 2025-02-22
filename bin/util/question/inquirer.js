import { confirm, select } from "@inquirer/prompts";

export async function askConfirmation(message, defaultValue = true) {
    return confirm({
        message,
        default: defaultValue,
    });
}

export async function askSelection(message, choices) {
    return select({
        message: message,
        choices: choices.map((choice) => ({ name: choice, value: choice })),
    });
}
