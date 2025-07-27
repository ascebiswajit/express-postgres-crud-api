import express from 'express';
import { createUser, deleteUser, getAllUsers, getUserById, updateUser } from '../controllers/userController.js';
import validateUserInput from '../middlewares/inputValidator.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Apply authentication middleware to all user routes
router.use(protect);

// Define your user routes here
router.get('/users', getAllUsers);
router.get('/user/:id', getUserById);
router.post('/user', validateUserInput, createUser);
router.put('/user/:id', validateUserInput, updateUser);
router.delete('/user/:id', deleteUser);

export default router;