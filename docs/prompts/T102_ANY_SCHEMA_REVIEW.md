# T-102 — Any Independent Schema Review

## Agent setting

- Agent: Any
- Preferred model: Gemini 3.1 Pro (High)
- Alternative: Gemini 3.5 Flash (Medium)

## Instruction

`TOBY_OPERATING_GUIDE.md`, `AGENTS.md`, all required project documents, and `docs/chat/hank-chat.md`를 먼저 읽습니다.

Hank의 T-102 schema plan을 독립적으로 검토하고 결과만 `docs/chat/any-chat.md`에 작성합니다.

### Review focus

1. Five-table schema suitability for Phase 1.
2. Composite owner integrity between restaurants, visits, and menu reviews.
3. Triple optional visit FK consistency: visit, restaurant, and user.
4. Nullable composite FK and `MATCH SIMPLE` behavior.
5. PostgreSQL-version compatibility of column-specific `ON DELETE SET NULL (visit_id)`.
6. Cascade paths through `auth.users` and parent tables.
7. Restaurant/place/visit delete behavior and data-loss risk.
8. Whether `pgcrypto` is required for `gen_random_uuid()`.
9. Timestamp trigger complexity.
10. Required, optional, deferred, and duplicate indexes.
11. Supabase/PostgREST CRUD implications.
12. Risk of creating tables before RLS policies exist.
13. Whether initial schema should enable RLS with default deny.
14. Rollback versus forward corrective migrations.

### Boundaries

- Do not create or edit SQL/code.
- Do not connect to Supabase.
- Do not install packages.
- Do not modify shared logs or another Agent's chat.
- Write only `docs/chat/any-chat.md` and sign `— Any`.

Use verdict `Approve`, `Approve with changes`, or `Reject`, with Critical/High/Medium/Low findings and concrete required changes.
