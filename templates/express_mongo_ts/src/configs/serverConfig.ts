import dotenv from "dotenv";
import type { TServerConfig } from "../types";

dotenv.config();

export const config: TServerConfig = {
  dbUrl: process.env.DB_URL || "mongodb://localhost:27017/mydb",
  host: process.env.HOST || "http://localhost",
  port: parseInt(process.env.PORT!) || 8000,
}
