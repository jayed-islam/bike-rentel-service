import { IUser } from './user.interface';
import { User } from './user.model';

// get user profile
const getUserProfileFromDB = async (payload: string) => {
  const result = await User.findOne({ email: payload }).select('-password');

  return result;
};

// get user profile
const getAllUserFromDB = async () => {
  const result = await User.find().select('-password');

  return result;
};

// update user profile data
const updateUserProfileData = async (
  email: string,
  payload: Partial<IUser>,
) => {
  const result = await User.findOneAndUpdate({ email }, payload, {
    new: true,
    runValidators: true,
  }).select('_id name email role phone address profileImage');

  return result;
};

// Delete user
const deleteUser = async (email: string) => {
  const result = await User.findOneAndDelete({ email });
  return result;
};

// Make user an admin
const makeUserAdmin = async (email: string, role: string) => {
  const result = await User.findOneAndUpdate(
    { email },
    { role },
    { new: true, runValidators: true },
  ).select('_id name email role phone address profileImage');
  return result;
};

export const UserService = {
  getUserProfileFromDB,
  updateUserProfileData,
  makeUserAdmin,
  deleteUser,
  getAllUserFromDB,
};
