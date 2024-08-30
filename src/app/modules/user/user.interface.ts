/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose';
import { USER_ROLE } from './user.constants';

export interface IUser {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  profileImage: string;
  role: 'ADMIN' | 'USER';
}

export interface UserModel extends Model<IUser> {
  isUserExistsByEmail(email: string): Promise<IUser>;
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
}

export type IUserRole = keyof typeof USER_ROLE;
