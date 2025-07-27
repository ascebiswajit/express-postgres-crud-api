import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

// Generate JWT Token
export const generateToken = (userId) => {
    return jwt.sign(
        { userId },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN || '7d'
        }
    );
};

// Verify JWT Token
export const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};

// Hash Password
export const hashPassword = async (password) => {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
};

// Compare Password
export const comparePassword = async (plainPassword, hashedPassword) => {
    return await bcrypt.compare(plainPassword, hashedPassword);
};

// Create and send token response
export const createSendToken = (user, statusCode, res, message = 'Success') => {
    const token = generateToken(user.id);

    // Remove password from output
    const { password, ...userWithoutPassword } = user;

    res.status(statusCode).json({
        status: statusCode,
        message,
        token,
        data: {
            user: userWithoutPassword
        }
    });
};