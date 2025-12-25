const { pool } = require('../config/db');

// Get all users for the tenant
exports.getUsers = async (req, res) => {
    try {
        const result = await pool.query('SELECT id, name, email, role FROM users WHERE tenant_id = $1', [req.user.tenant_id]);
        res.json({ success: true, data: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Get single user
exports.getUserById = async (req, res) => {
    try {
        const result = await pool.query('SELECT id, name, email, role FROM users WHERE id = $1 AND tenant_id = $2', [req.params.id, req.user.tenant_id]);
        if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'User not found' });
        res.json({ success: true, data: result.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Update user
exports.updateUser = async (req, res) => {
    const { name, role } = req.body;
    try {
        const result = await pool.query(
            'UPDATE users SET name = $1, role = $2 WHERE id = $3 AND tenant_id = $4 RETURNING id, name, email, role',
            [name, role, req.params.id, req.user.tenant_id]
        );
        if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'User not found' });
        res.json({ success: true, message: 'User updated', data: result.rows[0] });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// Delete user (The missing function!)
exports.deleteUser = async (req, res) => {
    try {
        const result = await pool.query('DELETE FROM users WHERE id = $1 AND tenant_id = $2 RETURNING *', [req.params.id, req.user.tenant_id]);
        if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'User not found' });
        res.json({ success: true, message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};