import { Router, Request, Response } from "express";
import { user } from "./user.routes";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to Express, MongoDB and TypeScript server",
  });
});

router.use("/api/user", user);

export default router;
