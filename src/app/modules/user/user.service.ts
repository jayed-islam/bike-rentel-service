import { IUser } from './user.interface';
import { User } from './user.model';

// get user profile
const getUserProfileFromDB = async (payload: string) => {
  const result = await User.findOne({ email: payload }).select('-password');

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
  }).select('_id name email role phone address');

  return result;
};

export const UserService = {
  getUserProfileFromDB,
  updateUserProfileData,
};
