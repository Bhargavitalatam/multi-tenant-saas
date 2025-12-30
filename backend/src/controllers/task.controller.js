const { pool } = require('../config/db');
const auditLogger = require('../utils/auditLogger');

// 1. Get All Tasks (Tenant Isolated + Super Admin Bypass)
exports.getTasks = async (req, res) => {
    try {
        let result;
        if (req.user.role === 'super_admin') {
            // Super Admin can see all tasks across all tenants
            result = await pool.query('SELECT * FROM tasks ORDER BY created_at DESC');
        } else {
            // Regular users only see tasks for their own tenant
            result = await pool.query(
                'SELECT * FROM tasks WHERE tenant_id = $1 ORDER BY created_at DESC', 
                [req.user.tenant_id]
            );
        }
        res.status(200).json({ success: true, data: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// 2. Get Single Task (Strict Isolation)
exports.getTaskById = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM tasks WHERE id = $1 AND (tenant_id = $2 OR $3 = $4)', 
            [req.params.id, req.user.tenant_id, req.user.role, 'super_admin']
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }
        res.status(200).json({ success: true, data: result.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// 3. Create Task (With Cross-Tenant Security & Super Admin Support)
exports.createTask = async (req, res) => {
    const { title, description, status, project_id, assigned_to } = req.body;
    try {
        // Step A: Verify the project exists and get its tenant_id
        const projectRes = await pool.query('SELECT tenant_id FROM projects WHERE id = $1', [project_id]);
        
        if (projectRes.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Target project not found' });
        }

        const projectTenantId = projectRes.rows[0].tenant_id;

        // Step B: Security Check
        // Block if not a Super Admin AND the project belongs to a different tenant
        if (req.user.role !== 'super_admin' && projectTenantId !== req.user.tenant_id) {
            return res.status(403).json({ 
                success: false, 
                message: 'Security Alert: Project does not belong to your organization' 
            });
        }

        // Step C: Insert Task (Using the project's tenant_id for data integrity)
        const result = await pool.query(
            'INSERT INTO tasks (title, description, status, project_id, tenant_id, assigned_to) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [title, description, status || 'todo', project_id, projectTenantId, assigned_to || null]
        );

        // Step D: Audit Log
        await auditLogger.logAction(projectTenantId, req.user.id, 'CREATE_TASK', 'task', result.rows[0].id);

        res.status(201).json({ success: true, data: result.rows[0] });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// 4. Update Task
exports.updateTask = async (req, res) => {
    const { title, description, status, assigned_to } = req.body;
    try {
        const result = await pool.query(
            'UPDATE tasks SET title = $1, description = $2, status = $3, assigned_to = $4 WHERE id = $5 AND (tenant_id = $6 OR $7 = $8) RETURNING *',
            [title, description, status, assigned_to, req.params.id, req.user.tenant_id, req.user.role, 'super_admin']
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }

        await auditLogger.logAction(result.rows[0].tenant_id, req.user.id, 'UPDATE_TASK', 'task', req.params.id);

        res.status(200).json({ success: true, data: result.rows[0] });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// 5. Delete Task
exports.deleteTask = async (req, res) => {
    try {
        const result = await pool.query(
            'DELETE FROM tasks WHERE id = $1 AND (tenant_id = $2 OR $3 = $4) RETURNING *', 
            [req.params.id, req.user.tenant_id, req.user.role, 'super_admin']
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }

        await auditLogger.logAction(result.rows[0].tenant_id, req.user.id, 'DELETE_TASK', 'task', req.params.id);

        res.status(200).json({ success: true, message: 'Task deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};