# Any Chat

## Any -> Owner, Toby, Gini, Hank

- Date: 2026-07-15
- Related task: T-102 independent schema review
- Status: Review complete

### Context reviewed

- `TOBY_OPERATING_GUIDE.md`, `AGENTS.md`, `PROJECT_CONTEXT.md`
- `docs/PHASE1_REQUIREMENTS.md`, `docs/DATABASE_AND_RLS.md`
- `TASK_BOARD.md`, `DECISION_LOG.md`, `WORK_LOG.md`
- `docs/TEST_AND_SUBMISSION.md`
- Current chat files (`hank-chat.md`, `gini-chat.md`, `toby-chat.md`, `CHAT_PROTOCOL.md`)

### Overall verdict

- Approve with changes

### Critical findings

- **초기 노출 방어**: T-102 마이그레이션에서 테이블 생성 시점 직후에 반드시 `ALTER TABLE [table_name] ENABLE ROW LEVEL SECURITY;`를 실행해야 합니다. 테이블만 만들고 정책이 없는 상태에서 RLS가 활성화되면 모든 쿼리가 거부(Default Deny)되므로 안전합니다.

### High findings

- `ON DELETE SET NULL (visit_id)` 문법은 PostgreSQL 15부터 지원됩니다. Supabase 최신 프로젝트는 PG 15+를 사용하므로 안전할 가능성이 높지만, 버전이 확실치 않다면 `ON DELETE RESTRICT`를 지정하고 삭제 전 애플리케이션/서비스 레벨에서 `visit_id`를 `null`로 명시적 업데이트 후 삭제하는 것이 더 안전한 대안입니다.
- `gen_random_uuid()` 함수는 PostgreSQL 13부터 내장(Core) 함수이므로 `CREATE EXTENSION pgcrypto` 확장을 설치할 필요가 없습니다. 마이그레이션에서 제외해도 됩니다.

### Medium findings

- **인덱스 최적화**: `user_restaurants` 테이블의 `UNIQUE (id, user_id)` 대신 컬럼 순서를 `UNIQUE (user_id, id)`로 변경하면, PostgreSQL 내부적으로 생성되는 유니크 인덱스가 선두 컬럼인 `user_id` 인덱스 역할까지 함께 수행할 수 있어 단독 `user_id` 인덱스 생성을 줄일 수 있습니다.

### Low findings

- `places` 테이블을 준비만 해두고 `user_restaurants.place_id`를 nullable로 연결하는 설계는 향후 확장을 대비하면서도 Phase 1 요구사항을 해치지 않는 적절한 선택입니다.
- `profiles.username`을 nullable/non-unique로 유지하는 것은 Phase 1 Auth 흐름(단순 가입/로그인)에 최적화된 좋은 결정입니다.

### Composite ownership integrity review

- **매우 우수함**: `user_restaurants`에 복합 Unique 제약을 걸고, 자식 테이블(`visits`, `menu_reviews`)이 복합 FK(`restaurant_id`, `user_id`)로 참조하게 하는 설계는 어플리케이션 결함으로 인해 부모-자식 간 소유자가 불일치하는 것을 DB 엔진 레벨에서 100% 차단합니다. 복잡한 트리거 없이 무결성을 보장하므로 최고 수준의 설계입니다.

### Nullable visit foreign key review

- **정확함**: PostgreSQL의 복합 외래 키는 기본적으로 `MATCH SIMPLE` 방식으로 동작합니다. Hank의 설명대로 `visit_id`가 NULL일 경우 전체 FK 제약 조건 검사를 우회하므로, '선택적인 방문 연결'이라는 Phase 1 요구사항을 안전하고 완벽하게 충족합니다.

### Delete and cascade review

- **안전성 및 기획 부합**: 식당 삭제 시 연관된 `visits`와 `menu_reviews`가 함께 삭제(`CASCADE`)되는 것은 Phase 1 요구사항(경고 확인 후 동시 삭제)에 정확히 부합합니다.
- `places` 삭제 시 `user_restaurants.place_id`만 NULL로 만드는 `SET NULL` 규칙은 공식 장소 데이터가 삭제되어도 개인의 리뷰 기록을 보존하므로 적절합니다.
- `auth.users` 삭제 시 직접 연결된 FK와 부모 테이블을 거쳐 내려오는 FK 간의 다중 Cascade는 PostgreSQL이 한 번의 삭제 작업으로 안전하게 병합 처리하므로 충돌 및 예기치 못한 위험은 없습니다.

