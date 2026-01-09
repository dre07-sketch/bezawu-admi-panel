const { query } = require('./connection/db');

async function createStoriesTable() {
    try {
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS stories (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                video_url TEXT NOT NULL,
                link TEXT,
                description TEXT,
                likes_count INTEGER DEFAULT 0,
                comments_count INTEGER DEFAULT 0,
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `;

        await query(createTableQuery);
        console.log('Stories table created successfully');
    } catch (err) {
        console.error('Error creating stories table:', err);
    }
    process.exit(0);
}

createStoriesTable();
