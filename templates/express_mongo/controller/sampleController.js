import { appendFileSync } from "fs";

import { db } from "../connection/connection.js";

async function test(req, res) {
    return res.status(200).send({
        MESSAGE: "It's Working. 👍🏻",
    });
}

async function getSample1(req, res) {
    try {
        const sample1Collection = db.collection("sample1");
        const data = await sample1Collection.find().toArray();
        return res.status(200).send({
            MESSAGE: "Data fetched successfully.",
            DATA: data,
        });
    } catch (err) {
        const timeStamp = new Date().toLocaleString();
        const errMessage = `[ERROR]: ${timeStamp} - ${err.message}`;
        console.error(errMessage);
        appendFileSync("./logs/controller/controller.log", `${errMessage}\n`);

        return res.status(500).send({
            MESSAGE: "Something went wrong. Please try again later.",
        });
    }
}

async function getSample2(req, res) {
    try {
        const sample2Collection = db.collection("sample2");
        const data = await sample2Collection.find().toArray();
        return res.status(200).send({
            MESSAGE: "Data fetched successfully.",
            DATA: data,
        });
    } catch (err) {
        const timeStamp = new Date().toLocaleString();
        const errMessage = `[ERROR]: ${timeStamp} - ${err.message}`;
        console.error(errMessage);
        appendFileSync("./logs/controller/controller.log", `${errMessage}\n`);

        return res.status(500).send({
            MESSAGE: "Something went wrong. Please try again later.",
        });
    }
}

export { test, getSample1, getSample2 };
