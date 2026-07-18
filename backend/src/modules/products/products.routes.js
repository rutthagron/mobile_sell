import { Router } from 'express';
import { authRequired } from '../../middlewares/auth.js';
import { lookupHandler } from './products.controller.js';

const router = Router();

router.get('/lookup/:code', authRequired, lookupHandler);

export default router;
