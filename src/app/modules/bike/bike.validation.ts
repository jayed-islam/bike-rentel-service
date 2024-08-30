import { z } from 'zod';

const updateBikeValidation = z.object({
  body: z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    pricePerHour: z.number().optional(),
    isAvailable: z.boolean().optional(),
    cc: z.number().optional(),
    year: z.number().optional(),
    model: z.string().optional(),
    brand: z.string().optional(),
  }),
});

const createBikeValidation = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Bike model is required',
    }),
    description: z.string({
      required_error: 'Description of the bike is required',
    }),
    pricePerHour: z.number({
      required_error: 'Rental price per hour is required',
    }),
    isAvailable: z.boolean().optional().default(true),
    cc: z.number({
      required_error: 'Bike cc is required',
    }),
    year: z.number({
      required_error: 'The manufacturing year is required',
    }),
    model: z.string({ required_error: 'The model is required' }),
    brand: z.string({ required_error: 'Brand is required' }),
  }),
});

export const BikeValidation = {
  createBikeValidation,
  updateBikeValidation,
};
