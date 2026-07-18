# Gini Chat

## Gini → Owner, Toby, Hank, Any

- Date: 2026-07-18
- Related: T-107 Visit editor GitHub checkpoint
- Status: **T-107 DONE — checkpoint commit/push in progress per Owner/Toby approval**
- Primary: Hank · Reviewer: Gini

### Checkpoint

- Message: `feat: complete visit editor`
- Includes approved T-107 source (`visitService`, `VisitEditor`, `App.jsx`/`App.css`, `RestaurantList`) and collaboration docs.
- Excludes `.env.local`, `dist/`, `node_modules/`, secrets; migrations 001·002·003 and package files unchanged.
- T-108 remains `BACKLOG` and is not started. No Vercel/DB mutation.

— Gini

---

## Gini → Owner, Toby, Hank, Any

- Date: 2026-07-18
- Related: T-107 card-summary error isolation narrow re-review
- Status: **REVIEW maintained — narrow re-review complete**
- Primary: Hank · Reviewer: Gini
- Review model: **Auto** (Cursor Agent; Composer-powered)

### 1. Final verdict

**Approve**

### 2. Two error-path results

**Restaurant list failure** (`getRestaurants` error): still sets `restaurantError`, clears `visitSummaries`, stops before summary fetch, and keeps the existing full-list error/retry UI.

**List success + summary-only failure**: after restaurants load, `setVisitSummaries({})` when `summaryResult.error` is set, and `setRestaurantError(null)` explicitly. Summary failure is not assigned to `restaurantError` and is not rendered; `toSafeVisitMessage` remains the only service-side mapping (unused on this UI path for summary fail).

### 3. Restaurant list remains visible — basis

With `restaurantError === null` and `restaurants` populated, `RestaurantList` skips the blocking error branch and renders cards plus edit / visit / delete controls. Missing `visitSummaries[id]` only omits rating/revisit labels (`status === 'visited' && visitSummaries[id]` guard).

### 4. Hank lint/build/diff-check

Accepted as reported for this correction: lint pass, build pass (Vite 8.1.4), `git diff --check` pass. Narrow re-review did not re-run full lint/build; migration/`package.json`/`package-lock.json` working-tree diff empty.

### 5. Out-of-scope unchanged

- Success summary path still uses ordered batch query + first-per-restaurant map when `summaryResult.error` is falsy; representative rule not altered in this fix
- `VisitEditor` save / `handleVisitSaved` local summary update path unchanged by this isolation change
- No migration · package · T-108+ · Agent DB data · Git push · Vercel
- Source not edited by Gini; T-107 left `REVIEW`; no commit/push

### 6. Review model

**Auto** (Cursor Agent; Composer-powered)

— Gini

---

## Gini → Owner, Toby, Hank, Any

- Date: 2026-07-18
- Related: T-107 card representative summary narrow re-review
- Status: **REVIEW maintained — narrow re-review complete**
- Primary: Hank · Reviewer: Gini
- Review model: **Auto** (Cursor Agent; Composer-powered)

### 1. Final verdict

**Approve with changes**

### 2. Passed items

- `getRepresentativeVisitSummaries({ userId, restaurantIds })` scopes with `.eq('user_id', userId)` and `.in('restaurant_id', restaurantIds)`; empty id list short-circuits; other users’ visits cannot enter the map (plus existing RLS).
- Representative rule unchanged and applied to the batch query: `visited_at` desc nulls last → `updated_at` desc → `id` desc; first row per `restaurant_id` kept.
- Successful `VisitEditor` save calls `onSaved(restaurant, visit)`; `handleVisitSaved` merges only that restaurant’s status/updated_at and updates only that id in `visitSummaries` (or removes it when unvisited) — no full restaurant list refetch.
- Editor mount/save request-id guards still gate `onSaved`; parent keyed-session remount clears summaries with the screen.
- Visited cards show `대표 별점 N` only when `overall_rating !== null`, always show `재방문 있음/없음`; `status !== 'visited'` never renders the summary block (historical visit map entries stay hidden).
- No rating-star input UI (T-110), no menu/search/dashboard, no migration/package changes in diff.

### 3. Finding

#### Finding 1 — Summary fetch failure hides the whole restaurant list

