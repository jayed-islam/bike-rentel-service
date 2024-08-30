import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { BookingRentalService } from './booking.service';

// create rental
const createBookinRental = catchAsync(async (req, res) => {
  const result = await BookingRentalService.createBookingRentalInToDB(
    req.user.userId,
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Rental created successfully',
    data: result,
  });
});

// make rental return by admin
const makeBikeReturn = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { endTime } = req.body;
  const result = await BookingRentalService.makeReturnBikeInToDB(id, endTime);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Bike returned successfully',
    data: result,
  });
});

// get all rental for user (my rentals)
const getAllRentalsForUser = catchAsync(async (req, res) => {
  const { status } = req.body;
  const result = await BookingRentalService.getAllRentalsForUserFromDB(
    req.user.userId,
    status,
  );

  if (result.length > 0) {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Rentals retrieved successfully',
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

// get all rental
const getAllRentals = catchAsync(async (req, res) => {
  const result = await BookingRentalService.getAllRentals();

  if (result.length > 0) {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Rentals retrieved successfully',
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

export const BookingRentalController = {
  createBookinRental,
  makeBikeReturn,
  getAllRentalsForUser,
  getAllRentals,
};
