# 다시갈집

> **TasteLog** — 기억나는 이름만으로 맛집을 빠르게 저장하고, 방문·메뉴·가격·별점·후기·재방문 의사를 이어서 기록하는 개인 맛집 관리 앱입니다.

React CRUD 과제의 Phase 1 구현입니다. 인증된 사용자의 Restaurant, Visit, Menu review를 Supabase에 저장하고, 검색·필터·정렬·요약·Top 5 및 반응형/접근성 UI를 제공합니다.

## 1. 프로젝트 소개

- 주 이름: **다시갈집**
- 보조·기술 이름: **TasteLog**
- 목표: 이름만으로 빠르게 저장하고 나중에 방문과 메뉴 정보를 보완하는 owner-scoped CRUD 앱
- 현재 구현 범위: Auth, Restaurant CRUD, Visit 편집, Menu review CRUD, Dashboard, 검색/필터/정렬, RatingStars, 반응형·접근성 UI
- Phase 1 제외: 지도 API, 사진 Storage, Social Login, 비밀번호 복구, 공개 피드, 결제, 관리자

## 2. 주요 기능

- 이메일 회원가입·로그인·로그아웃과 새로고침 후 세션 유지
- `display_name`만으로 Restaurant 생성, 목록 조회, 이름 수정, 연관 기록 경고 후 삭제
- 방문 여부, 방문일, 대표 별점, 메모, 재방문 의사와 재방문 메모 저장
- Restaurant별 여러 Menu review 생성·조회·수정·삭제
- 별점 데이터 `1–5` 정수 또는 `null`; mouse/touch/keyboard를 지원하는 공통 별 UI
- 전체·미방문·방문·재방문 의향 요약, 대표 별점 Top 5
- 이름·지역·카테고리 검색, 방문 상태 필터, 최근 수정/별점 정렬
- 약 360px mobile부터 desktop까지 반응형 레이아웃
- visible label/focus, native radio semantics, 약 44px touch target 등 접근성 보완
- loading, owner-empty, filtered-empty, safe error/retry, disabled/pending, 삭제 확인 상태

## 3. 기술 스택과 구조

### 기술 스택

- React `19.2.7`, React DOM `19.2.7`
- Vite `8.1.1`
- Supabase JS `2.110.7` (Auth, PostgreSQL, RLS)
- Oxlint `1.71.0`
- Plain CSS
- Hosting: Vercel 예정

### Source 책임 분리

```text
src/
  components/
    auth/            Auth UI
    restaurants/     Create/List/Edit/Delete, search/filter/sort controls
    visits/          Representative visit editor
    menus/           Menu review CRUD
    dashboard/       Summary cards, Top 5
    common/          Shared RatingStars
  services/          Auth/Restaurant/Visit/Menu Supabase operations
  utils/             Pure dashboard/filter/sort calculations
  lib/supabase.js    Supabase browser client
```

Presentation component에서 DB 요청을 직접 흩뿌리지 않고 service 함수 뒤에 둡니다. Dashboard는 이미 owner-scoped로 조회한 Restaurant와 representative Visit summary에서 client-side로 계산하며 추가 aggregate table이나 mutation을 만들지 않습니다.

## 4. 데이터 모델

```text
auth.users
  ├─ 1:1 profiles
  └─ 1:N user_restaurants
            ├─ N:1 places (optional place_id)
            ├─ 1:N visits
            └─ 1:N menu_reviews
                       └─ N:1 visits (optional visit_id)
```

- `user_restaurants`: 사용자별 맛집. `display_name`만 필수이며 `place_id`는 nullable
- `visits`: Restaurant에 속하는 방문 기록. 별점은 `null` 또는 정수 `1–5`
- `menu_reviews`: Restaurant에 속하는 메뉴 기록. 가격은 `null` 또는 0 이상 정수, 맛 평가는 `null` 또는 정수 `1–5`
- Child row에는 `user_id`와 Restaurant 관계를 함께 두고 composite foreign key로 owner/parent 일관성을 강제
- Restaurant 삭제 시 연관 Visit/Menu review는 cascade
- optional `visit_id`의 Visit 삭제 시 `visit_id`만 `null`로 만들고 Restaurant/Menu 소유 관계는 유지

대표 방문은 다음 순서의 첫 행으로 결정합니다.

```text
visited_at DESC (NULLS LAST)
→ updated_at DESC
→ id DESC
```

적용 완료된 migration `001`, `002`, `003`은 재현성을 위해 불변으로 유지합니다.

- `001`: schema, constraints, indexes, RLS enablement
- `002`: authenticated operation별 RLS policy
- `003`: `set_updated_at()`의 `search_path` 보안 강화

## 5. Auth·RLS·보안

