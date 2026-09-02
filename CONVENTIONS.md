# CONVENTIONS.md — askai

> How this codebase is written. **Read this before writing or changing any code**, then match the
> pattern you find here. This file describes what the code *actually does today*, extracted from the
> source — not aspirations.
>
> Companion file: `DESIGN.md` covers visual decisions (palette, typography, spacing, layout).
> This file covers structural decisions (data flow, module shape, naming, patterns).
>
> **Rule of use:** before adding a feature, find the closest existing example in the "Recipes"
> section, open the file it names, and follow it. Do not introduce a second way to do something that
> already has a way.

---

## 1. What the app is

An AI meeting app. You create **agents** (a name + system instructions), schedule **meetings** with
an agent, join a live video call where the agent participates as a real-time voice participant, and
afterwards get a transcript, an AI summary, a recording, and a chat you can ask about the meeting.

Billing is a free tier (`MAX_FREE_AGENTS = 1`, `MAX_FREE_MEETINGS = 3`) with paid plans via Polar.

## 2. Stack

| Concern | Library | Notes |
|---|---|---|
| Framework | Next.js 15 App Router, React 19 | Server Components by default |
| API | tRPC v11 | `src/trpc/` |
| Server state | TanStack Query v5 | Always *through* tRPC, never `fetch` in a component |
| Database | Neon serverless Postgres | `@neondatabase/serverless` |
| ORM | Drizzle | `src/db/schema.ts` is the single schema file |
| Auth | better-auth | email/password + GitHub + Google |
| Billing | Polar | `@polar-sh/better-auth` plugin, `checkout` + `portal` |
| Video | Stream Video | `@stream-io/video-react-sdk`, `@stream-io/node-sdk` |
| Chat | Stream Chat | `stream-chat-react` |
| AI | OpenAI `gpt-4o` | realtime in-call; chat completions for post-meeting Q&A |
| Background jobs | Inngest | `src/inngest/` |
| URL state | nuqs | filters/pagination live in the query string |
| Forms | react-hook-form + zod | via `@hookform/resolvers/zod` |
| UI primitives | shadcn/ui (new-york, neutral) | 46 components in `src/components/ui/` |
| Icons | lucide-react | `react-icons` only for brand marks (Google/GitHub) |
| Toasts | sonner | `toast.error()` / `toast.success()` |
| Styling | Tailwind v4 | CSS-first config in `src/app/globals.css`, no `tailwind.config` |

## 3. Directory layout

```
src/
├── app/                        # routes only — thin, no business logic
│   ├── (auth)/                 # route group: sign-in, sign-up
│   ├── (dashboard)/            # route group: sidebar + navbar shell
│   ├── call/                   # full-screen, outside the dashboard shell
│   └── api/                    # auth, trpc, inngest, webhook handlers
├── components/                 # app-wide shared components
│   └── ui/                     # shadcn primitives — DO NOT hand-edit
├── db/                         # drizzle client + schema
├── hooks/                      # app-wide hooks
├── inngest/                    # background job client + functions
├── lib/                        # third-party clients and helpers
├── modules/<feature>/          # ALL feature code lives here
└── trpc/                       # tRPC wiring
```

### The module pattern (this is the core convention)

Every feature is a folder under `src/modules/`. Existing ones: `agents`, `meetings`, `call`, `auth`,
`dashboard`, `home`, `premium`. A full-featured module looks like:

```
modules/<feature>/
├── server/
│   ├── procedure.ts        # the tRPC router for this feature
│   └── schemas.ts          # zod input schemas  (agents/ puts schemas.ts at module root)
├── types.ts                # types inferred from the router + local enums
├── params.ts               # nuqs SERVER-side search param loader
├── hooks/
│   └── use-<feature>-filters.ts   # nuqs CLIENT-side filter hook
└── ui/
    ├── views/              # one per route — owns data fetching
    └── components/         # everything else for this feature
```

**Rules:**
- A module never imports from another module's `server/`. Cross-module UI imports are fine and do
  happen (e.g. `meeting-form.tsx` imports `NewAgentDialogue` from the agents module).
- Anything used by two or more modules moves to `src/components/` or `src/hooks/`.
- Note the inconsistency: `agents/schemas.ts` sits at the module root, `meetings/server/schemas.ts`
  sits under `server/`. **New modules: put it in `server/schemas.ts`.**

