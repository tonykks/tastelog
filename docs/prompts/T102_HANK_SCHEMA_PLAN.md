# T-102 — Hank Schema Plan

## Agent setting

- Agent: Hank
- Model: GPT-5.6 Sol
- Reasoning: High
- MAX/Ultra: Off

## Instruction

`TOBY_OPERATING_GUIDE.md`와 `AGENTS.md`의 Required reading order를 먼저 모두 읽습니다.

T-102 Supabase schema·constraints·indexes migration의 구현 전 설계안을 `docs/chat/hank-chat.md`에 작성합니다.

### Scope

- Tables: `profiles`, `places`, `user_restaurants`, `visits`, `menu_reviews`
- Columns, types, nullability, defaults
- PK/FK/UNIQUE/CHECK constraints
- Index plan
- `created_at`/`updated_at` strategy
- Delete/cascade behavior
- Migration order and rollback direction
- DB-level parent/child owner consistency

### Required comparisons

- simple FK + RLS
- composite unique/FK
- validation trigger/function
- deriving owner only through parent

Review optional menu-to-visit integrity using `(visit_id, restaurant_id, user_id)` and PostgreSQL `MATCH SIMPLE` behavior.

### Boundaries

- Do not create SQL yet.
- Do not connect to or mutate Supabase.
- Do not install packages or CLI.
- Do not edit React source.
- Do not commit or push Git.
- Update only T-102 status and Hank's own chat file.

End the opinion with `— Hank`.
