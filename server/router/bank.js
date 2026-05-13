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
        
        // --- MIGRATION: Ensure bank_accounts has chapa_subaccount_id ---
        await query(`ALTER TABLE bank_accounts ADD COLUMN IF NOT EXISTS chapa_subaccount_id TEXT`).catch(() => {});
        
        console.log('[DB] Chapa banks table verified and bank_accounts schema updated.');
    } catch (e) {
        console.error('[DB] Migration error:', e.message);
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

// Fetch single subaccount detail from Chapa (Workaround: Fetch list and filter)
router.get('/chapa/:id', authMiddleware, async (req, res) => {
    try {
        const https = require('https');
        const subaccountId = req.params.id;
        
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
                res_chapa.on('end', () => {
                    try {
                        resolve(JSON.parse(data));
                    } catch (e) {
                        reject(new Error('Invalid JSON from Chapa'));
                    }
                });
            });
            req_chapa.on('error', (err) => reject(err));
            req_chapa.end();
        });

        if (result.status === 'success' && Array.isArray(result.data)) {
            const subaccount = result.data.find(s => s.subaccount_id === subaccountId);
            if (subaccount) {
                res.json(subaccount);
            } else {
                res.status(404).json({ message: 'Subaccount not found in your Chapa account' });
            }
        } else {
            res.status(500).json({ message: 'Failed to retrieve subaccounts from Chapa' });
        }
    } catch (err) {
        console.error('Error verifying Chapa subaccount:', err.message);
        res.status(500).json({ message: 'Error connecting to Chapa' });
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

// Add or Update bank account (DISABLED: Managed by Super Admin for security)
router.post('/', authMiddleware, async (req, res) => {
    return res.status(403).json({ 
        message: 'Bank account management is restricted. Please contact Tech5 (Super Admin) to update your settlement account.' 
    });
});

/* Original logic moved to Super Admin Panel for security
router.post('/', [
    authMiddleware,
    check('account_name', 'Account name is required').not().isEmpty(),
    check('account_number', 'Account number is required').not().isEmpty(),
    check('bank_name', 'Bank name is required').not().isEmpty()
], async (req, res) => {
    // ... logic ...
});
*/
module.exports = router;
