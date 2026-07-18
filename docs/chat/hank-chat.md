# Hank Chat

## Hank → Owner, Toby, Gini, Any

- Date: 2026-07-15
- Related task: T-102
- Status: Implementation complete — awaiting Any review

### Context reviewed

- `TOBY_OPERATING_GUIDE.md`
- `AGENTS.md` Required reading order 전체
- `docs/chat/hank-chat.md`
- `docs/chat/any-chat.md`
- `docs/prompts/T102_HANK_MIGRATION_IMPLEMENT.md`

### Implementation summary

Created local SQL migration artifact only:

- `supabase/migrations/20260715_001_initial_schema.sql`

Updated required collaboration records:

- `DECISION_LOG.md` — added D-010 Accepted schema integrity decision
- `TASK_BOARD.md` — set T-102 to `REVIEW`
- `WORK_LOG.md` — added T-102 implementation entry
- `docs/chat/hank-chat.md` — this handoff

No SQL was executed. No Supabase connection, CLI/package install, React source edit, Git commit, remote, push, or deploy was performed.

### Schema implemented

- Five tables: `profiles`, `places`, `user_restaurants`, `visits`, `menu_reviews`
- `places` table and nullable `user_restaurants.place_id` kept for Phase 1
- `profiles.username` nullable and non-unique
- `gen_random_uuid()` used directly; no `pgcrypto` extension statement
- One shared `public.set_updated_at()` trigger function
- `updated_at` triggers on all five tables
- Owner-first composite uniqueness/FK:
  - `user_restaurants unique (user_id, id)`
  - `visits foreign key (user_id, restaurant_id)` -> `user_restaurants(user_id, id)`
  - `visits unique (user_id, restaurant_id, id)`
  - `menu_reviews foreign key (user_id, restaurant_id)` -> `user_restaurants(user_id, id)`
  - nullable optional visit FK `(user_id, restaurant_id, visit_id)` -> `visits(user_id, restaurant_id, id)`
- Optional visit FK uses `ON DELETE RESTRICT`
- Restaurant deletion cascades to visits and menu reviews
- Place deletion sets `user_restaurants.place_id` to null
- Auth user deletion cascades to owned profile/restaurant/visit/menu rows
- RLS enabled on all five tables; no policies added

### Static checks performed

- SQL creation/dependency order reviewed:
  - function -> parent/shared tables -> owner parent -> children -> indexes -> triggers -> RLS
- Verified composite UNIQUE/FK column order and referenced columns match
- Verified all five tables have `ENABLE ROW LEVEL SECURITY`
- Verified no `create policy` or `alter policy`
- Verified no `pgcrypto`
- Verified no destructive `DROP`
- Verified no secret-like strings, URL, password, or token in SQL
- Confirmed SQL was not executed

### Notes for Any review

- Please review the interaction between direct restaurant cascades and the optional menu-to-visit `ON DELETE RESTRICT` FK before any external execution. This follows the implementation prompt, but it is the main point worth reviewing carefully.
- Please verify that the minimal indexes are sufficient for Phase 1 and not excessive.
- Please verify that RLS enable-only/default-deny in T-102 is acceptable before T-103 policy SQL is applied.

### Remaining risks

- T-102 and T-103 must be applied in one approved ordered execution later. If T-102 is applied alone, RLS default-deny is secure but the app will not be usable until policies exist.
- External Supabase PostgreSQL compatibility is not verified because no connection or SQL execution was allowed.

### Next requested action

Any should independently review `supabase/migrations/20260715_001_initial_schema.sql`.

T-103 is not started.

— Hank

---

## Hank → Owner, Toby, Gini, Any

- Date: 2026-07-18
- Related task: T-105 Restaurant Read/Create narrow code review
- Status: Review complete

### Final verdict

**Approve with changes**

### Passed review points

- `getRestaurants()` scopes the query to the signed-in session's supplied `userId` and the applied `user_restaurants` owner RLS remains the enforcement boundary. `createRestaurant()` writes only `user_id` and `display_name`; nullable `place_id` is not required. No service-role client or RLS bypass was added.
- Database errors are converted to fixed Korean messages before rendering. The reviewed restaurant path neither renders raw Supabase errors nor logs environment values, keys, or session objects.
- The list has distinct loading, empty, and safe-error/retry states. The form has an associated label, visible keyboard focus, `type="submit"`, and disabled input/button while creation is pending. It validates the blank/whitespace-only UI input before the DB call.
- A successful insert is selected through the existing owner-visible policy and prepended, which is consistent with the descending `updated_at` list ordering. No edit/delete, visit/menu, or search/dashboard behavior was introduced.

### Findings

#### 1. Previous user's list can remain or win during a direct session-user change

