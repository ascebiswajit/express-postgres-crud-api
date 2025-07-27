import express from 'express';
import { createUser, deleteUser, getAllUsers, getUserById, updateUser } from '../controllers/userController.js';
import validateUserInput from '../middlewares/inputValidator.js';

const router = express.Router();

// Define your user routes here


router.get('/users',getAllUsers);
router.get('/user/:id', getUserById);
router.post('/user',validateUserInput, createUser);
router.put('/user/:id',validateUserInput, updateUser);
router.delete('/user/:id', deleteUser);

export default router;