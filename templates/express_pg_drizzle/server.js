import express from "express";
import db from "./db/db_connect.js";
const app = express();

app.listen(8000, () => {
    console.log("Server is running on port 8000");
})