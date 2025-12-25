const { pool } = require('../config/db');

// 1. Get All Tasks (Point #10)
exports.getTasks = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM tasks WHERE tenant_id = $1', 
            [req.user.tenant_id]
        );
        res.json({ success: true, data: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// 2. Get Single Task (Point #11)
exports.getTaskById = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM tasks WHERE id = $1 AND tenant_id = $2', 
            [req.params.id, req.user.tenant_id]
        );
        if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Task not found' });
        res.json({ success: true, data: result.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// 3. Create Task (Point #12)
exports.createTask = async (req, res) => {
    const { title, description, status, project_id } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO tasks (title, description, status, project_id, tenant_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [title, description, status || 'todo', project_id, req.user.tenant_id]
        );
        res.status(201).json({ success: true, message: 'Task created', data: result.rows[0] });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// 4. Update Task (Point #13)
exports.updateTask = async (req, res) => {
    const { title, description, status } = req.body;
    try {
        const result = await pool.query(
            'UPDATE tasks SET title = $1, description = $2, status = $3 WHERE id = $4 AND tenant_id = $5 RETURNING *',
            [title, description, status, req.params.id, req.user.tenant_id]
        );
        if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Task not found' });
        res.json({ success: true, message: 'Task updated', data: result.rows[0] });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// 5. Delete Task (Point #14)
exports.deleteTask = async (req, res) => {
    try {
        const result = await pool.query('DELETE FROM tasks WHERE id = $1 AND tenant_id = $2 RETURNING *', [req.params.id, req.user.tenant_id]);
        if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Task not found' });
        res.json({ success: true, message: 'Task deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};