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
  auth(USER_ROLE.user, USER_ROLE.admin),
  validateRequest(BookingRentalValidation.bookingRentalValidation),
  BookingRentalController.createBookinRental,
);

// make rental return by amdin
router.put(
  '/:id/return',
  auth(USER_ROLE.admin),
  BookingRentalController.makeBikeReturn,
);

// get all rentals for user
router.get(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.user),
  BookingRentalController.getAllRentalsForUser,
);

export const BookingRentalRoutes = router;
