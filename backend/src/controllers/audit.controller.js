const { pool } = require('../config/db');

exports.getAuditLogs = async (req, res) => {
    try {
        let result;
        if (req.user.role === 'super_admin') {
            result = await pool.query('SELECT * FROM audit_logs ORDER BY created_at DESC');
        } else {
            result = await pool.query('SELECT * FROM audit_logs WHERE tenant_id = $1 ORDER BY created_at DESC', [req.user.tenant_id]);
        }
        res.status(200).json({ success: true, data: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};