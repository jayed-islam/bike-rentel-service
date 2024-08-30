import mongoose, { Schema } from 'mongoose';
import { ICoupon } from './coupon.interface';

const couponSchema = new Schema<ICoupon>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    discountAmount: {
      type: Number,
      required: true,
    },
    discountType: {
      type: String,
      enum: ['percentage', 'fixed'],
      default: 'percentage',
    },
    expirationDate: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

export const Coupon = mongoose.model<ICoupon>('Coupon', couponSchema);
