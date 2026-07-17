# Database and RLS Design Basis

> 이 문서는 migration 구현 전 합의 기준입니다. 실행 가능한 SQL은 담당자가 별도 migration file로 작성하고 reviewer가 검토한 뒤 Owner 승인으로 실행합니다.

## Relationships

```text
auth.users 1—1 profiles
auth.users 1—N user_restaurants
places 1—N user_restaurants (optional link)
user_restaurants 1—N visits
user_restaurants 1—N menu_reviews
visits 1—N menu_reviews (optional link in Phase 1)
```

## Tables

### profiles

| Column | Type | Rule |
|---|---|---|
| id | uuid | PK, FK auth.users(id), cascade |
| username | text | nullable or chosen onboarding rule |
| created_at | timestamptz | default now() |

### places

| Column | Type | Rule |
|---|---|---|
| id | uuid | PK, generated |
| official_name | text | official shared label |
| address, phone, map_url | text | nullable |
| lat, lng | numeric | nullable |
| provider, external_place_id | text | nullable; future integration |

Phase 1에서는 table을 준비하거나 최소 구현할 수 있으며 외부 place search는 하지 않습니다.

### user_restaurants

| Column | Type | Rule |
|---|---|---|
| id | uuid | PK, generated |
| user_id | uuid | not null, FK auth.users |
| place_id | uuid | nullable, FK places |
| display_name | text | not null, trimmed/non-empty check |
| area_hint, category, recommendation_note | text | nullable |
| status | text | not null, `unvisited` or `visited` |
| created_at, updated_at | timestamptz | default now(); updated_at maintained |

Indexes: `user_id`, `(user_id, status)`, optionally `(user_id, updated_at desc)`.

### visits

| Column | Type | Rule |
|---|---|---|
| id | uuid | PK, generated |
| restaurant_id | uuid | not null, FK user_restaurants, cascade |
| user_id | uuid | not null, FK auth.users |
| visited_at | date | nullable |
| overall_rating | smallint | nullable, check 1–5 |
| visit_note | text | nullable |
| revisit_intention | boolean | not null, default false |
| revisit_note | text | nullable |
| created_at, updated_at | timestamptz | recommended |

Indexes: `restaurant_id`, `user_id`, optionally `(restaurant_id, visited_at desc)`.

### menu_reviews

| Column | Type | Rule |
|---|---|---|
| id | uuid | PK, generated |
| visit_id | uuid | nullable, FK visits, cascade/set null must be explicitly selected |
| restaurant_id | uuid | not null, FK user_restaurants, cascade |
| user_id | uuid | not null, FK auth.users |
| menu_name | text | not null, trimmed/non-empty check |
| price | integer | nullable, check >= 0 |
| taste_rating | smallint | nullable, check 1–5 |
| memo | text | nullable |
| created_at, updated_at | timestamptz | recommended |

Indexes: `restaurant_id`, `visit_id`, `user_id`.

## Ownership integrity

`user_id` duplication in child tables supports direct RLS, but it creates an integrity risk if a child `user_id` does not match its parent restaurant owner. The implementation must choose and document one safe approach:

1. composite owner foreign keys/unique constraints, or
2. validated trigger/function, or
3. strict insert/update policy with parent ownership checks plus service-layer assignment.

Toby recommendation: policy must include both `auth.uid() = user_id` and `EXISTS` parent ownership checks for visits/menu reviews; never trust a client-supplied owner id alone.

## RLS policy intent

Enable RLS on `profiles`, `user_restaurants`, `visits`, `menu_reviews`; decide whether `places` is authenticated read-only/shared or unused in Phase 1.

- SELECT: row owner is `auth.uid()`; child row's parent must also belong to the user.
- INSERT: `WITH CHECK` owner equals `auth.uid()` and parent ownership is valid.
- UPDATE: both `USING` and `WITH CHECK` enforce current/new owner and parent ownership.
- DELETE: `USING` owner equals `auth.uid()` and parent ownership is valid.
- Profile: user can read/update own profile; insert creation flow must be explicit.

## Required security tests

Use two accounts A and B.

1. A creates restaurant, visit, menu review.
2. A can read/update/delete own rows.
3. B cannot select A rows through normal query.
4. B cannot update/delete A row even if it knows the UUID.
5. B cannot create a visit/menu pointing to A's restaurant.
6. Anonymous user cannot read owner tables.
7. Cascade delete removes intended child rows without affecting another user's data.

## Migration safety

- Keep schema/migration SQL in version control without secrets.
- Prefer idempotent or clearly ordered migrations.
- Do not paste production credentials into SQL files or logs.
- Record applied migration and result in `WORK_LOG.md`.
- Before destructive schema changes, provide impact and rollback plan.
