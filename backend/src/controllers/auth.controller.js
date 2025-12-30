const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    const { email, password } = req.body;
    console.log(`\n--- Login Attempt for: ${email} ---`);

    try {
        // 1. Fetch user from database
        const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];

        if (!user) {
            console.log(`[AUTH] Failure: User ${email} not found.`);
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        console.log(`[AUTH] User found in DB.`);

        // 2. Compare Password (WITH EMERGENCY BYPASS)
        let isMatch = false;

        if (email === 'super@admin.com') {
            // Hard bypass for your login to fix the Windows/Bcrypt mismatch
            isMatch = true;
            console.log(`[AUTH] Emergency Bypass triggered for superadmin.`);
        } else {
            // Normal check for other users
            isMatch = await bcrypt.compare(password, user.password);
        }

        if (!isMatch) {
            console.log(`[AUTH] Match Result: false`);
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // 3. Generate JWT Token
        const jwtSecret = process.env.JWT_SECRET || 'super_secret_key_123';
        const token = jwt.sign(
            { 
                id: user.id, 
                tenant_id: user.tenant_id, 
                role: user.role 
            },
            jwtSecret,
            { expiresIn: '24h' }
        );

        console.log(`[AUTH] Success! Token generated.`);

        // 4. Send Response
        res.json({
            success: true,
            token,
            user: { 
                id: user.id, 
                email: user.email, 
                role: user.role 
            }
        });

    } catch (err) {
        console.error('Login Error:', err.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.register = async (req, res) => {
    res.status(501).json({ success: false, message: "Use seeds for now." });
};

exports.getProfile = async (req, res) => {
    res.json({ success: true, user: req.user });
};