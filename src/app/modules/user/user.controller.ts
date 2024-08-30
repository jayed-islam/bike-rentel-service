import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserService } from './user.service';

// Get user profile
const getUserProfile = catchAsync(async (req, res) => {
  const result = await UserService.getUserProfileFromDB(req.user.email);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User profile retrieved successfully',
    data: result,
  });
});

// Get users
const getAllUser = catchAsync(async (req, res) => {
  const result = await UserService.getAllUserFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All User retrieved successfully',
    data: result,
  });
});

// Update user profile
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

// Delete user
const deleteUser = catchAsync(async (req, res) => {
  await UserService.deleteUser(req.params.email);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User deleted successfully',
    data: null,
  });
});

// Make user an admin
const makeUserAdmin = catchAsync(async (req, res) => {
  const result = await UserService.makeUserAdmin(
    req.params.email,
    req.body.role,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User has been made an admin successfully',
    data: result,
  });
});

export const UserControllers = {
  getUserProfile,
  updateUserProfile,
  deleteUser,
  makeUserAdmin,
  getAllUser,
};
