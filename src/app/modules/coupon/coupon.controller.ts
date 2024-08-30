import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CouponService } from './coupon.service';

// Get all coupons
const getAllCoupons = catchAsync(async (req, res) => {
  const result = await CouponService.getAllCouponsFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All coupons retrieved successfully',
    data: result,
  });
});

// Get a single coupon by code
const getCouponByCode = catchAsync(async (req, res) => {
  const result = await CouponService.getCouponByCodeFromDB(req.params.code);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Coupon retrieved successfully',
    data: result,
  });
});

// Create a new coupon
const createCoupon = catchAsync(async (req, res) => {
  const result = await CouponService.createCouponInDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Coupon created successfully',
    data: result,
  });
});

// Update a coupon
const updateCoupon = catchAsync(async (req, res) => {
  const result = await CouponService.updateCouponInDB(
    req.params.code,
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Coupon updated successfully',
    data: result,
  });
});

// Delete a coupon
const deleteCoupon = catchAsync(async (req, res) => {
  await CouponService.deleteCouponFromDB(req.params.code);

  sendResponse(res, {
    statusCode: httpStatus.NO_CONTENT,
    success: true,
    message: 'Coupon deleted successfully',
    data: null,
  });
});

export const CouponControllers = {
  getAllCoupons,
  getCouponByCode,
  createCoupon,
  updateCoupon,
  deleteCoupon,
};