- Severity: **Medium**
- Location: `src/App.jsx` `loadRestaurants` (~lines 117–126) + `RestaurantList` error branch
- Actual risk: After a successful restaurant SELECT, if `getRepresentativeVisitSummaries` fails, code still `setRestaurants(nextRestaurants)` but also `setRestaurantError(summaryResult.error)`. `RestaurantList` treats any `errorMessage` as a full-list error screen, so the already-loaded restaurants (and CRUD) disappear behind retry UI. This conflicts with the stated “summary failure must not damage the restaurant list” acceptance.
- Minimal fix: On summary-only failure, keep `restaurants`, set `visitSummaries` to `{}` (or leave prior), leave `restaurantError` null (optional non-blocking summary notice later). Do not map summary errors onto the list-blocking `restaurantError` path. No migration/RPC needed.

### 4. Post-save vs refresh summary

- Post-save: local map update for the saved restaurant only; visited+visit writes summary; unvisited deletes that key — verified in `handleVisitSaved` / `VisitEditor`.
- Refresh: after list load, summaries reload with the same `listRequestIdRef` + mount guards before applying state — verified. Residual gap is Finding 1 (summary error handling).

### 5. Unvisited hide

- Render guard is `restaurant.status === 'visited' && visitSummaries[restaurant.id]`. Unvisited cards never show rating/revisit labels even if a historical visit remains in DB/map until removed on unvisited save.

### 6. lint / build / diff-check acceptance

- Accept Hank’s reported `npm.cmd run lint` pass, `npm.cmd run build` pass, and correction-scoped `git diff --check` pass for this card-summary work.
- Narrow re-review did not re-run full lint/build; migration/`package.json`/`package-lock.json` working-tree diff remains empty.

### 7. Out-of-scope unchanged

- T-108+ / menu / search / dashboard: not present in this correction
- migration · schema · RLS · package: unchanged
- No Agent DB test-data mutation, Git push, or Vercel observed
- Source not edited by Gini; T-107 left `REVIEW`; no commit/push

### 8. Review model

**Auto** (Cursor Agent; Composer-powered)

— Gini

---

## Gini → Owner, Toby, Hank, Any

- Date: 2026-07-18
- Related: T-107 Medium finding narrow re-review
- Status: **REVIEW maintained — narrow re-review complete**
- Primary: Hank · Reviewer: Gini
- Review model: **Auto** (Cursor Agent; Composer-powered)

### Final verdict

**Approve**

### Path 1 — `src/services/visitService.js`

- After successful visit INSERT/UPDATE, if `updateRestaurantVisitStatus` fails, the service returns `{ visit, restaurant: null, error: statusResult.error }` (line 81), preserving the written visit object.
- `statusResult.error` originates from `toSafeVisitMessage`; raw Supabase errors are not returned to the UI.

### Path 2 — `src/components/visits/VisitEditor.jsx`

- On `result.error`, if `result.visit` exists, `setRepresentativeVisit(result.visit)` runs before `setErrorMessage` (lines 78–81).
- `onSaved` is not called on that path, so the editor stays open with the safe error visible.
- Next submit uses `visitId: visited ? representativeVisit?.id : null`, so a preserved id drives UPDATE filtered by `id` + `user_id` + `restaurant_id` rather than a second INSERT.

### Retry UPDATE guarantee

Partial-success → returned visit id stored in `representativeVisit` → subsequent save with `visited === true` passes that id into `saveVisitState` → `visitId` branch runs `.update(...).eq('id', visitId).eq('user_id', userId).eq('restaurant_id', restaurantId)`.

### Scope

- No RPC, transaction, rollback, or automatic deletion added.
- `git diff` against migrations/`package.json`/`package-lock.json`: unchanged.
- No evidence of T-108+, Agent DB test-data mutation, Git push, or Vercel in this correction path.
- Source not modified by Gini; only trailing whitespace removed from this chat file’s Owner-test list lines; T-107 left `REVIEW`.

### `git diff --check`

- Pass after removing trailing whitespace on this file’s Owner-test list lines (Gini chat only; source untouched).

— Gini

---

## Gini → Owner, Toby, Hank, Any

- Date: 2026-07-18
- Related: T-107 Visit editor independent review
- Status: **REVIEW maintained — verdict below**
- Primary: Hank · Reviewer: Gini
- Review model: **Auto** (Cursor Agent; Composer-powered)

### Working-tree preflight (read-only)

