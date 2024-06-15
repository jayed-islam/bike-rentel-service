import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';

import config from '../../config';
import { ILoginUser } from './auth.interface';
import { IUser } from '../user/user.interface';
import { createToken } from './auth.utils';

// user registration service
const registerUserIntoDB = async (payload: IUser) => {
  const user = await User.isUserExistsByEmail(payload.email);

  if (user) {
    throw new AppError(505, 'This user is already exists');
  }

  const result = await User.create(payload);
  // const userWithoutPassword = result.toObject()
  // delete userWithoutPassword.password

  return result;
};

// user login service
const loginUserFromDB = async (payload: ILoginUser) => {
  const user = await User.isUserExistsByEmail(payload.email);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }

  if (!(await User.isPasswordMatched(payload.password, user.password))) {
    throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched');
  }

  // console.log('userid', user._id);

  const jwtPayload = {
    email: user.email,
    role: user.role,
    userId: user._id,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_sccess_secret as string,
    config.jwt_access_expirse_id as string,
  );

  const userData = await User.findOne({ email: payload.email }).select(
    'name email role _id address phone',
  );

  return {
    accessToken,
    result: userData,
  };
};

export const AuthService = {
  registerUserIntoDB,
  loginUserFromDB,
};
