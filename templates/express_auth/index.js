import express from "express";
import cors from "cors";

import { authConfig } from "./config/authConfig.js";
import { authRouter } from "./router/authRouter.js";

import { initLog } from "./logs/initLog.js";

import { connectDB } from "./connection/connection.js";

const app = express();

initLog();

app.use(cors());
app.use(express.json());

app.use(authConfig.router.AUTH_PREFIX, authRouter);

app.get("/", (req, res) => {
    res.json({ message: "auth server is running" });
});

const startServer = async () => {
    await connectDB();
    app.listen(authConfig.PORT, () => {
        console.info(
            `Server is running on http://127.0.0.1:${authConfig.PORT}`,
        );
        console.warn(
            `Test registration at http://127.0.0.1:${authConfig.PORT}${authConfig.router.AUTH_PREFIX}/register`,
        );
    });
};

startServer();