## 4. Naming

| Thing | Convention | Example |
|---|---|---|
| Files | kebab-case, always | `agent-id-view-header.tsx` |
| Components | PascalCase, **named exports** | `export const AgentForm = ...` |
| Pages | `const Page = ...; export default Page` | required by Next |
| Layouts | `const Layout = ...; export default Layout` | |
| Views | `<Feature>View` / `<Feature>IdView` | `MeetingIdView` |
| View states | `<Name>Loading`, `<Name>Error` | exported from the *same* file as the view |
| Props interface | `Props` if local, `<Name>Props` if it could collide | both are in use |
| tRPC routers | `<feature>Router` | `agentsRouter` |
| Inferred types | `<Feature>GetMany`, `<Feature>GetOne` | `MeetingGetOne` |
| Zod schemas | `<feature>InsertSchema`, `<feature>UpdateSchema` | `agentsInsertSchema` |
| Filter hooks | `use<Feature>Filters` | `useMeetingsFilters` |

**Known spelling quirk, kept for consistency:** dialog wrapper files are spelled `dialogue`
(`new-agent-dialogue.tsx`, `responsive-dialogue.tsx`). Match it; don't half-migrate.

## 5. Data flow

### The one and only path

```
Component → useTRPC() → TanStack Query → tRPC route handler → procedure → Drizzle → Neon
```

Never call `fetch` for internal data. Never query the DB from a component.

### Server Components prefetch, Client Components consume

Every data-backed page follows this exact shape (`app/(dashboard)/agents/page.tsx`):

1. `await loadSearchParams(searchParams)` — if the route has filters
2. `auth.api.getSession({ headers: await headers() })` → `redirect("/sign-in")` if absent
3. `getQueryClient()` then `void queryClient.prefetchQuery(trpc.x.y.queryOptions({...}))`
   — note `void`, deliberately not awaited
4. Render `<HydrationBoundary state={dehydrate(queryClient)}>` wrapping
   `<Suspense fallback={<XLoading/>}>` wrapping `<ErrorBoundary fallback={<XError/>}>`

The view inside then uses **`useSuspenseQuery`** — never `useQuery` — so the prefetched data is read
synchronously and Suspense/ErrorBoundary handle the states.

```tsx
// in a view, for prefetched data:
const { data } = useSuspenseQuery(trpc.agents.getMany.queryOptions({ ...filters }));
```

Use plain **`useQuery`** only for data that was *not* prefetched and is genuinely optional —
secondary dropdown/lookup data (`agent-id-filter.tsx`, `dashboard-trial.tsx`, `transcript.tsx`).

### Mutations

Always `useMutation(trpc.x.y.mutationOptions({ ... }))`, with:
- `onSuccess`: `await queryClient.invalidateQueries(trpc.x.getMany.queryOptions({}))`, plus
  `trpc.x.getOne.queryOptions({ id })` when editing one, plus
  **`trpc.premium.getFreeUsage.queryOptions()` whenever a create/delete changes a quota count**
- `onError`: `toast.error(error.message || "<fallback>")`, and for quota errors
  `if (error.data?.code === "FORBIDDEN") router.push("/upgrade")`
- Fire the mutation with `.mutate()` from forms; use `.mutateAsync()` only when you need to await it
  (and then wrap it in try/catch)

### tRPC procedures

Three levels, defined in `src/trpc/init.ts`:

| Procedure | Use for |
|---|---|
| `baseProcedure` | nothing currently — public data only |
| `protectedProcedure` | **the default.** Adds `ctx.auth.user` |
| `premiumProcedure("agents" \| "meetings")` | creates that count against the free tier |

Standard procedure body:

```ts
export const xRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const [row] = await db.select().from(x)
        .where(and(eq(x.id, input.id), eq(x.userId, ctx.auth.user.id)));  // ALWAYS scope to user
      if (!row) throw new TRPCError({ code: "NOT_FOUND", message: "X not found" });
      return row;
    }),
});
```

**Non-negotiable:** every query and mutation is scoped with `eq(table.userId, ctx.auth.user.id)`
inside the `and(...)`. Missing rows throw `TRPCError` `NOT_FOUND`, never return `null`.

