import { appendFileSync } from "fs";

import { pool } from "../connection/poolConnection.js";

async function test(req, res) {
    return res.status(200).send({
        MESSAGE: "It's Working. 👍🏻",
    });
}

async function getAllSamples(req, res) {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");
        await client.query("LOCK TABLE sample_table IN ACCESS SHARE MODE");
        const { rows: data } = await client.query("SELECT * FROM sample_table");
        return res.status(200).send({
            MESSAGE: "Data fetched successfully.",
            DATA: data,
        });
    } catch (err) {
        const timeStamp = new Date().toLocaleString();
        const errMessage = `[ERROR]: ${timeStamp} - ${err.message}`;
        console.error(errMessage);
        appendFileSync(
            "./logs/controller/sampleController.log",
            `${errMessage}\n`,
        );

        return res.status(500).send({
            MESSAGE: "Something went wrong. Please try again later.",
        });
    } finally {
        client.release();
    }
}

export { test, getAllSamples };
