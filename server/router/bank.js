const express = require('express');
const router = express.Router();
const { query } = require('../connection/db');
const authMiddleware = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

// --- DATABASE SELF-HEALING (Runs ONCE on startup) ---
(async () => {
    try {
        await query(`
            CREATE TABLE IF NOT EXISTS chapa_banks (
                id SERIAL PRIMARY KEY,
                bank_name VARCHAR(100) UNIQUE NOT NULL,
                bank_code VARCHAR(10) UNIQUE NOT NULL,
                acct_length INT
            )
        `).catch(() => {});
        // --- CLEANUP: Remove old/wrong entries ---
        await query(`DELETE FROM chapa_banks WHERE bank_name LIKE '%Commercial%' AND bank_code = '128'`).catch(() => {});
        console.log('[DB] Chapa banks table verified and cleaned.');
    } catch (e) {
        console.error('[DB] Migration error (Table might already exist):', e.message);
    }
})();

// Get list of supported banks from chapa_banks table
router.get('/list', authMiddleware, async (req, res) => {
    try {
        let result;
        try {
            result = await query('SELECT bank_name as name, bank_code as code, acct_length FROM chapa_banks ORDER BY bank_name ASC');
        } catch (dbErr) {
            // FALLBACK if the column doesn't exist yet
            console.warn('[DB Warning] Fetching banks without acct_length:', dbErr.message);
            result = await query('SELECT bank_name as name, bank_code as code FROM chapa_banks ORDER BY bank_name ASC');
        }
        
        // AUTO-SYNC if no banks found! (Don't let it crash the whole request if it fails)
        if (result.rows.length === 0 && (process.env.CHAPA_SECRET_KEY || '').trim()) {
            try {
                const https = require('https');
                const options = {
                    hostname: 'api.chapa.co',
                    port: 443,
                    path: '/v1/banks',
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${process.env.CHAPA_SECRET_KEY.trim()}` }
                };

                await new Promise((resolve) => {
                    const req_chapa = https.request(options, (res_chapa) => {
                        let data = '';
                        res_chapa.on('data', (chunk) => data += chunk);
                        res_chapa.on('end', async () => {
                            try {
                                const response = JSON.parse(data);
                                if (response.data && Array.isArray(response.data)) {
                                    for (const bank of response.data) {
                                        await query(`
                                            INSERT INTO chapa_banks (bank_name, bank_code, acct_length) 
                                            VALUES ($1, $2, $3) 
                                            ON CONFLICT (bank_name) DO UPDATE SET bank_code = EXCLUDED.bank_code, acct_length = EXCLUDED.acct_length
                                        `, [bank.name, bank.id, bank.acct_length]).catch(() => {});
                                    }
                                }
                            } catch (e) {}
                            resolve();
                        });
                    });
                    req_chapa.on('error', () => resolve());
                    req_chapa.end();
                });
                // Re-fetch after sync attempt
                result = await query('SELECT bank_name as name, bank_code as code, acct_length FROM chapa_banks ORDER BY bank_name ASC');
            } catch (syncErr) {
                console.error('[Sync Warning]:', syncErr.message);
            }
        }

        // --- MANUALLY ADDED SAFETY-NET BANKS ---
        const finalBanks = [...(result.rows || [])];
        const manualBanks = [
            { name: "Commercial Bank of Ethiopia (CBEBank)", code: "851", acct_length: 13 },
            { name: "Bank of Abyssinia (BoA)", code: "004", acct_length: 13 },
            { name: "Awash Bank", code: "002", acct_length: 13 },
            { name: "Dashen Bank", code: "003", acct_length: 13 },
            { name: "Hibret Bank", code: "005", acct_length: 13 },
            { name: "Wegagen Bank", code: "472", acct_length: 13 },
            { name: "Nib International Bank", code: "008", acct_length: 13 },
            { name: "CBEBirr / Mobile Wallet", code: "128", acct_length: 10 },
            { name: "telebirr", code: "855", acct_length: 10 }
        ];

        manualBanks.forEach(mb => {
            if (!finalBanks.some(fb => fb.code === mb.code || fb.name === mb.name)) {
                finalBanks.push(mb);
            }
        });

        res.json(finalBanks.sort((a, b) => (a.name || '').localeCompare(b.name || '')));
    } catch (err) {
        console.error('Error fetching bank list [ROUTE ERROR]:', err.message);
        res.status(500).json({ message: 'Internal Server Error', details: err.message });
    }
});

// Fetch all subaccounts from Chapa
router.get('/chapa-list', authMiddleware, async (req, res) => {
    try {
        const https = require('https');
        const options = {
            hostname: 'api.chapa.co',
            port: 443,
            path: '/v1/subaccount',
            method: 'GET',
            headers: { 'Authorization': `Bearer ${process.env.CHAPA_SECRET_KEY}` }
        };

        const result = await new Promise((resolve, reject) => {
            const req_chapa = https.request(options, (res_chapa) => {
                let data = '';
                res_chapa.on('data', (chunk) => data += chunk);
                res_chapa.on('end', () => resolve(JSON.parse(data)));
            });
            req_chapa.on('error', (err) => reject(err));
            req_chapa.end();
        });

        res.json(result.data || []);
    } catch (err) {
        console.error('Error fetching Chapa subaccounts:', err.message);
        res.status(500).json({ message: 'Error fetching from Chapa' });
    }
});

// Get bank account for a branch or vendor
router.get('/', authMiddleware, async (req, res) => {
    try {
        const { branchId, vendorId } = req.user;
        let text = 'SELECT * FROM bank_accounts WHERE 1=1';
        const params = [];

        if (branchId) {
            text += ' AND branch_id = $1';
            params.push(branchId);
        } else if (vendorId) {
            text += ' AND vendor_id = $1';
            params.push(vendorId);
        } else {
            return res.status(403).json({ message: 'Unauthorized access' });
        }

        const result = await query(text, params);
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching bank account:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Add or Update bank account
router.post('/', [
    authMiddleware,
    check('account_name', 'Account name is required').not().isEmpty(),
    check('account_number', 'Account number is required').not().isEmpty(),
    check('bank_name', 'Bank name is required').not().isEmpty()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { branchId, vendorId } = req.user;
        const { account_name, account_number, bank_name, bank_code, chapa_subaccount_id } = req.body;
        const { syncBankToChapa } = require('../utils/chapaSync');

        // Check if this specific account number already exists for this vendor/branch
        const checkText = 'SELECT id FROM bank_accounts WHERE vendor_id::text = $1::text AND (branch_id::text = $2::text OR (branch_id IS NULL AND $2 IS NULL)) AND account_number = $3';
        const checkResult = await query(checkText, [vendorId, branchId, account_number]);

        let savedAccount;
        if (checkResult.rows.length > 0) {
            // Update
            const updateText = `
                UPDATE bank_accounts 
                SET account_name = $1, account_number = $2, bank_name = $3, bank_code = $4, chapa_subaccount_id = COALESCE($5, chapa_subaccount_id)
                WHERE id = $6
                RETURNING *
            `;
            const result = await query(updateText, [account_name, account_number, bank_name, bank_code, chapa_subaccount_id, checkResult.rows[0].id]);
            savedAccount = result.rows[0];
        } else {
            // Insert
            const insertText = `
                INSERT INTO bank_accounts (vendor_id, branch_id, account_name, account_number, bank_name, bank_code, chapa_subaccount_id, is_primary)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                RETURNING *
            `;
            const result = await query(insertText, [vendorId, branchId, account_name, account_number, bank_name, bank_code, chapa_subaccount_id, true]);
            savedAccount = result.rows[0];
        }

        // --- THE CHAPA SYNC HOOK (Only run if no manual subaccount ID provided) ---
        if (!chapa_subaccount_id) {
            try {
                const chapaId = await syncBankToChapa(savedAccount.id);
                savedAccount.chapa_subaccount_id = chapaId;
            } catch (chapaErr) {
                console.error('⚠️ Chapa Sync Failed during bank account update:', chapaErr.message);
            }
        }

        res.json(savedAccount);
    } catch (err) {
        console.error('[Bank API Error Details]:', {
            message: err.message,
            stack: err.stack,
            body: req.body,
            user: req.user
        });
        res.status(500).json({ message: 'Internal Server Error', detail: err.message });
    }
});

module.exports = router;