### PostgreSQL/Supabase compatibility review

- 복합 외래 키와 인덱스 구성은 Supabase/PostgREST를 통한 CRUD 작업 시 불필요한 어려움을 만들지 않습니다. 클라이언트는 단순히 평문 컬럼값만 전송하면 되며, 검증은 DB 계층에서 투명하게 처리됩니다.
- 단방향 진행 (Forward corrective migration): 데이터가 누적된 이후에는 Destructive rollback을 피하고 수정 마이그레이션을 추가하는 방향이 실무 관행이며 적절합니다.

### Index simplification

- **반드시 필요한 index**: 테이블별 PK 자동 인덱스, `visits(restaurant_id, user_id)`, `menu_reviews(restaurant_id, user_id)`.
- **있으면 좋은 index**: `user_restaurants(user_id, status)`, `user_restaurants(user_id, updated_at desc)`, `visits(restaurant_id, visited_at desc)`, `menu_reviews(user_id)`.
- **Phase 1에서 미뤄도 되는 index**: `places(official_name)`, `user_restaurants(place_id)`, `visits(user_id, revisit_intention)`, `visits(user_id, overall_rating desc)`, `menu_reviews(visit_id, restaurant_id, user_id)`.
- **중복되는 index**: Hank가 제안한 `user_restaurants(user_id)` 단독 인덱스는 복합 유니크 제약 `UNIQUE (user_id, id)`를 사용할 경우 생략 가능합니다.

### RLS execution-order risk

- T-102 스키마와 T-103 RLS 정책을 같은 승인 작업에서 순서대로 실행하더라도, T-102 마이그레이션 직후 T-103이 실행되기 전 미세한 틈이나 실패 시 테이블이 퍼블릭에 노출될 수 있습니다.
- **가장 안전한 방법**: 테이블 생성과 동시에 RLS를 활성화(Enable)하는 것입니다. RLS Policy는 T-103에서 추가하더라도, Enable만 되어 있으면 기본 차단(Default Deny) 모드로 동작하여 데이터를 안전하게 보호할 수 있습니다.

### Recommended final T-102 decisions

- `places` nullable 연결: Accept
- 복합 Unique/FK를 활용한 Owner 무결성 강제: Accept
- 공통 `updated_at` 함수 및 트리거 사용: Accept
- 복합 FK `UNIQUE(user_id, id)` 순서 최적화 반영: Modify
- `ON DELETE SET NULL (visit_id)` 대신 `ON DELETE RESTRICT` (버전 불확실성 대비) 사용: Modify (또는 PG 버전 확인 후 Accept)
- 테이블 생성 마이그레이션 내 `ENABLE ROW LEVEL SECURITY` 적용: Modify
- 불필요한 `pgcrypto` 확장 생성 쿼리 제거: Modify

### Required 소스 변경 전(Required changes before SQL creation)
(요청 형식 호환성을 위해 아래 원본 문구 사용)
### Required changes before SQL creation

1. 5개 테이블 생성 스키마 하단에 각각 `ALTER TABLE [table_name] ENABLE ROW LEVEL SECURITY;` 구문 추가
2. `user_restaurants` 테이블의 고유 제약 조건을 `UNIQUE (id, user_id)`에서 `UNIQUE (user_id, id)`로 변경하여 인덱스 최적화 달성
3. `pgcrypto` 확장(Extension) 설치 구문 제거

### T-103 handoff recommendations

- T-102에서 RLS를 Enable하여 "기본 차단" 방어를 적용한 뒤 T-103으로 인계됩니다.
- T-103에서는 각 테이블의 소유권(Owner) 기반 CRUD 접근 권한(Policy) 작성에만 집중하면 됩니다.

### Owner/Toby decisions needed

- T-102 마이그레이션에 `ENABLE ROW LEVEL SECURITY`를 미리 포함시키는 설계에 대한 최종 승인
- 목표 Supabase PostgreSQL 버전에 따라 `ON DELETE SET NULL (visit_id)`(PG 15+)를 시도할지, 보수적으로 `ON DELETE RESTRICT`를 채택할지 결정

---

## Any -> Owner, Toby, Gini, Hank (T-102 Migration SQL Implementation Review)

- Date: 2026-07-15
- Related task: T-102 Migration SQL implementation review
- Status: Review complete

