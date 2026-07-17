# T-102 Hank Correction After Any Review

## Identity and task

You are **Hank**. Correct only the T-102 migration issues accepted by Owner/Toby after Any's independent review.

Before working, read:

1. `TOBY_OPERATING_GUIDE.md`
2. The complete required reading order in `AGENTS.md`
3. `DECISION_LOG.md`
4. `TASK_BOARD.md`
5. `WORK_LOG.md`
6. `docs/chat/hank-chat.md`
7. `docs/chat/any-chat.md`
8. `docs/prompts/T102_HANK_MIGRATION_IMPLEMENT.md`
9. `supabase/migrations/20260715_001_initial_schema.sql`

## Toby decision

Any's current implementation review is **Approve with changes**. Apply only these two accepted corrections:

1. Replace the optional visit foreign key action on `menu_reviews` from `ON DELETE RESTRICT` to `ON DELETE SET NULL (visit_id)`.
   - Preserve `user_id` and `restaurant_id`.
   - The purpose is to avoid a conflict between restaurant/user cascades and the optional visit reference.
   - PostgreSQL 15 and later support a column list for `ON DELETE SET NULL`.
2. Rename the migration file to the standard timestamp form:
   - From: `supabase/migrations/20260715_001_initial_schema.sql`
   - To: `supabase/migrations/20260715000001_initial_schema.sql`

The earlier design-review remarks at the beginning of `any-chat.md` are historical context. Do not reapply changes that are already present. In particular:

- Keep `ENABLE ROW LEVEL SECURITY` on all five tables.
- Do not add any RLS policy in T-102.
- Keep `UNIQUE (user_id, id)` if already implemented.
- Keep `pgcrypto` absent.

## Required collaboration updates

- Add a new accepted decision to `DECISION_LOG.md` that supersedes only the `ON DELETE RESTRICT` portion of D-010.
- Keep T-102 in `REVIEW` after correction; it is not `DONE` until the final review is accepted.
- Add a concise correction entry to `WORK_LOG.md`.
- Append a signed handoff to `docs/chat/hank-chat.md` ending with `— Hank`.
- Update references to the old migration filename only where they directly identify the active T-102 migration artifact.

## Static verification

Verify and report all of the following:

- Only one active T-102 migration file exists.
- The active filename is `20260715000001_initial_schema.sql`.
- `menu_reviews` uses `ON DELETE SET NULL (visit_id)` for the optional visit FK.
- The FK keeps `user_id` and `restaurant_id` intact.
- All five tables still enable RLS.
- No `CREATE POLICY` or `ALTER POLICY` exists.
- No `DROP`, secret, URL, password, access token, or service-role key exists.
- No SQL was executed.

## Forbidden actions

Do not:

- connect to Supabase;
- install or invoke the Supabase CLI;
- execute SQL or run a remote/local database;
- install packages;
- modify React source;
- start T-103;
- create a Git commit, remote, push, or deployment;
- modify Gini's or Any's chat files.

## Completion report

In chat, report only:

1. corrected files;
2. the two accepted corrections;
3. static verification result;
4. confirmation that T-102 remains `REVIEW` and awaits final review.

