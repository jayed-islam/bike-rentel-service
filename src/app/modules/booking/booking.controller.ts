import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { BookingRentalService } from './booking.service';

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

const getAllRentalsForUser = catchAsync(async (req, res) => {
  const result = await BookingRentalService.getAllRentalsForUserFromDB(
    req.user.userId,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Rentals retrieved successfully',
    data: result,
  });
});

export const BookingRentalController = {
  createBookinRental,
  makeBikeReturn,
  getAllRentalsForUser,
};
