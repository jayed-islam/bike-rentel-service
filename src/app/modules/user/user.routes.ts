import express from 'express';
import { UserControllers } from './user.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from './user.constants';
import validateRequest from '../../middlewares/validateRequest';
import { UserValidation } from './user.validation';

const router = express.Router();

// Get user profile
router.get(
  '/me',
  auth(USER_ROLE.USER, USER_ROLE.ADMIN),
  UserControllers.getUserProfile,
);

router.get('/get-all', auth(USER_ROLE.ADMIN), UserControllers.getAllUser);
// Update user profile
router.put(
  '/update',
  auth(USER_ROLE.USER, USER_ROLE.ADMIN),
  validateRequest(UserValidation.userUpdateValidation),
  UserControllers.updateUserProfile,
);

// Delete user (admin only)
router.delete(
  '/delete/:email',
  auth(USER_ROLE.ADMIN),
  UserControllers.deleteUser,
);

// Make user an admin (admin only)
router.patch(
  '/:email/make-admin',
  auth(USER_ROLE.ADMIN),
  UserControllers.makeUserAdmin,
);

export const UserRoutes = router;
