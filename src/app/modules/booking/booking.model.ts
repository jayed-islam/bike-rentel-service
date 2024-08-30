import { Schema, model } from 'mongoose';
import { IBooking } from './bookin.interface';

const bookingSchema = new Schema<IBooking>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
  },
  bikeId: {
    type: Schema.Types.ObjectId,
    ref: 'Bike',
    required: [true, 'Bike ID is required'],
  },
  startTime: {
    type: Date,
    required: [true, 'Start time of the rental is required'],
  },
  returnTime: {
    type: Date,
    default: null,
  },
  totalCost: {
    type: Number,
    required: [true, 'Total cost of the rental is required'],
  },
  advancedAmount: {
    type: Number,
  },
  coupon: {
    type: String,
  },
  isReturned: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ['paid', 'unpaid'],
    default: 'unpaid',
  },
});

const Booking = model<IBooking>('Booking', bookingSchema);

export default Booking;
