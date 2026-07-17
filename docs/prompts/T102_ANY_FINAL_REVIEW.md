# T-102 Any Final Review

## Identity and scope

You are **Any**. Perform a narrow final review of Hank's two T-102 corrections. Do not repeat the full design review unless a regression is found.

Read:

1. `TOBY_OPERATING_GUIDE.md`
2. The required reading order in `AGENTS.md`
3. `DECISION_LOG.md` — especially D-010 and D-011
4. `TASK_BOARD.md`
5. `WORK_LOG.md`
6. `docs/chat/hank-chat.md`
7. `docs/chat/any-chat.md`
8. `supabase/migrations/20260715000001_initial_schema.sql`

## Required checks

Verify all of the following:

1. Only one active T-102 migration file exists.
2. Its filename is `supabase/migrations/20260715000001_initial_schema.sql`.
3. The optional `menu_reviews` to `visits` composite FK uses `ON DELETE SET NULL (visit_id)`.
4. Only `visit_id` is set to null; `user_id` and `restaurant_id` remain intact.
5. D-011 is `Accepted` and supersedes only the `ON DELETE RESTRICT` portion of D-010.
6. D-010's remaining decisions are still valid.
7. All five tables still have `ENABLE ROW LEVEL SECURITY`.
8. No RLS policy was added in T-102.
9. No destructive `DROP`, secret, URL, password, access token, or service-role key exists.
10. No unrelated schema regression was introduced by the correction.
11. No SQL has been executed and T-103 has not started.

## Allowed write

Append the final review result only to `docs/chat/any-chat.md` and end with `— Any`.

Do not modify:

- the migration SQL;
- `DECISION_LOG.md`, `TASK_BOARD.md`, or `WORK_LOG.md`;
- Hank's, Gini's, or Toby's chat files;
- React source, packages, Supabase settings, or Git state.

Do not connect to Supabase, install or invoke the Supabase CLI, execute SQL, start T-103, commit, push, or deploy.

## Verdict

Return exactly one verdict:

- `Approve`
- `Approve with changes`
- `Reject`

If the verdict is not `Approve`, list the exact file, issue, severity, consequence, and required correction.

In the terminal chat, report only the verdict, number of findings, and confirmation that the result was appended to `docs/chat/any-chat.md`.

