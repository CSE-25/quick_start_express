import { existsSync, mkdirSync } from "fs";

export const initLog = () => {
    if (!existsSync("./logs")) {
        mkdirSync("./logs");
    }

    if (!existsSync("./logs/middleware")) {
        mkdirSync("./logs/middleware");
    }

    if (!existsSync("./logs/controller")) {
        mkdirSync("./logs/controller");
    }
};
