import { readFile } from "fs/promises";
import { appConfig } from "../config/appConfig.js";

const reInitDb = async (db) => {
    try {
        const data = await readFile("./db/reInitDb.sql", "utf8");
        await db.promise().query(data);
        console.info("[INFO]: Database re-initialized.");
    } catch (err) {
        console.error(`[ERROR]: ${new Date().toLocaleString()} - reInitDb - ${err.message}`);
        if (err.message.includes("Unknown database")) {
            console.warn(`[HINT]: Database '${appConfig.db.database}' does not exist. Please create it by running the following command in your MySQL shell: 'CREATE DATABASE ${appConfig.db.database}'.`);
        }
    } finally {
        return new Promise((resolve, reject) => {
            db.end((err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    }
};

export default reInitDb;
