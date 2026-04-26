# Project Management Platform

A full-stack, workspace-centric project management system for planning projects, assigning tasks, collaborating through task comments, and automating assignment/reminder emails using event-driven workflows.

---

## Project Overview

This project addresses a common product and engineering problem: teams often split project execution across disconnected tools (task board, chat, email, docs), which causes ownership ambiguity, status drift, and delayed delivery.

This platform centralizes:
- workspace-level team organization,
- project lifecycle tracking,
- task assignment and status management,
- project discussions (comments),
- automated notification workflows.

It is designed as a realistic production-style application, not just a CRUD demo.

### Problem Statement

Teams need a single system where they can:
- manage projects with priorities, timelines, and progress,
- assign accountable owners for every task,
- enforce permission boundaries (admin/team lead/member),
- collaborate asynchronously in task-level discussions,
- receive notifications without blocking core API requests.

---

## Solution Explanation

The application is built around a workspace as the top-level boundary. Each workspace contains projects; each project contains tasks and members; each task can have comments and an assignee.

Core flow:
1. Clerk handles user and organization identity.
2. Backend APIs enforce access checks before mutating workspace/project/task data.
3. Prisma + PostgreSQL (Neon) persist all domain entities.
4. Task assignment triggers an Inngest event.
5. Inngest executes asynchronous email workflows via Nodemailer (Brevo SMTP).
6. Frontend Redux state reflects workspace/project/task updates in real time from API responses.

### Core Idea and Approach

Instead of embedding everything into synchronous request-response logic, the app separates concerns:
- synchronous APIs for core transactional operations (create/update/delete),
- asynchronous workflows for side effects (emails, reminders),
- explicit role checks for authorization at workspace/project boundaries.

This design avoids API latency inflation and keeps business logic maintainable.

---

## Why This Project Stands Out

This project is stronger than generic “task manager clones” for the following technical reasons:

1. Workspace + organization sync with Clerk events  
   User and organization lifecycle changes are synchronized to internal DB entities using Inngest functions.

2. Event-driven notification workflow, not inline email sending  
   Task assignment emits `app/task.assigned`; email and due-date reminder logic run asynchronously via Inngest.

3. Role-aware mutation rules  
   - Workspace admin required for workspace-level member onboarding and project creation.
   - Project lead required for project-level member/task management.
   - Project membership required for commenting.

4. Rich relational model with explicit constraints  
   Prisma schema uses unique membership constraints (`@@unique`) to prevent duplicate workspace/project memberships.

5. End-to-end full-stack implementation  
   Includes auth, backend APIs, relational persistence, background jobs, analytics dashboards, calendar/task views, and collaborative comments.

### What makes it different from typical alternatives

Most portfolio project managers stop at basic CRUD + local UI state. This system includes:
- organization-aware authentication integration,
- asynchronous business workflow orchestration,
- cross-entity permission enforcement,
- project analytics and task calendar visualizations,
- production deployment setup for both frontend and backend (Vercel configs).

---

## Key Features

- Clerk-based authentication and organization/workspace context
- Workspace member management with role controls (`ADMIN`, `MEMBER`)
- Project creation, updates, and team assignment
- Task creation, status updates, and bulk deletion
- Task type/status/priority/assignee filtering
- Task discussion comments with project membership checks
- “My Tasks” personalized sidebar by assignee identity
- Project analytics dashboard (status/type/priority distributions)
- Calendar-based task visibility (upcoming and overdue)
- Automated email on task assignment
- Due-date reminder email if task remains incomplete

---

## Tech Stack

### Frontend
- React 19
- React Router DOM 7
- Redux Toolkit + React Redux
- Clerk React SDK
- Axios
- Tailwind CSS v4
- Recharts
- date-fns
- react-hot-toast
- lucide-react + react-icons

### Backend
- Node.js + Express 5
- Clerk Express middleware
- Prisma ORM
- PostgreSQL (Neon serverless)
- Inngest (event/workflow orchestration)
- Nodemailer (SMTP integration with Brevo)

