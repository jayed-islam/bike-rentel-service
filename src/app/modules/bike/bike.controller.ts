import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { BikeService } from './bike.service';

const createBike = catchAsync(async (req, res) => {
  const result = await BikeService.createBikeInToDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Bike added successfully',
    data: result,
  });
});

const getAllBike = catchAsync(async (req, res) => {
  const result = await BikeService.getAllBikeFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Bikes retrieved successfully',
    data: result,
  });
});

const updateSingleBike = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await BikeService.updateSingleBikeInToDB(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Bike updated successfully',
    data: result,
  });
});

const deleteSingleBike = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await BikeService.deleteSingleBikeFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Bike deleted successfully',
    data: result,
  });
});

export const BikeController = {
  createBike,
  getAllBike,
  updateSingleBike,
  deleteSingleBike,
};