- `user_restaurants`, `visits`, `menu_reviews`의 SELECT/INSERT/UPDATE/DELETE는 `auth.uid() = user_id` owner 정책 적용
- `profiles`는 본인 row만 SELECT/INSERT/UPDATE
- `places`는 authenticated SELECT만 허용
- Composite FK가 child의 `user_id`, `restaurant_id`, optional `visit_id` 관계를 검증
- Browser client에는 Supabase publishable key만 사용
- `service_role`, DB password, OAuth secret, access token은 frontend·문서·Git에 저장하지 않음
- `.env.local`, `node_modules`, `dist`, Supabase local temporary state는 Git 제외
- Supabase raw error/stack 대신 고정된 안전한 한국어 오류 표시

검증 범위:

- Migration/RLS SQL은 정적 독립 review를 거쳐 remote에 적용되었습니다.
- Owner가 단일 실제 계정으로 Auth와 전체 CRUD/persistence를 확인했습니다.
- **두 번째 계정으로 owner-isolation 공격을 다시 실행하는 T-111 검증은 아직 수행하지 않았습니다.** 이를 production-ready 보안 검증 완료로 표현하지 않습니다.

## 6. 로컬 실행

요구사항: Node.js/npm, 접근 가능한 Supabase project.

```bash
npm ci
```

`.env.example`을 참고해 root의 `.env.local`에 변수 **값을 직접** 설정합니다.

```dotenv
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
```

실제 URL, key, password, token은 commit하지 않습니다.

```bash
npm run dev
npm run lint
npm run build
npm run preview
```

환경변수가 없으면 앱은 secret을 노출하지 않고 안전한 설정 오류 화면을 표시합니다.

## 7. AI 협업 과정과 역할 분담

작업은 “한 task 한 Primary Implementer → 독립 Reviewer → Owner 검증/승인” 방식으로 진행했습니다.

| 역할 | 담당과 선택 이유 |
|---|---|
| Owner | 제품명·theme·외부 mutation·DB 실행·수동 browser 검증의 최종 결정권자 |
| Toby | 요구사항 구조화, task 배정, 승인 gate, Owner 검증 통합, 제출 문서 Primary |
| Gini | Cursor IDE 맥락을 활용한 React/UI 반복 구현과 Git checkpoint; T-100/101, T-104~106, T-109/110 Primary |
| Hank | 복잡한 DB/Visit/Menu 구현과 독립 code review; T-102/103/107/108 Primary, Gini UI task Reviewer |
| Any | DB/RLS 독립 second opinion과 review; T-102/103 검토, T-111 독립 보안·회귀 검토 예정 |

예를 들어 T-107/108은 관계·stale request 위험이 커서 Hank가 구현하고 Gini가 독립 검토했습니다. T-109/110은 UI 맥락과 빠른 반복이 중요해 Gini가 구현하고 Hank가 defect-first review를 수행했습니다.

성과를 특정 모델 하나의 결과로 보지 않습니다. 모델의 분석/구현 역량에 더해 `AGENTS.md`, `TASK_BOARD.md`, `DECISION_LOG.md`, `WORK_LOG.md`, agent chat의 공유 맥락, 역할 분담, Owner 승인 gate가 결합되어 연속성과 책임 분리를 높였습니다.

## 8. 대표 review·수정 사례

| 사례 | 발견 | 실제 위험 | 수정 | 재검토 결과 |
|---|---|---|---|---|
| Visit 저장 성공 뒤 status 실패 | Gini | 재시도 시 중복 INSERT | 성공 Visit/id를 보존해 같은 id UPDATE | Gini Approve |
| Visit summary query 실패 | Gini | 정상 Restaurant 목록과 CRUD 전체가 가려짐 | summary map만 비우고 목록 유지 | Gini Approve |
| Menu stale mutation | Gini | abort를 성공으로 오인해 form clear/edit exit | `{ aborted: true }` 계약으로 성공 side effect 차단 | Hank Approve |
| whitespace-only price | Gini | UI와 service의 null 해석 불일치 | trim 후 empty/null 처리 | Hank Approve |
| malformed representative rating | Hank | `0`/문자열이 rated/Top 5에 포함 | 정수 `1–5`만 rated | Hank Approve |
| 투명 radio focus | Hank | keyboard 사용자가 별 focus를 볼 수 없음 | 보이는 44px label에 focus ring | Hank Approve |
| star/accent contrast | Hank | gold/purple 대비 기준 미달 | gold/empty/purple 색상 대비 상향, ★/☆ 비색상 cue | Hank Approve |
| 360px Auth overflow | Hank | content-box padding으로 viewport 초과 | `.auth-card { box-sizing: border-box }` | Hank Approve |
| mobile action row | Owner browser test | 네 action이 불안정하게 줄바꿈 | 360–450px에서 equal-width 한 줄 유지 | Hank Approve |
| Visit/Menu panel header | Owner browser test | mobile 닫기·subtitle 배치 불안정 | 44px × control과 한 줄 subtitle | Hank Approve |

## 9. 테스트 증거

상세 상태와 근거는 [TEST_EVIDENCE.md](./TEST_EVIDENCE.md)에 기록했습니다.

