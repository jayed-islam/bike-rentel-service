import { z } from 'zod';

const bookingRentalValidation = z.object({
  body: z.object({
    bikeId: z.string({ required_error: 'Bike Id is required.' }),
    startTime: z.string({ required_error: 'Booking start time is required' }),
    coupon: z.string().optional(),
    advancedAmount: z.number().optional(),
  }),
});

export const BookingRentalValidation = {
  bookingRentalValidation,
};
