import { z } from 'zod';

const loginValidationSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'Email is required.' }),
    password: z.string({ required_error: 'Password is required' }),
  }),
});

const userCreateValidation = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }),
    email: z.string({ required_error: 'Email is required' }).email(),
    password: z
      .string()
      .min(8, { message: 'Password length must be at least 8 characters' })
      .refine((value) => value !== '', { message: 'Password is required' }),
    phone: z.string({ required_error: 'Phone is required' }).min(11).max(11),
    address: z.string({ required_error: 'Address is required' }),
  }),
});

export const AuthValidation = {
  userCreateValidation,
  loginValidationSchema,
};
