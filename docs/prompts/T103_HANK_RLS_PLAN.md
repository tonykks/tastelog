# T-103 Hank RLS Policy and Security Test Plan

## Identity and authorization

You are **Hank**. Owner/Toby authorizes starting the **planning phase only** of T-103: RLS policy design and security test planning.

Before working, read:

1. `TOBY_OPERATING_GUIDE.md`
2. The complete required reading order in `AGENTS.md`
3. `PROJECT_CONTEXT.md`
4. `AGENT_ROLES.md`
5. `WORKFLOW.md`
6. `TASK_BOARD.md`
7. `DECISION_LOG.md`
8. the latest entries in `WORK_LOG.md`
9. `docs/PHASE1_REQUIREMENTS.md`
10. `docs/DATABASE_AND_RLS.md`
11. `docs/TEST_AND_SUBMISSION.md`
12. all current files under `docs/chat/`
13. `supabase/migrations/20260715000001_initial_schema.sql`

## Preflight

Confirm that:

- T-102 has exactly one current task entry and its status is `DONE`.
- T-103 has exactly one current task entry and its status is `READY` or equivalent not-started state.
- The final Any verdict for T-102 is `Approve` with zero findings.
- Only one active initial schema migration exists.
- No SQL has been executed and no Supabase project is connected.

If the task board contains duplicate active rows or contradictory current statuses, stop without editing and report the exact conflict.

If preflight passes, set only T-103 to `IN_PROGRESS` and continue with planning.

## Planning scope

Produce a complete policy matrix and security test plan for these five tables:

- `profiles`
- `places`
- `user_restaurants`
- `visits`
- `menu_reviews`

At minimum, analyze and recommend:

### Owner tables

For `user_restaurants`, `visits`, and `menu_reviews`, design separate policies for:

- SELECT: `USING`
- INSERT: `WITH CHECK`
- UPDATE: both `USING` and `WITH CHECK`
- DELETE: `USING`

Use owner checks based on `(select auth.uid()) = user_id`, target the `authenticated` role, and do not use one broad `FOR ALL` policy.

Explain how the UPDATE policy prevents changing ownership and why a SELECT policy is required for UPDATE behavior.

### Profiles

Determine the minimum Phase 1 access rules for a profile whose primary key is the authenticated user's ID. Analyze own-row SELECT, INSERT, UPDATE, and whether direct profile DELETE should be allowed or account deletion should remain the only deletion path.

### Places

Determine whether Phase 1 needs authenticated read-only access to shared `places` rows. Do not grant browser clients INSERT, UPDATE, or DELETE unless a documented Phase 1 requirement clearly requires it. Do not create an always-true write policy.

### Anonymous and privileged access

- State the expected behavior for the `anon` role when no anon policies exist.
- Do not design client use of `service_role`.
- Do not expose or request secrets, tokens, passwords, URLs, or keys.
- Treat service-role bypass testing as out of browser-client scope.

## Policy quality requirements

For every proposed policy include:

- table;
- operation;
- target role;
- short descriptive policy name;
- exact proposed `USING` and/or `WITH CHECK` expression;
- rationale;
- expected allowed and denied behavior.

Review whether existing indexes sufficiently support owner predicates. Recommend an additional index only if it is necessary and not already covered by a primary key, unique index, or existing composite index. Do not modify the T-102 migration in this task.

## Security test matrix

Design reproducible tests, without executing them, covering at least:

1. unauthenticated/anon access;
2. User A own-row SELECT, INSERT, UPDATE, DELETE;
3. User B attempting to read User A rows;
4. User B attempting cross-user INSERT;
5. User B attempting cross-user UPDATE and DELETE;
6. an owner attempting to change `user_id` to another user;
7. child row with restaurant ownership mismatch;
8. menu review linked to a visit from a different restaurant or owner;
9. deleting a visit and verifying only `menu_reviews.visit_id` becomes null;
10. deleting a restaurant and verifying owned visits/menu reviews cascade;
11. profile own-row behavior;
12. places read-only behavior;
13. required SELECT policy presence for UPDATE tests;
14. RLS default-deny behavior before policies are applied.

For each test state the actor, setup, action, expected result, and evidence to capture for assignment submission.

Propose—but do not create—the next migration filename using the standard timestamp format, such as `supabase/migrations/20260715000002_rls_policies.sql`.

## Allowed file changes

Modify only:

- `TASK_BOARD.md` — T-103 to `IN_PROGRESS` after successful preflight;
- `WORK_LOG.md` — planning entry only;
- `docs/chat/hank-chat.md` — complete signed plan ending with `— Hank`.

## Forbidden actions

Do not:

- create or edit an SQL migration file;
- execute SQL;
- connect to or create a Supabase project;
- install or invoke Supabase CLI or packages;
- edit T-102 migration SQL;
- modify React source or environment files;
- create secrets or credentials;
- change Git state, commit, remote, push, or deploy;
- edit Gini's, Any's, or Toby's chat files;
- start T-104 or any later task.

## Completion report

In chat report only:

1. preflight result;
2. planning verdict and important open decisions;
3. files changed;
4. confirmation that no SQL file was created or executed and Supabase was not connected;
5. that the plan awaits Any review and Owner/Toby approval.