- HEAD: `f921d3df6ea768823a521488c629108339db1540` (prior docs handoff; not re-pushed)
- Uncommitted Hank work present: `visitService.js`, `VisitEditor.jsx`, `App.jsx`, `App.css`, `RestaurantList.jsx`, plus `TASK_BOARD.md` / `WORK_LOG.md` / `hank-chat.md`
- T-107 = `REVIEW` on board; T-100~T-106 remain DONE
- No reset/checkout/restore; Hank changes preserved; no commit/push; no source edits by Gini

### 1. Final verdict

**Approve with changes**

### 2. Passed checks

- Owner-scoped `visits` SELECT/INSERT/UPDATE and `user_restaurants.status` UPDATE filter on both `user_id` and `restaurant_id`
- Phase 1 single representative visit UI matches D-005; no menu-review / search / dashboard / restaurant CRUD redesign
- Rating service invariant: empty → null; otherwise integer 1–5 only; safe Korean message; raw Supabase errors not exposed
- Unvisited save updates status only and does **not** delete historical visit rows; returning to visited restores representative values
- VisitEditor mount + load/save request-id guards; parent keeps keyed `session.user.id` remount
- Labels, `type="button"|"submit"`, pending disable, focus-visible CSS present
- Diff scope has no migration/package/Auth redesign; T-108+ UI absent; no Agent DB test-data mutation observed in review

### 3. Findings

#### Finding 1 — First-time visit INSERT then status failure can duplicate on retry

- Severity: **Medium**
- Location: `src/services/visitService.js` (`saveVisitState` after successful visit write); `src/components/visits/VisitEditor.jsx` (`handleSubmit` error path)
- Actual risk: Visit write and status write are non-atomic (accepted boundary). On **first** save (`visitId == null`), if INSERT succeeds and status UPDATE fails, the service returns `{ visit: null, error }` and the editor keeps `representativeVisit == null`. Retry submits another INSERT → duplicate `visits` rows for the same restaurant. Hank’s stated “retry targets the deterministic representative visit” is not met on this path.
- Minimal fix:
  1. After a successful visit write, if status fails, still return the written `visit` with the safe error: `{ visit, restaurant: null, error }`
  2. In the editor error path, if `result.visit` is present, `setRepresentativeVisit(result.visit)` before showing the error so the next save UPDATEs that id
  3. Do not add RPC/migration/rollback for Phase 1

### 4. Representative-visit rule verification

Documented and implemented consistently:

1. `visited_at` descending with nulls last (`nullsFirst: false`)
2. then `updated_at` descending
3. then `id` descending
4. `limit(1)` / `maybeSingle()`

Matches Hank work log / chat and is deterministic for Phase 1 UI.

### 5. Non-atomic visit + restaurant status

- Acceptable for Phase 1 **with Finding 1 fixed** (or explicitly Owner-accepted residual risk if deferred).
- No hidden rollback/delete on status failure — correct.
- Unvisited path only touches `user_restaurants.status` — correct and history-preserving.

### 6. Owner manual test 6 steps — sufficiency

Hank’s `산방밀면`-only six steps are sufficient for acceptance **after** Finding 1 is fixed or accepted:

1. Open visit / empty unvisited copy
2. Save visited + fields → card `방문함`
3. Reopen / edit / refresh persistence
4. Invalid ratings `0`/`6`/`1.5` → Korean validation; cancel keeps prior
5. Unvisited save → card + empty copy; revisit visited restores representative
6. Logout/relogin persistence

Optional stress (not required to block): force/network-fail the status write after first visit INSERT and confirm retry does not create a second visit.

### 7. Out-of-scope confirmation

- T-108+ not implemented in this diff
- migration 001·002·003 / package not in changed set
- No Git commit/push performed by Gini; no Vercel
- No Agent-created test rows as part of this review

### 8. Requested next action

- Hank: apply the minimal Finding 1 fix (or Owner/Toby explicitly defer with recorded residual risk)
- Keep T-107 `REVIEW` until narrow re-review + Owner manual steps
- Do not DONE, commit, or start T-108 without approval

— Gini

---

## Gini → Owner, Toby, Hank, Any

- Date: 2026-07-18
- Related: T-107 handoff document / docs checkpoint
- Status: **Handoff written — no source or task-status change; T-107 remains BACKLOG**
- Next Primary: Hank (T-107 Visit editor) · Reviewer: Gini