- Severity: Medium
- File/location: `src/App.jsx:60-93`, especially `loadRestaurants()` at lines 69-81
- Problem and actual risk: `SignedInScreen` is retained when its `session` prop changes from one authenticated user to another. It neither clears the old `restaurants` state nor invalidates an in-flight request. If this happens without an intervening logged-out render, user B can briefly see user A's already loaded card; a slower A request can also resolve after B's request and overwrite B's list. RLS prevents a new cross-user read, but it cannot retract rows already held in browser state.
- Minimum recommendation: On `userId` change, clear `restaurants` and error state before loading; guard each request with an active/request-id check (or equivalent cancellation) so only the current user/request can commit its result. Apply the same guard to the create completion path if the auth state can change while an insert is pending.

#### 2. Service does not itself guarantee its advertised trimmed name invariant

- Severity: Low
- File/location: `src/services/restaurantService.js:27-35`
- Problem and actual risk: The current form trims and rejects blanks, but `createRestaurant()` inserts its `displayName` argument verbatim. A future caller can therefore bypass the form invariant and submit leading/trailing whitespace or a whitespace-only name, relying on a generic database error rather than the required client validation. This conflicts with the requested service-level review criterion of inserting a trimmed name.
- Minimum recommendation: Normalize with `const trimmedName = displayName.trim()` inside `createRestaurant()` and reject an empty value there with the same safe validation message (or make the service accept only an already validated value through an explicit contract plus test). Keep the form validation for immediate feedback.

### Remaining Owner confirmation

The Owner's recorded name-only create, immediate list update, refresh persistence, and logout/relogin checks satisfy the requested manual boundary. After Gini resolves the two findings and Hank re-reviews only those changes, Toby/Owner may decide whether to close T-105. I did not change T-105 status, source, SQL, common documents, Git, external services, or start T-106.

— Hank

---

## Hank → Owner, Toby, Gini, Any

- Date: 2026-07-17
- Related task: T-104 / D-014 security hardening migration review
- Status: Review complete

### Final verdict

**Approve**

### Findings

No blocking or non-blocking findings.

### Review evidence

1. `supabase/migrations/20260717000003_harden_set_updated_at_search_path.sql` is exactly one 70-byte SQL line with one statement and no BOM:

   ```sql
   alter function public.set_updated_at() set search_path = pg_catalog;
   ```

   It changes only the existing function's per-function `search_path`; it does not create, drop, or alter any table, schema, index, policy, constraint, trigger, grant, or function body.

2. The existing definition is `public.set_updated_at()` with no arguments, returns `trigger`, and uses `language plpgsql`. The migration's empty argument list therefore identifies the correct function signature. `ALTER FUNCTION ... SET search_path = pg_catalog` is valid PostgreSQL syntax.

3. The existing body only assigns `new.updated_at = now()` and returns `new`. `NEW` is the PL/pgSQL trigger record and `now()` is available from `pg_catalog`, so the fixed path does not break name resolution. `ALTER FUNCTION` changes an auxiliary function property without replacing the function object or body; the five existing `BEFORE UPDATE` triggers continue to reference and execute the same function.

4. The remote pre-check recorded by Gini found no existing fixed function configuration. Setting `search_path` to the trusted `pg_catalog` schema directly addresses Supabase Security Advisor check `0011 function search path mutable`. After the approved migration is actually applied, rerun Security Advisor to confirm the WARN is cleared; that runtime confirmation is not part of this static review.

5. Both already-applied migrations are unchanged in staged and unstaged Git diff, and their working-tree Git blobs exactly match `HEAD`:

   - `20260715000001_initial_schema.sql`: SHA256 `5AAB6F902052D15A104D78A4DC1B3A8611E7BE227FF8B914CC0DC566869C7C85`
   - `20260715000002_rls_policies.sql`: SHA256 `A948160A02E4C2CFFCCF17BECB75CB1FD1C2958431ADE16E5341D41E6824B9B0`

6. The new migration contains no unnecessary schema, index, policy, performance-advisor, or other database changes. Its SHA256 is `BCAD57CD16E90C47B79B2321B9DEFF77AEDE0813EA7DCAA790ABCC49941F5FBC`.

7. Gini's migration-history and dry-run evidence consistently records migrations 1 and 2 as local=remote and only `20260717000003_harden_set_updated_at_search_path.sql` as local pending. The actual `db push` was not executed. I did not repeat the linked dry-run or perform any remote operation in this review.

8. The reviewed migration contains no password, token, key, connection string, `service_role`, destructive command, or data-changing DML. No secret or dangerous command was introduced or executed during this review.

### Scope confirmation

No code, SQL, shared project document, database, Auth implementation, Git state, or migration history was changed. This review records findings only in Hank's own chat file. Actual `supabase db push`, migration repair/reset, Advisor rerun, Auth work, and Git operations remain outside this review and require the existing Owner/Toby approval flow.

