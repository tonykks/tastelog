# T-103 Any Independent RLS Plan Review

## Identity and task

You are **Any**. Independently review Hank's T-103 RLS policy and security test plan. This is a planning review only.

Before working, read:

1. `TOBY_OPERATING_GUIDE.md`
2. The complete required reading order in `AGENTS.md`
3. `PROJECT_CONTEXT.md`
4. `DECISION_LOG.md`
5. `TASK_BOARD.md`
6. the latest entries in `WORK_LOG.md`
7. `docs/PHASE1_REQUIREMENTS.md`
8. `docs/DATABASE_AND_RLS.md`
9. `docs/TEST_AND_SUBMISSION.md`
10. all current files under `docs/chat/`
11. `supabase/migrations/20260715000001_initial_schema.sql`

In `docs/chat/hank-chat.md`, locate the section titled `T-103 RLS policy and security test plan`. The file's historical sections may not be in perfect chronological order, so identify the section by task heading rather than assuming the last section is current.

## Owner/Toby provisional decisions to review

Review and either approve or challenge these provisional decisions:

1. `places`: allow SELECT to `authenticated` users with a read-only policy; create no browser INSERT, UPDATE, or DELETE policies.
2. `profiles`: allow an authenticated user to INSERT, SELECT, and UPDATE only the row whose `id` equals `(select auth.uid())`; create no direct browser DELETE policy.
3. `anon`: create no policies on any of the five Phase 1 tables.
4. Browser/client code must never use `service_role`.

## Required policy review

For each table and operation, verify:

- the target role is appropriate;
- SELECT uses `USING` only;
- INSERT uses `WITH CHECK` only;
- UPDATE uses both `USING` and `WITH CHECK`;
- DELETE uses `USING` only;
- owner expressions prevent cross-user access and ownership changes;
- separate policies are preferable to a broad `FOR ALL` policy;
- policy names and behavior are understandable and reproducible.

Tables:

- `profiles`
- `places`
- `user_restaurants`
- `visits`
- `menu_reviews`

## High-priority architectural question

Independently determine whether Hank's parent ownership `EXISTS` subqueries are necessary for `visits` and `menu_reviews`.

T-102 already enforces owner and parent consistency through composite UNIQUE and FOREIGN KEY constraints. Compare these alternatives:

- simple RLS: `(select auth.uid()) = user_id`, relying on T-102 constraints for parent integrity;
- defense-in-depth RLS: owner check plus parent ownership `EXISTS` subquery.

Evaluate correctness, nested RLS behavior, recursion risk, PostgREST behavior, query cost, index support, maintainability, and whether the extra subqueries materially improve Phase 1 security. Recommend one approach clearly.

Also determine whether the optional visit consistency `EXISTS` check in `menu_reviews` adds security beyond the existing composite FK or is redundant complexity.

## Security test review

Review Hank's complete test matrix for:

- own CRUD success;
- cross-user SELECT/INSERT/UPDATE/DELETE denial;
- attempted ownership change;
- mismatched parent and child ownership;
- cross-restaurant optional visit links;
- visit deletion setting only `visit_id` to null;
- restaurant cascade behavior;
- profile access;
- places authenticated read-only behavior;
- anonymous default-deny;
- absence of secrets in evidence.

Identify missing, duplicated, infeasible, or unnecessarily complicated tests. Recommend the smallest adequate Phase 1 test set and required evidence for submission.

## Compatibility and safety review

Confirm that:

- T-103 should use a new migration after `20260715000001_initial_schema.sql`;
- the proposed next name `20260715000002_rls_policies.sql` follows project convention;
- T-102 schema migration should not be edited;
- no SQL should be executed before implementation review and Owner/Toby approval;
- no Supabase connection, CLI/package installation, React edit, Git commit/push, or deployment is needed for this planning review.

## Allowed write

Append the review result only to `docs/chat/any-chat.md` and sign it `— Any`.

Do not modify any other file. Do not create SQL, connect Supabase, execute SQL, install anything, start implementation, or start a later task.

## Verdict

Return one:

- `Approve`
- `Approve with changes`
- `Reject`

For every finding include severity, exact policy/test area, reason, consequence, and recommended change.

In terminal chat, report only the verdict, number of findings by severity, important open decision(s), and confirmation that the full result was appended to `docs/chat/any-chat.md`.

