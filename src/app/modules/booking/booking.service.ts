/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import mongoose, { Error, Types } from 'mongoose';
import { IBooking } from './bookin.interface';
import Booking from './booking.model';
import Bike from '../bike/bike.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
// create rentals service
const createBookingRentalInToDB = async (
  userId: Types.ObjectId,
  payload: IBooking,
) => {
  const session = await mongoose.startSession();

  const bike = await Bike.findById(payload.bikeId);

  if (!bike) {
    throw new AppError(httpStatus.NOT_FOUND, 'Bike not found');
  }

  const isAvailable = bike.isAvailable;

  if (!isAvailable) {
    throw new AppError(httpStatus.CONFLICT, 'Bike is alredy rend out.');
  }

  try {
    session.startTransaction();

    const updatedBike = await Bike.findByIdAndUpdate(
      { _id: payload.bikeId },
      { isAvailable: false },
      { new: true, runValidators: true, session },
    );

    if (!updatedBike) {
      throw new AppError(httpStatus.NOT_FOUND, 'Bike not found');
    }

    const result = (
      await Booking.create(
        [
          {
            bikeId: updatedBike._id,
            userId,
            isReturned: false,
            startTime: payload.startTime,
            totalCost: 0,
            advancedAmount: payload.advancedAmount,
            coupon: payload.coupon,
          },
        ],
        { session },
      )
    )[0];

    await session.commitTransaction();
    await session.endSession();

    // return { paymentSession, result };
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(
      httpStatus.CONFLICT,
      error instanceof Error ? error.message : 'Something went wrong',
    );
  }
};

// make rentals return service
const makeReturnBikeInToDB = async (bookingId: string, endTime: Date) => {
  const session = await mongoose.startSession();

  const booking = await Booking.findById(bookingId);

  if (!booking) {
    throw new AppError(httpStatus.NOT_FOUND, 'Rental not found');
  }

  const returnTime = new Date(endTime);

  try {
    session.startTransaction();
    const updatedBike = await Bike.findByIdAndUpdate(
      { _id: booking.bikeId },
      { isAvailable: true },
      { new: true, runValidators: true, session },
    );

    if (!updatedBike) {
      throw new AppError(httpStatus.NOT_FOUND, 'Bike not found');
    }

    const rentalDurationInHours = Math.ceil(
      (returnTime.getTime() - booking.startTime.getTime()) / (1000 * 60 * 60),
    );

    const totalCost = rentalDurationInHours * updatedBike.pricePerHour;

    const result = await Booking.findByIdAndUpdate(
      { _id: bookingId },
      {
        returnTime: returnTime,
        totalCost,
        isReturned: true,
        status: 'paid',
      },
      { new: true, session },
    ).select('-__v');

    await session.commitTransaction();
    await session.endSession();

    return result;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(
      httpStatus.CONFLICT,
      error instanceof Error ? error.message : 'Something went wrong',
    );
  }
};

// get all rentals for user (my rentals) service
const getAllRentalsForUserFromDB = async (userId: string, status: string) => {
  const rentals = await Booking.find({ userId, status })
    .populate('bikeId', 'name brand model pricePerHour')
    .select('-__v')
    .exec();

  return rentals;
};

// get all rentals for user (my rentals) service
const getAllRentals = async () => {
  const rentals = await Booking.find()
    .populate('bikeId', 'name brand model pricePerHour')
    .select('-__v')
    .exec();

  return rentals;
};
export const BookingRentalService = {
  createBookingRentalInToDB,
  makeReturnBikeInToDB,
  getAllRentals,
  getAllRentalsForUserFromDB,
};
