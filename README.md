# Project Management Platform 

A full-stack, workspace-centric project management system for planning projects, assigning tasks, collaborating through task comments, and automating assignment/reminder emails using an event-driven workflow.

This repository contains:

- **Frontend:** `client/` (React + Redux + Tailwind)
- **Backend:** `server/` (Express + Prisma + PostgreSQL + Clerk + Inngest)

---

## Features

### Authentication & Organizations (Clerk)
- Secure authentication (sign in / sign up) handled via Clerk UI components.
- Organization/workspace onboarding using Clerk Organizations (users create an organization if they have none).
- Backend protected APIs using Clerk + an auth middleware guard.

---

## Role-Based Access Control (RBAC)

RBAC is enforced primarily **on the backend** via database roles and permission checks.

### Workspace roles
Workspace membership includes a role:
- `ADMIN`
- `MEMBER`

**Workspace ADMIN can:**
- Add workspace members (invite by email + set role)
- Create projects in the workspace
- Update projects in the workspace

**Workspace MEMBER can:**
- View workspace/projects/tasks they belong to (via membership)
- Participate in projects they’re added to

### Project permissions
Each project has a `team_lead` (project owner/lead).

**Project Team Lead can:**
- Add members to that project
- Create tasks
- Update tasks
- Bulk delete tasks

**Project Members can:**
- Comment on tasks (discussion thread) if they belong to the project

> Note: “Role-based login” is not a separate login flow. All users authenticate via Clerk; permissions are applied after login through workspace/project rules.

---

## Workspace Management
- Fetch all workspaces the current user belongs to.
- Workspace selection persisted locally (current workspace stored in `localStorage`).
- Workspace members include roles and can be managed by workspace admins.

---

## Project Management
- Create projects within a workspace (admin-only).
- Update project details (admin-only).
- Assign:
  - Project status (e.g., planning/active/completed, depending on UI usage)
  - Priority
  - Progress
  - Start/end dates
- Project membership management:
  - Team lead can add members to their project.

---

## Task Management
- Create tasks within a project (team lead-only).
- Update tasks (team lead-only).
- Bulk delete tasks (team lead-only).
- Task fields supported:
  - Title, description
  - Status (`TODO`, `IN_PROGRESS`, `DONE`)
  - Type (`TASK`, `BUG`, `FEATURE`, `IMPROVEMENT`, `OTHER`)
  - Priority (`LOW`, `MEDIUM`, `HIGH`)
  - Assignee
  - Due date
- “My Tasks” experience (frontend sidebar / filtering) driven by assignee identity.

---

## Collaboration (Comments)
- Task comments supported.
- Only **project members** can create comments on tasks in that project.
- Task details view refreshes comments periodically to keep discussions up to date.

---

## Analytics & Planning Views (Frontend)
- Dashboard overview
- Project analytics charts (status/type/priority distributions)
- Calendar-based task visibility (upcoming + overdue)

---

## Email Automation (Event-driven)
When a task is created/assigned:
- Backend emits an event to Inngest
- Email is sent to the assignee
- Inngest waits until the due date
- If the task is not completed (`DONE`), it sends a reminder email

Email sending uses Nodemailer (SMTP provider such as Brevo).

---

## Tech Stack

### Frontend (`client/`)
- React
- React Router
- Redux Toolkit
- Clerk React SDK
- Axios
- Tailwind CSS
- Recharts
- date-fns

### Backend (`server/`)
- Node.js + Express
- Clerk Express middleware
- Prisma ORM
- PostgreSQL (Neon serverless ready)
- Inngest (workflow + scheduling)
- Nodemailer (SMTP)

### Tooling / Deployment
- Vite
- ESLint
- Prisma CLI
- Vercel configs present (frontend + backend)

---

## Project Structure

```text
project-management/
├── client/                 # React frontend
│   ├── src/
│   │   ├── pages/          # Layout, Dashboard, Projects, ProjectDetails, TaskDetails, Team
│   │   ├── features/       # Redux slices (workspace, theme, etc.)
│   │   ├── components/     # UI components (sidebar/navbar/dialogs/charts/calendar/etc.)
│   │   └── configs/api.js  # Axios base URL (VITE_BASEURL)
│   └── vercel.json
│
└── server/                 # Express backend
    ├── server.js           # Express app + routes + Inngest serve
    ├── prisma/schema.prisma
    ├── middlewares/authMiddleware.js
    ├── controllers/        # workspace/project/task/comment controllers
    ├── routes/             # route wiring
    ├── inngest/            # workflows + events
    └── vercel.json
```

---

## Setup & Installation

### Prerequisites
- Node.js 18+ (recommended: 20+)
- npm
- PostgreSQL database (Neon recommended)
- Clerk project (Authentication + Organizations)
- Inngest credentials
- SMTP credentials (Brevo or any SMTP provider)

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

## License
Add a LICENSE file if you plan to open-source this project.
