import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import notFound from './app/middlewares/notFound';
import globalErrorHandler from './app/middlewares/globalErrorhandler';
import router from './app/routes';
// import dotenv from 'dotenv';
// import httpStatus from 'http-status';
const app: Application = express();

app.use(express.json());
app.use(cors());

// application routes
app.use('/api', router);

// const getAController = (req: Request, res: Response) => {
//   // const a = 10;
//   res.json({
//     statusCode: httpStatus.OK,
//     status: true,
//     message: 'Server is ok',
//   });
// };

// app.get('/', getAController);

const getAController = (_req: Request, res: Response) => {
  res.json('Bike Rental service server is running');
};

app.get('/', getAController);

app.use(globalErrorHandler);

// not Found
app.use(notFound);

// global error handler
app.use(globalErrorHandler);

export default app;
