# Technical Specification

## Project Setup
- **Environment:** Docker Desktop
- **Runtime:** Node.js v20-alpine
- **Database:** PostgreSQL 15
- **Frontend:** React with React Router 7

## Database Schema
- `tenants`: Stores organization name, subdomain, and plan type.
- `users`: Stores credentials and `tenant_id` for isolation.
- `projects`: Stores project details limited to 3 per Free tenant.
- `tasks`: Individual items within projects.
- `audit_logs`: Records every system action for security.

## Security
- All passwords hashed using `bcryptjs`.
- Session management via JWT with 24h expiry.
- Subdomain-based tenant identification middleware.