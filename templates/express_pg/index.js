import "dotenv/config.js";

import express from "express";
import { appendFileSync } from "fs";

import { initLog } from "./logs/initLog.js";
import { sampleRouter } from "./router/sampleRouter.js";
import { appConfig } from "./config/appConfig.js";
import { getDb } from "./connection/normalConnection.js";
import { reInitDb } from "./db/reInitDb.js";

const app = express();

app.use(appConfig.router.SAMPLE_PREFIX, sampleRouter);

initLog();
const db = getDb();
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
