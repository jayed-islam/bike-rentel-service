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

  console.log('bike', bikeId, startTime, userId, coupon, tnxId);

  const htmlContent = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Confirmation</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        margin: 0;
        padding: 0;
        color: #333;
      }
      .container {
        max-width: 600px;
        margin: 20px auto;
        background-color: #ffffff;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }
      .header {
        background-color: #4CAF50;
        color: white;
        padding: 20px;
        text-align: center;
        font-size: 24px;
      }
      .content {
        padding: 20px;
        line-height: 1.6;
      }
      .content h2 {
        color: #333;
      }
      .content p {
        margin: 15px 0;
      }
      .content .info {
        margin: 20px 0;
      }
      .info div {
        margin-bottom: 10px;
      }
      .footer {
        background-color: #f1f1f1;
        color: #777;
        text-align: center;
        padding: 10px;
        font-size: 14px;
      }
      .footer a {
        color: #4CAF50;
        text-decoration: none;
      }
      .btn-home {
        display: inline-block;
        margin-top: 20px;
        padding: 10px 20px;
        font-size: 16px;
        color: white;
        background-color: #4CAF50;
        text-decoration: none;
        border-radius: 5px;
        text-align: center;
      }
      .btn-home:hover {
        background-color: #45a049;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        Payment Confirmation
      </div>
      <div class="content">
        <h2>Thank you for your payment!</h2>
        <p>We have successfully received your payment.</p>
        <p>If you have any questions about your payment or need further assistance, please do not hesitate to contact us.</p>
        <p>Thank you for choosing our service.</p>
        <a href="http://localhost:5173" target="_blank" class="btn-home">Go Home</a>
      </div>
    </div>
  </body>
  </html>
`;

  console.log('res', verifyReponse);

  if (verifyReponse.pay_status === 'Successful') {
    const session = await mongoose.startSession();

    const bike = await Bike.findById(bikeId);

    if (!bike) {
      throw new AppError(httpStatus.NOT_FOUND, 'Bike not found');
    }

    console.log('res', verifyReponse.pay_status);

    try {
      session.startTransaction();

      if (isFromUserPanel === 'yes') {
        const res = await Coupon.findOne({ code: coupon });
        console.log('code', res?.discountAmount, res?.code);
        const discountPercentage = res?.discountAmount ?? 0;

        const bookingRes = await Booking.findById(bookingId);

        console.log('dis', startTime);

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

        console.log('rental', rentalDurationInHours, startDateTime, returnTime);
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

        console.log('res', result);
      }

      await session.commitTransaction();
      await session.endSession();

      return htmlContent;
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

  const htmlContent = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Failed</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        margin: 0;
        padding: 0;
        color: #333;
      }
      .container {
        max-width: 600px;
        margin: 20px auto;
        background-color: #ffffff;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }
      .header {
        background-color: #e74c3c;
        color: white;
        padding: 20px;
        text-align: center;
        font-size: 24px;
      }
      .content {
        padding: 20px;
        line-height: 1.6;
      }
      .content h2 {
        color: #333;
      }
      .content p {
        margin: 15px 0;
      }
      .footer {
        background-color: #f1f1f1;
        color: #777;
        text-align: center;
        padding: 10px;
        font-size: 14px;
      }
      .footer a {
        color: #e74c3c;
        text-decoration: none;
      }
         .btn-home {
        display: inline-block;
        margin-top: 20px;
        padding: 10px 20px;
        font-size: 16px;
        color: white;
        background-color: #4CAF50;
        text-decoration: none;
        border-radius: 5px;
        text-align: center;
      }
      .btn-home:hover {
        background-color: #45a049;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        Payment Failed
      </div>
      <div class="content">
        <h2>We're sorry, your payment could not be processed.</h2>
        <p>Dear Customer,</p>
        <p>Unfortunately, your payment with transaction ID <strong>${tnxId}</strong> could not be completed. Please try again or contact our support team for assistance.</p>
        <p>If you have any questions or need further help, please don't hesitate to reach out to our support team.</p>
        <p>Thank you for your understanding.</p>
         <a href="http://localhost:5173" target="_blank"  class="btn-home">Go Home</a>
      </div>
      <div class="footer">
        <p>&copy; 2024 Fast Bike. All rights reserved.</p>
      </div>
    </div>
  </body>
  </html>
  `;

  if (verifyResponse.pay_status !== 'Successful') {
    console.log('Payment failed', tnxId);
    return htmlContent;
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
  console.log('tt', isFromUserPanel, payload);
  if (isFromUserPanel === 'no') {
    const isAvailable = bike.isAvailable;

    if (!isAvailable) {
      throw new AppError(httpStatus.CONFLICT, 'Bike is alredy rend out.');
    }
  }

  try {
    session.startTransaction();

    const transactionId = `TXN-${Date.now()}`;

    // let isFromUserPanel = isFromUserPanel ?? 'no';

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
