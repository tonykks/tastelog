# T-103 Hank RLS Migration Implementation

## Identity and authorization

You are **Hank**. Owner/Toby approves implementing the T-103 RLS policy migration after Any's `Approve with changes` review.

This authorization includes the exact D-012 decision described below. Do not pause solely to request separate governance approval for adding D-012.

Before working, read:

1. `TOBY_OPERATING_GUIDE.md`
2. The complete required reading order in `AGENTS.md`
3. `PROJECT_CONTEXT.md`
4. `DECISION_LOG.md`
5. `TASK_BOARD.md`
6. latest `WORK_LOG.md`
7. `docs/PHASE1_REQUIREMENTS.md`
8. `docs/DATABASE_AND_RLS.md`
9. `docs/TEST_AND_SUBMISSION.md`
10. all current files under `docs/chat/`
11. `supabase/migrations/20260715000001_initial_schema.sql`
12. `docs/prompts/T103_HANK_RLS_PLAN.md`
13. `docs/prompts/T103_ANY_RLS_PLAN_REVIEW.md`

## Preflight

Confirm that:

- T-102 is `DONE`.
- T-103 is `IN_PROGRESS`.
- Any's current T-103 verdict is `Approve with changes` with one Medium and one Low finding.
- `supabase/migrations/20260715000001_initial_schema.sql` is the only active T-102 migration.
- `supabase/migrations/20260715000002_rls_policies.sql` does not already exist.
- no SQL has been executed and no Supabase project is connected.

If any conflict exists, stop without editing and report it.

## Final Owner/Toby decisions

Implement these decisions exactly:

1. Use simple owner RLS for `user_restaurants`, `visits`, and `menu_reviews`:
   - `(select auth.uid()) = user_id`
2. Remove all parent ownership and optional visit consistency `EXISTS` subqueries from RLS.
3. Rely on T-102 composite UNIQUE and FOREIGN KEY constraints for parent, owner, restaurant, and optional visit integrity.
4. `profiles`: authenticated users may SELECT, INSERT, and UPDATE only their own row where `(select auth.uid()) = id`; no direct DELETE policy.
5. `places`: authenticated users may SELECT shared rows; no INSERT, UPDATE, or DELETE policy.
6. `anon`: create no policy on any of the five tables.
7. Never use or expose `service_role` in browser/client code.
8. Keep security tests RLS-01 through RLS-14. Remove proposed RLS-15 and RLS-16.

## D-012 authorization

Add an `Accepted` D-012 entry to `DECISION_LOG.md` recording all final decisions above. State that Any's Medium and Low changes were accepted and that the simpler policies rely on T-102 structural constraints.

## Migration file

Create exactly:

`supabase/migrations/20260715000002_rls_policies.sql`

Do not edit `supabase/migrations/20260715000001_initial_schema.sql`.

Create separate operation-specific policies. Do not use `FOR ALL`.

### profiles — 3 policies

- SELECT to `authenticated`, `USING ((select auth.uid()) = id)`
- INSERT to `authenticated`, `WITH CHECK ((select auth.uid()) = id)`
- UPDATE to `authenticated`, both `USING` and `WITH CHECK` with the same own-row expression
- no DELETE policy

### places — 1 policy

- SELECT to `authenticated`, `USING (true)`
- no INSERT, UPDATE, or DELETE policy

The always-true expression is allowed only for this intentional authenticated shared-read policy.

### user_restaurants — 4 policies

- SELECT: own rows with `USING`
- INSERT: own rows with `WITH CHECK`
- UPDATE: own rows with both `USING` and `WITH CHECK`
- DELETE: own rows with `USING`

Use `((select auth.uid()) = user_id)` for every owner expression.

### visits — 4 policies

Use the same four-operation structure and simple owner expression. Do not add an `EXISTS` subquery.

### menu_reviews — 4 policies

Use the same four-operation structure and simple owner expression. Do not add an `EXISTS` subquery.

Expected total: **16 CREATE POLICY statements**.

Use short, descriptive, unique policy names. Schema-qualify every target table with `public.`. Use valid PostgreSQL/Supabase SQL and terminate every statement with a semicolon.

Do not add grants, functions, triggers, tables, indexes, extensions, policy drops, or destructive statements unless an existing project document explicitly requires them. If such a conflict exists, stop and report rather than expanding scope.

## Security test plan finalization

In the Hank handoff, provide the final RLS-01 through RLS-14 test matrix with actor, setup, operation, expected result, and submission evidence. Remove RLS-15 and RLS-16. Do not create executable tests or execute any test.

## Static verification

Verify and report:

- exactly two active migration files exist, ordered `...000001` then `...000002`;
- exactly 16 `CREATE POLICY` statements exist in T-103;
- all 16 target `authenticated`;
- no `FOR ALL`;
- SELECT count is 5;
- INSERT count is 4;
- UPDATE count is 4;
- DELETE count is 3;
- every UPDATE has both `USING` and `WITH CHECK`;
- INSERT policies use `WITH CHECK` and no `USING`;
- DELETE policies use `USING` and no `WITH CHECK`;
- no owner-table `EXISTS` subquery;
- the only `USING (true)` is the authenticated `places` SELECT policy;
- no anon policy and no `service_role` policy or secret;
- no `DROP`, URL, password, access token, API key, or connection string;
- T-102 migration content was not modified;
- no SQL was executed.

## Collaboration updates

- `DECISION_LOG.md`: add D-012 as explicitly authorized.
- `TASK_BOARD.md`: set T-103 to `REVIEW` after successful implementation and static checks.
- `WORK_LOG.md`: add implementation and verification entry.
- `docs/chat/hank-chat.md`: append the current T-103 implementation handoff at the **bottom of the file**, after all historical sections, and sign `— Hank`.

## Forbidden actions

Do not:

- execute SQL or tests;
- install or invoke Supabase CLI/packages;
- connect to or create a Supabase project;
- edit React or environment files;
- include secrets, tokens, passwords, project URLs, or keys;
- modify T-102 migration;
- create Git commits, remotes, pushes, or deployments;
- edit Any's, Gini's, or Toby's chat files;
- start T-104 or later tasks.

## Completion report

In terminal chat, report only:

1. files created/changed;
2. policy counts by table and operation;
3. static verification result;
4. confirmation that no SQL/test was executed and Supabase was not connected;
5. that T-103 is `REVIEW` and awaits Any final review.

