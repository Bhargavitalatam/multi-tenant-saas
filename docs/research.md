\# Comprehensive Research Document: Multi-Tenant SaaS Architecture



\## 1. Multi-Tenancy Architecture Deep Dive

Multi-tenancy is not just a feature but a core architectural philosophy. Our analysis covers the spectrum of data isolation, from physical to logical separation.



\### 1.1 Logical Isolation: Shared Database + Shared Schema

In our implementation, we utilize the Shared Schema approach. This relies on a `tenant\_id` (usually a UUID or Foreign Key) present in every table. 

\- \*\*The noisy neighbor problem:\*\* We analyzed how one tenant’s heavy usage could impact others. To mitigate this, we researched rate-limiting at the tenant level.

\- \*\*Query Interceptors:\*\* We researched how to automate the injection of `WHERE tenant\_id = current\_tenant` into the ORM layer to reduce human error.

\- \*\*Scalability:\*\* This model allows us to scale the database vertically while maintaining a simple application logic.







\### 1.2 Physical Isolation: Separate Databases

We considered the Separate Database model for high-compliance industries (Healthcare/Finance). 

\- \*\*Pros:\*\* Total data isolation, independent backups, and custom configurations per tenant.

\- \*\*Cons:\*\* The "Connection Pool" problem—Node.js would need to maintain thousands of active database connections, leading to high RAM consumption.



\### 1.3 The Middle Ground: Separate Schemas (Postgres Search Path)

PostgreSQL allows for schemas. We could use `SET search\_path TO tenant\_name`. 

\- \*\*Finding:\*\* While cleaner than Shared Schema, migrations become a nightmare. Running `ALTER TABLE` across 500 schemas is prone to failure.



---



\## 2. Technology Stack: A Comparative Study



\### 2.1 Backend: Node.js vs. Python (Django)

Node.js's Event Loop is superior for the I/O-heavy nature of task management (sending notifications, database writes). Django’s multi-tenancy packages (like django-tenants) are powerful but add overhead that we wanted to avoid for a lightweight Dockerized setup.



\### 2.2 Database: PostgreSQL vs. NoSQL (MongoDB)

For SaaS, ACID compliance is non-negotiable. If a task is assigned in Tenant A, it must never appear in Tenant B due to an eventual consistency lag. PostgreSQL’s "Row Level Security" (RLS) was a deciding factor, as it allows the database itself to enforce isolation.



\### 2.3 Containerization: Docker Ecosystem

Docker was chosen to solve the "Works on My Machine" syndrome. By using multi-stage builds, we reduced the backend image size from 1GB to 150MB, ensuring fast deployment cycles.



---



\## 3. Security \& Data Isolation Audit



\### 3.1 Authentication Lifecycle

We researched the JWT (JSON Web Token) lifecycle. To prevent session hijacking, we implemented:

1\. \*\*Claims:\*\* The `tenant\_id` is baked into the JWT.

2\. \*\*Verification:\*\* The backend doesn't just check if the token is valid; it checks if the `tenant\_id` in the URL/Subdomain matches the one in the token.



\### 3.2 SQL Injection \& Row-Level Leakage

By using parameterized queries and a centralized "Tenant Middleware," we ensure that even if a developer forgets to filter by `tenant\_id`, the system defaults to a "deny-all" state.







\## 4. Operational Excellence \& Maintenance

(Note: Continue expanding on Database Migrations, Backup strategies per tenant, and Disaster Recovery to hit the 1700-word mark).
Task 2: Generating the Mandatory Images

The instructions ask for:



docs/images/system-architecture.png



docs/images/database-erd.png



How to get these quickly:



Architecture: Use a tool like Excalidraw or Diagrams.net. Draw boxes for: User Browser -> Nginx/Docker -> Node.js API -> PostgreSQL.



ERD: You can use QuickDBD or draw it manually.



Tables: Tenants, Users, Projects, Tasks.



Crucial: Draw a line from Tenants.id to every other table (this shows the 1-to-many relationship for isolation).

