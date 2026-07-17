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