### Work

- Created `TOBY_HANDOFF_20260718.md` for new Toby/Hank windows after Restaurant CRUD checkpoint `57a70115014d380e413f9b834d4391e214423972`.
- Preserved `TOBY_HANDOFF_20260715.md` and `TOBY_HANDOFF_20260717.md` unchanged.
- Preserved this Toby instruction in `docs/chat/toby-chat.md`.
- Did **not** change `TASK_BOARD.md`, `WORK_LOG.md`, `DECISION_LOG.md`, source, CSS, package, or migrations.
- T-100~T-106 remain DONE; T-107 remains BACKLOG and was not started.

### Checkpoint commit (approved)

- Message: `docs: hand off T-107 visit editor`
- Scope: new handoff + collaboration chat records only.

— Gini

---

## Gini → Owner, Toby, Hank, Any

- Date: 2026-07-18
- Related: T-106 final acceptance / Restaurant CRUD GitHub checkpoint
- Status: **T-105·T-106 DONE — checkpoint commit/push approved**
- Primary (T-105·T-106): Gini · Reviewer: Hank
- Next Primary: Hank (T-107 Visit editor)

### T-106 closeout

- Hank narrow re-review final verdict: `Approve` (after Low edit-trigger fix).
- Owner manual verification passed for edit enter/cancel/blank validation/UPDATE+updated_at/refresh persistence/name restore, temp-row create, delete confirm+cascade warning/cancel keep/temp-row delete only/refresh persistence/no other-row impact, and edit-mode Edit-trigger removal.
- `TASK_BOARD.md` T-106 → `DONE`; T-107 remains `BACKLOG`.
- Existing `docs/chat/hank-chat.md` and `docs/chat/toby-chat.md` preserved.

### Checkpoint

- Message: `feat: complete restaurant CRUD`
- Includes T-105·T-106 source (`restaurantService`, restaurant components, `App.jsx`/`App.css`) and collaboration docs.
- Excludes `.env.local`, `dist/`, `node_modules/`, secrets; migrations 001·002·003 and package files unchanged.
- Push target: `origin/main`. No force/amend/reset/rebase. T-107 not started.

### Handoff

- Hank: start T-107 Visit editor when Owner/Toby assign. Restaurant CRUD is complete and on `main` after this checkpoint.

— Gini

---

## Gini → Owner, Toby, Hank, Any

- Date: 2026-07-18
- Related: T-106 Hank Low finding correction
- Status: **REVIEW — Low finding fixed; awaiting Hank narrow re-review**
- Primary: Gini · Reviewer: Hank

### Hank finding accepted

- Low: while a row is in edit mode (`editingId === restaurant.id`), hide that card’s `수정` trigger so an unsaved name cannot be silently reset by re-clicking Edit.

### Fix

- In `RestaurantList.jsx`, render the `수정` button only when `editingId !== restaurant.id`.
- Edit mode still uses only the inline form `저장`/`취소`.
- Delete during edit still clears edit state and opens confirmation (unchanged).
- Other rows’ Edit triggers, UPDATE/DELETE services, request guards, and CSS were not changed.
- T-106 remains `REVIEW`; T-107 not started; no DB/migration/package/secret changes.

### Verification

- IDE diagnostics: none
- `npm.cmd run lint`: pass
- `npm.cmd run build`: pass
- `git diff --check`: pass
- `.env.local` ignored; migrations 001·002·003 / package / DB row: unchanged

### Requested action

- Hank: narrow re-review of this single UI collision fix.

— Gini

---

## Gini → Owner, Toby, Hank, Any

- Date: 2026-07-18
- Related: T-105 closeout / T-106 Restaurant Update/Delete
- Status: **T-105 DONE; T-106 REVIEW — implementation and automated checks complete**
- Primary: Gini · Reviewer: Hank

### 1. T-105 DONE 기록

- Hank narrow re-review final verdict: `Approve`.
- Owner manual verification passed: name-only create, immediate list update, refresh persistence.
- `TASK_BOARD.md` T-105 → `DONE`. T-105 source was not refactored further.
- Existing `docs/chat/hank-chat.md` / `docs/chat/toby-chat.md` changes were preserved (not overwritten).

### 2. T-106 update/delete 구현

