import { appendFileSync } from "fs";

import makeApp from "./app.js";
import database from "./db/database.js";
import { initLog } from "./logs/initLog.js";
import connectToDb from "./connection/normalConnection.js";
import reInitDb from "./db/reInitDb.js";
import { appConfig } from "./config/appConfig.js";

const app = makeApp(database);

initLog();
const db = connectToDb();
await reInitDb(db);

app.listen(appConfig.PORT, (err) => {
    if (err) {
        const timeStamp = new Date().toLocaleString();
        const errMessage = `[ERROR]: ${timeStamp} - ${err.message}`;
        console.error(errMessage);
        appendFileSync("./logs/index.log", `${errMessage}\n`);
    } else {
        console.info(
            `[INFO]: Server is running on http://127.0.0.1:${appConfig.PORT}.`,
        );
        console.warn(
            `[TEST]: Test the server by sending a GET request to http://127.0.0.1:${appConfig.PORT}${appConfig.router.SAMPLE_PREFIX}/test.`,
        );
    }
});
