require('dotenv').config();
const { query } = require('./connection/db');

async function checkSchema() {
    try {
        const res = await query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'order_chats'
        `);
        console.log('Columns in order_chats:', res.rows);
    } catch (e) {
        console.error('Error:', e);
    }
}
checkSchema();
