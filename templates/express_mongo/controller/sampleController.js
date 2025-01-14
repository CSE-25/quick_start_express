import { appendFileSync } from "fs";

import { db } from "../connection/connection.js";
import { sampleSchema1, sampleSchema2 } from "../schema/sampleSchema.js";

async function test(req, res) {
    return res.status(200).send({
        MESSAGE: "It's Working. 👍🏻",
    });
}

async function getSample1(req, res) {
    try {
        const sampleModel = db.model("Sample1", sampleSchema1);
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

async function getSample2(req, res) {
    try {
        const sampleModel = db.model("Sample2", sampleSchema2);
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

export { test, getSample1, getSample2 };