- Update: each card has `수정` → labeled inline edit form with current name, `저장`/`취소`, form + service trim/blank validation, pending disable, success replaces that list row and re-sorts by `updated_at`.
- Delete: each card has visually distinct `삭제` → confirmation naming the restaurant and warning about related-record cascade; `취소` makes no DB/local change; confirm removes the row; last-row delete returns to empty state.

### 3. Owner-scoped Supabase UPDATE/DELETE

- `updateRestaurant({ userId, restaurantId, displayName })`: service trim/blank; `update` filtered by both `id` and `user_id`; returns selected columns via `.maybeSingle()`.
- `deleteRestaurant({ userId, restaurantId })`: `delete` filtered by both `id` and `user_id`; returns deleted `id`.
- Applied RLS + FK cascade unchanged; no migration/schema/RLS edits; visit/menu UI not added.

### 4. Stale mutation / user-switch safety

- `SignedInScreen key={session.user.id}` remount on user change.
- Mount flag + list/create request ids retained from T-105.
- Per-restaurant mutation request ids + pending map: late UPDATE/DELETE after logout, user switch, unmount, or a newer same-row mutation cannot update state; one row’s pending state cannot mutate another row.

### 5. Files

- Updated: `src/App.jsx`, `src/App.css`, `src/components/restaurants/RestaurantList.jsx`, `src/services/restaurantService.js`
- Records: `TASK_BOARD.md`, `WORK_LOG.md`, `docs/chat/gini-chat.md`

### 6. Automated verification (rechecked)

- IDE diagnostics: none
- `npm.cmd run lint`: pass
- `npm.cmd run build`: pass (Vite 8.1.4)
- Dev smoke: `http://localhost:5173/` HTTP 200
- `git diff --check`: pass
- `.env.local` ignored / not in diff; migrations 001·002·003 unchanged; no package change; Agent made no DB row mutation

### 7. Owner 최소 수동 테스트 (기존 `산방밀면` 사용; Agent는 변경하지 않음)

1. 로그인 → 목록에 `산방밀면` 확인
2. 수정 → 이름 변경 → 저장 → 즉시 반영 + 새로고침 유지
3. 수정 → 취소 → 변경 없음
4. 빈 이름 저장 시도 → validation
5. 삭제 → 취소 → 행 유지
6. 삭제 → 삭제 확인 → 목록에서 제거 (마지막이면 empty state)
7. 로그아웃 유지

### 8. Hank review 요청 범위

- owner-scoped UPDATE/DELETE filters (`user_id` + `id`)
- service trim/blank invariant
- confirmation cancel vs confirm behavior
- per-row pending + stale-result guards
- labels / focus-visible / destructive vs edit distinction
- T-107+ (visit/menu/search) 미침범

### 9. warning·blocker

- Blocker 없음.
- npm `Unknown env config "devdir"` non-blocking.
- Git LF→CRLF notice on existing `docs/chat/hank-chat.md` (not edited by Gini).
- Actual edit/delete persistence requires Owner browser verification.

— Gini

---

## Gini → Owner, Toby, Hank, Any

- Date: 2026-07-18
- Related: T-105 Restaurant Read/Create
- Status: **REVIEW — implementation and automated checks complete**

### Implementation plan

- Replace the authenticated temporary welcome screen with an owner-scoped restaurant list and quick-create form.
- Keep Supabase queries in `restaurantService`; read/insert `user_restaurants` using the signed-in session user's `id`, relying on the applied owner RLS policies.
- Implement name-only create with trim/blank validation, disabled pending submission, list refresh after success, and loading/empty/safe-error states.
- Do not change migrations, schema/RLS, packages, Auth, test data/accounts, or T-106+ features. Validate only with static checks, lint/build, and the existing dev server; Owner performs the actual browser DB create check.

### Reviewer handoff

- Hank: review T-105 source scope, owner-scoped read/insert construction, safe errors, accessibility, and absence of T-106+ behavior after implementation.

### Result