— Hank

---

## Hank → Owner, Toby, Gini, Any

- Date: 2026-07-15
- Related task: T-103 RLS policy and security test plan
- Status: Planning complete — T-103 remains `IN_PROGRESS`

### Preflight result

Passed.

- T-102 has one current task row and status `DONE`.
- T-103 has one current task row and was `READY` before this planning start.
- Any final T-102 verdict is `Approve` with zero new findings.
- One active initial schema migration exists: `supabase/migrations/20260715000001_initial_schema.sql`.
- No SQL has been executed and no Supabase project is connected according to current logs/chat.

I set only T-103 to `IN_PROGRESS`.

### Planning verdict

Recommended RLS design: create separate operation policies for each table, target only `authenticated`, keep `anon` default-denied, and do not use `service_role` in browser/client flows. Owner tables use `(select auth.uid()) = user_id` plus parent ownership checks for child rows. No `FOR ALL` policy is recommended.

Proposed next migration filename, not created: `supabase/migrations/20260715000002_rls_policies.sql`.

### Policy Matrix

#### profiles

| Operation | Role | Policy name | USING | WITH CHECK | Rationale / behavior |
|---|---|---|---|---|---|
| SELECT | `authenticated` | `profiles_select_own` | `(select auth.uid()) = id` | n/a | A user can read only their profile row; B and anon cannot read it. |
| INSERT | `authenticated` | `profiles_insert_own` | n/a | `(select auth.uid()) = id` | Allows client/onboarding creation of the user's own profile only. A cannot create B's profile. |
| UPDATE | `authenticated` | `profiles_update_own` | `(select auth.uid()) = id` | `(select auth.uid()) = id` | User can update own nullable username only; changing `id`/ownership fails. SELECT policy is also needed for PostgREST update visibility/returning behavior. |
| DELETE | none | none | none | none | Direct browser profile delete is not needed in Phase 1; account deletion should remain the deletion path through `auth.users` cascade. |

#### places

| Operation | Role | Policy name | USING | WITH CHECK | Rationale / behavior |
|---|---|---|---|---|---|
| SELECT | `authenticated` | `places_select_authenticated` | `true` | n/a | Shared place rows are non-owner reference data. Authenticated users may read them if the UI later resolves nullable `place_id`. |
| INSERT | none | none | none | none | Phase 1 has no browser place creation. |
| UPDATE | none | none | none | none | Phase 1 has no browser place editing. |
| DELETE | none | none | none | none | Phase 1 has no browser place deletion. |

Anon has no `places` policy and should be denied. Do not add any always-true write policy.

#### user_restaurants

| Operation | Role | Policy name | USING | WITH CHECK | Expected behavior |
|---|---|---|---|---|---|
| SELECT | `authenticated` | `user_restaurants_select_own` | `(select auth.uid()) = user_id` | n/a | User sees only their rows. |
| INSERT | `authenticated` | `user_restaurants_insert_own` | n/a | `(select auth.uid()) = user_id` | User can create own restaurant, including name-only create. Cross-user insert fails. |
| UPDATE | `authenticated` | `user_restaurants_update_own` | `(select auth.uid()) = user_id` | `(select auth.uid()) = user_id` | User can update own row; attempting to change `user_id` fails. SELECT policy is required so the update target is visible and returned correctly. |
| DELETE | `authenticated` | `user_restaurants_delete_own` | `(select auth.uid()) = user_id` | n/a | User can delete own restaurant; B cannot delete A's row. Cascades are handled by FK. |

#### visits

Parent ownership expression:

```sql
exists (
  select 1
  from public.user_restaurants ur
  where ur.user_id = (select auth.uid())
    and ur.id = visits.restaurant_id
)
```

| Operation | Role | Policy name | USING | WITH CHECK | Expected behavior |
|---|---|---|---|---|---|
| SELECT | `authenticated` | `visits_select_own` | `(select auth.uid()) = user_id and exists (...)` | n/a | User reads only visits attached to their restaurants. |
| INSERT | `authenticated` | `visits_insert_own` | n/a | `(select auth.uid()) = user_id and exists (...)` | User can insert a visit only for their restaurant. B cannot attach a visit to A's restaurant. |
| UPDATE | `authenticated` | `visits_update_own` | `(select auth.uid()) = user_id and exists (...)` | `(select auth.uid()) = user_id and exists (...)` | User can update own visit; changing `user_id` or moving to another user's restaurant fails. SELECT policy is required for target visibility/returning. |
| DELETE | `authenticated` | `visits_delete_own` | `(select auth.uid()) = user_id and exists (...)` | n/a | User can delete own visit; linked `menu_reviews.visit_id` becomes null by D-011/T-102 FK behavior. |

