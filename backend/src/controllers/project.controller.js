const { pool } = require('../config/db');
const auditLogger = require('../utils/auditLogger');

// 1. GET ALL PROJECTS
exports.getProjects = async (req, res) => {
    try {
        let query;
        let params = [];

        // Super admins see everything, others see only their tenant projects
        if (req.user.role === 'super_admin') {
            query = 'SELECT * FROM projects ORDER BY created_at DESC';
        } else {
            query = 'SELECT * FROM projects WHERE tenant_id = $1 ORDER BY created_at DESC';
            params = [req.user.tenant_id];
        }

        const result = await pool.query(query, params);
        res.status(200).json({ success: true, data: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// 2. GET SINGLE PROJECT
exports.getProjectById = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM projects WHERE id = $1 AND (tenant_id = $2 OR $3 = $4)', 
            [req.params.id, req.user.tenant_id, req.user.role, 'super_admin']
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }
        res.status(200).json({ success: true, data: result.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// 3. CREATE PROJECT (With Super Admin Fix)
exports.createProject = async (req, res) => {
    const { name, description, tenant_id } = req.body;
    
    try {
        // Step A: Determine target tenant
        // If Super Admin, use tenant_id from body. If Tenant Admin, use their own tenant_id.
        const targetTenantId = req.user.role === 'super_admin' ? tenant_id : req.user.tenant_id;

        if (!targetTenantId) {
            return res.status(400).json({ 
                success: false, 
                message: 'Tenant ID is required. Super Admins must provide a tenant_id in the request body.' 
            });
        }

        // Step B: Plan Enforcement (Only for non-super-admins)
        if (req.user.role !== 'super_admin') {
            const tenantRes = await pool.query('SELECT plan FROM tenants WHERE id = $1', [targetTenantId]);
            
            if (tenantRes.rows.length === 0) {
                return res.status(404).json({ success: false, message: 'Tenant not found' });
            }

            const plan = tenantRes.rows[0].plan.toLowerCase();
            const countRes = await pool.query('SELECT count(*) FROM projects WHERE tenant_id = $1', [targetTenantId]);
            const projectCount = parseInt(countRes.rows[0].count);

            if (plan === 'free' && projectCount >= 3) {
                return res.status(403).json({ success: false, message: 'Limit reached: Free plan max 3 projects' });
            }
        }

        // Step C: Insert Project
        const result = await pool.query(
            'INSERT INTO projects (name, description, tenant_id, created_by) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, description, targetTenantId, req.user.id]
        );

        // Step D: Audit Log
        // Important: logAction expects (tenantId, userId, action, entityType, entityId, details)
        await auditLogger.logAction(
            targetTenantId, 
            req.user.id, 
            'CREATE_PROJECT', 
            'project', 
            result.rows[0].id,
            { name: result.rows[0].name }
        );

        res.status(201).json({ success: true, data: result.rows[0] });
    } catch (err) {
        console.error('Project Creation Error:', err.message);
        res.status(400).json({ success: false, message: err.message });
    }
};

// 4. UPDATE PROJECT
exports.updateProject = async (req, res) => {
    const { name, description } = req.body;
    try {
        const result = await pool.query(
            'UPDATE projects SET name = $1, description = $2 WHERE id = $3 AND (tenant_id = $4 OR $5 = $6) RETURNING *',
            [name, description, req.params.id, req.user.tenant_id, req.user.role, 'super_admin']
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }
        
        await auditLogger.logAction(
            result.rows[0].tenant_id, 
            req.user.id, 
            'UPDATE_PROJECT', 
            'project', 
            req.params.id,
            { name }
        );

        res.status(200).json({ success: true, data: result.rows[0] });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// 5. DELETE PROJECT
exports.deleteProject = async (req, res) => {
    try {
        const result = await pool.query(
            'DELETE FROM projects WHERE id = $1 AND (tenant_id = $2 OR $3 = $4) RETURNING *', 
            [req.params.id, req.user.tenant_id, req.user.role, 'super_admin']
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }
        
        await auditLogger.logAction(
            result.rows[0].tenant_id, 
            req.user.id, 
            'DELETE_PROJECT', 
            'project', 
            req.params.id
        );

        res.status(200).json({ success: true, message: 'Project deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};