import mongoose from 'mongoose';

import { appConfig } from '../config/appConfig.js';

let db = null

try {
    const options = appConfig.db.options
    const connUrl = `mongodb://${options.host}:${options.port}/${options.dbname}`
    db = await mongoose.createConnection(connUrl, {user: options.user, pass: options.pass}).asPromise()
} catch (err) {
    const timeStamp = new Date().toLocaleString();
    const errMessage = `[ERROR]: ${timeStamp} - ${err.message}`;
    console.error(errMessage);
    appendFileSync("./logs/connection/connection.log", `${errMessage}\n`);
}

db.on('error', (err) => {
    const timeStamp = new Date().toLocaleString();
    const errMessage = `[ERROR]: ${timeStamp} - ${err.message}`;
    console.error(errMessage);
    appendFileSync("./logs/connection/connection.log", `${errMessage}\n`);
});

export { db }