### Dev / Build / Deployment
- Vite
- ESLint
- Prisma CLI
- Nodemon
- Vercel (frontend and backend configs present)

---

## Project Structure

```text
project-management/
├── README.md
├── client/                         # React frontend
│   ├── src/
│   │   ├── app/store.js            # Redux store registration
│   │   ├── features/
│   │   │   ├── workspaceSlice.js   # Workspace + nested project/task state/actions
│   │   │   └── themeSlice.js       # Light/dark mode state
│   │   ├── configs/api.js          # Axios instance (VITE_BASEURL)
│   │   ├── pages/
│   │   │   ├── Layout.jsx          # Auth gate + app shell
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Projects.jsx
│   │   │   ├── ProjectDetails.jsx
│   │   │   ├── TaskDetails.jsx
│   │   │   └── Team.jsx
│   │   ├── components/             # Dialogs, analytics, calendar, sidebars, cards
│   │   ├── assets/                 # Images + mock data file
│   │   ├── App.jsx                 # Router tree
│   │   ├── main.jsx                # App bootstrap + ClerkProvider
│   │   └── index.css               # Design system tokens + global styles
│   ├── package.json
│   └── vercel.json
│
└── server/                         # Express backend
    ├── server.js                   # Middleware + route registration + inngest serve
    ├── configs/
    │   ├── prisma.js               # Prisma client (Neon adapter)
    │   └── nodemailer.js           # SMTP transporter + sendEmail helper
    ├── middlewares/
    │   └── authMiddleware.js       # Clerk auth protection
    ├── prisma/
    │   └── schema.prisma           # Full relational schema + enums
    ├── controllers/
    │   ├── workspaceController.js
    │   ├── projectController.js
    │   ├── taskController.js
    │   └── commentController.js
    ├── routes/
    │   ├── workspaceRoutes.js
    │   ├── projectRoutes.js
    │   ├── taskRoutes.js
    │   └── commentRoutes.js
    ├── inngest/
    │   └── index.js                # Clerk sync functions + task email workflow
    ├── package.json
    └── vercel.json
```

---

## Workflow / How It Works

### 1) Authentication and workspace context
- Frontend bootstraps with `ClerkProvider`.
- `Layout.jsx` checks Clerk user state:
  - unauthenticated users see sign-in/sign-up UI,
  - authenticated users load workspaces from backend (`fetchWorkspaces` thunk).
- Current workspace ID is persisted in localStorage and switched via workspace dropdown.

### 2) Data loading strategy
- `fetchWorkspaces` calls `GET /api/workspaces` with Clerk bearer token.
- Backend returns nested data: workspace → members/projects → tasks/comments/assignees.
- Redux stores this nested payload and powers dashboard/project/task/team screens.

### 3) Project lifecycle
- Admin creates project (`POST /api/projects`).
- Backend validates workspace existence + admin membership.
- Project and project members are persisted via Prisma.
- Frontend updates local workspace state with `addProject`.

### 4) Task lifecycle
- Project lead creates task (`POST /api/tasks`).
- Backend validates:
  - project exists,
  - caller is team lead,
  - assignee belongs to project.
- Task is created in DB and returned with assignee details.
- Frontend updates state using `addTask`.

### 5) Event-driven notification path
- After task creation, backend emits `app/task.assigned` to Inngest.
- Inngest function:
  - fetches task + assignee + project,
  - sends assignment email,
  - sleeps until due date,
  - if task still not `DONE`, sends reminder email.

### 6) Task updates and deletion
- Task status update via `PUT /api/tasks/:id` (team lead gated).
- Bulk deletion via `POST /api/tasks/delete` with `taskIds`.
- Redux state is synchronized using `updateTask` and `deleteTask`.

### 7) Collaboration (comments)
- Members of a project can post comments on tasks (`POST /api/comments`).
- Task details page polls comments every 10 seconds to keep discussions refreshed.
- Comment retrieval: `GET /api/comments/:taskId`.

### 8) Reporting and planning views
- Dashboard statistics + activity stream
- Project analytics (status/type/priority charts)
- Calendar view for due dates, upcoming tasks, and overdue tasks
- Team page showing membership and contribution context

