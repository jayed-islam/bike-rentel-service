import mongoose, { Error, Types } from 'mongoose';
import { IBookingRental } from './bookin.interface';
import Booking from './booking.model';
import Bike from '../bike/bike.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const createBookingRentalInToDB = async (
  userId: Types.ObjectId,
  payload: IBookingRental,
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
          },
        ],
        { session },
      )
    )[0];

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

const makeReturnBikeInToDB = async (bookingId: string) => {
  const session = await mongoose.startSession();

  const booking = await Booking.findById(bookingId);

  if (!booking) {
    throw new AppError(httpStatus.NOT_FOUND, 'Rental not found');
  }

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

    const currentTime = new Date().getTime();
    const rentalDurationInHours = Math.ceil(
      (currentTime - booking.startTime.getTime()) / (1000 * 60 * 60),
    );

    const totalCost = rentalDurationInHours * updatedBike.pricePerHour;

    const result = await Booking.findByIdAndUpdate(
      { _id: bookingId },
      {
        returnTime: currentTime,
        totalCost,
        isReturned: true,
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

const getAllRentalsForUserFromDB = async (userId: string) => {
  const result = await Booking.find({ userId }).select('-__v');

  return result;
};

export const BookingRentalService = {
  createBookingRentalInToDB,
  makeReturnBikeInToDB,
  getAllRentalsForUserFromDB,
};
