/* eslint-disable no-unused-vars */
import mongoose from 'mongoose';
import { IBooking, PaymentInfo } from '../booking/bookin.interface';
import Bike from '../bike/bike.model';
import { User } from '../user/user.model';
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { initiatePayment, verifyPayment } from './payment.utils';
import Booking from '../booking/booking.model';
import { Coupon } from '../coupon/coupon.model';
import {
  htmlPaymentFailContent,
  htmlPaymentSuccessContent,
} from './payment.data';

const PaymentConfirmation = async (
  tnxId: string,
  startTime: string,
  bikeId: string,
  userId: string,
  coupon: string,
  isFromUserPanel: string,
  bookingId: string,
) => {
  const verifyReponse = await verifyPayment(tnxId);

  if (verifyReponse.pay_status === 'Successful') {
    const session = await mongoose.startSession();

    const bike = await Bike.findById(bikeId);

    if (!bike) {
      throw new AppError(httpStatus.NOT_FOUND, 'Bike not found');
    }

    try {
      session.startTransaction();

      if (isFromUserPanel === 'yes') {
        const res = await Coupon.findOne({ code: coupon });
        const discountPercentage = res?.discountAmount ?? 0;

        const bookingRes = await Booking.findById(bookingId);

        const returnTime = new Date(Date.now());
        const startDateTime = new Date(bookingRes?.startTime as Date);
        const updatedBike = await Bike.findByIdAndUpdate(
          { _id: bikeId },
          { isAvailable: true },
          { new: true, runValidators: true, session },
        );

        if (!updatedBike) {
          throw new AppError(httpStatus.NOT_FOUND, 'Bike not found');
        }

        const rentalDurationInHours = Math.ceil(
          (returnTime.getTime() - startDateTime.getTime()) / (1000 * 60 * 60),
        );
        // const totalCost = rentalDurationInHours * updatedBike.pricePerHour;

        // Calculate the total cost without discount
        const totalCostWithoutDiscount =
          rentalDurationInHours * updatedBike.pricePerHour;

        // Calculate the discount amount
        const discountAmount =
          (totalCostWithoutDiscount * discountPercentage) / 100;

        // Apply the discount to get the final total cost
        const totalCost = totalCostWithoutDiscount - discountAmount;

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const result = await Booking.findByIdAndUpdate(
          { _id: bookingId },
          {
            returnTime: returnTime,
            totalCost: totalCost,
            isReturned: true,
            status: 'paid',
          },
          { new: true, session },
        ).select('-__v');
      } else {
        const isAvailable = bike.isAvailable;

        if (!isAvailable) {
          throw new AppError(httpStatus.CONFLICT, 'Bike is alredy rend out.');
        }

        const updatedBike = await Bike.findByIdAndUpdate(
          { _id: bikeId },
          { isAvailable: false },
          { new: true, runValidators: true, session },
        );

        if (!updatedBike) {
          throw new AppError(httpStatus.NOT_FOUND, 'Bike not found');
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
        const result = (
          await Booking.create(
            [
              {
                bikeId: updatedBike._id,
                userId,
                isReturned: false,
                startTime: startTime,
                totalCost: 0,
                advancedAmount: 100,
                coupon: coupon,
              },
            ],
            { session },
          )
        )[0];
      }

      await session.commitTransaction();
      await session.endSession();

      return htmlPaymentSuccessContent;
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();
      throw new AppError(
        httpStatus.CONFLICT,
        error instanceof Error ? error.message : 'Something went wrong',
      );
    }
  }
};

const PaymentFailure = async (tnxId: string) => {
  const verifyResponse = await verifyPayment(tnxId);

  if (verifyResponse.pay_status !== 'Successful') {
    console.log('Payment failed', tnxId);
    return htmlPaymentFailContent;
  }
};

export default PaymentFailure;

const makePayment = async (
  userId: string,
  payload: IBooking,
  isFromUserPanel: string,
) => {
  const session = await mongoose.startSession();

  const bike = await Bike.findById(payload.bikeId);

  const user = await User.findById(userId);

  if (!bike) {
    throw new AppError(httpStatus.NOT_FOUND, 'Bike not found');
  }

  if (isFromUserPanel === 'no') {
    const isAvailable = bike.isAvailable;

    if (!isAvailable) {
      throw new AppError(httpStatus.CONFLICT, 'Bike is alredy rend out.');
    }
  }

  try {
    session.startTransaction();

    const transactionId = `TXN-${Date.now()}`;

    const paymentInfo: PaymentInfo = {
      transactionId,
      amount: payload.advancedAmount ?? 100,
      customerName: user?.name,
      customerEmail: user?.email,
      customerPhone: user?.phone,
      customerAddress: user?.address,
    };

    const paymentSession = await initiatePayment(
      paymentInfo,
      payload,
      userId,
      isFromUserPanel ?? 'no',
      payload.id ?? 'bookingId',
    );

    await session.commitTransaction();
    await session.endSession();

    return paymentSession;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(
      httpStatus.CONFLICT,
      error instanceof Error ? error.message : 'Something went wrong',
    );
  }
};

export const PaymenttService = {
  PaymentConfirmation,
  makePayment,
  PaymentFailure,
};
