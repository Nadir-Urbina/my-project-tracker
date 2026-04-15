# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A personal project tracker PWA built with Next.js 16, React 19, TypeScript, Tailwind CSS v4, and Firebase (Auth + Firestore). Users log in and manage a hierarchy of Contexts → Projects → Tasks → SubTasks, plus a freeform Ideas capture board.

## Development Commands

```bash
npm run dev      # Start dev server on http://localhost:3000 (uses --webpack flag, not Turbopack)
npm run build    # Production build
npm run lint     # ESLint (flat config, eslint.config.mjs)
```

No test framework is configured.

## Architecture

### Data Model

`Context → Project → Task → SubTask` (defined in `types/models.ts`), plus a standalone `Idea` type.

- **Context**: Top-level grouping (e.g., "Day Job", "Side Business") with `EntityStatus` (ongoing/future/cancelled), `color` (hex), and `icon` (react-icons name)
- **Project**: Belongs to a Context via `contextId`
- **Task**: Belongs to a Project via `projectId` and Context via `contextId`. Has `TaskStatus` (backlog/next_action/in_progress/completed/cancelled), `Priority`, `TaskType`, `dueDate`, `timeSpent` (minutes), and `completionNotes`. `completedAt` is auto-set by `updateTask` in `services/firestore.ts` when status becomes `"completed"`.
- **SubTask**: Belongs to a Task, Project, and Context. Shares `TaskStatus`.
- **Idea**: Standalone capture item (title, description, status active/archived). Can be converted to a Context or Project via `convertIdeaToContext` / `convertIdeaToProject` in `services/firestore.ts`.

All entities use Firestore `Timestamp` for dates. Use the `toDate()` helper from `types/models.ts` for safe conversion. `Create*Data` types (e.g., `CreateTaskData`) omit server-generated fields. Display config maps (labels, colors, icons) for all enums live in `types/models.ts` (e.g., `TASK_STATUS_CONFIG`, `TASK_TYPE_CONFIG`).

### Firebase / Firestore

- Config in `lib/firebase.ts`, initialized from `NEXT_PUBLIC_FIREBASE_*` env vars (`.env.local`)
- All data is per-user, stored under `users/{uid}/{collection}` (see `services/firestore.ts`)
- `services/firestore.ts` exports CRUD functions and query builders for each entity — all take `uid` as first param
- `hooks/useFirestore.ts` wraps queries with real-time `onSnapshot` listeners via a generic `useCollection<T>` hook. The typed hooks (`useContexts`, `useProjects`, `useTasks`, `useIdeas`, etc.) are the primary data-fetching mechanism

### App Router Layout

- `app/layout.tsx`: Root layout (Server Component) → wraps children in `<Providers>` (AuthProvider + ThemeProvider + ToastProvider)
- `app/(dashboard)/layout.tsx`: Client Component with auth guard — redirects to `/login` if unauthenticated. Renders Sidebar + Header + BottomNav shell
- `app/login/page.tsx`: Login page (email/password + Google sign-in)
- `app/(dashboard)/page.tsx`: Dashboard with widgets (WelcomeBar, NextActions, InProgress, UpcomingDue, RecentlyCompleted, ProjectOverview)
- `app/(dashboard)/tasks/page.tsx`: All-tasks view
- `app/(dashboard)/projects/[projectId]/page.tsx`: Project detail
- `app/(dashboard)/projects/[projectId]/tasks/[taskId]/page.tsx`: Task detail with subtasks
- `app/(dashboard)/contexts/page.tsx` and `contexts/[contextId]/page.tsx`: Context management
- `app/(dashboard)/ideas/page.tsx`: Ideas board with convert-to-context/project actions
- `app/(dashboard)/profile/page.tsx`: User profile and theme settings

### Component Organization

- `components/ui/` — Reusable primitives: Button, Card, Modal, Badge, StatusSelect, ConfirmDialog, Toast, Skeleton, EmptyState, ViewToggle, ThemeToggle, MentionDropdown, CompletionNotesDialog, PWAUpdatePrompt, RefreshButton
- `components/layout/` — Sidebar, Header, BottomNav (mobile navigation)
- `components/dashboard/` — Dashboard widgets (WelcomeBar, NextActionsWidget, InProgressWidget, UpcomingDueWidget, RecentlyCompletedWidget, ProjectOverviewWidget)
- `components/projects/` — ProjectCard, ProjectForm, ProjectKanbanBoard
- `components/tasks/` — TaskCard, TaskForm, KanbanBoard, KanbanColumn, KanbanCard, SubTaskItem, SubTaskForm
- `components/contexts/` — ContextCard, ContextForm
- `components/ideas/` — IdeaCard, IdeaForm, ConvertIdeaDialog

### Contexts and Hooks

- `contexts/AuthContext.tsx` — `AuthProvider` + `useAuth()`: Firebase Auth state, exposes `signIn`, `signUp`, `signInWithGoogle`, `signOut`
- `contexts/ThemeContext.tsx` — `ThemeProvider` + `useTheme()`: light/dark/system theme. Persists to `localStorage`. Applies `dark` class to `<html>`.
- `hooks/useFirestore.ts` — Real-time Firestore hooks (see above)
- `hooks/useMentions.ts` — `useMentions()` hook + `MentionDropdown` component: typing `@` in any input triggers a suggestion dropdown for date shortcuts (`@today`, `@tomorrow`, `@nextweek`, `@nextmonth`)
- `hooks/useIsMobile.ts` — Responsive breakpoint detection
- `hooks/useLocalStorage.ts` — Typed localStorage hook

### Key Libraries

- `@dnd-kit` — Drag-and-drop for Kanban boards
- `canvas-confetti` (`lib/confetti.ts`) — Celebratory animation on task completion
- `date-fns` — Date formatting
- `react-icons` — Icon library (icons referenced by string name in data model, e.g., `LuSparkles`)
- `next-pwa` — Service worker and PWA manifest (`public/manifest.json`)
- `uuid` — ID generation

### Styling

- Tailwind CSS v4 with `@tailwindcss/postcss` plugin
- Custom CSS animations and utilities in `app/globals.css` (toast slide-in, line-clamp, kanban drag overlay)
- Dark mode via `dark:` variants with zinc-based color palette
- Path alias: `@/*` maps to project root
