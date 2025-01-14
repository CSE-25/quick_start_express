import { promises } from "fs";
import { appendFileSync } from "fs";
import { appConfig } from "../config/appConfig.js";

const reInitDb = async (db) => {
    try {
        const data = await promises.readFile("./db/reInitDb.sql", "utf8");
        await db.connect();
        await db.query(data);
        console.info("[INFO]: Database re-initialized.");
    } catch (err) {
        const timeStamp = new Date().toLocaleString();
        const errMessage = `[ERROR]: ${timeStamp} - reInitDb - ${err.message}`;
        console.error(errMessage);
        if (err.message.includes("database")) {
            console.warn(
                `[HINT]: Database '${appConfig.db.database}' does not exist. Please create it by running the following command in your SQL shell: 'CREATE DATABASE ${appConfig.db.database}'.`,
            );
        }
        appendFileSync("./logs/db/reInitDb.log", `${errMessage}\n`);
        await db.end();
        process.exit(1);
    } finally {
        await db.end();
    }
};

export { reInitDb };
