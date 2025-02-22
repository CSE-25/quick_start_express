export function confirmationQuestion(questionCallback) {
    return async function (message, defaultValue = true) {
        return await questionCallback(message, defaultValue);
    };
}

export function selectionQuestion(questionCallback) {
    return async function (message, choices) {
        return await questionCallback(message, choices);
    };
}
