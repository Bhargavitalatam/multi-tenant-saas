\# API Documentation - Multi-Tenant SaaS



\## Authentication \& Tenants

1\. \*\*POST /api/auth/register-tenant\*\* - Register a new organization and admin.

2\. \*\*POST /api/auth/login\*\* - Authenticate user and return JWT.

3\. \*\*GET /api/auth/me\*\* - Get current logged-in user details.



\## Tenant Management (Super Admin Only)

4\. \*\*GET /api/admin/tenants\*\* - List all tenants in the system.

5\. \*\*GET /api/admin/tenants/:id\*\* - Get specific tenant details.

6\. \*\*PATCH /api/admin/tenants/:id\*\* - Update tenant status (Active/Suspended).

7\. \*\*DELETE /api/admin/tenants/:id\*\* - Remove a tenant.



\## User Management (Tenant Admin Only)

8\. \*\*GET /api/users\*\* - List all users within the tenant.

9\. \*\*POST /api/users\*\* - Invite/Add a new user to the tenant.

10\. \*\*PATCH /api/users/:id\*\* - Update user role or status.

11\. \*\*DELETE /api/users/:id\*\* - Remove user from tenant.



\## Project Management

12\. \*\*GET /api/projects\*\* - List all projects for the tenant.

13\. \*\*POST /api/projects\*\* - Create a new project.

14\. \*\*GET /api/projects/:id\*\* - Get project details and tasks.

15\. \*\*DELETE /api/projects/:id\*\* - Delete a project.



\## Task Management

16\. \*\*GET /api/tasks\*\* - List all tasks (filtered by tenant).

17\. \*\*POST /api/tasks\*\* - Create a new task.

18\. \*\*PATCH /api/tasks/:id\*\* - Update task status/priority.

19\. \*\*DELETE /api/tasks/:id\*\* - Delete a task.



\## Security \& Isolation

\- \*\*Authentication:\*\* All requests except login/register require `Authorization: Bearer <token>`.

\- \*\*Tenant Isolation:\*\* The `X-Tenant-ID` or JWT claim ensures users only see data belonging to their organization.