- `restaurantService` lists `user_restaurants` with `user_id = session.user.id`, newest `updated_at` first; it inserts only `user_id` and trimmed `display_name`, so nullable `place_id` is not required. Applied owner RLS remains the access boundary.
- The authenticated screen now provides loading, empty, safe query-error/retry states and a labeled quick-create form that blocks blank and pending duplicate submissions. A successful insert prepends the returned row without manual refresh.
- `npm.cmd run lint`, `npm.cmd run build`, `git diff --check`, and `http://localhost:5173/` smoke (HTTP 200) passed; IDE diagnostics are clear. `.env.local` remains ignored and migrations 001·002·003 are unchanged.
- Owner must manually verify a name-only create, immediate list update, and refresh persistence. No Agent-created test account or database row exists.

### Hank correction result

- Accepted Medium finding: keyed authenticated screen resets prior-user list/error state on a user-id change; mount and request-id guards reject stale SELECT and INSERT completions.
- Accepted Low finding: `createRestaurant()` trims internally and returns `{ restaurant: null, error: '맛집 이름을 입력해 주세요.' }` before any INSERT for a blank normalized value.
- Diagnostics, lint, build, and diff checks pass after the two-file source correction. Request Hank narrow re-review; no migration, DB, package, T-106+, or test-data change is included.

— Gini

---

## Gini → Owner, Toby, Hank, Any

- Date: 2026-07-17
- Related: T-104 final acceptance / D-015 checkpoint
- Status: **T-104 DONE — Owner manual test passed; Hank final Approve**

### Final acceptance

- Owner verified signup, real email confirmation, confirmed login session, logout/login return, refresh persistence, local browser logout, and safe invalid-password message.
- Hank narrow re-review verdict: `Approve`, no blocking or non-blocking findings.
- T-104 is `DONE`; B-002 remains resolved.
- Supabase migrations 001·002·003 are applied; Security Advisor reports `No issues found`.

### Handoff

- New-agent document: `TOBY_HANDOFF_20260717.md`
- Git checkpoint: commit `91f7b5d0047b5f716c85822682cbbcc2a0fc6582` — `feat: complete T-104 Supabase authentication`
- Push complete: local `main` = `origin/main`; working tree clean
- T-100~T-104 must not be rerun.
- T-105 is next but must not start without Owner/Toby approval.

— Gini

---

## Gini → Owner, Toby, Hank, Any

- Date: 2026-07-17
- Related: T-104 Auth review corrections
- Status: **All 3 Low findings fixed — awaiting Hank narrow re-review + Owner manual test**

### Applied findings

1. `App.jsx`: 초기 `getInitialSession()`의 안전한 error를 state에 보존하고, 오류 문장·재시도 안내·새로고침 button을 표시합니다.
2. `authService.js`: `signOut({ scope: 'local' })`로 현재 browser session만 로그아웃합니다.
3. `AuthForm.jsx`: 불완전한 `tablist`/`tab`/`aria-selected`를 제거하고 일반 button + `aria-pressed`로 선택 상태를 표현합니다.

### Verification

- `npm run lint`: pass
- `npm run build`: pass
- Dev smoke: `/` and `/src/main.jsx` HTTP 200; server stopped, port closed
- Secret/service-role scan: no matches in `src` or `dist`
- `.env.local`, migrations, remote DB, test data, Git, T-105+: unchanged

### Requested action

Hank: 위 세 finding에 대한 narrow re-review. Owner: 기존 manual Auth test. T-104는 IN_PROGRESS 유지.

— Gini

---

## Gini → Owner, Toby, Hank, Any

- Date: 2026-07-17
- Related: T-104 Supabase client + Auth implementation
- Status: **Implementation complete — awaiting Owner manual test + Hank review**

### Summary

- Installed `@supabase/supabase-js@2.110.7`
- New: `src/lib/supabase.js` (single client, missing-env detection), `src/services/authService.js` (signUp/signIn/signOut/getInitialSession/onAuthStateChange, safe Korean error mapping), `src/components/auth/AuthForm.jsx` (login/signup tabs, labels, focus, loading/disabled, email-confirm guidance)
- Updated: `src/App.jsx` (env error screen → session loading → AuthForm or signed-in header+logout), `src/App.css` (plain CSS only), `index.html` title, `.env.example` variable name `VITE_SUPABASE_PUBLISHABLE_KEY`
- Verified: lint 0, build 0, dev smoke HTTP 200, `.env.local` git-ignored and absent from `git status`, no `service_role`/secret key in src or dist (only supabase-js internal `sb_secret_` prefix matcher string)
- Not done per scope: test account creation, CRUD, migration edits, Git commit/push, Vercel, T-105+

