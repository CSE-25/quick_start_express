import { promises } from "fs";
import { appendFileSync } from "fs";
import { sampleSchema } from "../schema/sampleSchema.js";

const reInitDb = async (db) => {
    try {
        const data = JSON.parse(await promises.readFile('./db/seedDb.json', 'utf-8'))
        const sampleModel = db.model('Sample', sampleSchema)
        await sampleModel.collection.drop()
        await sampleModel.insertMany(data)
    } catch (err) {
        const timeStamp = new Date().toLocaleString();
        const errMessage = `[ERROR]: ${timeStamp} - reInitDb - ${err.message}`;
        console.error(errMessage);
        if (err.message === 'ns not found') {
            console.warn('[HINT]: Collection does not exist');
        }
        appendFileSync("./logs/db/reInitDb.log", `${errMessage}\n`);
    }
}

export { reInitDb }