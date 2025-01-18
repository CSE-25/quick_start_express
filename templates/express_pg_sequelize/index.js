import express from "express";
import db from "./db.js";
import "dotenv/config.js";

import { appConfig } from "./config/appConfig.js";

const app = express();

app.use(express.json());

// Test PostgreSQL connection
db.authenticate()
    .then(() => {
        console.log("Database connection established successfully.");
    })
    .catch((err) => {
        console.error("Unable to connect to the database:", err);
    });

app.get("/", (req, res) => {
    return res.send("Hello, Express with PostgreSQL!");
});

// Dummy route to test DB query
app.get("/db-test", async (req, res) => {
    try {
        const [results, metadata] = await db.query("SELECT NOW()");
        return res
            .status(200)
            .json({ message: "DB query successful!", data: results });
    } catch (error) {
        return res
            .status(500)
            .json({ message: "Error querying the database", error });
    }
});

// Start the server
app.listen(appConfig.PORT, () => {
    console.log(`Server is running on http://localhost:${appConfig.PORT}`);
});
