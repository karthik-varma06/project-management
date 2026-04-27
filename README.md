# Project Management Platform

A full-stack, workspace-centric project management system for planning projects, assigning tasks, collaborating through task comments, and automating assignment/reminder emails using event-driven workflows.

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
