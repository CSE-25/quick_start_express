import { existsSync, mkdirSync } from "fs";

export const initLog = () => {
    if (!existsSync("./logs")) {
        mkdirSync("./logs");
    }

    if (!existsSync("./logs/controller")) {
        mkdirSync("./logs/controller");
    }

    if (!existsSync("./logs/db")) {
        mkdirSync("./logs/db");
    }

    if (!existsSync("./logs/connection")) {
        mkdirSync("./logs/connection");
    }
};
