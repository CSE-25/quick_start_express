import express, { json } from "express";
import helmet from "helmet";
import cors from "cors";

import sampleRouter from "./router/sampleRouter.js";
import { appConfig } from "./config/appConfig.js";

export default function (database) {
    const app = express();

    app.use(helmet());

    app.use(cors());
    app.use(json());

    // Disable the X-Powered-By header to make it harder
    // for attackers to find the tech stack.
    app.disable("x-powered-by");

    app.use(appConfig.router.SAMPLE_PREFIX, sampleRouter(database));

    return app;
}