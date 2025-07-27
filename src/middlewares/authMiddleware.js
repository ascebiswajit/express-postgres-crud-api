import { verifyToken } from '../utils/authUtils.js';
import { getUserByIdService } from '../models/userModel.js';

// Protect routes middleware
export const protect = async (req, res, next) => {
    try {
        // 1) Getting token and check if it's there
        let token;
        
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({
                status: 401,
                message: 'You are not logged in! Please log in to get access.'
            });
        }

        // 2) Verification token
        const decoded = verifyToken(token);

        // 3) Check if user still exists
        const currentUser = await getUserByIdService(decoded.userId);
        if (!currentUser) {
            return res.status(401).json({
                status: 401,
                message: 'The user belonging to this token does no longer exist.'
            });
        }

        // Grant access to protected route
        req.user = currentUser;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                status: 401,
                message: 'Invalid token. Please log in again!'
            });
        } else if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                status: 401,
                message: 'Your token has expired! Please log in again.'
            });
        }
        
        return res.status(500).json({
            status: 500,
            message: 'Something went wrong during authentication'
        });
    }
};