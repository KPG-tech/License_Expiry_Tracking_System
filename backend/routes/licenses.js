const express = require('express');
const db = require('../db');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Disable caching for all license routes to prevent browser from showing stale data
router.use((req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    next();
});

// Note: Applying the 'auth' middleware to all routes below.
// If you want them public since you removed the frontend login, 
// simply remove the 'auth' second argument from all these routes.
// For now, protecting the API as theoretically expected by the initial architecture request.

// GET /api/licenses - List all
router.get('/', auth, async (req, res) => {
    try {
        const { search, status } = req.query;
        let query = `
            SELECT id as _id, name, license_key as \`key\`, provider_name as provider, expiry_date as expiryDate, 
            CASE 
                WHEN expiry_date < CURDATE() THEN 'Expired'
                WHEN expiry_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY) THEN 'Expiring Soon'
                ELSE 'Valid'
            END as status 
            FROM licenses`;
        let queryParams = [];

        let whereClauses = [];
        if (search) {
            whereClauses.push('(name LIKE ? OR provider_name LIKE ?)');
            queryParams.push(`%${search}%`, `%${search}%`);
        }
        if (status) {
            whereClauses.push(`(
                CASE 
                    WHEN expiry_date < CURDATE() THEN 'Expired'
                    WHEN expiry_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY) THEN 'Expiring Soon'
                    ELSE 'Valid'
                END) = ?`);
            queryParams.push(status);
        }

        if (whereClauses.length > 0) {
            query += ` WHERE ${whereClauses.join(' AND ')}`;
        }

        query += ' ORDER BY expiry_date ASC';

        const [rows] = await db.query(query, queryParams);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching licenses:', error);
        res.status(500).json({ error: 'Failed to fetch licenses' });
    }
});

// GET /api/licenses/stats - Get dashboard statistics
router.get('/stats', auth, async (req, res) => {
    try {
        const [[{ total }]] = await db.query('SELECT COUNT(*) as total FROM licenses');
        const [[{ expired }]] = await db.query('SELECT COUNT(*) as expired FROM licenses WHERE expiry_date < CURDATE()');
        const [[{ expiringSoon }]] = await db.query('SELECT COUNT(*) as expiringSoon FROM licenses WHERE expiry_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY)');

        res.json({
            total: total || 0,
            expired: expired || 0,
            expiringSoon: expiringSoon || 0
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
});

// GET /api/licenses/:id - Get single license
router.get('/:id', auth, async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT id as _id, name, license_key as \`key\`, provider_name as provider, expiry_date as expiryDate, 
            CASE 
                WHEN expiry_date < CURDATE() THEN 'Expired'
                WHEN expiry_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY) THEN 'Expiring Soon'
                ELSE 'Valid'
            END as status 
            FROM licenses WHERE id = ?`, [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'License not found' });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch license' });
    }
});

// POST /api/licenses - Create new license
router.post('/', auth, async (req, res) => {
    try {
        const { name, key, provider, expiryDate, status } = req.body;

        // Status can be computed based on date, but allow explicit pass for simplicity
        const finalStatus = status || 'Valid';

        const [result] = await db.query(
            'INSERT INTO licenses (name, license_key, provider_name, expiry_date, status) VALUES (?, ?, ?, ?, ?)',
            [name, key, provider, expiryDate, finalStatus]
        );

        res.status(201).json({
            id: result.insertId,
            message: 'License created successfully'
        });
    } catch (error) {
        console.error('Error creating license:', error);
        res.status(500).json({ error: 'Failed to create license' });
    }
});

// PUT /api/licenses/:id - Update license
router.put('/:id', auth, async (req, res) => {
    try {
        const { name, key, provider, expiryDate, status } = req.body;

        const [result] = await db.query(
            'UPDATE licenses SET name = ?, license_key = ?, provider_name = ?, expiry_date = ?, status = ? WHERE id = ?',
            [name, key, provider, expiryDate, status, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'License not found' });
        }

        res.json({ message: 'License updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update license' });
    }
});

// DELETE /api/licenses/:id - Delete license
router.delete('/:id', auth, async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM licenses WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'License not found' });
        }
        res.json({ message: 'License deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete license' });
    }
});

// POST /api/licenses/:id/renew - Renew license
router.post('/:id/renew', auth, async (req, res) => {
    try {
        const daysToAdd = req.body.days || 365;

        // Using MySQL DATE_ADD to cleanly add days to the existing date
        const [result] = await db.query(
            'UPDATE licenses SET expiry_date = DATE_ADD(expiry_date, INTERVAL ? DAY), status = "Valid" WHERE id = ?',
            [daysToAdd, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'License not found' });
        }

        res.json({ message: `License renewed for ${daysToAdd} days` });
    } catch (error) {
        console.error('Error renewing license:', error);
        res.status(500).json({ error: 'Failed to renew license' });
    }
});

module.exports = router;
