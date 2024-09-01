import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { PaymenttService } from './payment.service';

const ConfirmPayment = catchAsync(async (req, res) => {
  const {
    tnxId,
    startTime,
    bikeId,
    userId,
    coupon,
    isFromUserPanel,
    bookingId,
  } = req.query;
  const result = await PaymenttService.PaymentConfirmation(
    tnxId as string,
    startTime as string,
    bikeId as string,
    userId as string,
    coupon as string,
    isFromUserPanel as string,
    bookingId as string,
  );

  res.setHeader('Content-Type', 'text/html');
  res.send(result);
});

const FailPayment = catchAsync(async (req, res) => {
  const { tnxId } = req.query;
  const result = await PaymenttService.PaymentFailure(tnxId as string);

  res.setHeader('Content-Type', 'text/html');
  res.send(result);
});

const MakePayemnt = catchAsync(async (req, res) => {
  const { isFromUserPanel } = req.query;
  const paymentSession = await PaymenttService.makePayment(
    req.user.userId,
    req.body,
    isFromUserPanel as string,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Make your payment',
    data: paymentSession,
  });
});

export const PaymentController = {
  ConfirmPayment,
  MakePayemnt,
  FailPayment,
};
