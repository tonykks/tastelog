# Toby Handoff — TasteLog Phase 1

- Date: 2026-07-15
- Owner: Tony Kim
- Toby: ChatGPT Work — planning, coordination, approval, final quality review
- Gini: Cursor Agent — primary React/client implementation
- Hank: Codex in Cursor — database, security, complex implementation/review
- Any: Antigravity CLI — independent second opinion and final review

## Current outcome

The collaboration framework and foundation work are complete through T-103.

| Task | Status | Result |
|---|---|---|
| T-100 | DONE | Repository and assignment inventory |
| T-101 | DONE | Vite React foundation; build/lint verified |
| T-102 | DONE | Initial Supabase schema migration created and independently approved |
| T-103 | DONE | RLS policy migration and security test plan created and independently approved |

Overall Phase 1 working-product progress is approximately 35–40%. Planning/database foundation progress is much higher, but Supabase has not been connected and application CRUD is not implemented yet.

## Approved migration artifacts

- `supabase/migrations/20260715000001_initial_schema.sql`
- `supabase/migrations/20260715000002_rls_policies.sql`

Both migrations passed static and independent review.

Important: neither migration has been executed.

## Final database/security decisions

- Five tables: `profiles`, `places`, `user_restaurants`, `visits`, `menu_reviews`
- RLS is enabled on all five tables in T-102.
- `profiles`: authenticated own-row SELECT, INSERT, UPDATE; no direct DELETE policy.
- `places`: authenticated SELECT only; no browser writes.
- `user_restaurants`, `visits`, `menu_reviews`: separate owner SELECT/INSERT/UPDATE/DELETE policies using `((select auth.uid()) = user_id)`.
- Parent/owner integrity is enforced by T-102 composite UNIQUE and FOREIGN KEY constraints, not duplicate RLS `EXISTS` subqueries.
- `anon` has no policies and is default-denied.
- `service_role` must never be used or exposed in browser/client code.
- Optional menu-to-visit deletion uses `ON DELETE SET NULL (visit_id)`.
- Final security test matrix is RLS-01 through RLS-14.

## External state and forbidden assumptions

As of this handoff:

- no Supabase project has been created for TasteLog;
- no Supabase CLI login/link has been performed;
- no SQL or security test has been executed;
- `@supabase/supabase-js` has not been installed;
- no local secret-bearing `.env.local` has been created;
- no Git commit, remote, push, GitHub repository, Vercel project, or deployment exists for this project;
- T-104 and later tasks have not started.

Do not assume any of the above has happened without fresh Owner evidence.

## Next task

T-104 — Supabase client + Auth

Acceptance target:

- Supabase project creation and local project link;
- ordered migration application after dry-run and explicit Owner approval;
- React Supabase client configuration;
- local `.env.local` with only Project URL and publishable key;
- sign-up, login, logout, session persistence, and safe error states;
- no secret/service-role key in browser, source, chat, screenshots, or Markdown.

## Required next sequence

1. Owner creates a new Supabase Free project named `tastelog-phase1` and privately stores the generated database password.
2. Do not create tables or run SQL manually in the Dashboard.
3. Toby prepares a file-based Gini preflight/link prompt.
4. Gini uses the official CLI migration workflow: authenticate, link the new project, inspect pending migrations with dry-run, then stop for Owner approval.
5. Only after explicit Owner approval may the two migrations be pushed in order.
6. Verify tables, policies, migration history, and security/performance advisors.
7. Install and configure the React Supabase client and implement Auth within T-104 scope.

## Secret handling

- Owner enters passwords and authorization only in the official browser/terminal prompt.
- Never paste database passwords, access tokens, secret keys, service-role keys, or connection strings into ChatGPT, Agent chat, Markdown, screenshots, or source control.
- Browser code may use only `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`.

## Collaboration protocol

- Long Agent instructions are delivered as files under `docs/prompts/`.
- The terminal/Agent chat receives only a short instruction to read the prompt file.
- Each Agent writes only its own chat file unless explicitly authorized.
- External mutations require explicit Owner approval.
- One primary implementer and one reviewer per task.
- Do not reopen completed T-102/T-103 decisions unless new evidence appears.

## Files to read in a new Toby conversation

At minimum upload/read:

1. `TOBY_OPERATING_GUIDE.md`
2. this handoff file
3. `TASK_BOARD.md`
4. `DECISION_LOG.md`
5. latest `WORK_LOG.md`
6. latest `docs/chat/gini-chat.md`
7. latest `docs/chat/hank-chat.md`
8. latest `docs/chat/any-chat.md`

Suggested opening message:

> Toby, read the operating guide, the 2026-07-15 handoff, the current task board/decision/work logs, and the latest Agent chat files. Resume from T-104 without redoing T-100 through T-103.

— Toby

