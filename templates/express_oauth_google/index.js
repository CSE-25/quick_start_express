import { configDotenv } from 'dotenv';
configDotenv({ path: "./.env" });

// For testing.
// console.log(process.env.GOOGLE_CLIENT_ID)
// console.log(process.env.GOOGLE_CLIENT_SECRET)

import express from 'express';
import cookieParser from 'cookie-parser';
import { appendFileSync } from 'fs';

import { authRouter } from './router/authRouter.js';
import { appRouter } from './router/appRouter.js';
import { initLog } from './logs/logsInit.js';

const app = express();

app.use(cookieParser());

initLog();

app.use('/', appRouter);
app.use('/auth', authRouter);

app.listen(3000, (err) => {
    if (err) {
        const timeStamp = new Date().toLocaleString();
        const errMessage = `[ERROR]: ${timeStamp} - ${err.message}`;
        console.error(errMessage);
        appendFileSync('./logs/index.log', `${errMessage}\n`);
    } else {
        console.info(`[INFO]: Server is running on http://localhost:3000`);
    }
});
