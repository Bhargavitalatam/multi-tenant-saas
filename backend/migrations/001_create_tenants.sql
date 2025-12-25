CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- Automatic ID generation
    name VARCHAR(255) NOT NULL,
    subdomain VARCHAR(100) UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'trial')),
    subscription_plan VARCHAR(20) DEFAULT 'free' CHECK (subscription_plan IN ('free', 'pro', 'enterprise')),
    max_users INTEGER NOT NULL DEFAULT 5, -- Match Free Plan limit [cite: 69]
    max_projects INTEGER NOT NULL DEFAULT 3, -- Match Free Plan limit [cite: 69]
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);