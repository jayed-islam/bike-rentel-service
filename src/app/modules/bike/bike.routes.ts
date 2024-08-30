import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { BikeValidation } from './bike.validation';
import { BikeController } from './bike.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constants';
const router = express.Router();

// create bike
router.post(
  '/',
  auth(USER_ROLE.ADMIN),
  validateRequest(BikeValidation.createBikeValidation),
  BikeController.createBike,
);

// delete single bike
router.get('/get-single/:id', BikeController.getSingleBike);

// get all bike
router.post('/get-all', BikeController.getAllBike);

// get all bike
router.get('/get-available-bike', BikeController.getAllAvailableBike);

// update single bike
router.put(
  '/update/:id',
  auth(USER_ROLE.ADMIN),
  validateRequest(BikeValidation.updateBikeValidation),
  BikeController.updateSingleBike,
);

// delete single bike
router.delete('/:id', auth(USER_ROLE.ADMIN), BikeController.deleteSingleBike);

export const BikeRoutes = router;
