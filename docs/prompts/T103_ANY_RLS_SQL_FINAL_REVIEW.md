# T-103 Any Final RLS SQL Review

## Identity and scope

You are **Any**. Perform the final independent review of the implemented T-103 RLS migration. Review only; do not modify SQL or execute anything.

Read:

1. `TOBY_OPERATING_GUIDE.md`
2. the complete required reading order in `AGENTS.md`
3. `PROJECT_CONTEXT.md`
4. `DECISION_LOG.md` — especially D-012
5. `TASK_BOARD.md`
6. latest `WORK_LOG.md`
7. `docs/PHASE1_REQUIREMENTS.md`
8. `docs/DATABASE_AND_RLS.md`
9. `docs/TEST_AND_SUBMISSION.md`
10. all current files under `docs/chat/`
11. `supabase/migrations/20260715000001_initial_schema.sql`
12. `supabase/migrations/20260715000002_rls_policies.sql`
13. `docs/prompts/T103_HANK_RLS_IMPLEMENT.md`

## Migration and syntax review

Verify the actual SQL file, not only Hank's summary:

- exactly two active migration files exist in correct order;
- T-103 contains exactly 16 unique `CREATE POLICY` statements;
- every statement is valid PostgreSQL/Supabase policy syntax and ends with a semicolon;
- every target table is schema-qualified with `public.`;
- policy names are unique and understandable;
- every policy targets only `authenticated`;
- no `FOR ALL`, anon policy, service-role policy, `DROP`, secret, URL, password, token, API key, or connection string exists;
- T-102 migration was not modified by T-103 implementation;
- all five target tables have RLS enabled in T-102.

## Exact policy matrix

Confirm:

### profiles

- SELECT with `USING ((select auth.uid()) = id)`
- INSERT with `WITH CHECK ((select auth.uid()) = id)`
- UPDATE with both the same `USING` and `WITH CHECK`
- no DELETE policy

### places

- authenticated SELECT only with `USING (true)`
- no INSERT, UPDATE, or DELETE policy

### user_restaurants, visits, menu_reviews

Each table has four separate policies:

- SELECT with `USING ((select auth.uid()) = user_id)`
- INSERT with `WITH CHECK ((select auth.uid()) = user_id)`
- UPDATE with both the same `USING` and `WITH CHECK`
- DELETE with `USING ((select auth.uid()) = user_id)`

Confirm no parent/visit `EXISTS` subqueries are present and that relying on T-102 composite constraints is consistent with D-012.

Expected operation totals:

- SELECT: 5
- INSERT: 4
- UPDATE: 4
- DELETE: 3
- total: 16

## Access and API behavior review

Check for any hidden gap affecting Supabase/PostgREST behavior:

- UPDATE has a matching SELECT policy where required;
- own-row `WITH CHECK` prevents ownership changes;
- absence of a profile DELETE policy and places write policies produces the intended denial;
- absence of anon policies produces default denial;
- `places USING (true)` is limited to the `authenticated` role;
- no unnecessary grants are needed under the project's documented Supabase assumptions. If explicit grants are actually required by the project documents, report this as a finding rather than modifying anything.

## Test-plan review

Verify the final RLS-01 through RLS-14 matrix covers own access, cross-user denial, ownership changes, composite-FK failures, optional visit unlinking, cascades, profiles, places, anon denial, and evidence without secrets. Confirm RLS-15 and RLS-16 were removed.

## Safety confirmation

Confirm that no SQL/test was executed, no Supabase project was connected, no package/CLI was installed, no React/env/Git/deployment change occurred, and no later task started.

## Allowed write

Append the complete final review only to `docs/chat/any-chat.md`, at the bottom of the file, and sign `— Any`.

Do not modify any other file. Do not create or edit SQL, connect Supabase, execute SQL/tests, install anything, change Git, or start a later task.

## Verdict

Return exactly one:

- `Approve`
- `Approve with changes`
- `Reject`

For every finding state severity, exact SQL/policy area, reason, consequence, and required correction.

In terminal chat report only the verdict, finding counts by severity, confirmation that `any-chat.md` was updated, and whether T-103 is ready for Owner/Toby closeout.

