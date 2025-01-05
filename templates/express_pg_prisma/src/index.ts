import express from 'express';
import UserRoutes from '../routes/userRoutes'
import { Request, Response } from 'express';
import { testDbConnection } from '../db/connectDB';
import { initLog } from '../util/initlog';

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use('/users', UserRoutes);

const startServer = async () => {
  initLog();
  await testDbConnection();

  app.get('/', (_: Request, res: Response): void => {
    res.status(200).json({ message: 'Welcome to the Express-Prisma' });
  });

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

startServer();
