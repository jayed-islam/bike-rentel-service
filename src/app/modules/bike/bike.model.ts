import { Schema, model } from 'mongoose';
import { BikeModel, IBike } from './bike.interface';

const bikeSchema = new Schema<IBike, BikeModel>({
  name: {
    type: String,
    required: [true, 'Bike model is required'],
  },
  description: {
    type: String,
    required: [true, 'Bike descripiton is required'],
  },
  images: {
    type: [String],
    min: 0,
    required: true,
  },
  pricePerHour: {
    type: Number,
    required: [true, 'Rental price per hour is required'],
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  cc: {
    type: Number,
    required: [true, 'Bike in cubic centimeters is required'],
  },
  year: {
    type: Number,
    required: [true, 'Year of the bike is required'],
  },
  model: {
    type: String,
    required: [true, 'Model of the bike is required'],
  },
  brand: {
    type: String,
    required: [true, 'Brand of the bike is required'],
  },
});

bikeSchema.statics.isBikeExists = async function (
  name: string,
  model: string,
  year: number,
) {
  return await this.findOne({ name, model, year });
};

bikeSchema.set('toJSON', {
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  },
});

const Bike = model<IBike, BikeModel>('Bike', bikeSchema);

export default Bike;