For SQL generation, replace `visits` in the expression with the table alias accepted by PostgreSQL policy syntax if needed; do not change the logic.

#### menu_reviews

Restaurant ownership expression:

```sql
exists (
  select 1
  from public.user_restaurants ur
  where ur.user_id = (select auth.uid())
    and ur.id = menu_reviews.restaurant_id
)
```

Optional visit consistency expression:

```sql
(
  visit_id is null
  or exists (
    select 1
    from public.visits v
    where v.user_id = (select auth.uid())
      and v.restaurant_id = menu_reviews.restaurant_id
      and v.id = menu_reviews.visit_id
  )
)
```

| Operation | Role | Policy name | USING | WITH CHECK | Expected behavior |
|---|---|---|---|---|---|
| SELECT | `authenticated` | `menu_reviews_select_own` | `(select auth.uid()) = user_id and restaurant ownership expression` | n/a | User reads only menu reviews for their restaurants. |
| INSERT | `authenticated` | `menu_reviews_insert_own` | n/a | `(select auth.uid()) = user_id and restaurant ownership expression and optional visit consistency expression` | User can insert a menu review only for own restaurant; cross-owner or cross-restaurant visit links fail. |
| UPDATE | `authenticated` | `menu_reviews_update_own` | `(select auth.uid()) = user_id and restaurant ownership expression` | `(select auth.uid()) = user_id and restaurant ownership expression and optional visit consistency expression` | User can update own menu review; changing owner, restaurant, or linking to another owner/restaurant visit fails. SELECT policy is required for target visibility/returning. |
| DELETE | `authenticated` | `menu_reviews_delete_own` | `(select auth.uid()) = user_id and restaurant ownership expression` | n/a | User can delete own menu review; B cannot delete A's row. |

The composite FK already enforces owner/restaurant integrity at the DB layer. The RLS checks duplicate the security intent and fail earlier for browser clients.

### Anonymous And Privileged Access

- `anon`: no policies are proposed for `anon`; all five RLS-enabled tables should default-deny browser access.
- `service_role`: do not use in frontend, tests, screenshots, Markdown, or client code. Service-role bypass testing is out of browser-client scope.
- No secrets, URLs, tokens, passwords, or keys are needed for this plan.

### Index Review

No additional index is recommended in T-103.

- `profiles`: primary key on `id` supports own-row lookup.
- `places`: primary key is enough; read-only shared lookup volume is Phase 1-small.
- `user_restaurants`: `UNIQUE(user_id, id)`, `(user_id, status)`, and `(user_id, updated_at desc)` cover owner predicates and list filters.
- `visits`: `UNIQUE(user_id, restaurant_id, id)` and `(user_id, restaurant_id, visited_at desc)` support owner/parent checks and representative visit lookup.
- `menu_reviews`: `(user_id, restaurant_id)` and partial `(user_id, restaurant_id, visit_id) where visit_id is not null` support owner and optional visit checks.

### Security Test Matrix

| ID | Actor | Setup | Action | Expected result | Evidence |
|---|---|---|---|---|---|
| RLS-01 | anon | T-102 applied, before login | SELECT from each table | Denied/no rows due to no anon policies | Query result/error screenshot without secrets |
| RLS-02 | User A | A signed in | Insert/select/update/delete A restaurant | Allowed | Row id, before/after values, final delete result |
| RLS-03 | User A | A owns restaurant | Insert/select/update/delete A visit | Allowed | Visit row evidence and updated fields |
| RLS-04 | User A | A owns restaurant/visit | Insert/select/update/delete A menu review | Allowed | Menu review CRUD evidence |
| RLS-05 | User B | A has restaurant/visit/menu | B selects known A ids | No rows or denied | Query result showing invisibility |
| RLS-06 | User B | A restaurant id known | B inserts visit/menu with B `user_id` but A `restaurant_id` | Denied by RLS/FK | Error category, no row created |
| RLS-07 | User B | A row ids known | B updates/deletes A restaurant/visit/menu | No affected rows or denied | Row remains unchanged for A |
| RLS-08 | User A | A owns row | A updates `user_id` to B's id | Denied by `WITH CHECK` | Error/no ownership change |
| RLS-09 | User A | A and B both have restaurants | A inserts/updates child with mismatched restaurant owner | Denied by RLS/FK | Error and no child row |
| RLS-10 | User A | A has two restaurants and visits | Menu review for restaurant 1 linked to visit from restaurant 2 | Denied by optional visit consistency/FK | Error and no invalid link |
| RLS-11 | User A | A menu review linked to A visit | Delete the visit | Visit deleted; menu review remains with `visit_id = null` | Before/after row evidence |
| RLS-12 | User A | A restaurant has visits/menu reviews | Delete the restaurant | Owned visits/menu reviews cascade; B rows unaffected | Counts before/after for A and B |
| RLS-13 | User A/B | Profile rows exist or are inserted | A select/insert/update own profile; B attempts A profile; direct delete attempt | Own select/insert/update allowed; cross-user denied; direct delete denied | Profile query/update/delete evidence |
| RLS-14 | authenticated A/B | Shared place row exists from privileged setup | SELECT places, then attempt browser INSERT/UPDATE/DELETE | SELECT allowed; writes denied | Read result and denied write evidence |
| RLS-15 | User A | Temporarily evaluate T-102-only state before T-103 policies in a disposable project | Browser SELECT/INSERT owner tables | Default-deny until policies exist | Recorded query error/no rows |
| RLS-16 | User A | UPDATE tests prepared | Remove/withhold SELECT policy in disposable check or reason from docs | UPDATE target not visible/returning breaks | Evidence or documented note proving SELECT policy necessity |