---

## API Documentation

Base URL (frontend): `VITE_BASEURL`

All protected routes require:
- `Authorization: Bearer <clerk_token>`

### Workspace
- `GET /api/workspaces`  
  Get all workspaces where current user is a member (with nested projects/tasks/members).

- `POST /api/workspaces/add-member`  
  Add existing user to workspace (admin only).  
  Body: `{ email, role, workspaceId, message? }`

### Projects
- `POST /api/projects`  
  Create project (workspace admin required).  
  Body includes: `workspaceId, name, description, status, priority, start_date, end_date, team_members, team_lead, progress`

- `PUT /api/projects`  
  Update project (workspace admin required).

- `POST /api/projects/:projectId/add-member`  
  Add member to project (project team lead required).  
  Body: `{ email }`

### Tasks
- `POST /api/tasks`  
  Create task (project team lead required).  
  Triggers `app/task.assigned` event.

- `PUT /api/tasks/:id`  
  Update task (project team lead required).

- `POST /api/tasks/delete`  
  Bulk delete tasks (project team lead required).  
  Body: `{ taskIds: string[] }`

### Comments
- `POST /api/comments`  
  Add comment (project member required).  
  Body: `{ taskId, content }`

- `GET /api/comments/:taskId`  
  Get all comments for a task.

### Inngest endpoint
- `POST /api/inngest`  
  Inngest handler endpoint served by Express.

---

## Setup & Installation

## Prerequisites

- Node.js 18+ (recommended: 20+)
- npm
- PostgreSQL database (Neon used in this project)
- Clerk project (auth + organizations)
- Inngest credentials
- Brevo SMTP credentials (or equivalent SMTP provider)

---

## 1) Clone repository

```bash
git clone https://github.com/karthik-varma06/project-management.git
cd project-management
```

---

## 2) Backend setup

```bash
cd server
npm install
```

Create `server/.env`:

```env
PORT=5000
NODE_ENV=development

# Clerk
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_WEBHOOK_SECRET=your_clerk_webhook_secret

# Database
DATABASE_URL=your_database_url
DIRECT_URL=your_direct_database_url

# Inngest
INNGEST_EVENT_KEY=your_inngest_event_key
INNGEST_SIGNING_KEY=your_inngest_signing_key

# SMTP / email
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
SENDER_EMAIL=your_verified_sender_email
```

Run backend:

```bash
npm run server
```

Backend runs at:
- `http://localhost:5000`

---

## 3) Frontend setup

```bash
cd ../client
npm install
```

Create `client/.env`:

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_BASEURL=http://localhost:5000
```

Run frontend:

```bash
npm run dev
```

Frontend runs at:
- `http://localhost:5173`

---

## 4) Prisma notes

From `server/` when schema changes:

```bash
npx prisma generate
npx prisma db push
```

---

## Usage

1. Sign in via Clerk.
2. Create/select an organization (workspace).
3. Open dashboard and create a project.
4. Add project members and assign team lead.
5. Create tasks with type, priority, status, assignee, due date.
6. Track work via:
   - Tasks table (filters + status updates),
   - Calendar view,
   - Analytics view,
   - Team page.
7. Open task details and collaborate via comments.
8. Assigned users receive email notifications; due-date reminders are sent for incomplete tasks.

---

## Potential Improvements / Future Scope

1. Real-time comments and task updates (WebSockets/SSE instead of polling)
2. Server-side pagination for workspace/project/task queries
3. Strong input validation layer (e.g., Zod) for all API payloads
4. Fine-grained RBAC (workspace admin, project manager, contributor, viewer)
5. Audit log for task/project/member changes
6. Notification center (in-app + email preferences)
7. File attachments for tasks/comments
8. Search API (server-side indexing by task/project/member fields)
9. Observability: structured logs, tracing, alerting
10. Automated tests:
    - backend integration tests for auth/permissions,
    - frontend component tests and route tests,
    - e2e tests for task assignment and comment workflows.