확인된 주요 결과:

- `npm run lint`: pass
- `npm run build`: pass (Vite production build)
- `git diff --check`: pass
- Owner: 가입/로그인/로그아웃/세션 유지
- Owner: Restaurant/Visit/Menu CRUD, 삭제 cancel/confirm, 저장 직후 반영과 새로고침 persistence
- Owner: 별점 `1–5`/`null`, 검색·필터·정렬·Top 5
- Owner: keyboard focus와 약 360px Auth/App/Visit/Menu 반응형
- 최종 Owner data:
  - `산방밀면`: visited, 대표 별점 `4`, revisit `true`
  - `밀면`: price `8500`, 맛 평가 `4`, memo `담백하고 시원했습니다.`

수행하지 않은 검증은 pass로 쓰지 않습니다. 두 계정 RLS 공격 검증과 Vercel production smoke test는 미완료입니다.

## 10. 스크린샷

현재 repository에는 제출 증거로 사용할 실제 앱 스크린샷이 없습니다. `src/assets/hero.png`는 Vite scaffold 장식 자산이며 테스트 증거가 아니므로 README에 포함하지 않았습니다.

필요 캡처와 개인정보/secret 점검 기준은 [docs/SCREENSHOT_CHECKLIST.md](./docs/SCREENSHOT_CHECKLIST.md)에 정리했습니다. 캡처에는 이메일, token, key, connection string, 불필요한 개인 데이터가 보이지 않아야 합니다.

## 11. 오류 해결 기록

| 오류/위험 | 원인 | 해결 | 재시험 |
|---|---|---|---|
| Visit status 갱신 실패 후 중복 Visit 가능성 | Visit write와 Restaurant status가 순차 요청 | 성공 Visit id를 editor state에 유지 | 같은 id UPDATE 경로 정적 review·Owner flow |
| Summary 오류가 목록을 차단 | summary error를 list-blocking error state에 저장 | Restaurant error와 summary error 격리 | 목록/CRUD 유지 narrow review |
| stale Menu 요청을 성공 처리 | `null`이 abort와 success에 공용 | distinct abort sentinel | Hank narrow review |
| optional price 공백 불일치 | UI가 trim 전에 숫자로 변환 | trim 후 empty/null | lint/build + review |
| 잘못된 rating이 ranking 대상 | null만 제외 | 정수 1–5 guard | malformed-rating pure smoke |
| 별 keyboard focus 미표시 | 투명 1px radio에 outline | visible label focus ring | Owner keyboard test + Hank review |
| mobile overflow/배치 | content-box와 좁은 action/header 공간 | border-box 및 scoped responsive CSS | Owner 360px test + Hank review |

## 12. Known limitations·향후 개선

### 현재 제한

- 두 번째 계정 owner-isolation 실검증(T-111)을 이번 긴급 제출 전에 다시 수행하지 않았습니다.
- 현재 Restaurant form/service는 `display_name` 생성·수정만 노출합니다. Schema와 조회/search에는 `area_hint`, `category`, `recommendation_note`가 준비되어 있지만 해당 optional field 편집 UI는 미구현입니다.
- Visit 저장과 Restaurant status 갱신은 browser의 순차 요청이며 원자 transaction이 아닙니다. 첫 write 성공 후 두 번째 write 실패 시 재시도 복구는 구현했지만 단일 transaction은 아닙니다.
- Vercel 배포와 production URL smoke test(T-113)는 아직 완료되지 않았습니다.
- 제출용 실제 스크린샷은 아직 확보되지 않았습니다.
- 별점 DB 데이터는 정수 `1–5` 또는 `null`이며 별은 UI 표현입니다. half-star는 지원하지 않습니다.
- Phase 1 UI는 대표 방문 1건 중심이며 DB는 여러 Visit을 저장할 수 있습니다.

### 향후 개선

- 두 계정 RLS-01~RLS-14 및 UUID 기반 update/delete/parent attack 재검증
- Visit + Restaurant status를 하나의 transaction/RPC로 원자화
- Vercel production 배포 후 mobile/desktop CRUD smoke test 자동화
- 안전한 제출 screenshot 확보 및 README 반영
- 지도/사진/소셜 기능은 별도 Phase에서 요구사항과 보안 검토 후 추가

## 13. 링크

- GitHub: https://github.com/tonykks/tastelog
- Vercel: **배포 예정 — T-113** (가짜 URL 없음)

## 프로젝트 기록

- [요구사항](./docs/PHASE1_REQUIREMENTS.md)
- [Database/RLS 설계](./docs/DATABASE_AND_RLS.md)
- [테스트·제출 계획](./docs/TEST_AND_SUBMISSION.md)
- [테스트 증거](./TEST_EVIDENCE.md)
- [스크린샷 체크리스트](./docs/SCREENSHOT_CHECKLIST.md)
- [결정 기록](./DECISION_LOG.md)
- [작업 기록](./WORK_LOG.md)
