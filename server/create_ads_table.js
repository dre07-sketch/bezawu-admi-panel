const { query } = require('./connection/db');

async function createAdsTable() {
    try {
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS ads (
                id SERIAL PRIMARY KEY,
                type VARCHAR(50) NOT NULL CHECK (type IN ('image', 'video')),
                media_url TEXT NOT NULL,
                description VARCHAR(100), -- "really short description"
                duration_hours INTEGER NOT NULL,
                expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `;

        await query(createTableQuery);
        console.log('Ads table created successfully');
    } catch (err) {
        console.error('Error creating ads table:', err);
    }
    process.exit(0);
}

createAdsTable();