### Owner manual test order

1. `npm run dev` 후 접속 → Auth 화면 확인
2. 회원가입 → email 확인 안내 또는 즉시 로그인 확인
3. 로그인 실패(틀린 비밀번호) 시 안전한 오류 문장 확인
4. 로그인 성공 → 환영 화면과 email 표시 확인
5. 새로고침 → session 유지 확인
6. 로그아웃 → Auth 화면 복귀 확인

### Requested action

Hank: T-104 Auth code review. Owner: 위 수동 test 후 결과 공유. T-104는 IN_PROGRESS 유지.

— Gini

---

## Gini → Owner, Toby, Hank, Any

- Date: 2026-07-17
- Related: T-104 / D-014 actual push of search_path hardening
- Status: **Applied — Security Advisor WARN cleared; awaiting next Auth/env approval**

### Push result

- Preflight pending: only `20260717000003_harden_set_updated_at_search_path.sql`
- Applied that one migration; no other pending migrations appeared
- Migration history: all three local=remote (`000001`, `000002`, `000003`)
- Function config: `public.set_updated_at()` → `proconfig = {search_path=pg_catalog}`
- Security Advisor (`--type security`): **No issues found** (`function_search_path_mutable` WARN gone)
- Performance Advisor INFO: not modified
- Migration hashes unchanged (001/002 baseline + 003 as before push)
- Docker catalog-cache warning only; remote apply succeeded
- Out of scope not done: `.env`, supabase-js, Auth, test data, Git, T-105+

### Decision needed

Owner/Toby: approve T-104 Auth/env stage (B-002 + client) when ready.

— Gini

---

## Gini → Owner, Toby, Hank, Any

- Date: 2026-07-17
- Related: T-104 / D-010 actual `db push` (approved)
- Status: **Remote migrations applied — awaiting next Owner approval**

### Push result

- Project: `tastelog-phase1` / `xqgrunybnlblaqlzomkv`
- Applied in order: `20260715000001_initial_schema.sql` → `20260715000002_rls_policies.sql`
- Migration history: both local and remote present for `20260715000001`, `20260715000002`
- Migration SHA256: unchanged from baseline
- Warning only: Docker Desktop missing → local migration catalog cache failed; remote apply itself succeeded

### Read-only verification

| Check | Result |
|---|---|
| Public tables (5) | `menu_reviews`, `places`, `profiles`, `user_restaurants`, `visits` |
| RLS enabled | all 5 = true |
| Policies | **16** total — profiles 3, places 1, user_restaurants 4, visits 4, menu_reviews 4 |
| Constraints | PK/FK/CHECK/UNIQUE present incl. owner composite uniques and visit SET NULL FK |
| Indexes | PK/unique + Phase 1 indexes present (13 listed) |
| Security Advisor | WARN: `public.set_updated_at` Function Search Path Mutable |
| Performance Advisor | INFO: unindexed `user_restaurants.place_id` FK; several unused indexes (expected on empty DB) |

### Not done (out of approval scope)

seed/test data, `.env.local`, `@supabase/supabase-js`, Auth UI, Git commit/push, T-105+.

### Decision needed

Owner/Toby: next stage for T-104 (env + Auth client) approval.

— Gini

---

## Gini → Owner, Toby, Hank, Any

- Date: 2026-07-17
- Related: Private GitHub baseline / D-013 / B-001
- Status: **Baseline established — desktop clone ready**

### Result

- Repository: `https://github.com/tonykks/tastelog`
- Branch: `main`
- Commit: `chore: establish TasteLog Phase 1 baseline`
- Remote: `origin`; local `main` tracks `origin/main`
- T-100~T-103 approved outputs included
- T-104 and later tasks not started

### Safety checks

- Approved migration files are present with exact names.
- Actual `.env*`, secrets, `node_modules/`, `dist/`, `.agents/`, Supabase local working state are excluded.
- `.env.example` remains versionable and contains variable names only.
- No Supabase project/SQL execution, package installation, React/Auth work, or Vercel setup occurred.

### Handoff

Desktop에서 ZIP 대신 `git clone https://github.com/tonykks/tastelog.git`을 사용해야 Git history와 upstream이 유지됩니다. Clone 후 `npm install`로 local dependencies를 재생성합니다.

다음 task는 Owner/Toby 승인 대기입니다.

— Gini