Test accounts must be non-sensitive. Screenshots must not show keys, tokens, connection strings, or private emails beyond what Owner approves.

### Important Open Decisions

- Approve `places` as authenticated read-only in Phase 1, with no browser writes.
- Confirm whether the app will create profile rows client-side after sign-up; if not, `profiles_insert_own` can be deferred, but my recommendation is to include it for simple onboarding.
- T-103 SQL migration must be reviewed by Any and approved by Owner/Toby before creation/execution.

### Files Changed

- `TASK_BOARD.md`
- `WORK_LOG.md`
- `docs/chat/hank-chat.md`

No SQL file was created or executed. No Supabase project was connected. No package install, React edit, env edit, Git change, T-104, or later task work occurred.

Plan awaits Any review and Owner/Toby approval.

— Hank

---

## Hank → Owner, Toby, Gini, Any

- Date: 2026-07-15
- Related task: T-102 correction after Any review
- Status: Correction applied — T-102 remains `REVIEW`

### Correction summary

Applied only the two accepted corrections from `docs/prompts/T102_HANK_CORRECTION_AFTER_ANY_REVIEW.md`:

- Renamed active migration artifact to `supabase/migrations/20260715000001_initial_schema.sql`.
- Changed the optional `menu_reviews` to `visits` FK from `ON DELETE RESTRICT` to `ON DELETE SET NULL (visit_id)`, preserving `user_id` and `restaurant_id`.

### Files changed

- `supabase/migrations/20260715000001_initial_schema.sql`
- `WORK_LOG.md`
- `docs/chat/hank-chat.md`

### Static verification

- Only one active T-102 migration file exists.
- Active filename is `20260715000001_initial_schema.sql`.
- Optional visit FK uses `ON DELETE SET NULL (visit_id)`.
- FK still uses `(user_id, restaurant_id, visit_id)` and only `visit_id` is nullable on delete.
- All five tables still enable RLS.
- No `CREATE POLICY` or `ALTER POLICY` exists.
- No `DROP`, secret, URL, password, access token, or service-role key was found.
- No SQL was executed.

### Remaining item

`DECISION_LOG.md` still needs the requested accepted D-011 entry superseding only the `ON DELETE RESTRICT` portion of D-010. My attempted patch was blocked by governance approval safeguards, so this needs explicit Owner/Toby approval or separate handling.

T-103 was not started.

— Hank

---

## Hank → Owner, Toby, Gini, Any

- Date: 2026-07-15
- Related task: T-102 D-011 governance completion
- Status: Completed — T-102 remains REVIEW

### Completion record

- `DECISION_LOG.md`에 D-011 Accepted 추가 완료
- D-010의 `ON DELETE RESTRICT` 부분만 `ON DELETE SET NULL (visit_id)`로 대체
- D-010의 나머지 결정은 계속 유효
- SQL 실행, Supabase 연결, T-103 시작 없음

— Hank

---

## Hank → Owner, Toby, Gini, Any

- Date: 2026-07-15
- Related task: T-103 RLS migration implementation
- Status: Implementation complete — T-103 is `REVIEW`

### Context and decisions

- Any T-103 plan review verdict: `Approve with changes`
- Findings accepted: one Medium, one Low
- D-012 added to `DECISION_LOG.md` as Accepted
- Final RLS design uses simple owner checks for owner tables: `((select auth.uid()) = user_id)`
- Parent, owner, restaurant, and optional visit integrity rely on T-102 composite `UNIQUE` and `FOREIGN KEY` constraints
- No duplicate parent/visit `EXISTS` subqueries are used in RLS
- `profiles`: own-row SELECT, INSERT, UPDATE only; no DELETE policy
- `places`: authenticated SELECT only; no browser writes
- `anon`: no policies
- `service_role`: not used or exposed in browser/client scope

### Files created or changed

- `supabase/migrations/20260715000002_rls_policies.sql`
- `DECISION_LOG.md`
- `TASK_BOARD.md`
- `WORK_LOG.md`
- `docs/chat/hank-chat.md`

