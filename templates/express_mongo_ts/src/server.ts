import express, { Express, NextFunction, Request, Response } from "express";
import cookieParser from 'cookie-parser';
import cors from 'cors';
import createError from 'http-errors';
import helmet from 'helmet';
import mongoose from 'mongoose';
import morgan from 'morgan';
import routes from './routes';
import type { TServerConfig } from './types';

export class InitServer {
  server: Express;
  database: typeof mongoose;

  constructor() {
    this.server = express();
    this.database = mongoose;
  }

  setup(config: TServerConfig) {

    // Setup server configuration
    this.server.set('host', config.host);
    this.server.set('port', config.port);
    this.server.set('dbUrl', config.dbUrl)

    // Setup middlewares
    this.server.use(cors());
    this.server.use(helmet());
    this.server.use(morgan('tiny'));
    this.server.use(cookieParser());
    this.server.use(express.json());
    this.server.use(express.urlencoded({ extended: false }));

    // Setup routes
    this.server.use("/", routes);

    // Return 404 if requested route is undefined
    this.server.use((req: Request, res: Response, next: NextFunction) => {
      next(createError(404));
    });
  }

  async start() {
    const host = this.server.get('host');
    const port = this.server.get('port');

    try {
      await this.database.connect(process.env.DB_URL!);
      this.server.listen(port, () => console.log(`[server]: Server is running at ${host}:${port}`));
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  }
}
