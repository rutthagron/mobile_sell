import { Router } from 'express';
import { validate } from '../../middlewares/validate.js';
import { loginHandler, loginSchema } from './auth.controller.js';

const router = Router();

router.post('/login', validate(loginSchema), loginHandler);

export default router;
