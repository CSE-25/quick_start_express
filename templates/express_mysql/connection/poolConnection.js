import { createPool } from "mysql2";
import { appConfig } from "../config/appConfig.js";
import { appendFileSync } from "fs";

let db = null;
try {
    db = createPool(appConfig.pool_db);
} catch (err) {
    const timeStamp = new Date().toLocaleString();
    const errMessage = `[ERROR]: ${timeStamp} - ${err.message}`;
    console.error(errMessage);
    appendFileSync("./logs/connection/poolConnection.log", `${errMessage}\n`);
}

export default db;
