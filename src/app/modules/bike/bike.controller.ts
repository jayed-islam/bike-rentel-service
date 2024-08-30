import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { BikeService } from './bike.service';

// create bike controller
const createBike = catchAsync(async (req, res) => {
  const result = await BikeService.createBikeInToDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Bike added successfully',
    data: result,
  });
});

// get all bike controller
const getAllBike = catchAsync(async (req, res) => {
  const { brand, model, isAvailable, name } = req.body;
  const result = await BikeService.getAllBikeFromDB({
    available: isAvailable,
    brand,
    model,
    name,
  });

  if (result.length > 0) {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Bikes retrieved successfully',
      data: result,
    });
  } else {
    res.json({
      success: false,
      message: 'No Data Found',
      data: [],
    });
  }
});
// get all bike controller
const getAllAvailableBike = catchAsync(async (req, res) => {
  const result = await BikeService.getAllAvailableBikeFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Bikes retrieved successfully',
    data: result,
  });
});

// update single bike
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

// delete single bike
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

// delete single bike
const getSingleBike = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await BikeService.getSingleBikeFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Bike retrieved successfully',
    data: result,
  });
});

export const BikeController = {
  createBike,
  getAllBike,
  updateSingleBike,
  deleteSingleBike,
  getAllAvailableBike,
  getSingleBike,
};
