import { Request, Response, NextFunction, RequestHandler } from 'express';

// no data found function
const handleNoDataFound: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!res.locals.data) {
    res.status(404).json({
      success: false,
      message: 'No Data Found',
      data: [],
    });
  } else {
    next();
  }
};

export default handleNoDataFound;
