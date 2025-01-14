import { appendFileSync } from "fs";

import { db } from "../connection/connection.js";
import { sampleSchema } from "../schema/sampleSchema.js";

async function test(req, res) {
    return res.status(200).send({
        MESSAGE: "It's Working. 👍🏻",
    });
}

async function getAllSamples(req, res) {
    try {
        const sampleModel = db.model("Sample", sampleSchema);
        const data = await sampleModel.find({});
        return res.status(200).send({
            MESSAGE: "Data fetched successfully.",
            DATA: data,
        });
    } catch (err) {
        const timeStamp = new Date().toLocaleString();
        const errMessage = `[ERROR]: ${timeStamp} - ${err.message}`;
        console.error(errMessage);
        appendFileSync("./logs/controler/controller.log", `${errMessage}\n`);

        return res.status(500).send({
            MESSAGE: "Something went wrong. Please try again later.",
        });
    }
}

export { test, getAllSamples };
