import { z } from 'zod';

const bookingRentalValidation = z.object({
  body: z.object({
    bikeId: z.string({ required_error: 'Bike Id is required.' }),
    startTime: z.string({ required_error: 'Booking start time is required' }),
  }),
});

export const BookingRentalValidation = {
  bookingRentalValidation,
};
