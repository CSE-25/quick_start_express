import "dotenv/config.js";
import express from "express";

const app = express();
const port = process.env.SERVER_PORT || 8080;

app.get("/", (req, res) => {
    return res.send("Hello World!");
});

if (process.env.NODE_ENV !== "test") {
    app.listen(port, () => {
        console.log(`[INFO]: Server listening on http://localhost:${port}.`);
    });
}

export default app;
