Research Document – Multi-Tenant SaaS Platform

1\. Multi-Tenancy Architecture Analysis



Multi-tenancy is a software architecture where a single application instance serves multiple organizations (tenants) while ensuring that each tenant’s data remains isolated and secure. Choosing the correct multi-tenancy approach is critical for scalability, security, and maintainability.



Approach 1: Shared Database + Shared Schema (Tenant ID Based)



In this approach, all tenants share the same database and the same database schema. Each table includes a tenant\_id column that identifies which tenant owns a specific record.



Pros:



Easy to implement and maintain



Low infrastructure cost



Simple onboarding for new tenants



Centralized schema updates



Cons:



High risk if tenant filtering is missed



Requires strict authorization checks



More responsibility on developers to prevent data leakage



Approach 2: Shared Database + Separate Schema (Per Tenant)



Each tenant has a separate schema within the same database. Tables are duplicated per tenant schema.



Pros:



Better data isolation compared to shared schema



Easier per-tenant customization



Reduced risk of accidental cross-tenant access



Cons:



Schema migrations become complex



Hard to manage large number of tenants



Increased operational complexity



Approach 3: Separate Database Per Tenant



Each tenant has its own dedicated database instance.



Pros:



Strongest data isolation



Easier compliance with regulations



Independent scaling and backups



Cons:



High infrastructure cost



Difficult tenant provisioning



Complex maintenance and monitoring



Comparison Table

Approach	Data Isolation	Cost	Scalability	Complexity

Shared DB + Shared Schema	Medium	Low	High	Low

Shared DB + Separate Schema	High	Medium	Medium	Medium

Separate DB Per Tenant	Very High	High	Low	High

Chosen Approach Justification



This project uses Shared Database with Shared Schema using tenant\_id. This approach provides the best balance between scalability, cost efficiency, and ease of deployment. When combined with strict middleware-based tenant filtering and role-based access control, it offers sufficient isolation for most SaaS applications.



2\. Technology Stack Justification

Backend Framework – Node.js with Express.js



Node.js is chosen due to its non-blocking architecture, excellent performance for I/O operations, and wide ecosystem. Express.js simplifies REST API development.



Alternatives Considered: Django, Spring Boot



Frontend Framework – React.js



React offers a component-based architecture, reusable UI components, and strong community support. It is ideal for building responsive single-page applications.



Alternatives Considered: Angular, Vue.js



Database – PostgreSQL



PostgreSQL provides ACID compliance, strong relational integrity, and excellent indexing support, making it ideal for multi-tenant applications.



Alternatives Considered: MySQL, MongoDB



Authentication – JWT (JSON Web Tokens)



JWT enables stateless authentication, making the system scalable and easy to integrate with frontend applications.



Alternatives Considered: Session-based authentication, OAuth-only systems



Deployment – Docker \& Docker Compose



Docker ensures consistency across environments. Docker Compose allows running the entire system with a single command.



Alternatives Considered: Manual VM deployment, cloud-only setups



3\. Security Considerations



Strict tenant-based query filtering using tenant\_id



JWT authentication with 24-hour expiry



Password hashing using bcrypt



Role-based access control at API level



Audit logging of sensitive operations



Data isolation is enforced using middleware and database constraints. Authentication ensures identity verification, while authorization ensures correct access permissions.

