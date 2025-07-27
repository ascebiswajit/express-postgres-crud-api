import express from 'express';
import {
    signup,
    login,
    logout,
    getProfile
} from '../controllers/authController.js';

import { protect } from '../middlewares/authMiddleware.js';
import { validateLogin, validateRegister } from '../middlewares/inputValidator.js';

const router = express.Router();

// Public routes
router.post('/signup', validateRegister, signup);
router.post('/login', validateLogin, login);

// Protected routes (require authentication)
router.use(protect); // All routes after this middleware are protected

router.post('/logout', logout);
router.get('/profile', getProfile);

export default router;