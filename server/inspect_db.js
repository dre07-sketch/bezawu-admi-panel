const { query } = require('./connection/db');

async function checkSchema() {
    try {
        const result = await query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'stories'
        `);
        console.log('Stories table columns:', result.rows);

        const result2 = await query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'story_comments_and_likes'
        `);
        console.log('Story comments table columns:', result2.rows);

    } catch (err) {
        console.error('Error checking schema:', err);
    }
    process.exit(0);
}

checkSchema();
