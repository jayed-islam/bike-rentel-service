import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import notFound from './app/middlewares/notFound';
import globalErrorHandler from './app/middlewares/globalErrorhandler';
import router from './app/routes';
import handleNoDataFound from './app/middlewares/noDataFound';
// import dotenv from 'dotenv';
// import httpStatus from 'http-status';
const app: Application = express();

app.use(express.json());
app.use(cors());

// application routes
app.use('/api', router);

const getAController = (_req: Request, res: Response) => {
  res.json('Bike Rental service server is running');
};

app.get('/', getAController);

// no data found
app.use(handleNoDataFound);

// not Found
app.use(notFound);

// global error handler
app.use(globalErrorHandler);

export default app;
