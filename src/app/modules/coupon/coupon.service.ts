import { ICoupon } from './coupon.interface';
import { Coupon } from './coupon.model';

// Get all coupons
const getAllCouponsFromDB = async () => {
  const result = await Coupon.find();
  return result;
};

// Get a single coupon by code
const getCouponByCodeFromDB = async (code: string) => {
  const result = await Coupon.findOne({ code });
  return result;
};

// Create a new coupon
const createCouponInDB = async (payload: ICoupon) => {
  const result = await Coupon.create(payload);
  return result;
};

// Update a coupon
const updateCouponInDB = async (code: string, payload: Partial<ICoupon>) => {
  const result = await Coupon.findOneAndUpdate({ code }, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

// Delete a coupon
const deleteCouponFromDB = async (code: string) => {
  await Coupon.findOneAndDelete({ code });
};

export const CouponService = {
  getAllCouponsFromDB,
  getCouponByCodeFromDB,
  createCouponInDB,
  updateCouponInDB,
  deleteCouponFromDB,
};
