import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { IBike } from './bike.interface';
import Bike from './bike.model';

const createBikeInToDB = async (payload: IBike) => {
  const bike = await Bike.isBikeExists(
    payload.name,
    payload.model,
    payload.year,
  );

  if (bike) {
    throw new AppError(httpStatus.CONFLICT, 'This Bike is already exists');
  }

  const result = await Bike.create(payload);

  return result;
};

const getAllBikeFromDB = async () => {
  const result = await Bike.find().select('-__v');
  return result;
};

const updateSingleBikeInToDB = async (id: string, playload: Partial<IBike>) => {
  const bike = await Bike.findById(id);
  if (!bike) {
    throw new AppError(httpStatus.NOT_FOUND, 'Bike not found');
  }

  const result = await Bike.findOneAndUpdate({ _id: id }, playload, {
    new: true,
    runValidators: true,
  }).select('-__v');

  return result;
};

const deleteSingleBikeFromDB = async (id: string) => {
  const bike = await Bike.findById(id);
  if (!bike) {
    throw new AppError(httpStatus.NOT_FOUND, 'Bike not found');
  }

  const result = await Bike.findByIdAndDelete({ _id: id }).select('-__v');

  return result;
};

export const BikeService = {
  createBikeInToDB,
  getAllBikeFromDB,
  updateSingleBikeInToDB,
  deleteSingleBikeFromDB,
};
