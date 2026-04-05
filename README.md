Project Management System - Full Stack Application

A full-stack project management platform that allows teams to manage projects, assign tasks, collaborate, and receive real-time email notifications for task updates.

---

1. Problem Statement

For Teams:

Managing projects across multiple tools leads to confusion and inefficiency  
Tracking task ownership, deadlines, and progress becomes difficult  
Communication gaps delay project completion  

For Developers / Students:

Learning full-stack development requires integrating multiple complex systems  
Handling authentication, database, background jobs, and notifications is non-trivial  

Why This is Painful:

Teams lack a centralized system for collaboration and tracking  
Manual coordination leads to missed deadlines and miscommunication  
Building such a system from scratch involves multiple moving parts  

---

2. Constraints & Assumptions

Technical Constraints:

Authentication must be secure and scalable  
Database must handle relational data (users, projects, tasks)  
Email notifications should be asynchronous and non-blocking  
Frontend must stay in sync with backend state  

Key Assumptions:

Users are authenticated via Clerk  
Each project has a team lead (admin)  
Tasks belong to a project and can be assigned to members  
Only project admins can create/update tasks  

What Makes This Hard:

Managing relational data across multiple entities  
Handling real-time updates and UI consistency  
Implementing background workflows (email reminders)  
Ensuring proper role-based access control  

---

3. Proposed Solution

Core Idea:

A centralized project management system where:

Users can create and manage projects  
Team members can be added to projects  
Tasks can be assigned with deadlines and priorities  
Email notifications are triggered on task assignment  
Background jobs handle reminders and delayed actions  

Why This Approach:

Approach                    Why We Didn't Choose It
Basic CRUD App             No real-world scalability or async handling
Manual Email Triggers      Blocks request cycle, inefficient
Event-driven System        Scalable, clean separation (Chosen)

Key Tradeoffs:

Simplicity over Completeness: Focus on core features instead of enterprise complexity  
Async over Immediate: Emails handled in background (Inngest)  
Security over Flexibility: Strict role-based permissions  

---

4. System Architecture

High-Level Architecture

Frontend (React + Redux)
        ↓
Backend (Node.js + Express)
        ↓
Authentication (Clerk)
        ↓
ORM (Prisma)
        ↓
Database (NeonDB - PostgreSQL)
        ↓
Event System (Inngest)
        ↓
Email Service (Nodemailer + Brevo SMTP)

---

Component Breakdown

Backend:

Project Controller: Create/update projects, manage members  
Task Controller: Create/update/delete tasks with validation  
Comment System: Add and retrieve task discussions  
Auth Middleware: Uses Clerk for user authentication  
Inngest Functions: Handles background workflows (emails, reminders)  

Frontend:

Dashboard: Overview of projects and tasks  
Project View: Manage tasks, members, and settings  
Task Management UI: Create, update, assign tasks  
Sidebar (My Tasks): Displays tasks assigned to logged-in user  
Comments Section: Task discussions  

---

Key Technology Choices:

Technology        Why Chosen
Clerk             Simplifies authentication and session management
Prisma            Type-safe ORM for database operations
NeonDB            Serverless PostgreSQL, easy setup
Inngest           Event-driven background job processing
Nodemailer        Simple email sending library
Brevo SMTP        Reliable email delivery provider
React + Redux     State management and UI handling

---

Data Flow Example

1. Admin creates a task and assigns it to a user  
2. Task is stored in database via Prisma  
3. Backend triggers event using Inngest  
4. Inngest processes event asynchronously  
5. Email sent via Nodemailer using Brevo SMTP  
6. User receives task assignment email  

---

Failure Modes & Edge Cases

Task Handling:

Invalid project ID → returns 404  
Unauthorized user → returns 403  
Assignee not part of project → blocked  

Email System:

Missing SMTP config → email fails gracefully  
Delayed jobs handled via Inngest retry  

Frontend:

Missing data handled with optional chaining  
Fallback UI for empty states  

---

5. Ideal End State (Production-Grade)

Scalability Plan

What Breaks First:

Database load with large number of users  
Email rate limits (Brevo free tier)  
Inngest execution limits  

Production Improvements Needed:

Component        Current State          Production Need
Database         NeonDB                 Managed cluster + scaling
Email            Brevo SMTP             AWS SES / SendGrid
Jobs             Inngest                Queue system (BullMQ/Kafka)
Auth             Clerk                  Production keys + policies
Caching          None                   Redis for performance

Scaling Targets:

Users: 10,000+ concurrent users  
Tasks: Millions of records  
Requests: 100+ per second  

What Needs Hardening:

Input validation  
Rate limiting  
Error logging  
Monitoring  

---

6. Features Implemented

Core Features:

User authentication using Clerk  
Project creation and management  
Add/remove project members  
Task creation with assignment  
Task updates and deletion  
Comment system for tasks  
Email notifications on task assignment  
Reminder emails before due date  
"My Tasks" sidebar for assigned tasks  

---

7. How to Run / Demo

Prerequisites:

Node.js (v16+)  
Clerk account  
Brevo SMTP credentials  
NeonDB database  

---

Backend Setup

cd server
npm install

Create .env file:

NODE_ENV=development

# Clerk
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_WEBHOOK_SECRET=your_clerk_webhook_secret

# Database (Neon)
DATABASE_URL=your_neon_database_url
DIRECT_URL=your_neon_direct_url

# Inngest (for background jobs)
INNGEST_EVENT_KEY=your_inngest_event_key
INNGEST_SIGNING_KEY=your_inngest_signing_key

# Email (Brevo SMTP)
SMTP_USER=your_brevo_smtp_user
SMTP_PASSWORD=your_brevo_smtp_password
SENDER_EMAIL=your_verified_sender_email

Run backend:

npm run server

Server runs on:
http://localhost:5000

---

Frontend Setup

cd client
npm install

Create .env file:

VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_BASEURL=http://localhost:5000


Run frontend:

npm run dev

App runs on:
http://localhost:5173

---

Demo Flow

1. Sign in using Clerk  
2. Create a project  
3. Add members to project  
4. Create tasks and assign users  
5. Assigned user receives email  
6. View tasks in "My Tasks" sidebar  
7. Add comments to tasks  

---

8. Notes on Design Decisions

Why Clerk:

Avoid building authentication from scratch  

Why Prisma:

Simplifies database queries and ensures type safety  

Why Inngest:

Handles background jobs without blocking API  

Why Nodemailer + Brevo:

Simple and reliable email integration  

---

9. Future Improvements

Real-time updates using WebSockets  
Role-based permissions (viewer/editor/admin)  
File attachments for tasks  
Notifications panel inside app  
Mobile responsiveness improvements  

---

10. Summary

This project demonstrates:

Full-stack development (Frontend + Backend)  
Authentication integration  
Database design and ORM usage  
Event-driven architecture  
Email automation system  

It reflects real-world system design patterns and scalable architecture fundamentals.