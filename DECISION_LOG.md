# Decision Log — TasteLog Phase 1

Status: `Proposed` · `Accepted` · `Rejected` · `Superseded` · `Deferred`

## D-001: Phase 1 scope follows assignment completion criteria

- Date: 2026-07-15
- Status: Accepted
- Decided by: Owner planning source + Toby synthesis
- Related: all tasks
- Decision: Auth/RLS, full restaurant CRUD, visit/menu records, search/filter/sort, responsive/error states, GitHub/Vercel and submission evidence are Phase 1. Long-term features are excluded.
- Reason: 제출 가능성과 기간 내 검증을 우선합니다.
- Consequence: 지도·사진·social 기능 요청은 별도 후속 결정 전 구현하지 않습니다.

## D-002: Fast capture with nullable official place

- Date: 2026-07-15
- Status: Accepted
- Decision: `user_restaurants.display_name`만 필수이며 `place_id`는 nullable입니다.
- Reason: 기억나는 이름부터 저장하는 핵심 UX를 보호합니다.
- Risk: 중복/부정확한 장소명은 Phase 1에서 허용합니다.

## D-003: Shared multi-user tables with owner RLS

- Date: 2026-07-15
- Status: Accepted
- Decision: 사용자별 table을 만들지 않고 공통 table에 `user_id`를 저장하며 `auth.uid() = user_id`로 모든 CRUD를 제한합니다.
- Reason: 관계형 DB와 다중 사용자 보안을 올바르게 학습합니다.
- Risk: FK와 RLS를 함께 잘못 구성하면 data leak 또는 insert failure가 발생할 수 있어 두 계정 테스트가 필수입니다.

## D-004: One primary implementer per task

- Date: 2026-07-15
- Status: Accepted
- Decision: task마다 Gini 또는 Hank 한 명만 코드를 수정하고 reviewer는 기본적으로 findings만 제공합니다.
- Reason: 충돌·중복·맥락 손실을 줄입니다.

## D-005: Phase 1 visit UX, extensible DB

- Date: 2026-07-15
- Status: Accepted
- Decision: DB는 restaurant 1:N visits를 지원하되 Phase 1 UI는 한 식당의 현재/대표 방문 1건 중심으로 구현할 수 있습니다.
- Reason: 확장 가능성을 유지하면서 과제 복잡도를 제한합니다.
- Risk: UI/쿼리가 어떤 visit을 대표로 표시하는지 명확히 해야 합니다.

## D-006: Secrets and deployment authority

- Date: 2026-07-15
- Status: Accepted
- Decision: secret은 협업문서에 기록하지 않으며 외부 project 생성, SQL 실행, GitHub push, Vercel deploy는 Owner 승인 하에 수행합니다.
- Reason: 보안과 외부 변경 통제.

## D-009: Initialize a local Git repository

- Date: 2026-07-15
- Status: Accepted
- Decided by: Owner + Toby
- Related: B-006, T-101, T-113
- Decision: 반복 생성되는 빈 `.git/`을 계속 삭제하지 않고, 해당 경로에서 정식 로컬 Git repository로 초기화한다. 기본 branch는 `main`이다. remote 추가, commit, push, GitHub 연결은 수행하지 않으며 GitHub 연결은 별도 Owner 승인 후 수행한다.
- Reason: Cursor 작업 환경에서 빈 `.git`이 재생성되는 패턴을 안정화하고, 이후 승인된 버전 관리 준비만 남긴다.
- Consequence: 로컬 repo는 존재하되 uncommitted working tree만 둔다. `.agents/`는 Cursor 작업용으로 유지한다.

## D-010: Initial schema migration integrity design

- Date: 2026-07-15
- Status: Accepted
- Decided by: Owner + Toby implementation prompt
- Related: T-102, T-103
- Decision: T-102 initial schema uses owner-first composite uniqueness and foreign keys: `user_restaurants unique (user_id, id)`, `visits foreign key (user_id, restaurant_id)`, and `menu_reviews foreign key (user_id, restaurant_id)`. Optional menu-to-visit linkage uses the triple relation `(user_id, restaurant_id, visit_id)` referencing `visits(user_id, restaurant_id, id)`.
- Decision: Phase 1 uses `ON DELETE RESTRICT` for the optional menu-to-visit foreign key; restaurant deletion still cascades to restaurant-owned visits and menu reviews.
- Decision: Initial schema enables RLS on all five tables, but RLS policies are deferred to T-103. With no policies, default deny is intentional.
- Decision: `gen_random_uuid()` is used directly and the migration does not create the `pgcrypto` extension.
- Decision: T-102 schema migration and future T-103 policy migration must not be applied externally until both are written, reviewed, and Owner approves one ordered execution.
- Reason: Declarative owner integrity reduces trigger complexity, RLS enablement prevents accidental open table exposure, and ordered execution keeps schema/policy rollout controlled.
- Consequence: T-102 can be reviewed as a static SQL artifact; actual Supabase execution remains blocked until T-103 and Owner approval.

