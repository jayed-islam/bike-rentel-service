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
  const result = await BookingRentalService.makeReturnBikeInToDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Bike returned successfully',
    data: result,
  });
});

// get all rental for user (my rentals)
const getAllRentalsForUser = catchAsync(async (req, res) => {
  const result = await BookingRentalService.getAllRentalsForUserFromDB(
    req.user.userId,
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

export const BookingRentalController = {
  createBookinRental,
  makeBikeReturn,
  getAllRentalsForUser,
};
