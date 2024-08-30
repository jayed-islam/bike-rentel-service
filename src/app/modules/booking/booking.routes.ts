import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { BookingRentalValidation } from './booking.validation';
import { BookingRentalController } from './booking.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constants';

const router = express.Router();

// create rental
router.post(
  '/',
  auth(USER_ROLE.USER, USER_ROLE.ADMIN),
  validateRequest(BookingRentalValidation.bookingRentalValidation),
  BookingRentalController.createBookinRental,
);

// make rental return by amdin
router.put(
  '/:id/return',
  auth(USER_ROLE.ADMIN),
  BookingRentalController.makeBikeReturn,
);

// get all rentals for user
router.post(
  '/get-user-rental-list',
  auth(USER_ROLE.ADMIN, USER_ROLE.USER),
  BookingRentalController.getAllRentalsForUser,
);

// get all rentals
router.get(
  '/get-rentals',
  auth(USER_ROLE.ADMIN),
  BookingRentalController.getAllRentals,
);

export const BookingRentalRoutes = router;
