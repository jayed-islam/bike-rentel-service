import express from 'express';
import { UserControllers } from './user.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from './user.constants';
import validateRequest from '../../middlewares/validateRequest';
import { UserValidation } from './user.validation';

const router = express.Router();

// get user profile
router.get('/me', auth(USER_ROLE.user), UserControllers.getUserProfile);

// update user profile
router.put(
  '/me',
  auth(USER_ROLE.user),
  validateRequest(UserValidation.userUpdateValidation),
  UserControllers.updateUserProfile,
);

export const UserRoutes = router;
