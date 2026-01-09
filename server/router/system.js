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

module.exports = router;
