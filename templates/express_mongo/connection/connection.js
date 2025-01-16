import { MongoClient } from "mongodb";
import { appendFileSync } from "fs";

import { appConfig } from "../config/appConfig.js";

let client = null;
let db = null;

try {
    const options = appConfig.db.options;
    const connUrl = `mongodb://${options.user ? `${options.user}:${options.pass}@` : ""}${options.host}:${options.port}`;
    client = new MongoClient(connUrl, { maxPoolSize: options.maxPoolSize });
    db = client.db(options.dbname);
} catch (err) {
    const timeStamp = new Date().toLocaleString();
    const errMessage = `[ERROR]: ${timeStamp} - ${err.message}`;
    console.error(errMessage);
    appendFileSync("./logs/connection/connection.log", `${errMessage}\n`);
}

export { db };
