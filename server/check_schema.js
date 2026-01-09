
const { query } = require('./connection/db');

async function checkSchema() {
    try {
        const resOrders = await query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'orders';
    `);
        console.log('Orders Table:', resOrders.rows.map(r => r.column_name));

        const resOrderItems = await query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'order_items';
    `);
        console.log('Order Items Table:', resOrderItems.rows.map(r => r.column_name));

        // Check if there is a 'bundles' table
        const resBundles = await query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'bundles';
    `);
        console.log('Bundles Table:', resBundles.rows.map(r => r.column_name));

    } catch (err) {
        console.error(err);
    } finally {
        process.exit();
    }
}

checkSchema();