### Overall verdict

- Approve with changes

### Findings

#### 1. RESTRICT와 CASCADE의 충돌 (식당/사용자 삭제 불가 버그)
- 심각도: Critical
- 파일: `supabase/migrations/20260715_001_initial_schema.sql`
- 대상: `menu_reviews_visit_owner_restaurant_fk` 제약조건의 `ON DELETE RESTRICT` 설정
- 문제의 원인: D-010 지침에 따라 `menu_reviews -> visits` 외래 키에 `ON DELETE RESTRICT`를 적용했습니다. 그러나 부모 테이블인 `user_restaurants`나 `auth.users` 계정을 삭제할 때 하위 테이블인 `visits`와 `menu_reviews`로 `CASCADE` 삭제가 동시에 전파됩니다. PostgreSQL이 여러 하위 테이블에 CASCADE를 적용할 때의 순서는 보장되지 않으므로, 데이터베이스가 `visits` 레코드를 먼저 삭제하려고 시도할 경우, 같이 삭제될 운명인 `menu_reviews` 레코드가 아직 남아있다는 이유로 `RESTRICT` 조건이 즉각(immediate) 발동하여 전체 삭제 트랜잭션을 취소시킵니다.
- 발생할 수 있는 결과: 메뉴 리뷰와 연결된 방문 기록이 하나라도 존재하는 식당(restaurant)이나 해당 사용자(auth.users) 계정 자체를 사용자가 삭제(Delete)하려고 하면, 외래 키 제약 조건 위반 에러가 발생하며 삭제에 완전히 실패합니다.
- 권장 수정 방법: PostgreSQL 15 이상을 타겟으로 하여 외래 키 동작을 `ON DELETE SET NULL (visit_id)`로 수정하는 것이 논리적 모순을 해결하는 유일하고 가장 완벽한 데이터베이스 계층의 해결책입니다. 만약 버전을 이유로 `RESTRICT`를 강제 유지해야 한다면, CASCADE에 의존하지 말고 애플리케이션 또는 서버리스 함수(Service) 단에서 식당 삭제 전 트랜잭션을 통해 명시적으로 자식 레코드들을 해제(NULL 업데이트)하거나 먼저 개별 삭제하도록 설계해야 합니다. 본 과제에서는 DB 차원의 안전한 처리인 `SET NULL (visit_id)` 도입을 강하게 권장합니다.

#### 2. 마이그레이션 파일명 규약 불일치
- 심각도: Minor
- 파일: `supabase/migrations/20260715_001_initial_schema.sql` (파일명)
- 대상: 파일의 이름 형식
- 문제의 원인: T-102 프롬프트에 명시된 파일명을 충실히 따랐으나, 실제 표준 Supabase CLI는 마이그레이션 스크립트를 인식할 때 14자리 타임스탬프(`YYYYMMDDHHMMSS_`) 포맷을 요구합니다.
- 발생할 수 있는 결과: 향후 `supabase db push`나 `migration up` 등의 명령어를 사용할 때 이 파일을 정상적인 순서의 마이그레이션으로 인식하지 못해 데이터베이스에 배포(적용)되지 않을 수 있습니다.
- 권장 수정 방법: 마이그레이션 파일의 이름을 `20260715000001_initial_schema.sql`과 같이 14자리 숫자 접두어를 갖춘 표준 형식으로 리네임할 것을 권장합니다.

 Any

---

## Any -> Owner, Toby, Gini, Hank (T-102 Final Review)

- Date: 2026-07-15
- Related task: T-102 narrow final review of Hank's corrections
- Status: Review complete

### Verdict

- `Approve`

— Any

---

## Any -> Owner, Toby, Gini, Hank

- Date: 2026-07-15
- Related task: T-103 Any Independent RLS Plan Review
- Status: Review complete

### Verdict

- `Approve with changes`

### Findings

#### 1. Redundant EXISTS subqueries in visits and menu_reviews
- Severity: Medium
- Exact policy/test area: `visits` and `menu_reviews` RLS policies
- Reason: Hank's proposed `EXISTS` subqueries for parent ownership and optional visit consistency are redundant. T-102 already enforces owner and parent consistency through composite UNIQUE and FOREIGN KEY constraints. The DB foreign key constraint (`user_id`, `restaurant_id`) perfectly guarantees that the `restaurant_id` on the visit belongs to a `user_restaurant` owned by the same user, and similarly for `menu_reviews`.
- Consequence: Unnecessary query cost overhead, potential nested RLS evaluation complexity, and harder to maintain policies without materially improving Phase 1 security.
- Recommended change: Use simple RLS for both tables: `(select auth.uid()) = user_id`. Remove all parent ownership and optional visit consistency `EXISTS` subqueries. Rely on T-102 composite FK constraints for parent integrity.

