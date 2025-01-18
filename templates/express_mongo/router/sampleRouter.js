import {
    test,
    getSample1,
    getSample2,
} from "../controller/sampleController.js";
import { Router } from "express";

const sampleRouter = Router();

sampleRouter.get("/test", test);
sampleRouter.get("/sample1", getSample1);
sampleRouter.get("/sample2", getSample2);

export { sampleRouter };
