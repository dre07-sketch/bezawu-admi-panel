const { query } = require('./connection/db');

async function fixStoriesIdTypes() {
    try {
        console.log('Changing branch_id and supermarket_id to VARCHAR...');

        // Alter branch_id
        await query(`
            ALTER TABLE stories 
            ALTER COLUMN branch_id TYPE VARCHAR(255);
        `);
        console.log('Changed branch_id to VARCHAR(255).');

        // Alter supermarket_id
        await query(`
            ALTER TABLE stories 
            ALTER COLUMN supermarket_id TYPE VARCHAR(255);
        `);
        console.log('Changed supermarket_id to VARCHAR(255).');

    } catch (err) {
        console.error('Error updating table columns:', err);
    }
    process.exit(0);
}

fixStoriesIdTypes();
