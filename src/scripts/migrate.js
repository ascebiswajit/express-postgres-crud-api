// src/scripts/migrate.js
// Run this script if you want to manually handle the migration

import pool from '../config/db.js';
import { recreateUserTable } from '../data/createUserTable.js';
import dotenv from 'dotenv';

dotenv.config();

const runMigration = async () => {
    try {
        console.log('🚀 Starting database migration...');
        
        // Check what exists currently
        const tableExistsQuery = `
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = 'users'
            );
        `;
        
        const tableExists = await pool.query(tableExistsQuery);
        const exists = tableExists.rows[0].exists;
        
        if (exists) {
            // Check current table structure
            const columnsQuery = `
                SELECT column_name, data_type, is_nullable 
                FROM information_schema.columns 
                WHERE table_schema = 'public' 
                AND table_name = 'users'
                ORDER BY ordinal_position;
            `;
            
            const columns = await pool.query(columnsQuery);
            console.log('📋 Current table structure:');
            columns.rows.forEach(col => {
                console.log(`  - ${col.column_name}: ${col.data_type} (${col.is_nullable})`);
            });
            
            // Check if password field exists
            const hasPassword = columns.rows.some(col => col.column_name === 'password');
            
            if (!hasPassword) {
                console.log('\n❓ Options:');
                console.log('1. Add password field to existing table (keeps existing data)');
                console.log('2. Recreate table (LOSES existing data)');
                console.log('\nRecommendation: Use option 1 to preserve existing users');
                
                // For this example, we'll add the password field
                console.log('\n🔧 Adding password field...');
                await pool.query('ALTER TABLE users ADD COLUMN password VARCHAR(255)');
                console.log('✅ Password field added successfully');
                console.log('⚠️  Existing users will need to set passwords via signup again');
            } else {
                console.log('✅ Table already has password field');
            }
        } else {
            console.log('📋 No existing users table found');
            console.log('🔧 Creating new table...');
            await recreateUserTable();
        }
        
        console.log('✅ Migration completed successfully');
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Migration failed:', error.message);
        process.exit(1);
    }
};

// Run migration if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    runMigration();
}

export default runMigration;