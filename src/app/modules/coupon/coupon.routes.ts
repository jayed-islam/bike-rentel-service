import express from 'express';
import { CouponControllers } from './coupon.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constants';

const router = express.Router();

// Get all coupons
router.get('/get-all', CouponControllers.getAllCoupons);

// Get a coupon by code
router.get('/:code', CouponControllers.getCouponByCode);

// Create a new coupon
router.post('/create', auth(USER_ROLE.ADMIN), CouponControllers.createCoupon);

// Update a coupon
router.put(
  '/update/:code',
  auth(USER_ROLE.ADMIN), // Only admin can update coupons
  CouponControllers.updateCoupon,
);

// Delete a coupon
router.delete(
  '/delete/:code',
  auth(USER_ROLE.ADMIN), // Only admin can delete coupons
  CouponControllers.deleteCoupon,
);

export const CouponRoutes = router;
