import pool from '../config/db.js';

const createUserTable = async () => {
    try {
        // First, check if table exists
        const tableExistsQuery = `
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = 'users'
            );
        `;
        
        const tableExists = await pool.query(tableExistsQuery);
        const exists = tableExists.rows[0].exists;
        
        if (!exists) {
            // Table doesn't exist, create new table with all fields
            console.log('Creating new users table...');
            const createTableQuery = `
                CREATE TABLE users(
                    id SERIAL PRIMARY KEY,
                    name VARCHAR(100) NOT NULL,
                    email VARCHAR(100) UNIQUE NOT NULL,
                    password VARCHAR(255) NOT NULL,
                    created_at TIMESTAMP DEFAULT NOW(),
                    updated_at TIMESTAMP DEFAULT NOW()
                )
            `;
            await pool.query(createTableQuery);
            console.log('✅ Users table created successfully with password field');
        } else {
            // Table exists, check if password field exists
            console.log('Users table already exists, checking for password field...');
            
            const columnExistsQuery = `
                SELECT EXISTS (
                    SELECT FROM information_schema.columns 
                    WHERE table_schema = 'public' 
                    AND table_name = 'users' 
                    AND column_name = 'password'
                );
            `;
            
            const columnExists = await pool.query(columnExistsQuery);
            const passwordFieldExists = columnExists.rows[0].exists;
            
            if (!passwordFieldExists) {
                // Add password field to existing table
                console.log('Adding password field to existing users table...');
                const addPasswordQuery = `
                    ALTER TABLE users 
                    ADD COLUMN password VARCHAR(255);
                `;
                await pool.query(addPasswordQuery);
                console.log('✅ Password field added to existing users table');
                
                // Optionally, you might want to set a default password for existing users
                // or mark them for password reset
                console.log('⚠️  Note: Existing users will need to reset their passwords');
            } else {
                console.log('✅ Users table already has password field');
            }
        }
        
    } catch (error) {
        console.error('❌ Error managing users table:', error.message);
        throw error;
    }
};

// Optional: Function to safely drop and recreate table (use with caution!)
export const recreateUserTable = async () => {
    try {
        console.log('⚠️  Dropping existing users table...');
        await pool.query('DROP TABLE IF EXISTS users CASCADE');
        
        console.log('Creating fresh users table...');
        const createTableQuery = `
            CREATE TABLE users(
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            )
        `;
        await pool.query(createTableQuery);
        console.log('✅ Fresh users table created successfully');
        
    } catch (error) {
        console.error('❌ Error recreating users table:', error.message);
        throw error;
    }
};

export default createUserTable;