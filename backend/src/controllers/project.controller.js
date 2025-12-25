const { pool } = require('../config/db');
const auditLogger = require('../utils/auditLogger');

// 1. Get All Projects (Tenant Isolated)
exports.getProjects = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM projects WHERE tenant_id = $1', 
            [req.user.tenant_id]
        );
        res.status(200).json({ success: true, data: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// 2. Get Single Project
exports.getProjectById = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM projects WHERE id = $1 AND tenant_id = $2', 
            [req.params.id, req.user.tenant_id]
        );
        if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Project not found' });
        res.status(200).json({ success: true, data: result.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// 3. Create Project (With Audit Log)
exports.createProject = async (req, res) => {
    const { name, description } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO projects (name, description, tenant_id, created_by) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, description, req.user.tenant_id, req.user.id]
        );

        // Security Audit Log Requirement
        await auditLogger.logAction(req.user.tenant_id, req.user.id, 'CREATE_PROJECT', 'project', result.rows[0].id);

        res.status(201).json({ success: true, message: 'Project created', data: result.rows[0] });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// 4. Update Project
exports.updateProject = async (req, res) => {
    const { name, description } = req.body;
    try {
        const result = await pool.query(
            'UPDATE projects SET name = $1, description = $2 WHERE id = $3 AND tenant_id = $4 RETURNING *',
            [name, description, req.params.id, req.user.tenant_id]
        );
        if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Project not found' });
        res.status(200).json({ success: true, message: 'Project updated', data: result.rows[0] });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// 5. Delete Project
exports.deleteProject = async (req, res) => {
    try {
        const result = await pool.query(
            'DELETE FROM projects WHERE id = $1 AND tenant_id = $2 RETURNING *', 
            [req.params.id, req.user.tenant_id]
        );
        if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Project not found' });
        
        await auditLogger.logAction(req.user.tenant_id, req.user.id, 'DELETE_PROJECT', 'project', req.params.id);

        res.status(200).json({ success: true, message: 'Project deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};