## D-011: Optional visit FK delete action correction

- Date: 2026-07-15
- Status: Accepted
- Decided by: Owner + Toby
- Related: T-102, D-010
- Supersedes: D-010의 `ON DELETE RESTRICT` 부분만
- Decision: 선택적 `menu_reviews` → `visits` 외래 키의 delete action을 `ON DELETE RESTRICT`에서 `ON DELETE SET NULL (visit_id)`로 변경한다. `user_id`와 `restaurant_id`는 유지한다.
- Reason: `restaurant` 또는 `auth user` 삭제 시 `visits`와 `menu_reviews`로 전파되는 `CASCADE`와의 충돌 가능성을 제거하면서, 메뉴 리뷰의 사용자 소유권과 식당 연결은 유지하기 위함이다.
- Consequence: D-010 전체를 폐기하지 않는다. Owner-first composite FK design, RLS enablement without policies, no `pgcrypto`, and no external execution before reviewed approval remain accepted.

## D-012: T-103 RLS policy design

- Date: 2026-07-15
- Status: Accepted
- Decided by: Owner + Toby
- Related: T-103
- Decision: `user_restaurants`, `visits`, `menu_reviews`의 RLS 소유자 검사는 `((select auth.uid()) = user_id)`를 사용한다.
- Decision: T-102의 복합 `UNIQUE`/`FK`가 부모·소유자·식당·선택적 방문 연결의 무결성을 보장하므로 RLS의 중복 `EXISTS` 하위 쿼리는 사용하지 않는다.
- Decision: `profiles`는 authenticated 사용자가 자신의 `id` 행만 SELECT, INSERT, UPDATE할 수 있고 직접 DELETE 정책은 만들지 않는다.
- Decision: `places`는 authenticated 사용자에게 SELECT만 허용하며 브라우저 INSERT, UPDATE, DELETE는 허용하지 않는다.
- Decision: anon 정책은 만들지 않고 5개 테이블 모두 기본 차단한다.
- Decision: `service_role`은 브라우저와 클라이언트에서 사용하거나 노출하지 않는다.
- Decision: Any가 제안한 변경에 따라 보안 테스트는 RLS-01부터 RLS-14까지만 유지하고 RLS-15와 RLS-16은 제외한다.
- Reason: Any의 Medium 및 Low 수정 의견을 수용한 최종 결정이다. 단순 소유자 정책은 중복 쿼리 비용과 nested RLS 복잡성을 줄이고, 구조적 무결성은 T-102 제약 조건에 맡긴다.
- Consequence: T-103 RLS migration은 operation-specific authenticated policy만 포함하며, SQL 실행은 Any final review와 Owner 승인 전까지 보류한다.

## D-013: Establish the Private GitHub baseline

- Date: 2026-07-17
- Status: Accepted
- Decided by: Owner + Toby
- Related: B-001, D-006, D-009
- Decision: 승인된 T-100~T-103 결과를 최초 commit `chore: establish TasteLog Phase 1 baseline`으로 기록하고 Private GitHub repository `https://github.com/tonykks/tastelog`의 `main` branch에 push한다.
- Decision: GitHub remote 이름은 `origin`으로 하고 local `main`이 `origin/main`을 추적하도록 설정한다.
- Decision: `.env`, `.env.*`(단 `.env.example` 제외), `node_modules/`, `dist/`, `.agents/`, Supabase local working state는 commit하지 않는다.
- Reason: 노트북과 데스크탑에서 동일한 versioned 기준점을 clone하고 안전하게 작업을 이어가기 위함이다.
- Consequence: D-009의 commit·remote·push 보류는 이 최초 Private GitHub 기준점 작업에 한해 해제된다. Supabase 연결·SQL 실행·배포·T-104는 별도 Owner 승인 전까지 계속 보류한다.

