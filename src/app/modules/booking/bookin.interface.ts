/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose';

export interface IBooking {
  userId: Types.ObjectId;
  bikeId: Types.ObjectId;
  startTime: Date;
  returnTime: Date | null;
  totalCost: number;
  isReturned: boolean;
}

export interface IBookingRental {
  bikeId: Types.ObjectId;
  startTime: Date;
}

export interface BookingModel extends Model<IBooking> {
  isAvailableForRent(id: string): Promise<boolean>;
}
