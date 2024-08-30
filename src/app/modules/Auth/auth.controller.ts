import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AuthService } from './auth.service';

// user registration controller
const registerUser = catchAsync(async (req, res) => {
  const result = await AuthService.registerUserIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User registered successfully',
    data: result,
  });
});

// user login service
const loginUser = catchAsync(async (req, res) => {
  const { accessToken, result } = await AuthService.loginUserFromDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User logged in successfully',
    token: accessToken,
    data: result,
  });
});

export const AuthController = {
  registerUser,
  loginUser,
};
