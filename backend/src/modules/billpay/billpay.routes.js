import { Router } from 'express';
import { authRequired } from '../../middlewares/auth.js';
import { validate } from '../../middlewares/validate.js';
import {
  createBillPaySchema,
  createHandler,
  listHandler,
} from './billpay.controller.js';

const router = Router();

router.post('/', authRequired, validate(createBillPaySchema), createHandler);
router.get('/', authRequired, listHandler);

export default router;
