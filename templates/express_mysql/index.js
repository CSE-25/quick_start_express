import express, { json } from "express";
import helmet from "helmet";
import { appendFileSync } from "fs";
import cors from "cors";

import { initLog } from "./logs/initLog.js";
import sampleRouter from "./router/sampleRouter.js";
import { appConfig } from "./config/appConfig.js";
import connectToDb from "./connection/normalConnection.js";
import reInitDb from "./db/reInitDb.js";

const app = express();

// Helmet sets HTTP headers for security.
app.use(helmet());

app.use(cors());
app.use(json());

// Disable the X-Powered-By header to make it harder
// for attackers to find the tech stack.
app.disable("x-powered-by");

app.use(appConfig.router.SAMPLE_PREFIX, sampleRouter);

initLog();
const db = connectToDb();
reInitDb(db);

export default app;

app.listen(appConfig.PORT, (err) => {
  if (err) {
    const timeStamp = new Date().toLocaleString();
    const errMessage = `[ERROR]: ${timeStamp} - ${err.message}`;
    console.error(errMessage);
    appendFileSync("./logs/index.log", `${errMessage}\n`);
  } else {
    console.info(
      `[INFO]: Server is running on http://127.0.0.1:${appConfig.PORT}.`
    );
    console.warn(
      `[TEST]: Test the server by sending a GET request to http://127.0.0.1:${appConfig.PORT}${appConfig.router.SAMPLE_PREFIX}/test.`
    );
  }
});
