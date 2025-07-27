import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import pool from "./config/db.js";
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import errorHandler from './middlewares/errorHandler.js';
import createUserTable from './data/createUserTable.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', userRoutes);

// Error handling middleware
app.use(errorHandler);

// Create user table if it doesn't exist
createUserTable();

// Testing postgres connection
app.get('/', async (req, res) => {
    try {
        const result = await pool.query("SELECT current_database()");
        res.send("The database is: " + result.rows[0].current_database);
    } catch (error) {
        res.status(500).send("Database connection error: " + error.message);
    }
});

// Server running
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});