### Policy counts

| Table | SELECT | INSERT | UPDATE | DELETE | Total |
|---|---:|---:|---:|---:|---:|
| `profiles` | 1 | 1 | 1 | 0 | 3 |
| `places` | 1 | 0 | 0 | 0 | 1 |
| `user_restaurants` | 1 | 1 | 1 | 1 | 4 |
| `visits` | 1 | 1 | 1 | 1 | 4 |
| `menu_reviews` | 1 | 1 | 1 | 1 | 4 |
| Total | 5 | 4 | 4 | 3 | 16 |

### Static verification

- Exactly two active migration files exist:
  - `20260715000001_initial_schema.sql`
  - `20260715000002_rls_policies.sql`
- T-103 has exactly 16 `CREATE POLICY` statements
- All 16 target `authenticated`
- No `FOR ALL`
- Operation counts: SELECT 5, INSERT 4, UPDATE 4, DELETE 3
- Every UPDATE has both `USING` and `WITH CHECK`
- INSERT policies use `WITH CHECK` and no `USING`
- DELETE policies use `USING` and no `WITH CHECK`
- No owner-table `EXISTS` subquery
- The only `USING (true)` is the authenticated `places` SELECT policy
- No anon policy
- No `service_role` policy or secret
- No `DROP`, URL, password, access token, API key, or connection string
- T-102 migration content was not modified in this implementation
- No SQL or test was executed
- Supabase was not connected

### Final security test matrix

| ID | Actor | Setup | Operation | Expected result | Submission evidence |
|---|---|---|---|---|---|
| RLS-01 | anon | T-102/T-103 applied, no login | SELECT/INSERT attempts on all five tables | Denied/default blocked | Query result or UI error without secrets |
| RLS-02 | User A | A signed in | Restaurant SELECT/INSERT/UPDATE/DELETE on A rows | Allowed | Row id and before/after values |
| RLS-03 | User A | A owns restaurant | Visit SELECT/INSERT/UPDATE/DELETE on A rows | Allowed | Visit row evidence |
| RLS-04 | User A | A owns restaurant | Menu review SELECT/INSERT/UPDATE/DELETE on A rows | Allowed | Menu review CRUD evidence |
| RLS-05 | User B | A has restaurant/visit/menu rows | B SELECTs A known ids | No rows or denied | B query result plus A row still present |
| RLS-06 | User B | A restaurant id known | B INSERTs visit/menu with B `user_id` and A `restaurant_id` | Denied by FK/RLS; no row created | Error category and row absence |
| RLS-07 | User B | A row ids known | B UPDATEs/DELETEs A restaurant/visit/menu rows | No affected rows or denied | A rows unchanged |
| RLS-08 | User A | A owns rows | A tries to change `user_id` to B id | Denied by `WITH CHECK`/FK | Error and unchanged owner |
| RLS-09 | User A/B | A and B each have restaurants | Child row with mismatched restaurant ownership | Denied by T-102 composite FK and owner policy | Error and no invalid child row |
| RLS-10 | User A | A has two restaurants and visits | Menu review links to visit from a different restaurant or owner | Denied by T-102 optional visit FK | Error and no invalid link |
| RLS-11 | User A | Menu review linked to A visit | Delete visit | Visit deleted; menu review remains with `visit_id = null` | Before/after row evidence |
| RLS-12 | User A/B | A restaurant has visits/menu reviews; B has separate data | Delete A restaurant | A child rows cascade; B data unaffected | Counts before/after |
| RLS-13 | User A/B | Profile rows exist or are inserted | A own SELECT/INSERT/UPDATE; B attempts A profile; direct DELETE | Own operations allowed except DELETE; cross-user denied | Profile operation evidence |
| RLS-14 | authenticated user | Shared place row exists from privileged setup | SELECT places; attempt browser INSERT/UPDATE/DELETE | SELECT allowed; writes denied | Read result and denied write evidence |

RLS-15 and RLS-16 are intentionally excluded per D-012 and Any's Low finding.

### Remaining risk and next action

T-103 is still a static artifact. Any should final-review `supabase/migrations/20260715000002_rls_policies.sql`. T-102/T-103 SQL execution remains blocked until final review and Owner-approved ordered execution.

No package install, React/env edit, Git commit/push, deployment, Supabase connection, SQL execution, test execution, or T-104 work was performed.

— Hank

---

## Hank → Owner, Toby, Gini, Any

- Date: 2026-07-17
- Related task: T-104 Supabase client + Auth independent review
- Status: Review complete

### Final verdict

**Approve with changes**

### Scope and passed checks

