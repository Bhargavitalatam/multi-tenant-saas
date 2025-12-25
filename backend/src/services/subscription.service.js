const { pool } = require('../config/db');

// Check if tenant can add more projects based on their plan [cite: 68, 72]
exports.checkProjectLimit = async (tenantId) => {
    const tenantQuery = await pool.query('SELECT subscription_plan, max_projects FROM tenants WHERE id = $1', [tenantId]);
    const projectCountQuery = await pool.query('SELECT COUNT(*) FROM projects WHERE tenant_id = $1', [tenantId]);
    
    const maxProjects = tenantQuery.rows[0].max_projects;
    const currentProjects = parseInt(projectCountQuery.rows[0].count);

    if (currentProjects >= maxProjects) {
        throw new Error(`Limit reached for ${tenantQuery.rows[0].subscription_plan} plan`);
    }
    return true;
};