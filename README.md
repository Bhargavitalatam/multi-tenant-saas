\# Multi-Tenant SaaS Task Management System



A production-ready, full-stack SaaS platform designed for high-scale organization management. This system utilizes a shared-database, shared-schema architecture with strict Row-Level Security (RLS) patterns to ensure 100% data isolation between tenants.



\### 🚀 Features

1\. \*\*Isolated Multi-tenancy:\*\* Secure data separation via `tenant\_id`.

2\. \*\*Subdomain Routing:\*\* Automatic tenant context resolution via subdomains.

3\. \*\*Role-Based Access Control (RBAC):\*\* Super Admin, Tenant Admin, and User roles.

4\. \*\*Tenant Onboarding:\*\* Self-service tenant registration and subdomain creation.

5\. \*\*Project Management:\*\* Organize work into specific projects per tenant.

6\. \*\*Task Tracking:\*\* Full CRUD for tasks with priority and status states.

7\. \*\*Real-time Analytics:\*\* Dashboard showing task statistics and project progress.

8\. \*\*Containerized Deployment:\*\* Fully Dockerized services for one-click setup.



\### 🛠 Technology Stack

\- \*\*Frontend:\*\* React (v18), Material UI, Axios, React Router.

\- \*\*Backend:\*\* Node.js (v18), Express, JWT Authentication, Sequelize/Postgres Driver.

\- \*\*Database:\*\* PostgreSQL (v15).

\- \*\*DevOps:\*\* Docker, Docker Compose.



\### 🏗 Architecture Overview



The system follows a \*\*Shared Database, Shared Schema\*\* multi-tenancy model. 



\#### Data Isolation Strategy:

\- \*\*Tenant Identification:\*\* Each request is identified by a subdomain or a `tenant\_id` inside the JWT token.

\- \*\*Query Filtering:\*\* Every database query includes a `WHERE tenant\_id = current\_tenant` clause to prevent data leakage.

\- \*\*Middleware:\*\* A custom Express middleware intercepts requests to validate tenant access before reaching the controllers.



\*\*System Flow:\*\*

User Interface (React) ➔ Express Middleware (Auth \& Tenant Check) ➔ Service Layer ➔ Postgres (Filtered by Tenant ID)



\### ⚙️ Installation \& Setup

1\. \*\*Prerequisites:\*\* Install Docker Desktop and Git.

2\. \*\*Local Setup:\*\*

&nbsp;  ```bash

&nbsp;  git clone <your-repo-url>

&nbsp;  cd multi-tenant-saas
3. Database \& Migrations: The system automatically seeds the database on the first run via Docker.



4\. Run Application:
docker-compose up -d
5. Access:



Frontend: http://localhost:3000



Backend API: http://localhost:5000



🔑 Environment Variables

DB\_HOST: database



DB\_USER: postgres



DB\_PASSWORD: postgres



JWT\_SECRET: Used for signing secure tokens.





\#### \*\*2. API Documentation (`docs/API.md`)\*\*

\* \*\*Action:\*\* Create a folder named `docs` and a file named `API.md`.

\* \*\*Task:\*\* You must list your \*\*19 endpoints\*\*. (e.g., POST `/api/auth/register`, GET `/api/tasks`, etc.)

\* \*\*Note:\*\* If you haven't finished the list of 19, let me know, and I will generate the standard list for this specific SaaS task.



---



\### \*\*Task 6.2: The `submission.json` (MANDATORY)\*\*

This is the file the \*\*automated grading script\*\* will use. It must be in the root folder and follow the exact structure you provided.



\* \*\*Action:\*\* `notepad submission.json`

\* \*\*Paste this (Ensure this matches your actual seed data):\*\*



```json

{

&nbsp; "testCredentials": {

&nbsp;   "superAdmin": {

&nbsp;     "email": "superadmin@system.com",

&nbsp;     "password": "Admin@123",

&nbsp;     "role": "super\_admin",

&nbsp;     "tenantId": null

&nbsp;   },

&nbsp;   "tenants": \[

&nbsp;     {

&nbsp;       "name": "Demo Company",

&nbsp;       "subdomain": "demo",

&nbsp;       "status": "active",

&nbsp;       "subscriptionPlan": "pro",

&nbsp;       "admin": {

&nbsp;         "email": "admin@demo.com",

&nbsp;         "password": "Demo@123",

&nbsp;         "role": "tenant\_admin"

&nbsp;       },

&nbsp;       "users": \[

&nbsp;         {

&nbsp;           "email": "user1@demo.com",

&nbsp;           "password": "User@123",

&nbsp;           "role": "user"

&nbsp;         }

&nbsp;       ],

&nbsp;       "projects": \[

&nbsp;         {

&nbsp;           "name": "Project Alpha",

&nbsp;           "description": "First demo project"

&nbsp;         }

&nbsp;       ]

&nbsp;     }

&nbsp;   ]

&nbsp; }

}