- `src/lib/supabase.js` is the sole `createClient` call and creates one module-scoped browser client only when both `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` exist.
- `.env.local` has only those two non-empty variable names, is ignored by both `.env.*` and `*.local`, is absent from Git status, and no environment file other than the empty-value `.env.example` is tracked. The local key is an `sb_publishable_` key; it and the URL appear in the production bundle as expected. No secret/service-role key, database password, token, or connection string was found in source or bundle.
- Missing configuration renders variable *names only*; values are neither logged nor rendered. Raw Supabase errors are mapped to fixed Korean messages, and React text rendering safely escapes both those messages and `session.user?.email`.
- `getSession` starts before the subscription but the subscription is registered synchronously before the login UI can render; `onAuthStateChange` also emits `INITIAL_SESSION`. The effect's active guard and cleanup unsubscribe the component listener correctly. Default browser `persistSession` behavior is compatible with refresh persistence.
- Email-confirmation handling correctly uses the documented Supabase signal (`data.session === null` after sign-up). Password is controlled component state only and is not stored, logged, or rendered elsewhere. Submit/sign-out controls disable while requests are pending.
- Labels, `htmlFor`, password/email autocomplete values, visible focus styles, alert/status messages, and disabled states are present. No T-105 feature or UI library was added.
- `@supabase/supabase-js` is locked at `2.110.7`; package and lockfile are consistent. `npm run lint`, `npm run build` (Vite `8.1.4`), `npm ls`, and production-only `npm audit` all passed; audit reports 0 vulnerabilities.
- Read-only `supabase migration list --linked` confirms 001, 002, and 003 are each local=remote. All three local SHA256 values match the previously recorded baselines; this Auth implementation did not alter migrations or the remote DB.

### Findings

#### 1. Initial-session errors are silently converted to the logged-out screen

- Severity: Low
- File/location: `src/App.jsx:93`
- Cause: `getInitialSession()` returns a mapped safe `error`, but the promise handler destructures only `session` and discards it.
- Impact: A storage/initialization failure can present as a normal logged-out state, giving the user no actionable explanation and obscuring a session-lifecycle failure.
- Recommended change: Keep an initialization-error state; when `getInitialSession()` returns `error`, finish loading and render that existing safe Korean message with a retry/reload instruction. Do not render the raw error.

#### 2. Logout uses Supabase's global default scope

- Severity: Low
- File/location: `src/services/authService.js:47`
- Cause: `supabase.auth.signOut()` is called without options; Supabase's default scope is `global`.
- Impact: One device's “로그아웃” invalidates all of the user's active sessions, which is surprising for a standard browser logout and broader than the UI communicates.
- Recommended change: Call `supabase.auth.signOut({ scope: 'local' })` unless Owner/Toby explicitly intend a global all-devices logout; keep the UI wording aligned with that decision.

#### 3. Declared tab roles lack the corresponding tab keyboard behavior

- Severity: Low
- File/location: `src/components/auth/AuthForm.jsx:64-85`
- Cause: The buttons declare `role="tab"` inside a `tablist`, but have no `aria-controls`/tabpanel association or ArrowLeft/ArrowRight navigation and roving `tabIndex` handling.
- Impact: Keyboard and assistive-technology users receive tab semantics that do not behave as expected.
- Recommended change: Either implement the complete WAI-ARIA tabs pattern, or remove the tab/tablist roles and present these as ordinary mode-switch buttons (the simpler Phase 1 option).

### Remaining verification boundary

No test account or Auth request was made in this review. Owner's manual sign-up, confirmation-required, login failure, login success, refresh, and logout checks remain required before T-104 can move from `IN_PROGRESS` to `DONE`.

No code, SQL, migration, database, common document, or Git commit/push was changed by Hank; this entry is findings only.

— Hank

---

## Hank → Owner, Toby, Gini, Any

- Date: 2026-07-17
- Related task: T-104 Auth Low findings narrow re-review
- Status: Review complete

### Final verdict

**Approve**

### Re-review result

All three previously accepted Low findings are resolved. No new findings in the requested narrow scope.

1. `src/App.jsx`
   - `getInitialSession()` now retains the mapped `error` in `initializationError`; it cannot silently fall through to the logged-out `AuthForm` screen.
   - The error branch renders only the already-mapped Korean message, a Korean retry instruction, and an explicit `type="button"` reload action.
   - It does not render raw Supabase errors, session data, or environment values. React renders the safe message as text.

2. `src/services/authService.js`
   - `signOut()` now calls `supabase.auth.signOut({ scope: 'local' })`, limiting the UI's logout action to the current browser session.
   - `toSafeMessage()` and its fixed Korean-message mapping are unchanged; no raw error is returned for rendering.

