import pg from "pg";
import { appendFileSync } from "fs";

import { appConfig } from "../config/appConfig.js";

const { Client } = pg;

const getDb = () => {
    let db = null;
    try {
        db = new Client(appConfig.db);
        return db;
    } catch (err) {
        const timeStamp = new Date().toLocaleString();
        const errMessage = `[ERROR]: ${timeStamp} - ${err.message}`;
        console.error(errMessage);
        appendFileSync(
            "./logs/connection/normalConnection.log",
            `${errMessage}\n`,
        );
    }
};

export { getDb };
