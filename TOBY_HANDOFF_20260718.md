# TasteLog Phase 1 Handoff — 2026-07-18

> 새 Toby 창과 Hank 구현 창에서 T-107 Visit editor를 안전하게 이어가기 위한 인계 문서입니다. T-107은 Owner/Toby 승인 전 시작하지 않습니다. 기존 `TOBY_HANDOFF_20260715.md`, `TOBY_HANDOFF_20260717.md`는 이력으로 보존합니다.

## 1. Project checkpoint

- Project: **TasteLog** Phase 1 (working Korean name: 다시갈집)
- GitHub: `https://github.com/tonykks/tastelog` (Private)
- Branch: `main`
- Application checkpoint: `57a70115014d380e413f9b834d4391e214423972` — `feat: complete restaurant CRUD`
- 이 checkpoint는 `origin/main`에 push 완료됐으며 local `main`과 동일합니다.
- Submission target: **2026-07-18**
- T-100~T-106: **DONE — 재수행 금지**
- 다음 task: **T-107 Visit editor** — Status `BACKLOG`, Primary **Hank**, Reviewer **Gini**
- T-107은 자동 시작하지 않습니다. Owner/Toby의 별도 승인이 필요합니다.

## 2. Completed implementation state

### Supabase / database

- Project: `tastelog-phase1` (ref documented in prior handoff; do not re-link without approval)
- Remote migrations applied (local = remote):
  1. `20260715000001_initial_schema.sql`
  2. `20260715000002_rls_policies.sql`
  3. `20260717000003_harden_set_updated_at_search_path.sql`
- Public tables: 5 — `profiles`, `places`, `user_restaurants`, `visits`, `menu_reviews`
- RLS enabled on all 5 tables; 16 policies
- Security Advisor: **No issues found**
- T-105·T-106 did **not** change migrations, schema, RLS, or package files

### Auth (T-104)

- Email/password sign-up, email confirmation, login, refresh session persistence, local-scope logout
- Safe Korean error messages; publishable key only in frontend

### Restaurant CRUD (T-105·T-106)

- Read/Create/Update/Delete for owner-scoped `user_restaurants`
- Name-only create (`display_name`); nullable `place_id` not required
- Owner-scoped SELECT/INSERT/UPDATE/DELETE using session `user_id` + restaurant `id`
- Stale-request / stale-mutation guards and user-keyed remount
- Hank final `Approve` for both T-105 and T-106 (T-106 after Low edit-trigger fix)
- Owner manual CRUD verification passed

### Current Owner test data

- One restaurant row remains: **산방밀면**
- Temporary delete-test row was removed; do not recreate or mutate Owner rows without Owner action

## 3. Next task boundary — T-107 Visit editor

- Design from actual schema plus `docs/PHASE1_REQUIREMENTS.md` and `docs/DATABASE_AND_RLS.md`
- DB supports restaurant 1:N visits; Phase 1 UI may center on one current/representative visit per D-005
- Confirm exact fields, nullability, rating (NULL or 1–5), and revisit validation from migration and requirements — do not invent columns
- Do **not** reimplement restaurant CRUD or modify migrations
- Menu review CRUD is **T-108** — keep out of T-107
- Agent must not create/update/delete DB rows for verification; Owner does browser verification
- Do not mark DONE before Gini review and Owner confirmation

## 4. Collaboration and submission notes

| Role | Responsibility |
|---|---|
| Toby | Coordination, approvals, Owner verification facilitation, final submission docs |
| Gini | T-105·T-106 implementer; T-107 reviewer |
| Hank | T-105·T-106 reviewer; T-107 Primary Implementer |
| Any | Independent review at T-111 security/regression |

- Update `TASK_BOARD.md`, `WORK_LOG.md`, and the assigned Agent chat per task
- T-112 will consolidate README, AI collaboration history, decisions/reviews/fixes, error resolution, test evidence, screenshots, URLs
- Schedule is tight (target 2026-07-18): prioritize submission-required scope; no feature expansion

## 5. Required reading order

1. `AGENTS.md`
2. `PROJECT_CONTEXT.md`
3. `docs/PHASE1_REQUIREMENTS.md`
4. `docs/DATABASE_AND_RLS.md`
5. `AGENT_ROLES.md`
6. `WORKFLOW.md`
7. `TASK_BOARD.md`
8. `DECISION_LOG.md`
9. `WORK_LOG.md` (latest entries)
10. `docs/TEST_AND_SUBMISSION.md`
11. `docs/chat/CHAT_PROTOCOL.md`
12. All current Agent chat files
13. This document — `TOBY_HANDOFF_20260718.md`

## 6. Environment and security

Required variable **names** only (values never in Git/docs/chat):

```text
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
```

- `.env.local` is Git-ignored; each PC keeps its own copy
- Never record real URL values, keys, passwords, tokens, or connection strings
- Frontend uses publishable key only — never `service_role`
- Exclude `.env.local`, `dist/`, `node_modules/` from commits
- Supabase CLI, DB mutation, Git push, and Vercel stay behind Owner/Toby approval gates

## 7. Next gate

1. New Agents read this handoff and the required reading order.
2. Await Owner/Toby approval before starting T-107.
3. Hank implements T-107; Gini reviews; Owner verifies in the browser.
4. Do not rerun T-100~T-106 or alter applied migrations 001·002·003.

— Gini
