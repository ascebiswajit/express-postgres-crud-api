import { 
    createUserService, 
    getUserByEmailService, 
    emailExistsService
} from '../models/userModel.js';
import { comparePassword, createSendToken } from '../utils/authUtils.js';

const handleResponse = (res, status, message, data = null) => {
    res.status(status).json({
        status: status,
        message: message,
        data: data
    });
};

// Register new user
export const signup = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await emailExistsService(email);
        if (existingUser) {
            return handleResponse(res, 400, 'User with this email already exists');
        }

        // Create new user
        const newUser = await createUserService(name, email, password);
        
        // Create and send token
        createSendToken(newUser, 201, res, 'User registered successfully');

    } catch (error) {
        next(error);
    }
};

// Login user
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Find user by email (include password for comparison)
        const user = await getUserByEmailService(email);
        if (!user) {
            return handleResponse(res, 401, 'Invalid email or password');
        }

        // Check password
        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
            return handleResponse(res, 401, 'Invalid email or password');
        }

        // Create and send token
        createSendToken(user, 200, res, 'Logged in successfully');

    } catch (error) {
        next(error);
    }
};

// Logout user (simple response - JWT is stateless)
export const logout = async (req, res, next) => {
    try {
        handleResponse(res, 200, 'Logged out successfully');
    } catch (error) {
        next(error);
    }
};

// Get current user profile
export const getProfile = async (req, res, next) => {
    try {
        const user = req.user;
        handleResponse(res, 200, 'User profile retrieved successfully', { user });
    } catch (error) {
        next(error);
    }
};