/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import config from '../../config';
import { IBooking, PaymentInfo } from '../booking/bookin.interface';

export const initiatePayment = async (
  payload: PaymentInfo,
  booking: IBooking,
  userId: string,
  isFromUserPanel: string,
  bookingId: string,
) => {
  const response = await axios.post(config.PAYMENT_URL as string, {
    store_id: config.AMARPAY_ID,
    signature_key: config.SIGNATURE_KEY,
    tran_id: payload.transactionId,
    success_url: `${config.APP_URL}/api/payment/success?tnxId=${payload.transactionId}&bikeId=${booking.bikeId}&startTime=${booking.startTime}&coupon=${booking.coupon}&userId=${userId}&isFromUserPanel=${isFromUserPanel}&bookingId=${bookingId}`,
    fail_url: `${config.APP_URL}/api/payment/fail?tnxId=${payload.transactionId}`,
    cancel_url: 'http://www.merchantdomain.com/cancelpage.html',
    amount: payload.amount,
    currency: 'BDT',

    desc: 'Merchant Registration Payment',
    cus_name: payload.customerName,
    cus_email: payload.customerEmail,
    cus_add1: payload.customerAddress,
    cus_add2: 'Mohakhali DOHS',
    cus_city: 'Dhaka',
    cus_state: 'Dhaka',
    cus_postcode: '1206',
    cus_country: 'Bangladesh',
    cus_phone: payload.customerPhone,
    type: 'json',
  });

  return response.data;
};

export const verifyPayment = async (tnxId: string) => {
  const response = await axios.get(config.PAYMENT_VERIFY_URL as string, {
    params: {
      store_id: config.AMARPAY_ID,
      signature_key: config.SIGNATURE_KEY,
      type: 'json',
      request_id: tnxId,
    },
  });

  return response.data;
};
