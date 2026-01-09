const { query } = require('./connection/db');

async function createStoryCommentsTable() {
    try {
        const createTableQuery = `
            DROP TABLE IF EXISTS story_comments_and_likes;
            CREATE TABLE story_comments_and_likes (
                id SERIAL PRIMARY KEY,
                story_id INTEGER REFERENCES stories(id) ON DELETE CASCADE,
                user_id UUID, -- Optional if we want to link to users table later
                user_name VARCHAR(255) NOT NULL,
                content TEXT NOT NULL,
                likes_count INTEGER DEFAULT 0,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `;

        await query(createTableQuery);
        console.log('Story comments table created successfully');
    } catch (err) {
        console.error('Error creating story comments table:', err);
    }
    process.exit(0);
}

createStoryCommentsTable();
