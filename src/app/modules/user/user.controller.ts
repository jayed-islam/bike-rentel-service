import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserService } from './user.service';

// get user profile
const getUserProfile = catchAsync(async (req, res) => {
  const result = await UserService.getUserProfileFromDB(req.user.email);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User profile retrieved successfully',
    data: result,
  });
});

// update user profile
const updateUserProfile = catchAsync(async (req, res) => {
  const result = await UserService.updateUserProfileData(
    req.user.email,
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Profile updated successfully',
    data: result,
  });
});

export const UserControllers = {
  getUserProfile,
  updateUserProfile,
};
