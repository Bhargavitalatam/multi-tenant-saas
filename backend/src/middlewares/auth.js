const jwt = require('jsonwebtoken');

// Middleware to protect routes and verify the JWT
const protect = (req, res, next) => {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        
        req.user = {
            id: decoded.id,
            tenant_id: decoded.tenant_id || decoded.tenantId, 
            role: decoded.role
        };
        
        next();
    } catch (err) {
        res.status(401).json({ success: false, message: 'Token is not valid' });
    }
};

// Middleware for Role-Based Access Control (RBAC)
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                success: false, 
                message: `User role ${req.user.role} is not authorized to access this route` 
            });
        }
        next();
    };
};

// Export as an object
module.exports = { protect, authorize };