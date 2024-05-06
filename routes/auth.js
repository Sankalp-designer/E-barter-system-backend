import express from 'express';
import { register, login, profile } from '../controllers/auth.js';
import {authenticateToken} from '../authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile',authenticateToken, profile);

export default router;
