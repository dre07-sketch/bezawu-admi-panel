const https = require('https');
const { query } = require('../connection/db');

/**
 * Registers a vendor's bank account with Chapa and updates the database.
 * @param {string} bankAccountId - The ID of the bank account record.
 */
async function syncBankToChapa(bankAccountId) {
    try {
        // 1. Fetch bank account details (Using plural 'bank_accounts')
        const accountQuery = `
            SELECT ba.*, cb.bank_code as chapa_bank_code
            FROM bank_accounts ba
            LEFT JOIN chapa_banks cb ON ba.bank_name = cb.bank_name
            WHERE ba.id = $1
        `;
        const accountRes = await query(accountQuery, [bankAccountId]);

        if (accountRes.rows.length === 0) {
             throw new Error(`Bank account ${bankAccountId} not found in bank_accounts table.`);
        }

        const bankAccount = accountRes.rows[0];

        // 2. Chapa Bank Code check
        const finalBankCode = bankAccount.bank_code || bankAccount.chapa_bank_code;
        if (!finalBankCode) {
            throw new Error(`Please select a valid bank (No Chapa code found).`);
        }

        // 3. Fetch Commission Rate for default split
        let commissionRate = 0.07; // Default 7%
        try {
            const systemRes = await query("SELECT value FROM system WHERE name = 'commission_rate'");
            if (systemRes.rows.length > 0) {
                commissionRate = parseFloat(systemRes.rows[0].value) / 100;
            }
        } catch (e) {
            console.warn('[Chapa Sync] Could not fetch commission_rate, using default 7%');
        }

        // 4. Prepare Chapa API Request
        const payload = JSON.stringify({
            business_name: bankAccount.account_name,
            account_name: bankAccount.account_name,
            bank_code: finalBankCode,
            account_number: bankAccount.account_number,
            split_type: "percentage",
            split_value: commissionRate 
        });

        const options = {
            hostname: 'api.chapa.co',
            port: 443,
            path: '/v1/subaccount',
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.CHAPA_SECRET_KEY}`,
                'Content-Type': 'application/json',
                'Content-Length': payload.length
            }
        };

        return new Promise((resolve, reject) => {
            const req = https.request(options, (res) => {
                let data = '';
                res.on('data', (chunk) => data += chunk);
                res.on('end', async () => {
                    const response = JSON.parse(data);
                    if (response.status === 'success') {
                        const subId = response.data.subaccount_id || response.data.id;
                        
                        // 4. Update the DB (Using plural 'bank_accounts')
                        await query(
                            `UPDATE bank_accounts SET chapa_subaccount_id = $1 WHERE id = $2`,
                            [subId, bankAccountId]
                        );

                        resolve(subId);
                    } else {
                        console.error('❌ Chapa Subaccount Registration Failed:', {
                            status: response.status,
                            message: response.message,
                            payload: JSON.parse(payload)
                        });
                        reject(new Error(response.message || 'Chapa registration failed'));
                    }
                });
            });

            req.on('error', (err) => {
                console.error('❌ Chapa Sync Network Error:', err.message);
                reject(err);
            });
            req.write(payload);
            req.end();
        });
    } catch (err) {
        console.error('[Chapa Sync Utility Critical Error]:', err.message);
        throw err;
    }
}

module.exports = { syncBankToChapa };
