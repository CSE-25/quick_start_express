import express from "express";
import cors from "cors";
import helmet from "helmet";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());

app.get("/", (req, res) => {
  res.json({ message: "This is Express typescript" });
});

app.listen(port, () => {
  console.log(`Server running on PORT = ${port}`);
});

export default app;
