import { Router } from 'express';
import { AuthRoutes } from '../modules/Auth/auth.routes';
import { UserRoutes } from '../modules/user/user.routes';
import { BikeRoutes } from '../modules/bike/bike.routes';
import { BookingRentalRoutes } from '../modules/booking/booking.routes';

const router = Router();

const modulesRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/bikes',
    route: BikeRoutes,
  },
  {
    path: '/rentals',
    route: BookingRentalRoutes,
  },
];

modulesRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
