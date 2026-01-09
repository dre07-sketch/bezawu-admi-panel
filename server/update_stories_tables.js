const { query } = require('./connection/db');

async function updateStoriesTables() {
    try {
        // 1. Add branch_id and supermarket_id to stories table
        await query(`
            ALTER TABLE stories 
            ADD COLUMN IF NOT EXISTS branch_id UUID,
            ADD COLUMN IF NOT EXISTS supermarket_id UUID;
        `);
        console.log('Added branch_id and supermarket_id columns to stories table.');

        // 2. Add likes_count to story_comments table
        await query(`
            ALTER TABLE story_comments 
            ADD COLUMN IF NOT EXISTS likes_count INTEGER DEFAULT 0;
        `);
        console.log('Added likes_count column to story_comments table.');

    } catch (err) {
        console.error('Error updating tables:', err);
    }
    process.exit(0);
}

updateStoriesTables();
