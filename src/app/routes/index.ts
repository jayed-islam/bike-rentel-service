import { Router } from 'express';
import { AuthRoutes } from '../modules/Auth/auth.routes';
import { UserRoutes } from '../modules/user/user.routes';
import { BikeRoutes } from '../modules/bike/bike.routes';
import { BookingRentalRoutes } from '../modules/booking/booking.routes';
import { CouponRoutes } from '../modules/coupon/coupon.routes';
import { PaymentRoutes } from '../modules/payment/payment.routes';

const router = Router();

const modulesRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/user',
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
  {
    path: '/coupon',
    route: CouponRoutes,
  },
  {
    path: '/payment',
    route: PaymentRoutes,
  },
];

modulesRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
