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

export const BookingRentalController = {
  createBookinRental,
};
