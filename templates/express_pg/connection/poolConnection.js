import pg from "pg";
import { appendFileSync } from "fs";

import { appConfig } from "../config/appConfig.js";

const { Pool } = pg;

let pool = null;
try {
    pool = new Pool(appConfig.pool_db);
} catch (err) {
    const timeStamp = new Date().toLocaleString();
    const errMessage = `[ERROR]: ${timeStamp} - ${err.message}`;
    console.error(errMessage);
    appendFileSync("./logs/connection/normalConnection.log", `${errMessage}\n`);
}

export { pool };
