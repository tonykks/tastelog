# T-102 — Hank Initial Schema Migration Implementation

## Agent setting

- Agent: Hank
- Model: GPT-5.6 Sol
- Reasoning: High
- MAX/Ultra: Off

## Goal

Owner와 Toby가 확정한 T-102 schema 결정을 반영하여 **실행하지 않은 초기 schema migration SQL 파일**을 작성하고 정적으로 검증합니다.

## Required reading

1. `TOBY_OPERATING_GUIDE.md`
2. `AGENTS.md` Required reading order 전체
3. `docs/chat/hank-chat.md`
4. `docs/chat/any-chat.md`
5. 이 prompt file

## Final decisions to implement

1. Create five tables: `profiles`, `places`, `user_restaurants`, `visits`, `menu_reviews`.
2. Keep `places` and nullable `user_restaurants.place_id` in Phase 1.
3. Keep `profiles.username` nullable and non-unique.
4. Use `gen_random_uuid()` directly. Do **not** create `pgcrypto` extension.
5. Use one safe `updated_at` function and triggers for all mutable tables.
6. Enforce owner consistency declaratively with composite UNIQUE/FK constraints.
7. Optimize owner-first column order consistently:
   - `user_restaurants UNIQUE (user_id, id)`
   - `visits FOREIGN KEY (user_id, restaurant_id) REFERENCES user_restaurants(user_id, id)`
   - `visits UNIQUE (user_id, restaurant_id, id)`
   - `menu_reviews FOREIGN KEY (user_id, restaurant_id) REFERENCES user_restaurants(user_id, id)`
   - optional visit FK: `FOREIGN KEY (user_id, restaurant_id, visit_id) REFERENCES visits(user_id, restaurant_id, id)`
8. `visit_id` remains nullable; default `MATCH SIMPLE` provides an absent optional relation when it is NULL.
9. Use `ON DELETE RESTRICT` for the optional menu-to-visit FK in Phase 1. Do not use column-specific `SET NULL` until target PostgreSQL version and deletion workflow are deliberately upgraded.
10. Restaurant deletion cascades to visits and menu reviews.
11. Place deletion sets only `user_restaurants.place_id` to NULL.
12. Auth user deletion cascades to owned profile/restaurant/visit/menu rows.
13. Enable RLS on all five tables in this initial migration. Do not add policies yet. With no policies, default deny is intentional until T-103.
14. The schema migration and future T-103 policy migration must not be applied externally until both have been written, reviewed, and Owner approves one ordered execution.

## Validation constraints

- `display_name`: required and `btrim(display_name) <> ''`
- `menu_name`: required and `btrim(menu_name) <> ''`
- `status`: `unvisited` or `visited`, default `unvisited`
- ratings: NULL or 1–5
- price: NULL or integer >= 0
- `place_id`, `visited_at`, notes, ratings, price, and `visit_id` nullable as designed
- duplicate free-text restaurant names allowed

## Minimal Phase 1 index plan

Do not add a standalone `user_restaurants(user_id)` index because `UNIQUE(user_id, id)` covers the owner prefix.

Add only indexes justified by Phase 1 queries and FK operations:

- `user_restaurants(user_id, status)`
- `user_restaurants(user_id, updated_at DESC)`
- `visits(user_id, restaurant_id, visited_at DESC)`
- `visits(user_id, revisit_intention)` only if clearly justified for dashboard filtering; otherwise defer
- `menu_reviews(user_id, restaurant_id)`
- `menu_reviews(user_id, restaurant_id, visit_id)` with `WHERE visit_id IS NOT NULL` for optional visit-reference lookup, if not already adequately covered

Defer `places(official_name)`, `user_restaurants(place_id)`, rating-sort indexes, trigram/full-text indexes, and speculative indexes unless the SQL comments clearly justify a required FK/query need.

## Migration artifact

Create:

```text
supabase/migrations/20260715_001_initial_schema.sql
```

If the folder does not exist, create only this required folder path.

Recommended SQL order:

1. Header comments and scope
2. `updated_at` function
3. `profiles`
4. `places`
5. `user_restaurants`
6. `visits`
7. `menu_reviews`
8. indexes
9. updated_at triggers
10. `ALTER TABLE ... ENABLE ROW LEVEL SECURITY` for all five tables
11. comments explaining default deny and T-103 handoff

Use explicit, readable constraint and trigger names.

## Static verification

- Review SQL creation/dependency order.
- Verify referenced UNIQUE columns and FK column order/types match exactly.
- Verify no policy SQL is present.
- Verify all five tables have RLS enabled.
- Verify no `pgcrypto` extension statement exists.
- Verify no secret, URL, password, or token exists.
- Verify no destructive DROP statements exist.
- Verify no SQL was executed.

Do not install Supabase CLI, PostgreSQL, parser, or npm packages just to validate this file.

## Durable decisions

Add an Accepted entry to `DECISION_LOG.md` recording:

- owner-first composite FK design
- triple optional visit relation
- `ON DELETE RESTRICT` for visit deletion in Phase 1
- RLS enabled in initial schema with policies deferred to T-103
- no `pgcrypto` extension
- no external execution before T-102 and T-103 are both approved

Use the next available decision ID after the current log; do not overwrite an existing ID.

## Allowed changes

- `supabase/migrations/20260715_001_initial_schema.sql`
- `DECISION_LOG.md`
- `TASK_BOARD.md` for T-102 only
- `WORK_LOG.md`
- `docs/chat/hank-chat.md`

## Forbidden actions

- Do not execute SQL.
- Do not connect to Supabase.
- Do not install packages or CLI.
- Do not edit React source.
- Do not add RLS policies; T-103 owns them.
- Do not commit, add remote, push, or deploy.
- Do not start T-103.
- Do not edit Gini, Toby, or Any chat files.

## Completion state

After successful file creation and static review:

- Set T-102 to `REVIEW`, reviewer Any.
- Record exact changed files and checks in `WORK_LOG.md`.
- Replace Hank's own chat with implementation result, remaining risks, and review request.
- Sign the chat with `— Hank`.

If any final decision is technically inconsistent, do not improvise. Stop and report the exact conflict before creating SQL.
