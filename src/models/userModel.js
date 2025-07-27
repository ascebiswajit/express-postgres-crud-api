import pool from '../config/db.js';
import { hashPassword } from '../utils/authUtils.js';

// Register new user
export const createUserService = async (name, email, password) => {
    // Hash password before storing
    const hashedPassword = await hashPassword(password);
    
    const result = await pool.query(
        'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, created_at, updated_at',
        [name, email, hashedPassword]
    );
    return result.rows[0];
};

// Find user by email (for login)
export const getUserByEmailService = async (email) => {
    const result = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
    );
    return result.rows[0];
};

// Get user by ID (without password)
export const getUserByIdService = async (id) => {
    const result = await pool.query(
        'SELECT id, name, email, created_at, updated_at FROM users WHERE id = $1',
        [id]
    );
    return result.rows[0];
};

// Get all users (without passwords)
export const getAllUsersService = async () => {
    const result = await pool.query(
        'SELECT id, name, email, created_at, updated_at FROM users ORDER BY created_at DESC'
    );
    return result.rows;
};

// Update user profile
export const updateUserService = async (id, name, email) => {
    const result = await pool.query(
        'UPDATE users SET name = $1, email = $2, updated_at = NOW() WHERE id = $3 RETURNING id, name, email, created_at, updated_at',
        [name, email, id]
    );
    return result.rows[0];
};

// Delete user
export const deleteUserService = async (id) => {
    const result = await pool.query(
        'DELETE FROM users WHERE id = $1 RETURNING id, name, email, created_at',
        [id]
    );
    if (result.rowCount === 0) {
        throw new Error('User not found');
    }
    return result.rows[0];
};

// Check if email exists (for registration validation)
export const emailExistsService = async (email) => {
    const result = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    return result.rows.length > 0;
};