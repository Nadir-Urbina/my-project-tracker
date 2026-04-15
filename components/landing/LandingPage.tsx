import Link from "next/link";
import {
  LuArrowRight,
  LuLayoutDashboard,
  LuLightbulb,
  LuLayers,
  LuCheck,
  LuSmartphone,
  LuZap,
  LuSparkles,
  LuFolderOpen,
  LuListChecks,
} from "react-icons/lu";

const VALUE_PROPS = [
  {
    icon: LuZap,
    title: "Always know what's next",
    description:
      "Next Actions and In Progress tasks are front and center so you never lose momentum.",
  },
  {
    icon: LuLayers,
    title: "Structure that scales",
    description:
      "Organize work into Contexts, Projects, Tasks, and Subtasks — as simple or detailed as you need.",
  },
  {
    icon: LuLightbulb,
    title: "Capture ideas instantly",
    description:
      "Dedicated inbox for ideas. Convert them to projects when you're ready, without losing a thought.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      {/* ── NAV ── */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-zinc-800/60 bg-zinc-950/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <img
              src="/icon-192x192.png"
              alt="FolioGTD"
              className="h-7 w-7 rounded-lg"
            />
            <span className="text-sm font-semibold text-white">FolioGTD</span>
          </div>
          <Link
            href="/login"
            className="rounded-lg bg-blue-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            Sign In
          </Link>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-zinc-950 pt-14">
        {/* Glow */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/4 rounded-full bg-blue-600/15 blur-[140px]" />
        </div>

        <div className="relative mx-auto max-w-6xl px-6 py-24 md:py-32">
          <div className="grid items-center gap-12 md:grid-cols-2">
            {/* Copy */}
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1.5 text-xs font-medium text-blue-400">
                <LuSparkles className="h-3 w-3" />
                Free, forever — no credit card required
              </div>
              <h1 className="mb-5 text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
                Your personal command center for getting things done.
              </h1>
              <p className="mb-8 text-lg leading-relaxed text-zinc-400">
                FolioGTD helps you organize your work across Contexts, Projects,
                and Tasks — with a clear view of what matters today. No noise,
                no bloat, no team features you&apos;ll never use.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition-all hover:bg-blue-700 hover:shadow-blue-600/40"
                >
                  Get Started Free
                  <LuArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Hero UI mockup
                ─────────────────────────────────────────────────────────────
                SCREENSHOT SLOT — Dashboard overview
                When you have a real screenshot, replace the inner content with:
                <img src="/screenshots/dashboard.png" alt="FolioGTD dashboard" className="w-full" />
                ───────────────────────────────────────────────────────────── */}
            <div className="relative">
              <div className="overflow-hidden rounded-2xl border border-zinc-800 shadow-2xl shadow-black/50">
                {/* Browser chrome */}
                <div className="flex items-center gap-1.5 border-b border-zinc-800 bg-zinc-900 px-4 py-3">
                  <div className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
                  <div className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
                  <div className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
                  <div className="ml-2 h-5 w-40 rounded-md bg-zinc-800" />
                </div>
                {/* Simplified dashboard UI */}
                <div className="flex bg-zinc-950">
                  {/* Sidebar */}
                  <div className="w-36 shrink-0 space-y-0.5 border-r border-zinc-800 bg-zinc-950 p-2">
                    <div className="flex items-center gap-2 rounded-lg bg-blue-950/60 px-2 py-1.5">
                      <div className="h-3 w-3 rounded-sm bg-blue-500" />
                      <div className="h-2 flex-1 rounded bg-blue-400/50" />
                    </div>
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 rounded-lg px-2 py-1.5"
                      >
                        <div className="h-3 w-3 rounded-sm bg-zinc-700" />
                        <div className="h-2 flex-1 rounded bg-zinc-800" />
                      </div>
                    ))}
                    <div className="mb-1 mt-4 px-2">
                      <div className="h-1.5 w-12 rounded bg-zinc-800" />
                    </div>
                    {["#3b82f6", "#8b5cf6", "#10b981"].map((color, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 rounded-lg px-2 py-1.5"
                      >
                        <div
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ background: color }}
                        />
                        <div className="h-2 flex-1 rounded bg-zinc-800" />
                      </div>
                    ))}
                  </div>
                  {/* Main content */}
                  <div className="flex-1 space-y-2 p-3">
                    <div className="h-8 rounded-lg border border-zinc-800 bg-zinc-900" />
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { dot: "bg-blue-500", rows: 3 },
                        { dot: "bg-amber-500", rows: 2 },
                      ].map((w, wi) => (
                        <div
                          key={wi}
                          className="space-y-1.5 rounded-lg border border-zinc-800 bg-zinc-900 p-2.5"
                        >
                          <div className="flex items-center gap-1.5">
                            <div className={`h-2 w-2 rounded-full ${w.dot}`} />
                            <div className="h-2 w-16 rounded bg-zinc-700" />
                          </div>
                          {Array.from({ length: w.rows }).map((_, i) => (
                            <div
                              key={i}
                              className="flex h-6 items-center gap-1.5 rounded bg-zinc-800 px-2"
                            >
                              <div className="h-1.5 w-1.5 rounded-full bg-zinc-600" />
                              <div className="h-1.5 flex-1 rounded bg-zinc-700" />
                              <div className="h-3.5 w-8 rounded-full bg-zinc-700" />
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                    <div className="space-y-1.5 rounded-lg border border-zinc-800 bg-zinc-900 p-2.5">
                      <div className="h-2 w-20 rounded bg-zinc-700" />
                      <div className="grid grid-cols-3 gap-1.5">
                        {["bg-zinc-500", "bg-blue-500", "bg-amber-500"].map(
                          (c, i) => (
                            <div
                              key={i}
                              className="flex h-14 flex-col justify-between rounded bg-zinc-800 p-1.5"
                            >
                              <div
                                className={`h-2 w-10 rounded ${c} opacity-40`}
                              />
                              <div className="space-y-0.5">
                                <div className="h-1.5 rounded bg-zinc-700" />
                                <div className="h-1.5 w-2/3 rounded bg-zinc-700" />
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── VALUE PROPS ── */}
      <section className="bg-zinc-50 py-20 dark:bg-zinc-900">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-6 md:grid-cols-3">
            {VALUE_PROPS.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-950"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mb-2 text-base font-semibold text-zinc-900 dark:text-zinc-50">
                    {f.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                    {f.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FEATURE 1: Dashboard ── */}
      <section className="bg-white py-20 dark:bg-zinc-950">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid items-center gap-12 md:grid-cols-[45%_55%]">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">
                Dashboard
              </p>
              <h2 className="mb-4 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                Always know what&apos;s next
              </h2>
              <ul className="space-y-3">
                {[
                  "Next Actions and In Progress tasks always at the top",
                  "Upcoming due dates so nothing slips through the cracks",
                  "Project health at a glance across all your contexts",
                  "Recently completed to track your daily momentum",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-zinc-600 dark:text-zinc-400"
                  >
                    <LuCheck className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* ─────────────────────────────────────────────────────────────
                SCREENSHOT SLOT — Dashboard widgets close-up
                Replace this block with:
                <img
                  src="/screenshots/dashboard-widgets.png"
                  alt="Dashboard widgets"
                  className="rounded-2xl border border-zinc-200 shadow-xl dark:border-zinc-800"
                />

                AI IMAGE PROMPT (for a stylized mockup alternative):
                "Clean UI screenshot mockup of a personal task manager dashboard.
                Two card widgets side by side on a white background: left card
                titled 'Next Actions' showing 3 task rows with blue dot icons and
                task name text. Right card titled 'In Progress' showing 2 task rows
                with amber dots. Minimal, flat design, Tailwind CSS aesthetic,
                light mode, no chrome or browser frame."
                ───────────────────────────────────────────────────────────── */}
            <div className="space-y-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-5 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
              {[
                {
                  label: "Next Actions",
                  textColor: "text-blue-600 dark:text-blue-400",
                  dot: "bg-blue-500",
                  ring: "border-blue-400",
                  bg: "bg-blue-50 dark:bg-blue-950/20",
                  rows: 3,
                },
                {
                  label: "In Progress",
                  textColor: "text-amber-600 dark:text-amber-400",
                  dot: "bg-amber-500",
                  ring: "border-amber-400",
                  bg: "bg-amber-50 dark:bg-amber-950/20",
                  rows: 2,
                },
              ].map((w) => (
                <div
                  key={w.label}
                  className="space-y-2 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800"
                >
                  <div
                    className={`flex items-center gap-2 text-sm font-semibold ${w.textColor}`}
                  >
                    <div className={`h-2 w-2 rounded-full ${w.dot}`} />
                    {w.label}
                  </div>
                  {Array.from({ length: w.rows }).map((_, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-2 rounded-lg px-3 py-2 ${w.bg}`}
                    >
                      <div
                        className={`h-3.5 w-3.5 shrink-0 rounded-full border-2 ${w.ring}`}
                      />
                      <div className="h-2 flex-1 rounded bg-zinc-200 dark:bg-zinc-600" />
                      <div className="h-4 w-12 rounded-full bg-zinc-200 dark:bg-zinc-600" />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURE 2: Structure / Kanban ── */}
      <section className="bg-zinc-50 py-20 dark:bg-zinc-900">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid items-center gap-12 md:grid-cols-[55%_45%]">
            {/* ─────────────────────────────────────────────────────────────
                SCREENSHOT SLOT — Kanban board
                Replace this block with:
                <img
                  src="/screenshots/kanban.png"
                  alt="Kanban board"
                  className="rounded-2xl border border-zinc-200 shadow-xl dark:border-zinc-800"
                />

                AI IMAGE PROMPT (for a stylized mockup alternative):
                "Clean UI screenshot of a Kanban board with 3 columns: Backlog,
                In Progress, and Done. Each column has 2-3 task cards with a title,
                a small colored priority badge, and a task type tag. Light mode,
                white card background, zinc column headers, blue accent color.
                Minimal flat design, no shadows, Tailwind CSS aesthetic."
                ───────────────────────────────────────────────────────────── */}
            <div className="flex gap-3">
              {[
                {
                  label: "Backlog",
                  cardBg: "bg-zinc-100 dark:bg-zinc-700",
                  cards: 3,
                },
                {
                  label: "In Progress",
                  cardBg: "bg-amber-50 dark:bg-amber-900/30",
                  cards: 2,
                },
                {
                  label: "Done",
                  cardBg: "bg-emerald-50 dark:bg-emerald-900/30",
                  cards: 2,
                },
              ].map((col) => (
                <div
                  key={col.label}
                  className="flex-1 space-y-2 rounded-xl border border-zinc-200 bg-white p-3 dark:border-zinc-700 dark:bg-zinc-800"
                >
                  <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                    {col.label}
                  </div>
                  {Array.from({ length: col.cards }).map((_, i) => (
                    <div
                      key={i}
                      className={`space-y-1.5 rounded-lg p-2.5 ${col.cardBg}`}
                    >
                      <div className="h-2 rounded bg-zinc-300 dark:bg-zinc-600" />
                      <div className="h-2 w-2/3 rounded bg-zinc-300 dark:bg-zinc-600" />
                      <div className="flex gap-1 pt-0.5">
                        <div className="h-4 w-10 rounded-full bg-zinc-300 dark:bg-zinc-600" />
                        <div className="h-4 w-8 rounded-full bg-zinc-300 dark:bg-zinc-600" />
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">
                Structure
              </p>
              <h2 className="mb-4 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                Built around how you actually think
              </h2>
              <p className="mb-5 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                From big-picture life areas down to individual subtasks —
                everything has its place.
              </p>
              <div className="space-y-2">
                {[
                  {
                    icon: LuFolderOpen,
                    label: "Contexts",
                    desc: "Separate areas of your life — Work, Side project, Personal",
                  },
                  {
                    icon: LuLayoutDashboard,
                    label: "Projects",
                    desc: "Meaningful units of work within each context",
                  },
                  {
                    icon: LuListChecks,
                    label: "Tasks & Subtasks",
                    desc: "Actionable items with status, priority, type, and due dates",
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.label}
                      className="flex items-start gap-3 rounded-xl border border-zinc-200 bg-white p-3 dark:border-zinc-700 dark:bg-zinc-950"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                          {item.label}
                        </p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURE 3: Ideas ── */}
      <section className="bg-white py-20 dark:bg-zinc-950">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid items-center gap-12 md:grid-cols-[45%_55%]">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-amber-500">
                Ideas Board
              </p>
              <h2 className="mb-4 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                Capture now, organize later
              </h2>
              <ul className="space-y-3">
                {[
                  "Dedicated inbox for ideas — no need to fit them anywhere yet",
                  "Convert an idea to a Context or Project with one click",
                  "Nothing gets lost between \"I should do that\" and actually doing it",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-zinc-600 dark:text-zinc-400"
                  >
                    <LuCheck className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* ─────────────────────────────────────────────────────────────
                SCREENSHOT SLOT — Ideas board
                Replace this block with:
                <img
                  src="/screenshots/ideas.png"
                  alt="Ideas board"
                  className="rounded-2xl border border-zinc-200 shadow-xl dark:border-zinc-800"
                />

                AI IMAGE PROMPT (for a stylized mockup alternative):
                "Clean UI mockup of an ideas capture board. A 2x2 grid of cards
                on a white background. Each card has a small yellow lightbulb icon
                in the top-left, a short bold title, and 1-2 lines of description
                text. Cards have subtle colored left borders (blue, amber, violet,
                emerald). Minimal flat design, light mode, Tailwind CSS aesthetic,
                no shadows."
                ───────────────────────────────────────────────────────────── */}
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  title: "Redesign portfolio",
                  desc: "Update case studies and refresh the layout",
                  border: "border-l-blue-400",
                },
                {
                  title: "Learn Rust",
                  desc: "Go through the Rust book, start with a small CLI",
                  border: "border-l-amber-400",
                },
                {
                  title: "Newsletter",
                  desc: "Weekly roundup of articles and interesting tools",
                  border: "border-l-violet-400",
                },
                {
                  title: "Home automation",
                  desc: "Smart lights in the office using Home Assistant",
                  border: "border-l-emerald-400",
                },
              ].map((card) => (
                <div
                  key={card.title}
                  className={`rounded-xl border border-zinc-200 border-l-4 bg-white p-3.5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 ${card.border}`}
                >
                  <LuLightbulb className="mb-2 h-4 w-4 text-amber-400" />
                  <p className="mb-1 text-xs font-semibold text-zinc-900 dark:text-zinc-50">
                    {card.title}
                  </p>
                  <p className="text-[11px] leading-relaxed text-zinc-500 dark:text-zinc-400">
                    {card.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FREE BANNER ── */}
      <section className="bg-blue-600 py-20">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
            100% free. No catch.
          </h2>
          <p className="mb-8 text-lg text-blue-100">
            No plans. No paywalls. No credit card. Just sign in and start
            organizing.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-semibold text-blue-600 shadow-lg transition-all hover:bg-blue-50"
          >
            Start for Free
            <LuArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ── PWA ── */}
      <section className="bg-zinc-950 py-20">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-900">
            <LuSmartphone className="h-6 w-6 text-zinc-400" />
          </div>
          <h2 className="mb-3 text-2xl font-bold text-white">
            Works everywhere
          </h2>
          <p className="mx-auto max-w-sm text-sm leading-relaxed text-zinc-400">
            FolioGTD is a Progressive Web App. Install it like a native app —
            no App Store required.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {["iOS", "Android", "macOS", "Windows"].map((platform) => (
              <span
                key={platform}
                className="rounded-full border border-zinc-700 bg-zinc-900 px-4 py-1.5 text-xs font-medium text-zinc-400"
              >
                {platform}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-zinc-800 bg-zinc-950 py-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <img
              src="/icon-192x192.png"
              alt="FolioGTD"
              className="h-6 w-6 rounded-md"
            />
            <span className="text-sm font-semibold text-zinc-400">
              FolioGTD
            </span>
          </div>
          <Link
            href="/login"
            className="text-sm text-zinc-500 transition-colors hover:text-zinc-300"
          >
            Sign In →
          </Link>
        </div>
      </footer>
    </div>
  );
}