3. `src/components/auth/AuthForm.jsx`
   - The incomplete `tablist`, `tab`, and `aria-selected` semantics are removed.
   - Both mode controls remain native `button` elements with the correct boolean `aria-pressed` state and existing disabled behavior.
   - No custom keyboard handler, `tabIndex`, or role overrides were introduced, so native Tab focus and Enter/Space button activation remain available; the existing visible `:focus-visible` style continues to apply.

Per Toby's narrow-review instruction, I did not repeat lint/build, dependency audit, migration/hash/history checks, network commands, or Supabase CLI operations. No code, SQL, database, or common document was changed by Hank.

— Hank

---

## Hank → Owner, Toby, Gini, Any

- Date: 2026-07-18
- Related task: T-105 two-findings narrow re-review
- Status: Review complete

### Final verdict

**Approve**

Both prior findings are resolved; no new issue was found in the requested narrow scope.

- `src/App.jsx:60-115,205`: `key={session.user.id}` remounts the signed-in surface for a different authenticated user. The unmount cleanup invalidates both request counters and sets the old component's mount flag to false. Each list/retry request gets a new list id, and each create gets a new create id; only the current mounted component's newest corresponding request can update state. Therefore old A SELECT/create completions cannot populate B's screen, while the current initial load, retry, and successful create retain their normal state updates and loading completion.
- `src/services/restaurantService.js:27-40`: `createRestaurant()` normalizes with `String(displayName ?? '').trim()` before any Supabase call, returns the specified fixed Korean validation contract for blank input, and inserts only the normalized value. The existing form validation and safe raw-error mapping remain intact.
- The diff contains no T-106 update/delete behavior and does not expand the T-105 data/error scope.

Per Toby's instruction, I did not rerun lint, build, dev smoke, audit, Supabase CLI/network/remote DB operations, or create test data. No source, SQL, common document/status, Git, or external service was changed by Hank. T-106 was not started.

— Hank

---

## Hank → Owner, Toby, Gini, Any

- Date: 2026-07-18
- Related task: T-106 Restaurant Update/Delete narrow code review
- Status: Review complete

### Final verdict

**Approve with changes**

### Passed review points

- `src/services/restaurantService.js:43-72` applies both `id` and current `user_id` filters to UPDATE and DELETE. Update normalizes/rejects blank names before its DB request; both operations use `maybeSingle()` and convert an error **or no returned row** to the existing safe user-facing error contract.
- `src/App.jsx:146-190` replaces only the returned row and re-sorts by `updated_at`, or removes only the server-returned deleted id. The per-row request map, mount flag, keyed signed-in screen, and cleanup prevent stale UPDATE/DELETE completions from modifying a new user or unmounted screen. Current initial loads, retries, and mutations retain a completion path, with no persistent loading state in the mounted screen.
- `src/components/restaurants/RestaurantList.jsx:38-77,181-206` performs no mutation on edit/delete cancellation. The confirmation names the target restaurant and accurately warns that its related visit/menu records are deleted by the applied restaurant-owned FK cascades. Labels, disabled pending controls, focus-visible styling, and the distinct destructive action remain present. No T-107+ feature was added.

### Finding

#### 1. The existing edit trigger remains active while that row's inline edit form is open

- Severity: Low
- File/location: `src/components/restaurants/RestaurantList.jsx:25-30,111-150,163-180`
- Problem and actual risk: While editing, the card still shows its original `수정` button. Activating it calls `beginEdit()` again and resets `editingName` to the persisted restaurant name, silently discarding the user's unsaved typed change. This does not cause a remote mutation, but creates an avoidable action conflict and is especially confusing for keyboard users navigating the card controls.
- Minimum recommendation: Hide or disable the card's `수정` trigger for `editingId === restaurant.id` (or make it a clearly labeled non-destructive reset with explicit confirmation). Keeping `삭제` available is acceptable if it intentionally cancels editing before opening the separate confirmation, as the current code does.

Per Toby's efficiency limits, I did not rerun lint/build/dev smoke/audit or use Supabase CLI, network, remote DB, or test data. I changed no source, common document/status, Git, or external state, and did not start T-107.

— Hank

---

## Hank → Owner, Toby, Gini, Any

- Date: 2026-07-18
- Related task: T-106 Low finding 1 narrow re-review
- Status: Review complete

### Final verdict

**Approve**

`src/components/restaurants/RestaurantList.jsx:163-182` now renders the card-level `수정` trigger only when `editingId !== restaurant.id`. Thus the edited card retains only the inline form's `저장`/`취소` editing controls plus its intentionally separate `삭제` path; pressing delete still clears edit state before confirmation. A non-editing card, including every other row, retains its normal `수정` trigger and `beginEdit(restaurant)` path. No finding-external behavior or T-107 scope was added.

Per Toby's instruction, I did not repeat lint/build/smoke/audit or perform Supabase CLI, network, DB, source/common-document/status, or Git work. T-107 was not started.

— Hank
