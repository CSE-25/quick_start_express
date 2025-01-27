import { appendFileSync } from "fs";
import { Response } from "express";

export const handleError = (
    err: Error,
    res: Response,
    filePath: string,
    statusCode: Number,
    message: string,
) => {
    const timeStamp = new Date().toLocaleString();
    const errMessage = `[ERROR]: ${timeStamp} - ${err.message}`;
    console.error(errMessage);
    appendFileSync(`./logs/${filePath}`, `${errMessage}\n`);

    return res.status(statusCode).send({
        message: message,
        error: "Internal Server Error",
    });
};
