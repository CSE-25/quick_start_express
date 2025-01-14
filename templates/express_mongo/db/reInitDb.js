import { promises } from "fs";
import { appendFileSync } from "fs";
import { sampleSchema1, sampleSchema2 } from "../schema/sampleSchema.js";

const reInitDb = async (db) => {
    try {
        const data1 = JSON.parse(
            await promises.readFile("./db/seedSample1.json", "utf-8"),
        );
        const sampleModel1 = db.model("Sample1", sampleSchema1);
        await sampleModel1.collection.drop();
        await sampleModel1.insertMany(data1);

        const data2 = JSON.parse(
            await promises.readFile("./db/seedSample2.json", "utf-8"),
        );
        const sampleModel2 = db.model("Sample2", sampleSchema2);
        await sampleModel2.collection.drop();
        await sampleModel2.insertMany(data2);
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
