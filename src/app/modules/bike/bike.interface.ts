/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';

export interface IBike {
  name: string;
  description: string;
  pricePerHour: number;
  isAvailable: boolean;
  cc: number;
  year: number;
  model: string;
  brand: string;
  images: string[];
}

export interface BikeModel extends Model<IBike> {
  isBikeExists(name: string, model: string, year: number): Promise<boolean>;
}

export interface BikeQueryParams {
  brand?: string;
  model?: string;
  name?: string;
  available?: boolean;
}
