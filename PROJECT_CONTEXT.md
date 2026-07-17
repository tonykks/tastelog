# Project Context — TasteLog Phase 1

> 모든 구현·검토 판단의 최상위 기준서입니다. 과제 기획서와 충돌하면 구현을 멈추고 Owner와 Toby에게 알립니다.

## 1. Project identity

- Project name: **TasteLog** (working Korean name: 다시갈집)
- Assignment: 과제 5 — React를 이용한 CRUD 앱 만들기
- Owner: Tony Kim
- Target repository / folder: Owner가 확정할 실제 과제 root
- Planning date: 2026-07-15
- Phase: Phase 1 assignment build
- Target completion: 2026-07-18

## 2. One-line definition

- English: A personal restaurant log where users can quickly save a remembered name and later record visits, menus, prices, ratings, notes, and revisit intent.
- Korean: 기억나는 이름만으로 맛집을 빠르게 저장하고, 방문 후 메뉴·가격·평가·후기·재방문 의사를 기록하는 개인 맛집 관리 웹앱입니다.

## 3. Why this project exists

- 추천받은 맛집과 방문 경험을 잊지 않도록 한곳에 기록합니다.
- React CRUD, 컴포넌트 분리, 관계형 DB, Auth, RLS, 배포를 실제 서비스 형태로 학습합니다.
- 향후 SkyView Family Site에 연결 가능한 다중 사용자 서비스의 기반을 만듭니다.

## 4. Target users

- Primary: 추천받은 맛집과 방문 경험을 개인적으로 기록하려는 사용자
- Phase 1 user model: 가입한 사용자는 자기 데이터만 조회·작성·수정·삭제
- Environment: modern desktop/mobile browser

## 5. Project philosophy

1. **Fast capture first:** `display_name`만으로 저장 가능해야 합니다.
2. **Progressive enrichment:** 장소·방문·메뉴 정보는 나중에 보완할 수 있습니다.
3. **Secure ownership:** 모든 개인 데이터는 `user_id`와 RLS로 분리합니다.
4. **Assignment first:** 장기 기능보다 1단계 완료 조건과 제출 증빙을 우선합니다.
5. **Simple, testable design:** 과제 기간 안에 설명하고 검증할 수 있는 구조를 선택합니다.

## 6. Phase 1 success

- Auth: 가입, 로그인, 로그아웃, 세션 유지
- Restaurant CRUD: 이름만으로 등록, 목록·상세·수정·삭제
- Visit: 방문 여부, 방문일, 전체 별점, 후기, 재방문 의사 수정
- Menu review CRUD: 음식명, 가격, 맛평가, 메모
- Search/filter/sort: 키워드, 방문 상태/재방문, 별점순
- UX: loading, empty, error, delete confirmation, responsive layout
- Security: RLS와 비밀정보 점검
- Delivery: GitHub main, README, Vercel production URL, 실행 캡처와 AI/오류 기록

## 7. In scope

- React + Vite SPA
- Supabase Auth, PostgreSQL tables, constraints, indexes, RLS
- `profiles`, `places`(최소/준비), `user_restaurants`, `visits`, `menu_reviews`
- 한 식당에 메뉴 여러 개; DB는 다회 방문 확장 가능, Phase 1 UI는 방문 1건 중심 가능
- mobile/desktop responsive dashboard

## 8. Out of scope for Phase 1

- 외부 지도 API 자동 검색·공식 장소 병합
- 사진 업로드와 Storage
- 비밀번호 복구 email, Social Login, 계정 삭제
- 공개 피드, 좋아요, 관리자, 신고
- 결제, 광고, 구독, custom domain, Family Site 통합

## 9. Constraints

- Frontend에는 Supabase publishable/anon key만 사용합니다.
- `service_role`, DB password, access token은 코드·문서·Git에 절대 기록하지 않습니다.
- `.env`는 commit하지 않고 `.env.example`에는 변수명만 둡니다.
- 가격은 NULL 또는 0 이상 정수, 별점은 NULL 또는 1–5입니다.
- `place_id`는 nullable입니다.
- 과도한 추상화·상태관리 library는 명백한 필요가 없으면 추가하지 않습니다.

## 10. Planned architecture

- Frontend: React, Vite, CSS (추가 UI library는 Owner 승인 후)
- Backend/Auth/DB: Supabase
- Hosting: Vercel
- Source control: GitHub
- External maps/storage: Phase 1 미사용

## 11. Non-negotiable business rules

1. 이름만으로 맛집을 등록할 수 있습니다.
2. 본인 데이터만 접근할 수 있습니다.
3. 미방문 맛집은 방문 관련 값이 비어도 됩니다.
4. 삭제 전 식당명과 연관 기록 삭제를 명확히 확인합니다.
5. 새로고침 후 세션과 저장 데이터가 유지됩니다.
6. production mobile/desktop에서 핵심 CRUD를 검증합니다.

## 12. Open Owner decisions

- 실제 GitHub repository name과 URL
- 실제 Supabase project와 Vercel project 생성/연결
- 최종 서비스명 `TasteLog` / `다시갈집`
- UI color/theme와 SkyView identity 적용 수준

## 13. Source of truth order

1. Owner의 최신 명시적 결정
2. `DECISION_LOG.md`의 Accepted 결정
3. 이 문서
4. `docs/PHASE1_REQUIREMENTS.md`, `docs/DATABASE_AND_RLS.md`
5. `TASK_BOARD.md`
6. 원본 개발기획서

## 14. Update rule

Owner와 Toby가 합의한 project-level 변경만 반영합니다. 일상 상태는 `TASK_BOARD.md`와 `WORK_LOG.md`에 기록합니다.
