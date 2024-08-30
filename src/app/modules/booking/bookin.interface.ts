import { Types } from 'mongoose';

export interface IBooking {
  id: string;
  userId: Types.ObjectId;
  bikeId: Types.ObjectId;
  startTime: Date;
  returnTime: Date | null;
  totalCost: number;
  isReturned: boolean;
  status: 'paid' | 'unpaid';
  coupon: string;
  advancedAmount: number;
}

// export interface IBookingRental {
//   bikeId: Types.ObjectId;
//   startTime: Date;
// }

export interface PaymentInfo {
  transactionId: string;
  amount: number;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  customerAddress?: string;
}
