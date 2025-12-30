const { pool } = require('../config/db');

exports.getAllTenants = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM tenants ORDER BY created_at DESC');
        res.json({ success: true, data: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getTenantById = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM tenants WHERE id = $1', [req.params.id]);
        if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Tenant not found' });
        res.json({ success: true, data: result.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.createTenant = async (req, res) => {
    const { name, plan } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO tenants (name, plan) VALUES ($1, $2) RETURNING *',
            [name, plan || 'free']
        );
        res.status(201).json({ success: true, data: result.rows[0] });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

exports.updateTenant = async (req, res) => {
    const { name, plan } = req.body;
    try {
        const result = await pool.query(
            'UPDATE tenants SET name = $1, plan = $2 WHERE id = $3 RETURNING *',
            [name, plan, req.params.id]
        );
        res.json({ success: true, data: result.rows[0] });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

exports.deleteTenant = async (req, res) => {
    try {
        await pool.query('DELETE FROM tenants WHERE id = $1', [req.params.id]);
        res.json({ success: true, message: 'Tenant deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};