const express = require('express');
const router = express.Router();
const { query } = require('../connection/db');

// Public route to check system status
router.get('/status', async (req, res) => {
    try {
        const result = await query('SELECT id, name, value FROM system WHERE id IN ( 3, 4)');
        const statusMap = {};
        result.rows.forEach(row => {
            statusMap[row.name] = row.value;
        });
        res.json(statusMap);
    } catch (err) {
        console.error('[System API] Error fetching status:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Route to fetch commission rate
router.get('/commission', async (req, res) => {
    try {
        const result = await query("SELECT value FROM system WHERE name = 'commission_rate'");
        if (result.rows.length > 0) {
            res.json({ commission_rate: result.rows[0].value });
        } else {
            // Defaulting to 0.05 if not found, as per previous logic mentioned in conversation history
            res.json({ commission_rate: '0.05' });
        }
    } catch (err) {
        console.error('[System API] Error fetching commission rate:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;

