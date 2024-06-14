import { z } from 'zod';

const userUpdateValidation = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }).optional(),
    phone: z
      .string({ required_error: 'Phone is required' })
      .min(11)
      .max(11)
      .optional(),
    address: z.string({ required_error: 'Address is required' }).optional(),
  }),
});

export const UserValidation = {
  userUpdateValidation,
};
