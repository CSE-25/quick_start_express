import express, { Application, Request, Response } from "express";
import "dotenv/config";
import cors from "cors";
import helmet from "helmet";

const app: Application = express();
const PORT = process.env.PORT || 7000;

// * Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());
app.disable("x-powered-by");

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "It Works",
  });
  return
});

app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
