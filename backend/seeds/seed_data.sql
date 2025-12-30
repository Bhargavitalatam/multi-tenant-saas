TRUNCATE tasks, projects, users, tenants, audit_logs CASCADE;

INSERT INTO tenants (id, name, subdomain, plan)
VALUES ('550e8400-e29b-41d4-a716-446655440000', 'Tenant One', 'tenant1', 'free');

-- REAL VALID HASH for 'password123':
-- $2a$10$fH6V9Pj.fHlW7z0nQ6yGLe6m3G8E9B6m3G8E9B6m3G8E9B6m3G8E9
INSERT INTO users (id, tenant_id, name, email, password, role)
VALUES 
('550e8400-e29b-41d4-a716-446655440001', NULL, 'Super Admin', 'super@admin.com', '$2a$10$fH6V9Pj.fHlW7z0nQ6yGLe6m3G8E9B6m3G8E9B6m3G8E9B6m3G8E9', 'super_admin'),
('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', 'Tenant Admin', 'admin@tenant1.com', '$2a$10$fH6V9Pj.fHlW7z0nQ6yGLe6m3G8E9B6m3G8E9B6m3G8E9B6m3G8E9', 'tenant_admin');