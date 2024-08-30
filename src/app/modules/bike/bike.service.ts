import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { BikeQueryParams, IBike } from './bike.interface';
import Bike from './bike.model';
import { FilterQuery } from 'mongoose';

// create bike service
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

// // get all bike service
// const getAllBikeFromDB = async () => {
//   const result = await Bike.find().select('-__v');
//   return result;
// };

const getAllBikeFromDB = async ({
  brand,
  model,
  name,
  available,
}: BikeQueryParams) => {
  const filter: FilterQuery<IBike> = {};

  if (brand) filter.brand = brand;
  if (model) filter.model = model;
  if (name) filter.name = { $regex: name, $options: 'i' };
  if (available !== undefined) filter.isAvailable = available;

  const result = await Bike.find(filter).select('-__v').exec();
  return result;
};

// get all bike service
const getAllAvailableBikeFromDB = async () => {
  const result = await Bike.find({ isAvailable: true }).select('-__v');
  return result;
};

// update single bike
const updateSingleBikeInToDB = async (id: string, playload: Partial<IBike>) => {
  const bike = await Bike.findById(id);
  if (!bike) {
    throw new AppError(httpStatus.NOT_FOUND, 'Bike not found');
  }

  console.log(id, playload);

  const result = await Bike.findOneAndUpdate({ _id: id }, playload, {
    new: true,
    runValidators: true,
  }).select('-__v');

  return result;
};

// delete single bike
const deleteSingleBikeFromDB = async (id: string) => {
  const bike = await Bike.findById(id);
  if (!bike) {
    throw new AppError(httpStatus.NOT_FOUND, 'Bike not found');
  }

  const result = await Bike.findByIdAndDelete({ _id: id }).select('-__v');

  return result;
};

const getSingleBikeFromDB = async (id: string) => {
  const bike = await Bike.findById(id);
  if (!bike) {
    throw new AppError(httpStatus.NOT_FOUND, 'Bike not found');
  }

  return bike;
};

export const BikeService = {
  createBikeInToDB,
  getAllBikeFromDB,
  updateSingleBikeInToDB,
  deleteSingleBikeFromDB,
  getAllAvailableBikeFromDB,
  getSingleBikeFromDB,
};
