const { query } = require('./connection/db');

async function createOrderChatsTable() {
    try {
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS order_chats (
                id SERIAL PRIMARY KEY,
                order_id VARCHAR(255) NOT NULL, -- Linking to order ID (which seems to be string based on previous context)
                sender_type VARCHAR(50) NOT NULL CHECK (sender_type IN ('ADMIN', 'CUSTOMER')),
                message TEXT NOT NULL,
                is_read BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `;

        await query(createTableQuery);
        console.log('Order chats table created successfully');
    } catch (err) {
        console.error('Error creating order chats table:', err);
    }
    process.exit(0);
}

createOrderChatsTable();
