const express = require('express');

const { check, validationResult } = require('express-validator');
const router = express.Router();
const { query } = require('../connection/db');
const authMiddleware = require('../middleware/auth');

// Get all categories (filtered by user's supermarket/branch)
router.get('/categories-get', authMiddleware, async (req, res) => {
    try {
        const { branchId, supermarketId, role } = req.user;

        let text = 'SELECT * FROM categories WHERE 1=1';
        const params = [];

        // If Super Admin, show everything
        if (role === 'SUPER_ADMIN' || role === 'ADMIN') {
            // No filters
        } else if (branchId) {
            // Branch Admin: sees branch-specific, supermarket-global, and system-global
            text += ' AND (branch_id = $1 OR supermarket_id = $2 OR (branch_id IS NULL AND supermarket_id IS NULL))';
            params.push(branchId, supermarketId);
        } else if (supermarketId) {
            // Supermarket Admin: sees all categories in their supermarket + global
            text += ' AND (supermarket_id = $1 OR (branch_id IS NULL AND supermarket_id IS NULL))';
            params.push(supermarketId);
        } else {
            // Global/Other: only see truly global categories
            text += ' AND (branch_id IS NULL AND supermarket_id IS NULL)';
        }

        text += ' ORDER BY name ASC';
        const result = await query(text, params);
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching categories:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Create a new category
router.post('/categories-post', [
    authMiddleware,
    check('name', 'Category name is required').not().isEmpty().trim().escape()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { name } = req.body;
    const branch_id = req.user.branchId;
    const supermarket_id = req.user.supermarketId;

    if (!name) {
        return res.status(400).json({ message: 'Category name is required' });
    }

    try {
        const text = `
            INSERT INTO categories (name, supermarket_id, branch_id)
            VALUES ($1, $2, $3)
            RETURNING *
        `;
        const values = [name, supermarket_id, branch_id];
        const result = await query(text, values);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error creating category:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