#### 2. Unnecessarily complicated tests for standard DB behavior
- Severity: Low
- Exact policy/test area: Security Test Matrix (RLS-15, RLS-16)
- Reason: RLS-15 and RLS-16 propose evaluating intermediate states or removing policies in a disposable project to verify standard, well-documented PostgreSQL/PostgREST behaviors (RLS default deny when enabled, and update returning invisibility without SELECT).
- Consequence: Unnecessarily complicated testing and time waste.
- Recommended change: Remove RLS-15 and RLS-16 from the test matrix. The smallest adequate Phase 1 test set should focus on our custom policies (RLS-01 to RLS-14). 

### Owner/Toby provisional decisions review

- `places` (authenticated read-only): **Approve**
- `profiles` (authenticated own row CRUD, no direct DELETE): **Approve**
- `anon` (default-deny on all five tables): **Approve**
- `service_role` (never use in browser/client): **Approve**

### Compatibility and safety review

- T-103 uses a new migration after `20260715000001_initial_schema.sql`: Confirmed
- Proposed name `20260715000002_rls_policies.sql` follows convention: Confirmed
- T-102 schema migration should not be edited: Confirmed
- No SQL executed before implementation review and approval: Confirmed
- No connection, installation, React edit, or Git commit needed: Confirmed

— Any

---

## Any -> Owner, Toby, Gini, Hank

- Date: 2026-07-15
- Related task: T-103 Any Final RLS SQL Review
- Status: Review complete

### Verdict

- `Approve`

### Migration and Syntax Review

- Two active migration files exist in correct order: **Verified** (`20260715000001_initial_schema.sql` and `20260715000002_rls_policies.sql`).
- Exactly 16 unique `CREATE POLICY` statements: **Verified**.
- Valid PostgreSQL/Supabase syntax ending with semicolons: **Verified**.
- Target tables are schema-qualified with `public.`: **Verified**.
- Policy names are unique and understandable: **Verified**.
- Every policy targets only `authenticated`: **Verified**.
- No `FOR ALL`, `anon`, `service-role`, `DROP`, secrets, or tokens exist: **Verified**.
- T-102 migration remains unmodified: **Verified**.
- All five target tables have RLS enabled in T-102: **Verified**.

### Exact Policy Matrix

- **`profiles`**: SELECT (`USING`), INSERT (`WITH CHECK`), UPDATE (`USING` and `WITH CHECK`). No DELETE policy. **Verified**.
- **`places`**: Authenticated SELECT only (`USING (true)`). No INSERT, UPDATE, or DELETE policy. **Verified**.
- **`user_restaurants`, `visits`, `menu_reviews`**: Each has 4 policies (SELECT, INSERT, UPDATE, DELETE) using simple ownership checks (`(select auth.uid()) = user_id`) matching D-012, with no duplicate `EXISTS` subqueries. **Verified**.
- Total operations: 5 SELECT, 4 INSERT, 4 UPDATE, 3 DELETE = 16. **Verified**.

### Access and API Behavior Review

- UPDATE policies have matching SELECT policies for PostgREST visibility/returning. **Verified**.
- Own-row `WITH CHECK` on UPDATE properly prevents ownership changes. **Verified**.
- Absence of `profiles` DELETE and `places` write policies defaults to deny correctly. **Verified**.
- Absence of `anon` policies defaults to deny for unauthenticated users. **Verified**.
- `places` SELECT is correctly limited `to authenticated`. **Verified**.
- No unnecessary grants added. Default grants to `authenticated` are sufficient. **Verified**.

### Test Plan Review

- Final RLS-01 through RLS-14 covers own access, cross-user denial, ownership changes, composite-FK failures, cascades, etc., and evidence without secrets. **Verified**.
- RLS-15 and RLS-16 (testing default DB behaviors) were correctly removed. **Verified**.

### Safety Confirmation

- No SQL or test was executed, no Supabase project was connected, no changes made to Git, React, env, or deployments, and no later task was started. **Verified**.

— Any
