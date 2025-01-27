import { test, getAllSamples } from "../controller/sampleController.js";
import { Router } from "express";

const sampleRouter = Router();

sampleRouter.get("/test", test);
sampleRouter.get("/all", getAllSamples);

export default sampleRouter;
