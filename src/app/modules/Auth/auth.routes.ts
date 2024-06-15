import express from 'express';
import { AuthController } from './auth.controller';
import validateRequest from '../../middlewares/validateRequest';
import { AuthValidation } from './auth.validation';

const router = express.Router();

// user registration route also for admin
router.post(
  '/signup',
  validateRequest(AuthValidation.userCreateValidation),
  AuthController.registerUser,
);

// login route for user and admin
router.post(
  '/login',
  validateRequest(AuthValidation.loginValidationSchema),
  AuthController.loginUser,
);

export const AuthRoutes = router;
