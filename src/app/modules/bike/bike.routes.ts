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
  auth(USER_ROLE.admin),
  validateRequest(BikeValidation.createBikeValidation),
  BikeController.createBike,
);

// get all bike
router.get('/', BikeController.getAllBike);

// update single bike
router.put(
  '/:id',
  auth(USER_ROLE.admin),
  validateRequest(BikeValidation.updateBikeValidation),
  BikeController.updateSingleBike,
);

// delete single bike
router.delete('/:id', auth(USER_ROLE.admin), BikeController.deleteSingleBike);

export const BikeRoutes = router;
