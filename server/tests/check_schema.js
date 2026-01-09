const { query } = require('../connection/db');

async function checkSchema() {
    try {
        const res = await query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'orders';
        `);
        console.log(res.rows);
    } catch (err) {
        console.error(err);
    }
}
checkSchema();
