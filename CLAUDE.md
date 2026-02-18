# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A personal project tracker built with Next.js 16, React 19, TypeScript, Tailwind CSS v4, and Firebase (Auth + Firestore). Users log in and manage a hierarchy of Contexts → Projects → Tasks → SubTasks.

## Development Commands

```bash
npm run dev      # Start dev server on http://localhost:3000
npm run build    # Production build
npm run lint     # ESLint (flat config, eslint.config.mjs)
```

No test framework is configured.

## Architecture

### Data Model Hierarchy

`Context → Project → Task → SubTask` (defined in `types/models.ts`)

- **Context**: Top-level grouping (e.g., "Day Job", "Side Business") with `EntityStatus` (ongoing/future/cancelled)
- **Project**: Belongs to a Context via `contextId`
- **Task**: Belongs to a Project via `projectId` and Context via `contextId`. Has `TaskStatus` (backlog/next_action/in_progress/completed/cancelled), `Priority`, and `TaskType`
- **SubTask**: Belongs to a Task, Project, and Context. Shares `TaskStatus` with Tasks

All entities use Firestore `Timestamp` for dates. Use the `toDate()` helper from `types/models.ts` for safe conversion. `Create*Data` types (e.g., `CreateTaskData`) omit server-generated fields.

### Firebase / Firestore

- Config in `lib/firebase.ts`, initialized from `NEXT_PUBLIC_FIREBASE_*` env vars (`.env.local`)
- All data is per-user, stored under `users/{uid}/{collection}` (see `services/firestore.ts`)
- `services/firestore.ts` exports CRUD functions and query builders for each entity — all take `uid` as first param
- `hooks/useFirestore.ts` wraps queries with real-time `onSnapshot` listeners via a generic `useCollection<T>` hook. The typed hooks (`useContexts`, `useProjects`, `useTasks`, etc.) are the primary data-fetching mechanism

### App Router Layout

- `app/layout.tsx`: Root layout (Server Component) → wraps children in `<Providers>` (AuthProvider + ToastProvider)
- `app/(dashboard)/layout.tsx`: Client Component with auth guard — redirects to `/login` if unauthenticated. Renders Sidebar + Header shell
- `app/login/page.tsx`: Login page (email/password + Google sign-in)
- `app/(dashboard)/page.tsx`: Dashboard with widgets (NextActions, InProgress, RecentlyCompleted, ProjectOverview)
- `app/(dashboard)/projects/[projectId]/page.tsx`: Project detail
- `app/(dashboard)/projects/[projectId]/tasks/[taskId]/page.tsx`: Task detail with subtasks
- `app/(dashboard)/contexts/page.tsx` and `contexts/[contextId]/page.tsx`: Context management

### Component Organization

- `components/ui/` — Reusable primitives: Button, Card, Modal, Badge, StatusSelect, ConfirmDialog, Toast, Skeleton, EmptyState, ViewToggle
- `components/layout/` — Sidebar, Header
- `components/dashboard/` — Dashboard widgets
- `components/projects/` — ProjectCard, ProjectForm, ProjectKanbanBoard
- `components/tasks/` — TaskCard, TaskForm, KanbanBoard, KanbanColumn, KanbanCard, SubTaskItem, SubTaskForm
- `components/contexts/` — ContextCard, ContextForm

### Key Libraries

- `@dnd-kit` — Drag-and-drop for Kanban boards
- `date-fns` — Date formatting
- `react-icons` — Icon library (icons referenced by string name in data model, e.g., `LuSparkles`)
- `uuid` — ID generation

### Styling

- Tailwind CSS v4 with `@tailwindcss/postcss` plugin
- Custom CSS animations and utilities in `app/globals.css` (toast slide-in, line-clamp, kanban drag overlay)
- Dark mode via `dark:` variants with zinc-based color palette
- Path alias: `@/*` maps to project root
