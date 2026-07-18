import { Router } from 'express';
import { authRequired } from '../../middlewares/auth.js';
import { searchHandler } from './customers.controller.js';

const router = Router();

router.get('/', authRequired, searchHandler);

export default router;
