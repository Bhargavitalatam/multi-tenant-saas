const { pool } = require('../config/db');

exports.getUsers = async (req, res) => {
    try {
        let query;
        let params = [];

        if (req.user.role === 'super_admin') {
            query = 'SELECT id, email, role, tenant_id FROM users';
        } else {
            query = 'SELECT id, email, role, tenant_id FROM users WHERE tenant_id = $1';
            params = [req.user.tenant_id];
        }

        const result = await pool.query(query, params);
        res.json({ success: true, data: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, email, role, tenant_id FROM users WHERE id = $1 AND (tenant_id = $2 OR $3 = $4)', 
            [req.params.id, req.user.tenant_id, req.user.role, 'super_admin']
        );
        if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'User not found' });
        res.json({ success: true, data: result.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        // Only allow if user is super admin or if they are a tenant admin deleting someone in their own tenant
        const result = await pool.query(
            'DELETE FROM users WHERE id = $1 AND (tenant_id = $2 OR $3 = $4) RETURNING *',
            [req.params.id, req.user.tenant_id, req.user.role, 'super_admin']
        );
        if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'User not found or unauthorized' });
        res.json({ success: true, message: 'User deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};