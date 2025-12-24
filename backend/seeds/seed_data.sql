-- SUPER ADMIN
INSERT INTO users (id, tenant_id, email, password_hash, full_name, role)
VALUES (
    gen_random_uuid(),
    NULL,
    'superadmin@system.com',
    '$2b$10$examplehashedpasswordadmin',
    'System Admin',
    'super_admin'
);

-- DEMO TENANT
INSERT INTO tenants (id, name, subdomain, status, subscription_plan, max_users, max_projects)
VALUES (
    gen_random_uuid(),
    'Demo Company',
    'demo',
    'active',
    'pro',
    25,
    15
);

-- TENANT ADMIN
INSERT INTO users (id, tenant_id, email, password_hash, full_name, role)
SELECT
    gen_random_uuid(),
    id,
    'admin@demo.com',
    '$2b$10$examplehashedpassworddemo',
    'Demo Admin',
    'tenant_admin'
FROM tenants WHERE subdomain = 'demo';

-- REGULAR USERS
INSERT INTO users (id, tenant_id, email, password_hash, full_name, role)
SELECT gen_random_uuid(), id, 'user1@demo.com', '$2b$10$examplehash', 'User One', 'user'
FROM tenants WHERE subdomain = 'demo';

INSERT INTO users (id, tenant_id, email, password_hash, full_name, role)
SELECT gen_random_uuid(), id, 'user2@demo.com', '$2b$10$examplehash', 'User Two', 'user'
FROM tenants WHERE subdomain = 'demo';
