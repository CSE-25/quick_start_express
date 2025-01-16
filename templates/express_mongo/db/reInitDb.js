import { promises } from "fs";
import { appendFileSync } from "fs";

const reInitDb = async (db) => {
    try {
        const sample1Collection = db.collection("sample1");
        const sample2Collection = db.collection("sample2");

        await sample1Collection.drop();
        await sample2Collection.drop();

        const data1 = JSON.parse(
            await promises.readFile("./db/seedSample1.json", "utf-8"),
        );
        await sample1Collection.insertMany(data1);
        const data2 = JSON.parse(
            await promises.readFile("./db/seedSample2.json", "utf-8"),
        );
        await sample2Collection.insertMany(data2);
    } catch (err) {
        const timeStamp = new Date().toLocaleString();
        const errMessage = `[ERROR]: ${timeStamp} - reInitDb - ${err.message}`;
        console.error(errMessage);
        if (err.message === "ns not found") {
            console.warn("[HINT]: Collection does not exist");
        }
        appendFileSync("./logs/db/reInitDb.log", `${errMessage}\n`);
    }
};

export { reInitDb };
