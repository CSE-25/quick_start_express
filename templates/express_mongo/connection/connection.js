import { MongoClient } from "mongodb";
import { appendFileSync } from "fs";

import { appConfig } from "../config/appConfig.js";

let client = null;
let db = null;

try {
    client = new MongoClient(appConfig.db.connUrl, { ...appConfig.db.options });
    db = client.db(appConfig.db.dbname);
} catch (err) {
    const timeStamp = new Date().toLocaleString();
    const errMessage = `[ERROR]: ${timeStamp} - ${err.message}`;
    console.error(errMessage);
    appendFileSync("./logs/connection/connection.log", `${errMessage}\n`);
}

export { db };
