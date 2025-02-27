import { Router } from "express";

import sampleController from "../controller/sampleController.js";

export default function (database) {
    const router = Router();

    router.get("/test", (req, res) => sampleController.test(req, res));
    router.get("/all", (req, res) => sampleController.getAllSamples(req, res, database));

    return router
}