import { PrismaClient } from "@prisma/client";
import { appendFileSync } from "fs";

const prisma = new PrismaClient();

export const testDbConnection = async () => {
    try {
        await prisma.$connect();
        console.log("[INFO]: Database connected successfully.");
    } catch (error) {
        const timeStamp = new Date().toLocaleString();
        const errMessage = `[ERROR]: ${timeStamp} - ${error}`;
        console.error(errMessage);
        appendFileSync(`./logs/db.log`, `${errMessage}\n`);

        // Exit the process if the database connection fails.
        process.exit(1);
    }
};