List procedures take `{ page, pageSize, search }` (+ feature filters), use
`ilike(table.name, '%' + search + '%')`, order by `desc(createdAt), desc(id)`, run a second
`count()` query, and return `{ items, total, totalPages }`.

### Types come from the router, never hand-written

```ts
// modules/<feature>/types.ts
export type XGetMany = inferRouterOutputs<AppRouter>["x"]["getMany"]["items"];
export type XGetOne  = inferRouterOutputs<AppRouter>["x"]["getOne"];
```

Never redeclare a shape the router already returns.

## 6. URL state (nuqs)

Filters and pagination live in the query string, so list views are shareable and back-button-correct.
Each feature declares the parser set **twice** — server and client — and they must stay in sync:

- `modules/<f>/params.ts` — `parseAs*` from `nuqs/server` + `createLoader` → used by the page
- `modules/<f>/hooks/use-<f>-filters.ts` — the same parsers from `nuqs` + `useQueryStates` → used by
  components

Always `.withDefault(...).withOptions({ clearOnDefault: true })` so defaults stay out of the URL.
`NuqsAdapter` is mounted in `app/(dashboard)/layout.tsx`.

## 7. Forms

`react-hook-form` + `zodResolver` + the shadcn `<Form>` primitives. One form component serves both
create and edit, switched on `initialValues`:

```tsx
interface XFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialValues?: XGetOne;
}
const IsEdit = !!initialValues?.id;
const isPending = createX.isPending || updateX.isPending;
```

Submit button reads `{IsEdit ? "Update" : "Create"}`; both buttons take `disabled={isPending}`.
Cancel renders only `{onCancel && ...}`. Validation messages live in the zod schema, not the JSX.

## 8. Dialogs

Never use `<Dialog>` directly in feature code. Use **`<ResponsiveDialog>`**
(`src/components/responsive-dialogue.tsx`) — it renders a `Dialog` on desktop and a `Drawer` on
mobile via `useIsMobile()`.

Each form gets two thin wrappers that own only the copy:
`new-<x>-dialogue.tsx` and `update-<x>-dialogue.tsx`. Open state is `useState` in the parent,
passed down as `open` / `onOpenChange`.

For confirmations use the **`useConfirm(title, description)`** hook:

```tsx
const [RemoveConfirmation, confirmRemove] = useConfirm("Are you sure?", "This will remove ...");
const handleRemove = async () => {
  const ok = await confirmRemove();
  if (!ok) return;
  await removeX.mutateAsync({ id });
};
// render <RemoveConfirmation /> at the top of the returned tree
```

## 9. View / component conventions

- Views own data fetching. Components take props and stay dumb.
- Every view file also exports `<Name>Loading` and `<Name>Error` built from the shared
  `<LoadingState>` / `<ErrorState>` components. Pages wire them into Suspense/ErrorBoundary.
- Empty results render `<EmptyState title description image?>`; illustrations live in `public/`.
- Detail pages start with a `<X>IdViewHeader` — breadcrumb on the left, `MoreVerticalIcon` dropdown
  (Edit / Delete) on the right, with `<DropdownMenu modal={false}>` (without it the page becomes
  unclickable after the dialog closes — see the comments in those files).
- List pages: `<X>ListHeader` (title + "New" button + filter row in a horizontal `ScrollArea`),
  then the view with `<DataTable>` + `<DataPagination>`.
- `"use client"` goes only on files that need it: views, interactive components, anything using
  hooks. Pages and layouts stay server components.

## 10. Styling

Read `DESIGN.md` first. In short:

- Tailwind utility classes only. No CSS modules, no styled-components, no inline `style` except the
  CSS-variable trick in `components/ui/sonner.tsx`.
- **Use design tokens, not raw colors.** `bg-background`, `bg-card`, `text-muted-foreground`,
  `border-border`, `text-primary`, `text-destructive`. Not `bg-white`, not `text-blue-700`.
  Meeting status uses the `--status-*` tokens; see DESIGN.md.
- Merge classes with `cn()` from `@/lib/utils`. Multi-variant components use `cva` (see
  `pricing-card.tsx`).
- Keep every class on **one line**. A newline inside a `className` string splits the class and
  silently breaks it — this has already happened in `completed-state.tsx`.
- Spacing comes from the 4px scale. No new arbitrary `[13px]` values.

## 11. Third-party clients

