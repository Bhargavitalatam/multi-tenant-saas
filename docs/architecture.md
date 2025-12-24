System Architecture Document

High-Level Architecture



The system follows a three-tier architecture:



Client (Browser)



Frontend Application (React)



Backend API Server (Node.js)



Database (PostgreSQL)



JWT tokens handle authentication between frontend and backend.



Diagram Location:

docs/images/system-architecture.png



Database Schema Design (ERD)

Tables



tenants



users



projects



tasks



audit\_logs



All tables include tenant\_id for data isolation.

Indexes are created on all tenant\_id columns.



ERD Location:

docs/images/database-erd.png



API Architecture

Authentication



POST /api/auth/register (Public)



POST /api/auth/login (Public)



Tenants



GET /api/tenants (Super Admin only)



Users



POST /api/users (Tenant Admin)



GET /api/users (Tenant Admin)



Projects



POST /api/projects (Tenant Admin)



GET /api/projects (Authenticated users)



Tasks



POST /api/tasks (Authenticated users)



GET /api/tasks (Authenticated users)

