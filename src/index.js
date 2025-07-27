import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from "./config/db.js";
import userRoutes from './routes/userRoutes.js';
import errorHandler from './middlewares/errorHandler.js';
import createUserTable from './data/createUserTable.js';
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;


app.use(express.json());
app.use(cors());

// Import routes
app.use('/api', userRoutes);
//Error handling middleware
app.use(errorHandler)

// create user table if it doesn't exist
createUserTable();
// Testing  postgres connection

app.get('/',async (req,res)=>{
    const result = await pool.query("SELECT current_database() ");
    res.send ("the database is: " + result.rows[0].current_database);
})

// Server runnning

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})