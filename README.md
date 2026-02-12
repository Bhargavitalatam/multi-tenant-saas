# Multi-Tenant SaaS Platform – Project & Task Management

Production-ready multi-tenant SaaS boilerplate with complete data isolation, RBAC, subscription limits, REST APIs, React frontend, PostgreSQL, and Docker Compose one-command startup.

## Features
- Multi-tenancy with tenant_id isolation and subdomain-aware login
- Roles: super_admin, tenant_admin, user (RBAC at API and UI)
- JWT auth (24h), bcrypt password hashing
- Tenants, Users, Projects, Tasks modules (19 APIs)
- Subscription plans (free/pro/enterprise) with user/project limits
- Audit logging of CRUD and auth actions
- Health check: GET /api/health (DB and readiness)
- Automatic migrations + seed on container start
- React app with protected routes and role-based UI
- Full Docker: database, backend, frontend on fixed ports

## Tech Stack
- Backend: Node.js (Express), pg, jsonwebtoken, bcrypt, express-validator, helmet, cors, morgan
- Database: PostgreSQL 15
- Frontend: React + Vite, Axios, React Router
- Containerization: Docker, Docker Compose

## Architecture Overview
- Browser → Frontend (http://localhost:3000) → Backend API (http://localhost:5000/api) → PostgreSQL (database service)
- JWT in Authorization header; tenant isolation enforced at query level
- See docs/architecture.md (includes Mermaid diagrams) and images (placeholders)

## Quick Start (Docker)
1. Ensure Docker Desktop is running.
2. From repo root:

```bash
docker-compose up -d --build
```

3. Verify:
```bash
curl http://localhost:5000/api/health
# {"status":"ok","database":"connected"}
```
4. Open frontend: http://localhost:3000

Seed credentials are in submission.json and documented below.

## Environment (Backend)
- DB_HOST=database
- DB_PORT=5432
- DB_NAME=saas_db
- DB_USER=postgres
- DB_PASSWORD=postgres
- JWT_SECRET=supersecret_jwt_key_that_is_at_least_32_chars!
- JWT_EXPIRES_IN=24h
- PORT=5000
- FRONTEND_URL=http://frontend:3000

These are set in docker-compose.yml for evaluation.

## Seed/Test Credentials
See submission.json for exact credentials. Defaults:
- Super Admin: superadmin@system.com / Admin@123
- Demo Tenant: subdomain demo
  - Admin: admin@demo.com / Demo@123
  - Users: user1@demo.com / User@123, user2@demo.com / User@123

## API Documentation
- Swagger-like markdown in docs/API.md (paths, bodies, responses)
- Consistent response: { success, message?, data? }

## Diagrams
- System: docs/images/system-architecture.png (placeholder)
- ERD: docs/images/database-erd.png (placeholder)

## Local Dev (optional)
- You can run backend locally with Node.js 18+ and a local Postgres. For evaluation, Docker is mandatory and sufficient.