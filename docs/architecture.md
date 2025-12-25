# System Architecture Document

## 1. High-Level Architecture
This platform follows a Multi-Tenant SaaS pattern using Row-Level Isolation.
- **Frontend:** React.js (Port 3000)
- **Backend:** Node.js/Express (Port 5000)
- **Database:** PostgreSQL (Port 5432)

## 2. Mandatory API Endpoint List (19 Endpoints)
As required by the specification, here are the core endpoints:

### Auth & User Management
1. `POST /api/auth/register` - Tenant & Admin registration
2. `POST /api/auth/login` - User login (JWT)
3. `GET /api/auth/profile` - User profile
4. `GET /api/users` - List all users in tenant
5. `POST /api/users` - Add new user (Limited by Plan)

### Tenant & Subscription
6. `GET /api/tenants/me` - Tenant details
7. `PUT /api/tenants/me` - Update organization info
8. `GET /api/health` - System health check (Public)

### Project Management
9. `GET /api/projects` - List tenant projects
10. `POST /api/projects` - Create project (Limited by Plan)
11. `GET /api/projects/:id` - Project details
12. `PUT /api/projects/:id` - Update project
13. `DELETE /api/projects/:id` - Delete project (Cascades)

### Task Management
14. `GET /api/tasks` - List all tasks
15. `POST /api/tasks` - Create task
16. `GET /api/tasks/:id` - Task details
17. `PUT /api/tasks/:id` - Update status/priority
18. `DELETE /api/tasks/:id` - Remove task
19. `GET /api/projects/:id/tasks` - Get tasks for specific project