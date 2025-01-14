import { appendFileSync } from "fs";
import db from "../connection/poolConnection.js";

export async function test(_, res) {
    return res.status(200).send({
        MESSAGE: "It's Working. 👍🏻",
    });
}

export async function getAllSamples(_, res) {
    const db_conn = await db.promise().getConnection();
    try {
        await db_conn.query("LOCK TABLES sample_table READ");
        const [data] = await db_conn.query("SELECT * FROM sample_table");
        return res.status(200).send({
            MESSAGE: "Data fetched successfully.",
            DATA: data,
        });
    } catch {
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
        await db_conn.query("UNLOCK TABLES");
        db_conn.release();
    }
}