All singletons live in `src/lib/`, are server-only, and read config from `process.env`:
`auth.ts`, `polar.ts`, `stream-chat.ts`, `stream-video.ts`, `db/index.ts`.
The browser-side counterpart is `lib/auth-client.ts` (`authClient.useSession()`, `signIn`, `signOut`,
`customer.portal()`, `checkout()`).

Env vars in use: `DATABASE_URL`, `GITHUB_CLIENT_ID/SECRET`, `GOOGLE_CLIENT_ID/SECRET`,
`OPENAI_API_KEY`, `POLAR_ACCESS_TOKEN`, `STREAM_VIDEO_SECRET_KEY`, `STREAM_CHAT_SECRET_KEY`,
`INNGEST_EVENT_KEY`, `INNGEST_SIGNING_KEY`, `NEXT_PUBLIC_APP_URL`,
`NEXT_PUBLIC_STREAM_VIDEO_API_KEY`, `NEXT_PUBLIC_STREAM_CHAT_API_KEY`.
Only `NEXT_PUBLIC_*` may be referenced from client components.

## 12. Async work

Long-running work is **not** done in a request. The Stream webhook
(`app/api/webhook/route.ts`) sends an Inngest event; the function in `src/inngest/functions.ts` does
the work in discrete `step.run(...)` blocks. Add new background work as steps there, never inline in
a route handler.

Meeting lifecycle, for reference:
`created` → `upcoming` → (`call.session_started`) `active` → (`call.session_ended`) `processing`
→ (transcript ready → Inngest summarizes) `completed`. `cancelled` is set by the user.

## 13. Routing

- Absolute paths **always**: `router.push("/upgrade")`, `<Link href="/meetings">`.
  A missing leading slash silently produces a relative navigation and a 404. Same for
  `next/image`: `<Image src="/logo.svg">`.
- Auth gate is per-page, at the top of every server page component. There is no middleware.

## 14. Known deviations

Documented so they are recognised as debt, not copied:

- `next.config.ts` sets `typescript.ignoreBuildErrors` and `eslint.ignoreDuringBuilds` to `true`.
  This is why typos in class names and dead code survive. The only real type errors are in the
  **unused** `src/components/ui/chart.tsx` (recharts v3 vs a shadcn file written for v2).
- `createTRPCContext` in `src/trpc/init.ts` still returns the scaffold `{ userId: "user_123" }`.
  It is unused — real identity comes from `protectedProcedure`.
- `agents.getOne` has its `userId` check written as a **dangling statement after** the `.where(...)`,
  so it does not scope to the user. Any signed-in user can read any agent by id. Needs fixing.
- `meetings.getMany` selects `meetingCount: sql<number>\`5\`` — a hardcoded placeholder.
- No dark mode: there is no `ThemeProvider`, so the `.dark` block in `globals.css` is unreachable.
  Do not write `dark:` variants in feature code until that is wired up.

---

## 15. Recipes — copy these

| To do this | Follow this file |
|---|---|
| Add a list page | `app/(dashboard)/agents/page.tsx` + `modules/agents/ui/views/agents-view.tsx` |
| Add a detail page | `app/(dashboard)/meetings/[meetingId]/page.tsx` + `meeting-id-view.tsx` |
| Add a tRPC query | `agentsRouter.getOne` in `modules/agents/server/procedure.ts` |
| Add a paginated list query | `agentsRouter.getMany` (same file) |
| Add a mutation | `agentsRouter.update` (same file) |
| Add a quota-limited create | `agentsRouter.create` — uses `premiumProcedure` |
| Add a form | `modules/agents/ui/components/agent-form.tsx` |
| Add a dialog | `modules/agents/ui/components/new-agent-dialogue.tsx` |
| Add a confirmation | `modules/agents/ui/views/agent-id-view.tsx` + `hooks/use-confirm.tsx` |
| Add a URL filter | `modules/meetings/params.ts` + `hooks/use-meetings-filters.ts` |
| Add a searchable select | `modules/meetings/ui/components/agent-id-filter.tsx` |
| Add a table column | `modules/meetings/ui/components/columns.tsx` |
| Add a background job | `src/inngest/functions.ts` |

---

## Change log

| Date | Change | Reason |
|---|---|---|
| 2026-09-02 | Initial extraction from the existing codebase | Baseline of the patterns actually in use, so new code matches instead of drifting. |