## D-014: Harden `set_updated_at` with a forward migration

- Date: 2026-07-17
- Status: Accepted
- Decided by: Owner + Toby
- Related: T-104, D-010, Security Advisor
- Decision: 이미 remote에 적용된 `20260715000001_initial_schema.sql`과 `20260715000002_rls_policies.sql`은 수정하거나 rename하지 않는다.
- Decision: Security Advisor의 `function_search_path_mutable` WARN은 새 forward migration `20260717000003_harden_set_updated_at_search_path.sql`에서 `ALTER FUNCTION public.set_updated_at() SET search_path = pg_catalog;`만 적용해 해결한다.
- Decision: Performance Advisor의 `place_id` 미인덱싱 및 unused index INFO는 이번 보정 범위에서 변경하지 않는다.
- Reason: 적용된 migration history의 재현성을 보존하면서 함수의 이름 해석 경로를 고정해 보안 경고를 최소 변경으로 해소한다.
- Consequence: 새 migration은 Hank review와 Owner/Toby의 실제 push 승인 전까지 local pending 상태로 유지한다.

## D-015: Close T-104 and publish an Auth checkpoint

- Date: 2026-07-17
- Status: Accepted
- Decided by: Owner + Toby
- Related: T-104, D-013, D-014
- Decision: Owner의 실제 회원가입·email confirmation·로그인·로그아웃·재로그인·새로고침 session 유지·잘못된 비밀번호 오류 확인과 Hank narrow re-review `Approve`를 근거로 T-104를 `DONE` 처리한다.
- Decision: T-104 source, Supabase CLI/config 및 migration 003, 협업 기록, `TOBY_HANDOFF_20260717.md`를 commit `feat: complete T-104 Supabase authentication`으로 Private GitHub `main`에 push한다.
- Decision: `.env.local`, secret, database password, service-role key, `node_modules/`, `dist/`, Supabase local temporary state는 checkpoint에서 제외한다.
- Reason: 새 Agent 창과 다른 PC가 검증된 T-104 완료 상태에서 T-105를 안전하게 준비할 수 있도록 재현 가능한 Git 기준점을 만든다.
- Consequence: T-100~T-104는 재수행하지 않는다. T-105는 Owner/Toby의 별도 시작 승인 전 자동 착수하지 않는다.
- Result: checkpoint commit `91f7b5d0047b5f716c85822682cbbcc2a0fc6582`가 `origin/main`에 push 완료됐고 local `main`과 동일하다.

## D-007: Final product name

- Date: 2026-07-18
- Status: Accepted
- Decided by: Owner + Toby
- Related: T-110, T-112
- Decision: 화면 주 brand는 `다시갈집`, 보조 brand/technical identity는 `TasteLog`이다. Browser title은 `다시갈집 | TasteLog`이다. GitHub repository와 technical project name은 TasteLog를 유지한다.
- Reason: Owner가 T-110 시작 승인에서 화면 표시명과 technical identity를 분리해 확정했다.
- Consequence: UI header·Auth·document title은 다시갈집/TasteLog 병기를 따르며 DB table·기능 API 이름은 변경하지 않는다.

## D-008: UI implementation style

- Date: 2026-07-18
- Status: Accepted
- Decided by: Owner + Toby
- Related: T-110, T-101
- Decision: Phase 1 UI는 plain CSS만 사용한다. Visual theme은 warm off-white 배경, 기존 purple primary accent, gold rating star, visited purple badge, unvisited neutral gray/lavender, destructive red, white card + thin border + light shadow이다. UI library·icon package·과도한 animation은 추가하지 않는다.
- Reason: 과제 설명·유지보수 용이성과 Owner 확정 theme을 맞춘다.
- Consequence: T-110은 CSS variables와 공통 RatingStars로 적용하며 package.json에 UI framework를 추가하지 않는다.

## Proposed decisions for Owner

### D-007: Final product name

- Status: Accepted — see Accepted section above (2026-07-18). Historical options were `TasteLog`, `다시갈집`, 병기; Owner chose primary `다시갈집` with auxiliary `TasteLog`.

### D-008: UI implementation style

- Status: Accepted — see Accepted section above (2026-07-18). Historical options were plain CSS vs approved UI library; Owner chose plain CSS with the warm off-white + purple + gold-star theme.
