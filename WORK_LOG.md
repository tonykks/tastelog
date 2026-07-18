# Work Log — TasteLog Phase 1

최신 기록을 위에 추가합니다. 사실과 미검증 사항을 구분합니다.

---

## 2026-07-18 — Gini — T-112 emergency submission documentation support

### Scope

- Replaced the stale collaboration-pack README with the actual Phase 1 submission README.
- Added `TEST_EVIDENCE.md` with recorded automated/static checks, Owner browser evidence, T1–T10 status, RLS evidence boundaries, and final retained data.
- Added `docs/SCREENSHOT_CHECKLIST.md`; repository inspection found no actual app screenshots. `src/assets/hero.png` is a scaffold decorative asset and was not presented as evidence.
- Marked T-112 `IN_PROGRESS` only; Primary remains Toby and Reviewer remains Owner.

### README coverage

- Project/features/stack/source responsibilities
- Data model, representative Visit rule, migration 001–003 status
- Auth/RLS/security and local environment setup
- AI role split and model/agent selection rationale
- Ten representative review/fix examples
- Test evidence, screenshot status, error-resolution record
- Known limitations and GitHub/Vercel link status

### Explicit limitations

- Two-account owner isolation/UUID attack verification not rerun
- Visit write + Restaurant status update is sequential, not atomic
- Restaurant optional area/category/recommendation edit UI is not exposed
- Vercel production smoke and submission screenshots are incomplete

### Validation

- Source lint/build not rerun by instruction
- README links, secret-like values, and document-only diff checked before handoff
- No source, DB, migration, package, commit/push, or Vercel mutation

### Status

T-112 remains `IN_PROGRESS` pending Toby/Owner review.

— Gini

---

## 2026-07-18 — Gini — T-110 final closeout

### Result

- T-110 is `DONE`: Hank independent review and all narrow re-reviews approved; Owner completed the 12-step browser verification.
- Accepted corrections: RatingStars focus/contrast, 360px Auth sizing, four mobile restaurant actions in one row, and Visit/Menu × header controls with accessible names and one-line subtitle.
- Owner verified desktop/mobile branding, ratings (1–5/null), keyboard operation, responsive overflow, Visit/Menu persistence, and final data.

### Final Owner data

- Restaurant `산방밀면`: `visited`, representative rating `4`, revisit intention `true`
- Menu `밀면`: price `8500`, taste rating `4`, memo `담백하고 시원했습니다.`

### Documentation / handoff

- `TASK_BOARD.md`: T-110 `DONE`; T-111+ statuses and role assignments remain unchanged (`BACKLOG`)
- `TASK_BOARD.md`: T-112 will integrate the T-110 Gini/Hank role split and review/fix evidence
- `WORK_LOG.md`, `docs/chat/gini-chat.md`: this closeout

### Validation

- Prior lint/build evidence accepted by Owner/Toby; not rerun for this documentation-only closeout
- Documentation-only `git diff --check`: pass
- No source, DB, migration, package, Git commit/push, or Vercel changes

### Next action

Await Owner/Toby approval before starting any existing BACKLOG task.

---

## 2026-07-18 — Gini — T-110 panel header UI correction

### Goal

Owner 모바일 검증 finding을 해결합니다: Visit/Menu panel header의 닫기 control을 compact한 × button으로 통일하고 Visit subtitle을 360px에서 한 줄로 표시합니다.

### Work performed

- `VisitEditor`: visual label `닫기` → `×`, `aria-label="방문 기록 닫기"`, subtitle → `대표 방문 1건을 표시합니다.`
- `MenuReviewPanel`: visual label `닫기` → `×`, `aria-label="메뉴 기록 닫기"`
- `.panel-close-button`: 44×44px fixed touch target, 24px × glyph, existing `.restaurant-action:focus-visible` outline retained
- Mobile Visit heading: 8px gap, flexible text column, 13px no-wrap subtitle
- Handler, disabled condition, saving/cancel logic, desktop heading layout, CRUD/RatingStars unchanged

### Files changed

- `src/components/visits/VisitEditor.jsx`
- `src/components/menus/MenuReviewPanel.jsx`
- `src/App.css`
- `WORK_LOG.md`
- `docs/chat/gini-chat.md`

### Validation

- 360px static layout: Visit panel content width ~290px; 44px button + 8px gap leaves ~238px for shortened 13px subtitle, so it remains one line without horizontal overflow
- Visible keyboard focus: inherited `.restaurant-action:focus-visible` outline remains active
- Accessible names: `방문 기록 닫기`, `메뉴 기록 닫기`
- `npm.cmd run lint`: pass
- `npm.cmd run build`: pass
- `git diff --check`: pass (existing CRLF conversion warnings only)
- IDE diagnostics: none

### Status / review request

- T-110 remains `REVIEW`; no commit or push
- Hank: Visit/Menu panel header UI only — × label, accessible names, 44px target/focus, 360px subtitle/overflow, and no handler regression

### Risks

- Actual 360px browser visual confirmation remains an Owner/Hank review item; scope was intentionally limited to the requested header UI.

---

## 2026-07-18 — Gini — T-110 mobile restaurant action row correction

### Goal

Owner 모바일 검증 finding을 해결합니다: 약 360~450px 식당 카드에서 `수정`·`방문 기록`·`메뉴 기록`·`삭제` action을 한 줄로 유지합니다.

### Work performed

- `src/App.css`의 `@media (max-width: 480px)`에 식당 카드 footer action row 전용 규칙만 추가
- direct-card selector로 한정해 삭제 확인 panel, Visit/Menu panel, 다른 action row는 변경하지 않음
- 4개 action을 equal flex item으로 만들고 `nowrap`, 4px gap, 12px font, 4px horizontal padding 적용
- 기존 `min-height: 44px`은 유지; JSX, event handler, CRUD, RatingStars는 변경하지 않음

### Files changed

- `src/App.css`
- `WORK_LOG.md`
- `docs/chat/gini-chat.md`

### Validation

- 360px static layout check: `.app-main` 14px 좌우 padding 및 card 18px 좌우 padding 기준 action container 약 294px; 4px gap 3개를 제외하면 각 action 약 70.5px. 가장 긴 label `방문 기록` / `메뉴 기록`도 `white-space: nowrap` 상태로 수용
- `npm.cmd run lint`: pass
- `npm.cmd run build`: pass
- `git diff --check`: pass (existing CRLF conversion warnings only)
- `src/App.css` IDE diagnostics: none

### Status / review request

- T-110 remains `REVIEW`; no task status change, commit, or push
- Hank: 식당 카드 mobile action row만 narrow re-review 요청 (360px 4 actions one row, no-wrap, 44px target, overflow/regression)

### Risks

- 실제 360px browser visual check is still an Owner/Hank review item; this change is intentionally scoped to CSS layout only.

---

## 2026-07-18 — Gini — T-110 Hank findings correction (focus / contrast / Auth)

### Corrections

1. **Medium — RatingStars focus:** `.rating-star-option:has(input:focus-visible)`에 44px label outline; hidden radio outline 제거. Disabled: `cursor: not-allowed` + opacity. Selected stars use ★ vs ☆ + underline weight cue.
2. **Medium — contrast:** `--star-gold` `#8a6500` (~5.33:1 vs white), `--star-empty` `#6f6960` (~5.43:1), `--accent` `#7a1fcc` (~7.25:1 vs white; ~6.56:1 vs page-bg). White-on-accent submit ~7.25:1. Theme identity kept (darker purple/gold).
3. **Low — Auth overflow:** `.auth-card { box-sizing: border-box; }`. 360px: center padding 16×2 → card outer 328px (was ~366 with content-box).

### Files

- `src/index.css`, `src/App.css`, `src/components/common/RatingStars.jsx`
- Records: `WORK_LOG.md`, `docs/chat/gini-chat.md`

### Validation

- Contrast ratios recorded above (computed)
- 360px Auth width: static border-box math pass
- `npm.cmd run lint`: pass
- `npm.cmd run build`: pass
- correction-scoped `git diff --check`: pass
- RatingStars 1–5/null contract, Visit/Menu services, abort/price Low paths: unchanged

### Status

T-110 remains `REVIEW`. Hank narrow re-review requested for focus / contrast / Auth overflow only.

— Gini

---

## 2026-07-18 — Gini — T-110 Responsive UI / a11y / RatingStars

### Name · theme (D-007 / D-008 Accepted)

- Primary UI brand: `다시갈집`; auxiliary: `TasteLog`; title: `다시갈집 | TasteLog`
- Theme: warm off-white page (`--page-bg`), white cards, purple accent retained, gold stars, visited purple / unvisited gray-lavender badges, destructive red; plain CSS only; light color-scheme

### RatingStars

- `src/components/common/RatingStars.jsx`: interactive radiogroup + clear (“평가하지 않음”) and readonly display
- Contract: integer 1–5 or null only (`normalizeStarRating`); invalid local values → null; no half-star; no string storage
- Applied: VisitEditor overall rating; MenuReviewForm taste rating; Restaurant card / Top 5 / Menu card readonly
- Service/DB validation unchanged

### Responsive / a11y

- Breakpoints ~768 / ~480; overflow-x hidden on `#root`; header wrap; summary 2-col; actions wrap; ~44px touch targets on actions/stars
- Labels, focus-visible, aria-busy on pending, status badges not color-only (text retained), star accessible names

### T-108 Low cleanup

- Low A: Menu price UI validates after trim; whitespace-only → empty/null like service
- Low B: MenuReviewPanel create/update returns `{ aborted: true }` on stale; form skips success side effects; pending cleared when still mounted

### Files

- Created: `RatingStars.jsx`
- Updated: `VisitEditor`, `MenuReviewForm`, `MenuReviewPanel`, `RestaurantList`, `TopRatedList`, `AuthForm`, `App.jsx`, `App.css`, `index.css`, `index.html`
- Docs: `DECISION_LOG` D-007/D-008, `TASK_BOARD`, `WORK_LOG`, `gini-chat`

### Validation

- Rating normalize smoke: null/0/6/1.5/"4" → null; 1/3/5 ok
- lint pass · production build pass (Vite 8.1.4)
- `git diff --check` pass (CRLF warnings only)
- package/migration diffs: none
- secret scan on touched paths: no matches

### Owner unverified (browser)

1–12 from Toby T-110 plan (desktop theme, Visit/Menu stars, mobile overflow, keyboard, CRUD/dashboard regression, persistence)

### Status

T-110 → `REVIEW` (not DONE). Hank review requested.

— Gini

---

## 2026-07-18 — Gini — T-109 GitHub checkpoint

### Goal

Owner/Toby-approved T-109 Search/Filter/Rating sort/Dashboard source and collaboration records committed and pushed to Private GitHub `main`. T-110 not started.

### Scope included

- Source: `restaurantDashboard.js`, `SummaryCards.jsx`, `TopRatedList.jsx`, `RestaurantControls.jsx`, `App.jsx`, `App.css`, `RestaurantList.jsx`
- Docs: `TASK_BOARD.md`, `WORK_LOG.md`, `docs/chat/gini-chat.md`, `docs/chat/hank-chat.md`, `docs/chat/toby-chat.md`
- Excluded: `.env.local`, `dist/`, `node_modules/`, secrets, migrations 001·002·003, packages, Auth/Visit/Menu services

### Next action

T-109 `DONE`; T-110 `BACKLOG` pending explicit start approval.

— Gini

---

## 2026-07-18 — Gini — T-109 final closeout

### Final acceptance

- Owner/Toby final approval after Gini implementation, Hank `Approve with changes`, Low finding correction, and Hank narrow re-review final `Approve`.
- Keyword: trim · case-insensitive · `display_name` + `area_hint` + `category`.
- Filters: 전체 / 미방문 / 방문함 / visited + `revisit_intention===true`.
- Sort: 최근 수정순 `updated_at` DESC → `id` DESC; 별점 높·낮은순은 rated visited 우선 → rating DESC/ASC → `updated_at` DESC → `id` DESC; unrated/unvisited 후미.
- Summary·Top 5: owner 전체 기준(keyword/filter 독립). Top 5 = visited + valid integer rating 1–5, max 5.
- Hank Low: malformed `0`/string ratings treated as rated → fixed with `Number.isInteger(rating) && 1 <= rating <= 5`.
- Owner browser verified counts, search (incl. whitespace / no-match), filters, sorts, Create/Update/Delete/Visit sync, Menu 무영향, refresh·logout/relogin persistence.
- Accepted automated evidence: lint, production build, `git diff --check`, pure + malformed-rating smoke.

### Final Owner data

- Restaurant: `산방밀면` (1 row), `visited`
- Representative visit: overall rating `4`, revisit intention `true`
- Menu: `밀면` — price `8500`, taste_rating `4`, memo `담백하고 시원했습니다.`

### Scope / next action

T-109 is `DONE`; T-110 remains `BACKLOG` pending explicit Owner/Toby approval. Document-only closeout — no source, DB, migration/package, Git, or Vercel mutation.

— Gini

---

## 2026-07-18 — Gini — T-109 Low finding: getRepresentativeRating guard

### Finding (Hank)

`getRepresentativeRating()` treated `0`, numeric strings, and nonnumeric strings as rated values.

### Correction

- Return rating only when `Number.isInteger(rating) && rating >= 1 && rating <= 5`
- Otherwise `null` (including `0`, `6`, `-1`, `1.5`, `"4"`, `"좋음"`, null/undefined, missing summary)
- Unvisited still excluded; `filterAndSortRestaurants` / `computeTopRated` structure unchanged

### Validation

- Pure smoke: integers 1/3/5 ok; invalids null; Top 5 excludes invalid; input immutable — pass
- `npm.cmd run lint`: pass
- `npm.cmd run build`: pass (Vite 8.1.4)
- `git diff --check` on correction paths: pass
- UI/DB/migration/package/service: not modified in this correction

### Status

T-109 remains `REVIEW`. Hank narrow re-review requested for `getRepresentativeRating` only.

— Gini

---

## 2026-07-18 — Gini — T-109 Search/filter/sort/dashboard

### Goal

Existing owner-scoped `restaurants` + representative `visitSummaries`로 client-side 검색·상태 filter·대표 별점 정렬·요약 dashboard·Top 5를 제공한다. DB table/mutation/refetch를 추가하지 않는다.

### Calculation rules (documented)

- **Keyword:** trim + case-insensitive. Fields: `display_name`, `area_hint`, `category`. `recommendation_note` / menu memo 제외. Empty keyword = all.
- **Filters (mutually exclusive):** 전체 / 미방문(`status==='unvisited'`) / 방문함(`visited`) / 다시 갈 의향 있음(`visited` AND summary.`revisit_intention===true`). Unvisited never enters revisit filter even if a historical visit remains elsewhere.
- **Sort — 최근 수정순 (default):** `updated_at` DESC → `id` DESC
- **Sort — 별점 높은순 / 낮은순:** rated visited first; then `overall_rating` DESC/ASC; tie `updated_at` DESC → `id` DESC; unvisited or null rating always after rated
- **Summary counts:** full owner list (not keyword/filter subset): total / unvisited / visited / revisit(visited+intention)
- **Top 5:** visited + non-null representative rating only; rating DESC → `updated_at` DESC → `id` DESC; max 5; independent of keyword/filter
- Menu reviews are not used for ranking/counts

### Files

- Created: `src/utils/restaurantDashboard.js`
- Created: `src/components/dashboard/SummaryCards.jsx`, `TopRatedList.jsx`
- Created: `src/components/restaurants/RestaurantControls.jsx`
- Updated: `src/App.jsx`, `RestaurantList.jsx` (filtered-empty copy), `App.css`
- Records: `TASK_BOARD.md`, `WORK_LOG.md`, `docs/chat/gini-chat.md`

### Local sync

Create/Update/Delete/Visit-save already mutate `restaurants` / `visitSummaries`; derived dashboard recomputes on render. No extra list refetch. Menu CRUD does not touch those maps.

### Validation

- Pure utility smoke (node ESM): search trim/case, filters, rating null/unvisited last, tie-break, summary, Top 5, input immutability — pass
- IDE diagnostics: none on touched files
- `npm.cmd run lint`: pass
- `npm.cmd run build`: pass (Vite 8.1.4)
- `git diff --check`: pass (CRLF warnings only)
- Protected scope: no migration/package/service/Visit/Menu/Auth diffs
- Secret scan on T-109 paths: no matches

### Unverified (Owner browser)

1. Dashboard counts match current data
2. display_name (+ area/category) keyword search
3. No-match empty vs owner-empty
4. All four filters
5. Updated sort + rating high/low + unrated last
6. Rating tie order
7. Top 5 set/order/max 5
8. CRUD + Visit immediate recompute
9. Menu CRUD no dashboard effect
10. Refresh + logout/relogin

### Status

T-109 → `REVIEW` (not DONE). Hank review requested.

— Gini

---

## 2026-07-18 — Gini — T-108 GitHub checkpoint

### Goal

Owner/Toby-approved T-108 Menu review CRUD source and collaboration records committed and pushed to Private GitHub `main`. T-109 not started.

### Scope included

- Source: `menuReviewService.js`, `MenuReviewForm.jsx`, `MenuReviewPanel.jsx`, `App.jsx`, `App.css`, `RestaurantList.jsx`
- Docs: `TASK_BOARD.md`, `WORK_LOG.md`, `docs/chat/gini-chat.md`, `docs/chat/hank-chat.md`, `docs/chat/toby-chat.md`
- Excluded: `.env.local`, `dist/`, `node_modules/`, secrets, migrations 001·002·003, packages, VisitEditor/visitService

### Next action

T-108 `DONE`; T-109 `BACKLOG` pending explicit start approval.

— Gini

---

## 2026-07-18 — Hank — T-108 final closeout

### Final acceptance

- Owner/Toby final approval received after Hank implementation and Gini independent review final `Approve`. No Medium/High findings remain.
- Two Low findings are accepted as non-blocking: the stale-abort `null` return contract and the whitespace-only price interpretation difference between UI and service. Neither causes current acceptance failure or data loss; revisit in T-110/final cleanup if needed.
- New menu INSERTs omit `visit_id`, leaving it null. Existing linked rows preserve `visit_id` because UPDATE payloads exclude it.
- Owner verified empty state, two menu Creates, refresh persistence, `updated_at` DESC → `id` DESC ordering, edit cancel/save, price and taste validation, field/row isolation, delete cancel/confirm, refresh/logout/relogin persistence, and no Restaurant/Visit/card-summary regression.
- Accepted automated evidence: lint pass, production build pass, T-108 source diff check pass. Full `git diff --check` also passed during closeout after Gini chat whitespace cleanup.

### Final Owner test data

- Restaurant: `산방밀면`
- Visit: existing representative visit preserved
- Menu review: one `밀면` row remains
  - `price`: `8500`
  - `taste_rating`: `4`
  - `memo`: `담백하고 시원했습니다.`

### Scope / next action

T-108 is `DONE`; T-109 remains `BACKLOG` pending explicit Owner/Toby approval. This closeout changes documents only and performs no source, DB, migration/package, Git, or Vercel mutation.

— Hank

---

## 2026-07-18 — Hank — T-108 Menu review CRUD

### Goal and scope

로그인 사용자가 선택한 자신의 Restaurant 안에서 여러 menu review를 등록·조회·수정·삭제하도록 구현했습니다. Menu CRUD만 포함하며 T-109+ 검색/dashboard와 T-110 RatingStars는 포함하지 않습니다.

### Implementation

- `menuReviewService`는 모든 SELECT/UPDATE/DELETE를 `user_id + restaurant_id`로 제한하고, UPDATE/DELETE는 추가로 menu `id`를 제한합니다. 0-row 결과도 성공으로 처리하지 않으며 raw Supabase 오류는 고정 한국어 메시지로 변환합니다.
- 메뉴 정렬은 `updated_at` DESC → `id` DESC입니다. Create는 반환 행만 추가, Update는 반환된 정확한 행만 교체, Delete는 반환된 id만 제거해 전체 목록을 재조회하지 않습니다.
- UI와 service 모두 `menu_name` trim/non-empty, price 빈 값 또는 0 이상 정수, taste rating 빈 값 또는 정수 1–5를 DB 요청 전에 검증합니다. Server error가 발생해도 입력값을 유지합니다.
- 식당별 패널은 loading, empty, safe error/retry, create, inline edit/save/cancel, menu-name delete confirmation/cancel/confirm을 구분합니다. Create와 각 menu row mutation은 별도 pending/request id로 관리합니다.
- Session user keyed remount, panel key, mount flag, load/create/per-row mutation request ids로 logout, user switch, panel unmount, Restaurant 전환, stale result가 현재 UI를 덮어쓰지 못하게 했습니다.

### Phase 1 `visit_id` boundary

- 새 menu review INSERT는 `visit_id`를 전송하지 않아 nullable default인 null을 사용합니다. 대표 visit을 추론하거나 자동 연결하지 않습니다.
- 기존 row SELECT에는 `visit_id`가 포함되지만 UPDATE payload는 `menu_name`, `price`, `taste_rating`, `memo`만 포함하므로 기존 `visit_id`를 덮어쓰거나 해제하지 않습니다.
- VisitEditor와 T-107 대표 방문 결정·status 저장 로직은 변경하지 않았습니다.

### Files

- Created: `src/services/menuReviewService.js`
- Created: `src/components/menus/MenuReviewForm.jsx`, `src/components/menus/MenuReviewPanel.jsx`
- Updated: `src/App.jsx`, `src/components/restaurants/RestaurantList.jsx`, `src/App.css`
- Records: `TASK_BOARD.md`, `WORK_LOG.md`, `docs/chat/hank-chat.md`

### Validation

- `npm.cmd run lint`: pass (`oxlint`)
- `npm.cmd run build`: pass (Vite 8.1.4)
- T-108 scoped diff/trailing-whitespace check: pass
- Full working-tree `git diff --check`: nonzero only because pre-existing `docs/chat/gini-chat.md:54-61` contains trailing spaces; Hank did not modify another Agent's chat file
- Owner filters / `visit_id` payload boundary / T-109+ path scan: pass
- Secret scan in T-108 paths: no matches
- Migration 001·002·003, package files, VisitEditor, visit service: no diff
- Actual Supabase menu CRUD: not run by design; Owner verification required

### Next action

T-108 is `REVIEW`, not DONE. Gini reviews source; Owner follows the manual test sequence in Hank chat. T-109+, DB mutation by agents, Git commit/push, and Vercel remain unstarted.

— Hank

---

## 2026-07-18 — Hank — T-107 final closeout

### Final acceptance

- Owner/Toby final approval received after Hank implementation, Gini independent review, and all narrow correction re-reviews reached final `Approve`.
- Representative visit rule is deterministic: `visited_at` descending with nulls last → `updated_at` descending → `id` descending.
- Gini Medium findings were resolved: a successful first visit write is retained when status update fails so retry UPDATEs the same visit id; summary-only query failure no longer hides the successful Restaurant list.
- Owner verified empty unvisited state, visit INSERT/read/UPDATE/refresh persistence, rating `0`/`6`/`1.5` validation, cancel preservation, visited/unvisited transitions, historical visit preservation, representative restoration, logout/relogin persistence, and card-summary refresh persistence.
- Final accepted card copy: `방문함 · 대표 별점 4 · 다시 갈 의향 있음`.
- Accepted automated evidence: lint pass, production build pass, `git diff --check` pass.

### Scope confirmation

- T-107 is `DONE`; T-108 remains `BACKLOG` pending explicit Owner/Toby approval.
- Migration 001·002·003, schema, RLS, packages, DB test data, T-108+, Git commit/push, and Vercel were not changed during this closeout.

— Hank

---

## 2026-07-18 — Gini — T-106 final acceptance and Restaurant CRUD GitHub checkpoint

### Goal

Hank narrow re-review `Approve`와 Owner 수동 검증 통과를 반영해 T-106을 `DONE`으로 종료하고, T-105·T-106 Restaurant CRUD를 하나의 GitHub checkpoint로 commit/push합니다. T-107은 시작하지 않습니다.

### Acceptance evidence

Owner manual verification:

1. 편집 form 진입
2. 취소 시 원본 유지
3. 빈 이름 validation
4. 실제 UPDATE 및 수정 시각 갱신
5. 새로고침 후 UPDATE persistence
6. 원래 이름 복구
7. 별도 임시 row 생성
8. 삭제 확인 및 cascade 경고
9. 삭제 취소 시 row 유지
10. 임시 row만 DELETE
11. 새로고침 후 DELETE persistence
12. 다른 row 영향 없음
13. 편집 중 중복 `수정` trigger 제거 확인

Reviewer:

- Hank initial T-106 verdict: `Approve with changes`
- Low UI finding corrected (hide Edit trigger while editing)
- Hank narrow re-review final verdict: `Approve`

### Work performed

1. `TASK_BOARD.md` T-106 → `DONE`; T-107 remains `BACKLOG`
2. Collaboration records updated; `hank-chat.md` / `toby-chat.md` preserved
3. Approved checkpoint commit `feat: complete restaurant CRUD` and `git push origin main`
4. T-107 Visit editor, DB mutation, test data, Vercel not started

### Validation reused / rechecked

- Prior lint/build/dev smoke for T-105·T-106 accepted as already passed
- `git diff --check`, staged file/secret scan, `.env.local` ignore, migration/package unchanged rechecked at commit time

### Next action

Next Primary Implementer is Hank for T-107 Visit editor. Gini does not start T-107.

— Gini

---

## 2026-07-18 — Gini — T-106 Hank Low finding correction

### Goal

Hank `Approve with changes`의 Low finding 1건만 수정합니다. T-106은 `REVIEW` 유지.

### Work performed

1. `RestaurantList.jsx`에서 `editingId === restaurant.id`인 카드의 `수정` trigger를 숨깁니다. 편집 중에는 inline form의 `저장`/`취소`만 사용합니다.
2. 편집 중 `삭제`는 기존처럼 편집 state를 정리하고 삭제 확인으로 전환합니다. 다른 row의 `수정` 시작, service/guard/CSS는 변경하지 않았습니다.

### Files changed

- `src/components/restaurants/RestaurantList.jsx`
- `WORK_LOG.md`, `docs/chat/gini-chat.md`

### Validation

- IDE diagnostics: none
- `npm.cmd run lint`: pass
- `npm.cmd run build`: pass
- `git diff --check`: pass
- DB row, migration, package, secret: unchanged

— Gini

---

## 2026-07-18 — Hank — T-107 card summary copy correction

### Change

- Restaurant card summary의 `재방문 있음/없음` 문구를 `다시 갈 의향 있음/없음`으로 변경했습니다.
- `revisit_intention` DB field, visit service, 저장·조회 로직, 대표 방문 규칙은 변경하지 않았습니다.

### Validation

- `npm.cmd run lint`: pass
- `npm.cmd run build`: pass (Vite 8.1.4)
- `git diff --check`: pass

T-107은 closeout 전 `REVIEW` 상태를 유지합니다.

— Hank

---

## 2026-07-18 — Hank — T-107 summary error isolation

### Finding

Gini Medium finding: Restaurant SELECT 성공 후 representative summary SELECT만 실패해도 summary 오류가 list-blocking `restaurantError`로 전달되어 정상 Restaurant card와 CRUD가 전체 error UI 뒤에 가려졌습니다.

### Correction

- Restaurant SELECT 실패 경로는 기존대로 `restaurantError`와 retry UI를 유지합니다.
- Restaurant SELECT가 성공한 뒤 summary만 실패하면 `visitSummaries`를 빈 map으로 설정하고 `restaurantError`는 `null`로 유지합니다.
- 따라서 별점·재방문 표시만 생략되고 정상 Restaurant card와 수정·방문 기록·삭제 동작은 계속 표시됩니다.
- Summary service의 안전한 오류도 blocking UI나 console로 전달하지 않으며 raw Supabase 오류를 노출하지 않습니다.

### Validation

- summary failure → empty summary map + Restaurant list 유지: static pass
- Restaurant failure → existing list error/retry branch 유지: static pass
- `npm.cmd run lint`: pass
- `npm.cmd run build`: pass (Vite 8.1.4)
- `git diff --check`: pass
- out-of-scope path scan: no migration/package/T-108+ changes

### Scope / status

T-107은 `REVIEW` 유지. Summary query/대표 규칙, VisitEditor 저장, migration/schema/RLS/package/DB data, T-108+, Git/Vercel은 변경하지 않았습니다.

— Hank

---

## 2026-07-18 — Hank — T-107 card representative summary

### Context

Owner의 T-107 수동 기능 검증 6단계가 모두 통과했습니다: 방문 INSERT/조회/UPDATE/새로고침 persistence, rating validation과 cancel 보존, visited/unvisited 전환, unvisited 이력 보존, visited 재전환 시 대표 방문 복원, logout/relogin persistence.

### Acceptance-gap correction

- `visitService.getRepresentativeVisitSummaries()`를 추가해 현재 사용자의 restaurant id 집합으로만 방문을 조회합니다. 기존 규칙인 non-null `visited_at` DESC → `updated_at` DESC → `id` DESC를 그대로 적용하고 식당별 첫 행을 대표 방문으로 선택합니다.
- 페이지 목록 로드 시 식당 조회 성공 후 대표 방문 summary를 함께 조회합니다. 동일한 list request id와 keyed user lifecycle guard를 사용하므로 stale 응답이나 사용자 전환 후 결과는 반영되지 않습니다.
- 방문 editor 저장 성공 시 반환된 대표 visit만 local summary map에 병합합니다. 목록 전체 재조회는 하지 않습니다. 미방문 저장 또는 식당 삭제 시 해당 local summary를 제거합니다.
- Card는 `visited`이고 대표 방문이 있을 때만 저장된 대표 별점(값이 있을 때)과 `재방문 있음/없음`을 표시합니다. `unvisited`에서는 보존된 과거 visit 세부정보를 표시하지 않습니다.

### Files changed

- `src/services/visitService.js`
- `src/App.jsx`
- `src/components/visits/VisitEditor.jsx`
- `src/components/restaurants/RestaurantList.jsx`
- `src/App.css`
- `WORK_LOG.md`, `docs/chat/hank-chat.md`

### Validation

- `npm.cmd run lint`: pass
- `npm.cmd run build`: pass (Vite 8.1.4)
- `git diff --check`: pass
- visited summary render / unvisited hide flow: static check pass
- migration 001·002·003, package, T-108+, DB test data, Git push, Vercel: unchanged

### Next action

T-107 remains `REVIEW`. Gini performs a narrow re-review of only the card-summary query, local update, and visibility condition.

— Hank

---

## 2026-07-18 — Hank — T-107 Medium finding correction

### Goal

최초 방문 INSERT 성공 후 식당 status UPDATE가 실패할 때 재시도가 중복 visit INSERT를 만들 수 있는 Gini Medium finding을 최소 수정합니다.

### Correction

- `visitService.saveVisitState()`는 방문 INSERT/UPDATE가 성공한 뒤 status UPDATE가 실패하면 성공한 `visit`을 버리지 않고 `{ visit, restaurant: null, error: 안전한 한국어 오류 }`로 반환합니다.
- `VisitEditor.handleSubmit()`은 오류 결과에 `visit`이 있으면 먼저 `representativeVisit`으로 보존하고 오류를 표시합니다. Editor는 닫히지 않으며, 다음 제출은 보존된 `visit.id`를 전달해 INSERT가 아닌 owner-scoped UPDATE를 수행합니다.
- RPC, transaction, rollback, delete, migration/schema/RLS, T-108+, Restaurant CRUD/Auth 변경은 없습니다.

### Validation

- 해당 service 반환 경로와 editor 오류 경로 정적 확인
- `npm.cmd run lint`: pass
- `npm.cmd run build`: pass (Vite 8.1.4)
- correction-scoped `git diff --check` and source trailing-whitespace scan: pass
- full working-tree `git diff --check`: blocked only by pre-existing `docs/chat/gini-chat.md:65-70` trailing whitespace; Hank did not modify another Agent's chat file
- migration/package/T-108+ protected-scope scan: no changes

### Status

T-107은 `REVIEW`를 유지하며 Gini narrow re-review가 필요합니다.

— Hank

---

## 2026-07-18 — Hank — T-107 Visit editor

### Goal

기존 식당의 대표 방문 1건을 중심으로 방문 여부, 방문일, 전체 별점, 방문 메모, 재방문 의사와 메모를 owner-scoped Supabase CRUD로 기록합니다.

### Implementation

1. `src/services/visitService.js`를 추가해 `visits`의 owner+restaurant 범위 대표 방문 SELECT, 대표 방문 INSERT/UPDATE, `user_restaurants.status` UPDATE를 서비스 계층으로 분리했습니다. 모든 DB 오류는 고정 한국어 메시지로 변환합니다.
2. 대표 방문 선택은 **`visited_at`이 있는 행 우선 내림차순 → `updated_at` 내림차순 → `id` 내림차순**입니다. 이 규칙은 식당별 다회 방문 DB 구조에서 UI가 항상 하나의 동일한 대표 행을 편집하게 합니다.
3. 미방문 저장은 `user_restaurants.status`만 `unvisited`로 바꾸며 기존 방문 행을 삭제하지 않습니다. UI는 그 행을 무시하고 빈 미방문 상태를 보이며, 다시 방문함을 선택하면 위 규칙의 대표 행을 이어서 편집합니다. 따라서 다회 방문 이력은 보존됩니다.
4. `src/components/visits/VisitEditor.jsx`에 방문 여부, date, nullable 1–5 integer rating, 방문 메모, 재방문 checkbox/note, loading/error-retry/empty, save/cancel/pending 상태를 구현했습니다. 대표 방문을 읽지 못하면 폼을 열지 않아 중복 INSERT 위험을 막습니다.
5. `RestaurantList`에 식당별 `방문 기록` 진입점을 추가하고, `App`은 방문 저장 후 반환된 owner restaurant status 행만 병합·최근 수정 시각순 재정렬합니다. keyed user remount와 editor의 mount/request-id guards로 logout/user switch/unmount 뒤 늦은 SELECT/save 결과를 차단합니다.

### Files changed

- Created: `src/services/visitService.js`, `src/components/visits/VisitEditor.jsx`
- Updated: `src/App.jsx`, `src/App.css`, `src/components/restaurants/RestaurantList.jsx`
- Records: `TASK_BOARD.md`, `WORK_LOG.md`, `docs/chat/hank-chat.md`

### Validation

| Check | Result |
|---|---|
| `npm.cmd run lint` | pass (`oxlint`) |
| `npm.cmd run build` | pass (Vite 8.1.4) |
| `git diff --check` | pass |
| migration 001·002·003 / package files diff | no changes |
| service-role/secret scan in changed visit paths | no matches |
| Actual Supabase/DB test | not run by design; Owner uses existing `산방밀면` |

### Risk / manual verification boundary

- Browser client CRUD cannot make the visit write and restaurant-status write atomic without an approved database RPC/schema change; the service saves the representative visit first and then sets `status` to `visited`. If the second request fails, a safe error is shown and retry updates the same selected representative visit before retrying the status write. No hidden rollback or destructive action is attempted.
- T-107 is `REVIEW`, not DONE. Gini source review and Owner manual persistence verification remain required.

### Next action

Gini reviews only T-107. Owner runs the recorded `산방밀면` manual flow. T-108, database mutation by agents, migration/package/Auth work, Git commit/push, and Vercel deploy remain out of scope.

— Hank

---

## 2026-07-18 — Gini — T-106 Restaurant Update/Delete

### Goal

로그인한 사용자가 자신의 식당 이름을 수정하고, 확인 후 자신의 식당을 삭제할 수 있게 합니다. Primary Implementer는 Gini, reviewer는 Hank입니다.

### Work performed

1. `restaurantService`에 `user_id`와 restaurant `id`를 함께 필터하는 UPDATE/DELETE를 추가했습니다. update는 service 내부 trim/blank invariant를 적용하고 반환 행으로 목록을 갱신합니다.
2. 카드별 inline edit/save/cancel form과 이름 validation, delete confirmation/cancel/confirm을 구현했습니다. delete confirmation은 식당명과 연관 기록 cascade 경고를 표시하며, cancel은 service를 호출하지 않습니다.
3. 각 restaurant id별 pending state와 request id를 사용해 row 간 mutation state를 분리했습니다. T-105 user-keyed remount/mount guard를 유지해 logout, user switch, unmount, stale completion이 state를 변경하지 못하게 했습니다.
4. 적용된 FK cascade와 RLS를 그대로 사용했습니다. visit/menu, migration/schema/RLS, package, test data/account, Supabase CLI/remote DB, T-107+ 기능은 변경하지 않았습니다.

### Files changed

- `src/App.jsx`
- `src/App.css`
- `src/components/restaurants/RestaurantList.jsx`
- `src/services/restaurantService.js`
- `TASK_BOARD.md`, `WORK_LOG.md`, `docs/chat/gini-chat.md`

### Validation

- IDE diagnostics: no errors
- `npm.cmd run lint`: pass
- `npm.cmd run build`: pass (Vite 8.1.4)
- Existing dev server smoke: `http://localhost:5173/` HTTP 200
- `git diff --check`: pass
- No Agent-created/updated/deleted restaurant row; Owner must use the existing `산방밀면` row for browser verification.

### Next action

T-106 remains `REVIEW`. Hank reviews owner-scoped mutation construction, stale-result guards, validation/confirmation/accessibility, and T-107+ non-regression. Owner manually verifies edit save/cancel and delete cancel/confirm.

— Gini

---

## 2026-07-18 — Gini — T-105 closeout / T-106 start

### T-105 closeout

- Hank narrow re-review final verdict: `Approve`.
- Owner manual verification passed: name-only create, immediate list update, and refresh persistence.
- T-105 is `DONE`. No additional T-105 source refactor was made.

### T-106 plan

- Primary Implementer: Gini. Reviewer: Hank.
- Add current-owner-scoped name update and confirmation-based delete, with service-level trim/blank validation, per-row mutation state, and existing user lifecycle guards.
- Preserve applied FK cascade behavior; do not create test data or modify migrations, RLS, packages, Auth, visit/menu, or T-107+ features.

— Gini

---

## 2026-07-18 — Gini — T-105 Hank review corrections

### Goal

Hank `Approve with changes`의 T-105 finding 두 건만 수정합니다. T-105는 `REVIEW`를 유지합니다.

### Work performed

1. Medium: authenticated restaurant screen을 `session.user.id` key로 lifecycle 분리해 사용자 전환 시 목록·query error가 즉시 초기화되고 loading 상태에서 새 목록을 조회하게 했습니다. SELECT에는 mount flag와 monotonic request id guard를 적용해 이전/더 오래된 요청이 state를 갱신하지 못하게 했습니다. INSERT에도 mount/request guard를 적용해 logout, user switch, unmount 후 결과를 반영하지 않습니다.
2. Low: `createRestaurant()`에서 전달된 이름을 다시 trim하고, 빈 값이면 Supabase INSERT 없이 `{ restaurant: null, error: '맛집 이름을 입력해 주세요.' }`를 반환하도록 service invariant를 추가했습니다. 실제 INSERT는 정규화된 이름만 사용합니다.

### Files changed

- `src/App.jsx`
- `src/services/restaurantService.js`
- `WORK_LOG.md`
- `docs/chat/gini-chat.md`

### Validation

- IDE diagnostics: no errors
- `npm.cmd run lint`: pass
- `npm.cmd run build`: pass (Vite 8.1.4)
- `git diff --check`: pass
- `.env.local`, migrations 001·002·003, Supabase/remote DB, package, test account/data: unchanged

### Next action

자동 검증 후 Hank에게 두 finding에 대한 narrow re-review를 요청합니다. Owner DB 수동 검증 및 T-106은 시작하지 않습니다.

— Gini

---

## 2026-07-18 — Gini — T-105 Restaurant Read/Create

### Goal

로그인한 사용자가 자신의 맛집 목록을 보고 `display_name`만으로 새 맛집을 저장할 수 있게 합니다. Primary Implementer는 Gini, reviewer는 Hank입니다.

### Work performed

1. 인증 후 임시 환영 화면을 목록과 quick-create 화면으로 교체했습니다.
2. `restaurantService`에 현재 session 사용자 id로 필터한 `user_restaurants` SELECT와 `user_id`·trimmed `display_name`만 전송하는 INSERT를 추가했습니다. `place_id`는 nullable이므로 name-only create에서 전송하지 않습니다.
3. 적용된 `user_restaurants` owner SELECT/INSERT RLS policy를 그대로 사용했습니다. 원시 DB 오류는 화면에 노출하지 않고 안전한 한국어 메시지로 변환합니다.
4. loading, empty, query error/retry 상태와 blank-name validation, pending submit disable, 성공 행의 즉시 목록 반영을 구현했습니다.
5. T-106 edit/delete, visits, menu reviews, search/filter/sort, dashboard, migration/schema/RLS, package, Auth 변경은 수행하지 않았습니다.

### Files changed

- Created: `src/services/restaurantService.js`, `src/components/restaurants/RestaurantForm.jsx`, `src/components/restaurants/RestaurantList.jsx`
- Updated: `src/App.jsx`, `src/App.css`, `TASK_BOARD.md`, `WORK_LOG.md`, `docs/chat/gini-chat.md`

### Validation

- IDE diagnostics: no errors
- `npm.cmd run lint`: pass
- `npm.cmd run build`: pass (Vite 8.1.4)
- Existing dev server smoke: `http://localhost:5173/` HTTP 200
- `git diff --check`: pass
- `.env.local`: still ignored and absent from the diff; no values read or recorded
- Migrations 001·002·003: unchanged; no Supabase CLI or remote DB command executed

### Findings/risks

- Agent did not create a test account or database row. Owner manual verification is required for actual owner-RLS SELECT/INSERT, name-only persistence, and refresh behavior.
- `npm` emitted the existing non-blocking `Unknown env config "devdir"` warning and a version-update notice.
- The authenticated card does not show visit rating/revisit data because visit functionality is T-107 scope.

### Next action

T-105 remains `REVIEW`. Hank reviews the source scope, owner-scoped query/insert, safe errors, accessibility, and T-106+ non-regression. Owner then manually creates one name-only restaurant and verifies immediate list update and refresh persistence.

— Gini

---

## 2026-07-17 — Gini — T-104 final acceptance and GitHub checkpoint

### Goal

Owner의 실제 Auth 검증 통과와 Hank narrow re-review `Approve`를 반영해 T-104를 종료하고, 새 창·다른 PC 인계용 GitHub checkpoint를 생성합니다.

### Acceptance evidence

- 회원가입 요청 및 실제 email confirmation mail 수신
- Confirmation link 인증 성공
- 인증 후 로그인 session 생성과 환영 화면 진입
- 로그아웃 후 로그인 화면 복귀
- 올바른 정보로 재로그인 성공
- 새로고침 후 session 유지
- 현재 browser session만 로그아웃 성공
- 잘못된 비밀번호에 안전한 한국어 오류 표시
- Hank narrow re-review 최종 `Approve` (blocking/non-blocking finding 없음)

### Work performed

1. `TASK_BOARD.md` T-104 → `DONE`, B-002 resolved 재확인
2. D-015 T-104 종료/GitHub checkpoint Accepted 기록
3. `docs/chat/gini-chat.md` 최종 종료 handoff 갱신
4. `TOBY_HANDOFF_20260717.md` 신규 작성 (기존 20260715 handoff 보존)
5. 검증 통과 후 승인된 checkpoint commit 생성 및 `origin/main` push
6. T-105는 시작하지 않음

### Files changed

- `TASK_BOARD.md`, `DECISION_LOG.md`, `WORK_LOG.md`
- `docs/chat/gini-chat.md`
- `TOBY_HANDOFF_20260717.md`
- Checkpoint commit에 T-104 source/package, Supabase config/migration 003, 협업 chat/log 총 19개 file 포함

### Validation

| Check | Result |
|---|---|
| `npm run lint` | 통과 (exit 0) |
| `npm run build` | 통과 (Vite 8.1.4) |
| `git diff --check` | 통과 |
| `.env.local` | ignored; tracked/staged 아님 |
| Staged secret scan | service-role/secret/password/connection string 없음; `.env.example` 값 비어 있음 |
| Migration 001·002·003 hash | baseline과 동일 (미변경) |
| Commit | `91f7b5d0047b5f716c85822682cbbcc2a0fc6582` — `feat: complete T-104 Supabase authentication` |
| Push | `origin/main` 성공 (`75bc907..91f7b5d`) |
| Sync | local `main` = `origin/main` |
| Working tree | clean |

### Findings/risks

- 제출 기한은 2026-07-18이며 T-105~T-114가 남아 일정 위험이 높습니다.
- Performance Advisor INFO는 승인 범위 밖으로 보류됩니다.

### Next action

T-105는 Owner/Toby 별도 승인 전 시작하지 않습니다.

### Handoff note

T-104는 Owner+Hank 검증 근거로 DONE입니다. 다음 창은 `TOBY_HANDOFF_20260717.md`와 required reading order를 먼저 읽어야 합니다.

---

## 2026-07-17 — Gini — T-104 Hank review corrections

### Goal

Hank `Approve with changes`의 Low finding 3건만 Owner/Toby 승인 범위대로 수정합니다.

### Work performed

1. 초기 session 오류를 버리지 않고 `initializationError` state와 안전한 오류/새로고침 화면으로 연결
2. 로그아웃 scope를 Supabase `local`로 제한
3. 로그인/회원가입 전환의 불완전한 tab ARIA semantics 제거; 일반 button과 `aria-pressed` 사용
4. 그 외 refactor·기능 추가 없음

### Files changed

- `src/App.jsx`
- `src/services/authService.js`
- `src/components/auth/AuthForm.jsx`
- `WORK_LOG.md`, `docs/chat/gini-chat.md`, `TASK_BOARD.md`

### Validation

| Check | Result |
|---|---|
| IDE lints | none |
| `npm run lint` | exit 0 |
| `npm run build` | exit 0 (Vite 8.1.4) |
| Dev smoke | `/` 200, root OK, `/src/main.jsx` 200; port 5173 closed afterward |
| Secret scan | no service-role/secret key matches in `src` or `dist` |
| `.env.local` | still ignored; unchanged |

### Findings/risks

- Blocker 없음.
- 실제 Auth 요청과 session 오류 강제 재현은 test account 금지 및 Owner manual-test 경계로 남습니다.

### Decisions needed

- Hank narrow re-review of the three corrections
- Owner manual Auth verification

### Next action

두 검증 전 T-104는 IN_PROGRESS 유지. T-105/Git/remote DB 작업 미착수.

### Handoff note

세 Low finding만 수정했고 lint/build/smoke가 통과했습니다.

---

## 2026-07-17 — Gini — T-104 Supabase client + Auth 구현

### Goal

Owner/Toby 승인에 따라 Supabase client와 email/password Auth(가입·로그인·로그아웃·session 유지·안전 오류 처리)를 구현합니다. Migration/remote DB는 변경하지 않습니다.

### Work performed

1. Preflight: `.env.local` 존재, 두 환경변수 non-empty(값 미출력), `.gitignore`의 `.env.*` rule로 ignore 확인, `git status`에 미노출
2. `@supabase/supabase-js@2.110.7` dependency 설치
3. `src/lib/supabase.js` — 단일 client 생성, 누락 env 이름 목록 export
4. `src/services/authService.js` — signUp/signIn/signOut/getInitialSession/onAuthStateChange, 오류를 안전한 한국어 문장으로 변환
5. `src/components/auth/AuthForm.jsx` — 로그인/회원가입 tab, label·focus·disabled/loading, email 확인 안내 상태
6. `src/App.jsx` — env 오류 화면, session loading 화면, 로그인 전(AuthForm)/후(header+logout) 화면 분리, `onAuthStateChange` 구독
7. `src/App.css` — plain CSS만 사용 (UI library 없음)
8. `index.html` title `TasteLog`, `.env.example` 변수명을 `VITE_SUPABASE_PUBLISHABLE_KEY`로 갱신 (이름만)
9. Test 계정 자동 생성, CRUD, migration 수정, Git commit/push, Vercel, T-105+ **미수행**

### Files changed

- Created: `src/lib/supabase.js`, `src/services/authService.js`, `src/components/auth/AuthForm.jsx`
- Updated: `src/App.jsx`, `src/App.css`, `index.html`, `.env.example`, `package.json`, `package-lock.json`
- Docs: `TASK_BOARD.md`, `WORK_LOG.md`, `docs/chat/gini-chat.md`

### Validation

| Check | Result |
|---|---|
| `npm run lint` | exit 0 (oxlint) |
| `npm run build` | exit 0; Vite 8.1.4 |
| Dev smoke | `http://127.0.0.1:5173/` HTTP 200, `#root` OK, `/src/main.jsx` 200; 서버 종료 |
| `.env.local` Git 제외 | `git check-ignore` matched `.env.*`; `git status`에 없음 |
| Secret scan (src) | `service_role`/`sb_secret` 없음 |
| Secret scan (dist) | supabase-js 내부의 `sb_secret_` prefix 판별 문자열만 존재; 실제 key 없음 |
| Env 값 노출 | 값·token을 어떤 출력/문서에도 기록하지 않음 |

### Findings/risks

- Session 유지·email 확인 흐름은 코드/문서 기준 구현이며, 실제 브라우저 가입·로그인은 Owner 확인 필요 (test 계정 자동 생성 금지 준수).
- Supabase project의 email confirmation 설정에 따라 가입 직후 세션 발급 여부가 달라지며, 두 경우 모두 처리했습니다.

### Decisions needed

- Owner: dev server에서 실제 가입·로그인·로그아웃·새로고침 확인
- Hank: T-104 Auth 구현 code review

### Next action

Owner 수동 확인과 Hank review 대기. T-104는 IN_PROGRESS 유지.

### Handoff note

Auth 구현은 lint/build/smoke까지 통과한 상태입니다. secret은 코드·번들·문서에 없으며 `.env.local`은 Git에서 제외됩니다. DONE 처리는 Owner 확인+Hank review 후에만 합니다.

---

## 2026-07-17 — Gini — D-014 actual push + Security Advisor recheck

### Goal

Hank `Approve` (no findings) 후 Owner/Toby 승인에 따라 `20260717000003`만 remote에 적용하고 search_path 고정과 Security Advisor WARN 해소를 검증합니다.

### Work performed

1. Preflight: hashes + migration list + dry-run → pending은 003만
2. `supabase db push` — applied only `20260717000003_harden_set_updated_at_search_path.sql`
3. Migration history: three migrations all local=remote
4. Read-only: `proconfig = {search_path=pg_catalog}` on `public.set_updated_at()`
5. `supabase db advisors --linked --type security` → no issues
6. Did **not** change Performance Advisor items, Auth/env, Git, or later tasks

### Files changed

- `TASK_BOARD.md` — next action after hardening apply
- `WORK_LOG.md` — this entry
- `docs/chat/gini-chat.md` — push + advisor result
- Migration SQL files: **not modified** during this push stage

### Validation

| Check | Result |
|---|---|
| Preflight pending | only 003 |
| Push | 003 applied successfully |
| History | 001/002/003 local=remote |
| Function config | `search_path=pg_catalog` |
| Security Advisor | No issues found |
| Hashes | 001 `5AAB…C85`, 002 `A948…9B0`, 003 `BCAD…5FBC` unchanged |
| Docker warning | local catalog cache fail only; remote OK |

### Findings/risks

- Transient `migration list` temp-role connect failure once; retry succeeded without password args or repair.
- Performance Advisor INFO remains intentionally untouched.

### Decisions needed

- Owner/Toby: approve T-104 Auth/env stage when ready.

### Next action

Stop. Await Auth/env approval. Do not start client work without it.

### Handoff note

D-014 hardening is live on `tastelog-phase1`. Security Advisor WARN for mutable search_path is cleared. T-104 Auth remains blocked pending explicit approval.

---

## 2026-07-17 — Gini — `set_updated_at` search_path hardening dry-run

### Goal

기존 applied migration을 보존하면서 Security Advisor의 `public.set_updated_at search_path mutable` WARN을 forward migration으로 보정하고, 실제 push 없이 dry-run까지만 검증합니다.

### Work performed

1. Remote `pg_proc`를 읽기 전용 조회해 `public.set_updated_at()` 무인자 signature와 `trigger` 반환형, 미설정 `proconfig` 확인
2. 기존 두 migration SHA256 baseline 일치 확인
3. `20260717000003_harden_set_updated_at_search_path.sql` 생성
4. D-014 Accepted 기록
5. 새 migration이 지정된 `ALTER FUNCTION` 한 문장만 포함하는지 정적 검증
6. Migration history에서 세 번째 migration만 local pending임을 확인
7. `supabase db push --dry-run` 실행; 세 번째 migration 하나만 표시
8. 실제 `db push` 미실행

### Files changed

- `supabase/migrations/20260717000003_harden_set_updated_at_search_path.sql` — 함수 `search_path` 보정만 포함
- `DECISION_LOG.md` — D-014 Accepted
- `TASK_BOARD.md` — review/push 승인 대기 상태
- `WORK_LOG.md` — 본 기록
- `docs/chat/gini-chat.md` — 계획과 결과
- 기존 migration 두 개: **미수정·미rename**

### Validation

| Check | Result |
|---|---|
| Remote signature | `public.set_updated_at()` → `trigger` |
| New migration SQL | `alter function public.set_updated_at() set search_path = pg_catalog;` only |
| Migration history | 1·2 local=remote; 3 local-only |
| Dry-run | only `20260717000003_harden_set_updated_at_search_path.sql` |
| Existing SHA256 | `5AAB...C85`, `A948...9B0` — baseline unchanged |
| Actual push | not executed |

### Findings/risks

- 보정 SQL은 함수 body나 trigger, table, policy, constraint, index를 변경하지 않습니다.
- Performance Advisor INFO는 지시대로 변경하지 않았습니다.

### Decisions needed

- Hank: 새 forward migration 정적 review
- Owner/Toby: Hank review 후 실제 `supabase db push` 승인 여부

### Next action

Review와 실제 push 승인을 기다립니다. 승인 전 remote 변경, Auth/env/client 작업을 시작하지 않습니다.

### Handoff note

세 번째 migration만 pending이며 dry-run이 예상 순서를 확인했습니다. 실제 push는 실행하지 않았습니다.

---

## 2026-07-17 — Gini — D-010 actual `db push` + read-only verify

### Goal

Owner/Toby-approved ordered remote apply of the two reviewed migrations on linked `tastelog-phase1`, then read-only verification. No Auth/env/client work.

### Work performed

1. Reconfirmed migration SHA256 vs baseline (unchanged)
2. Ran `supabase db push` — applied `20260715000001_initial_schema.sql` then `20260715000002_rls_policies.sql`
3. Confirmed `supabase migration list`: both local and remote populated
4. Read-only checks: 5 public tables, RLS enabled on all, 16 policies, constraints, indexes
5. Ran `supabase db advisors --linked --type all`
6. Did **not** seed data, write `.env`, install `@supabase/supabase-js`, implement Auth, commit, or start T-105

### Files changed

- `TASK_BOARD.md` — next action after remote apply
- `WORK_LOG.md` — this entry
- `docs/chat/gini-chat.md` — push + verify handoff
- Migration SQL files: **not modified**

### Validation

| Check | Result |
|---|---|
| Push order | schema then RLS; Finished successfully |
| Migration history | remote `20260715000001`, `20260715000002` |
| Tables | 5 expected public base tables |
| RLS | enabled on all 5 |
| Policies | 16 (profiles 3, places 1, user_restaurants 4, visits 4, menu_reviews 4) |
| Constraints/indexes | present (owner uniques, FKs, checks, Phase 1 indexes) |
| Security Advisor | WARN `set_updated_at` search_path mutable |
| Performance Advisor | INFO unindexed `place_id` FK; unused indexes on empty DB |
| Migration SHA256 | unchanged |
| Docker warning | local catalog cache failed (no Docker Desktop); remote apply OK |

### Findings/risks

- Advisor WARN on `set_updated_at` is informational for Phase 1; no migration repair performed.
- Unused-index INFO is expected before app traffic.

### Decisions needed

- Owner/Toby: approve T-104 Auth/env stage (B-002 `.env` + client).

### Next action

Stop and await next approval. Do not start Auth/env without explicit Owner/Toby go-ahead.

### Handoff note

Remote DB now has approved schema + RLS. T-104 remains IN_PROGRESS until Auth acceptance criteria are met under a new approval.

---

## 2026-07-17 — Gini — T-104 stage 1 (CLI · link · dry-run)

### Goal

Owner-approved T-104 stage 1: prepare Supabase CLI, link `tastelog-phase1`, verify migration history, run `db push --dry-run` only. Do not apply SQL.

### Work performed

1. Confirmed Git `main`/`origin/main` at baseline; recorded migration SHA256 hashes
2. Installed project-scoped `supabase` CLI 2.109.1 as devDependency
3. Ran `supabase init` (created `config.toml` / `.gitignore`; migrations unchanged)
4. Owner completed `npx supabase login` in Cursor Terminal
5. Linked project ref `xqgrunybnlblaqlzomkv`
6. `supabase migration list`: both migrations local-only; remote empty
7. `supabase db push --dry-run`: would push the two approved files in order
8. Did **not** run actual `db push`

### Files changed

- `package.json`, `package-lock.json` — `supabase` devDependency
- `supabase/config.toml`, `supabase/.gitignore` — CLI init
- `TASK_BOARD.md` — T-104 IN_PROGRESS; stage 1 complete note
- `WORK_LOG.md` — this entry
- `docs/chat/gini-chat.md` — stage 1 result

### Validation

| Check | Result |
|---|---|
| CLI version | 2.109.1 |
| Project | `tastelog-phase1` / `xqgrunybnlblaqlzomkv` ACTIVE_HEALTHY, linked |
| Migration list | local `20260715000001`, `20260715000002`; remote blank |
| Dry-run order | 1) `initial_schema` 2) `rls_policies` only |
| Migration SHA256 | unchanged vs baseline |
| Actual SQL apply | not executed |

### Findings/risks

- Remote DB has no migrations yet; first real push will create schema + RLS.
- Secrets were not written to docs/chat/commands.

### Decisions needed

- Owner/Toby: approve actual `supabase db push` (D-010 ordered execution).

### Next action

Stop until Owner/Toby approve real `db push`. No Auth/.env/client work until that stage is assigned.

### Handoff note

T-104 stage 1 (prepare/link/dry-run) is complete and safe to hand off for push approval. Actual push, env, and Auth remain blocked.

---

## 2026-07-17 — Gini — Private GitHub baseline

### Goal

승인된 T-100~T-103 결과를 secret과 local 생성물 없이 최초 Git commit으로 보존하고, 데스크탑에서 clone 가능한 Private GitHub `main` 기준점을 확립합니다.

### Work performed

1. Required reading order와 current chat files 재확인
2. Local branch `main`, commit 0, remote 없음, 전체 untracked file 확인
3. 승인된 migration 두 개의 정확한 이름과 대용량 생성물 부재 확인
4. `.agents/`는 비어 있는 local Cursor working folder로 판단해 `.gitignore`에 제외
5. Supabase local working state(`supabase/.branches/`, `supabase/.temp/`) 제외 규칙 추가
6. Secret-like 문자열과 실제 `.env*` 검사; `.env.example` 외 환경 파일 없음 확인
7. D-013 Accepted 및 B-001 resolved 기록
8. 최초 commit `chore: establish TasteLog Phase 1 baseline` 생성 후 `origin/main`에 push

### Files changed

- `.gitignore` — local agent/Supabase working state 제외
- `DECISION_LOG.md` — D-013 Accepted
- `TASK_BOARD.md` — B-001 resolved; 다음 task 미시작
- `WORK_LOG.md` — 본 기록
- `docs/chat/gini-chat.md` — Git baseline handoff
- 기존 승인된 source, docs, migration files를 최초 baseline에 포함

### Validation

- Repository URL: `https://github.com/tonykks/tastelog`
- Branch: `main`
- Migrations: `20260715000001_initial_schema.sql`, `20260715000002_rls_policies.sql`
- Excluded: `.agents/`, `node_modules/`, `dist/`, actual `.env*`, Supabase local working state, logs/editor/OS temp
- Secret scan: 실제 password/token/API key/service-role key/connection string 없음
- Remote preflight: `git ls-remote` refs 없음 (empty repository)
- Push 후 local `main`과 `origin/main` 동일 commit 및 clean working tree 확인

### Warnings / risks

- GitHub CLI(`gh`)는 이 PC에 설치되어 있지 않아 repository metadata 조회 대신 `git ls-remote`와 standard Git push/verification을 사용
- Supabase project 연결·SQL 실행·React/Auth 구현·package 설치·Vercel 연결은 수행하지 않음

### Next action

Desktop에서 repository를 `git clone`하고 `npm install` 후 local 실행을 확인합니다. T-104 또는 이후 task는 Owner/Toby 승인 전 시작하지 않습니다.

### Handoff note

Private GitHub `main` is the shared Phase 1 baseline. Use clone, not Download ZIP, so Git history and upstream tracking are preserved.

---

## 2026-07-15 — Gini — T-103 final approval / closeout (docs only)

### Goal

Owner/Toby의 T-103 최종 승인을 보드·로그·chat에 반영하고 task를 종료합니다. SQL/Migration/React/env/Supabase/package/Git은 수정·실행하지 않습니다.

### Work performed

1. Any 최종 판정 `Approve` (추가 findings 없음) 및 Owner/Toby T-103 최종 승인 확인
2. `TASK_BOARD.md`: T-103 → `DONE`; 다음 task 상태 임의 변경·시작 없음
3. `WORK_LOG.md` / `docs/chat/gini-chat.md`에 종료 정리 기록
4. Migration SQL 실행, React/env/Supabase/package/Git, 후속 task 구현 **미수행**

### Files changed

- `TASK_BOARD.md` — T-103 DONE, immediate next action = Owner/Toby 승인 대기
- `WORK_LOG.md` — 본 항목
- `docs/chat/gini-chat.md` — T-103 closeout append (서명: Gini)

### Validation

- Documentation status only; no SQL execution
- Migration artifacts unchanged by this closeout

### Findings/risks

- T-102/T-103 SQL remain reviewed static artifacts; Supabase apply still requires explicit Owner ordered execution (D-010)

### Next action

Owner/Toby 다음 stage 승인 대기. 후속 task 미시작.

### Handoff note

T-103 is closed by Owner/Toby after Any final Approve with no added findings. No next task was marked READY or started in this closeout.

---

## 2026-07-15 — Hank — T-103 implementation

### Goal

Implement the approved T-103 RLS policy migration after Any's `Approve with changes` review and Owner/Toby acceptance of D-012.

### Work performed

1. Confirmed preflight: T-102 `DONE`, T-103 `IN_PROGRESS`, Any T-103 verdict `Approve with changes` with one Medium and one Low finding, one active T-102 migration, T-103 migration absent before creation, no SQL execution or Supabase connection recorded.
2. Created `supabase/migrations/20260715000002_rls_policies.sql`.
3. Added D-012 Accepted decision to `DECISION_LOG.md`.
4. Implemented 16 operation-specific RLS policies targeting `authenticated`.
5. Applied Any's accepted changes: simple owner RLS for owner tables, no parent/visit `EXISTS` subqueries, security tests limited to RLS-01 through RLS-14.
6. Set T-103 to `REVIEW`.
7. SQL execution, tests, Supabase connection, package/CLI install, React/env edits, Git commit/push, and T-104 were not performed.

### Files changed

- `supabase/migrations/20260715000002_rls_policies.sql` — T-103 RLS policy migration
- `DECISION_LOG.md` — D-012 Accepted
- `TASK_BOARD.md` — T-103 `REVIEW`
- `WORK_LOG.md` — this implementation entry
- `docs/chat/hank-chat.md` — implementation handoff

### Validation command/check and result

| Check | Result |
|---|---|
| Active migration files | OK: `20260715000001_initial_schema.sql`, `20260715000002_rls_policies.sql` |
| T-103 `CREATE POLICY` count | OK: 16 |
| Target role | OK: 16 `to authenticated` |
| `FOR ALL` | OK: 0 |
| Operation counts | OK: SELECT 5, INSERT 4, UPDATE 4, DELETE 3 |
| UPDATE shape | OK: each update policy has both `USING` and `WITH CHECK` |
| INSERT shape | OK: insert policies use `WITH CHECK` and no `USING` |
| DELETE shape | OK: delete policies use `USING` and no `WITH CHECK` |
| Owner-table `EXISTS` subquery | OK: none |
| `USING (true)` | OK: only authenticated `places` SELECT |
| anon/service-role policy | OK: none |
| `DROP` / URL / password / access token / API key / connection string | OK |
| T-102 migration | Not modified in this implementation |
| SQL/test execution | Not executed |

### Findings/risks

- T-103 is a static SQL artifact only. It still needs Any final review and Owner approval before any ordered Supabase execution.

### Decisions needed

- Any final review of T-103 migration.
- Owner/Toby approval before SQL execution with T-102/T-103 ordered migration.

### Next action

Any reviews `supabase/migrations/20260715000002_rls_policies.sql`.

### Handoff note

T-103 implementation is complete for static review. Policy counts match the approved design. No SQL was executed and no Supabase project was connected. T-103 is `REVIEW`; T-104 was not started.

---

## 2026-07-15 — Hank — T-103 planning

### Goal

T-103 planning phase only: design the RLS policy matrix and reproducible security test plan for `profiles`, `places`, `user_restaurants`, `visits`, and `menu_reviews`.

### Work performed

1. Read `docs/prompts/T103_HANK_RLS_PLAN.md` and required project context.
2. Completed preflight: T-102 is `DONE`, T-103 was `READY`, Any final T-102 verdict is `Approve`, one active migration exists, and no SQL/Supabase execution is recorded.
3. Set T-103 to `IN_PROGRESS`.
4. Wrote the policy matrix, index review, next migration filename proposal, and security test matrix in `docs/chat/hank-chat.md`.

### Files changed

- `TASK_BOARD.md` — T-103 set to `IN_PROGRESS`
- `WORK_LOG.md` — this planning entry
- `docs/chat/hank-chat.md` — complete signed T-103 planning handoff

### Validation command/check and result

| Check | Result |
|---|---|
| T-102 current row | OK: one active row, `DONE` |
| T-103 current row | OK: one active row, `READY` before update |
| Any final T-102 verdict | OK: `Approve` |
| Active schema migration | OK: only `20260715000001_initial_schema.sql` |
| SQL/Supabase execution | Not performed; no connection created |
| SQL file creation | Not performed |

### Findings/risks

- Recommended policy plan requires separate SQL migration review before execution.
- `places` is recommended as authenticated read-only for Phase 1; browser writes remain denied.

### Decisions needed

- Any review of T-103 plan.
- Owner/Toby approval before creating or executing the future RLS policy migration.

### Next action

Await Any review and Owner/Toby approval. Do not create SQL migration until approved.

### Handoff note

T-103 is in planning only. No SQL file was created or executed. No Supabase project was connected. No React, env, Git, or later task work was performed.

---

## 2026-07-15 — Gini — T-102 final approval / closeout (docs only)

### Goal

Owner/Toby의 T-102 최종 승인을 보드·로그·chat에 반영하고 task를 종료합니다. SQL/Migration/React/Supabase/Git은 수정하지 않습니다.

### Work performed

1. Any 최종 판정 `Approve` (findings 0) 및 Owner/Toby T-102 최종 승인 확인
2. `TASK_BOARD.md`: T-102 → `DONE`, T-103 → `READY` (시작하지 않음)
3. `WORK_LOG.md` / `docs/chat/gini-chat.md`에 종료 정리 기록
4. Migration SQL 실행, schema 변경, React/Supabase/Git, T-103 구현 **미수행**

### Files changed

- `TASK_BOARD.md` — T-102 DONE, T-103 READY, immediate next action
- `WORK_LOG.md` — 본 항목
- `docs/chat/gini-chat.md` — T-102 closeout (서명: Gini)

### Validation

- Documentation status only; no SQL execution
- Active migration artifact remains `supabase/migrations/20260715000001_initial_schema.sql` (unchanged by this closeout)

### Findings/risks

- Schema is reviewed and accepted as a static artifact; production/Supabase apply still blocked until T-103 + Owner ordered execution (D-010)

### Next action

Owner/Toby T-103 시작 승인 대기. Gini는 T-103을 시작하지 않음.

### Handoff note

T-102 is closed by Owner/Toby after Any final Approve (findings 0). T-103 is READY only. No implementation started in this closeout.

---

## 2026-07-15 — Hank — T-102 correction after Any review

### Goal

Any review after T-102 identified two accepted corrections in `docs/prompts/T102_HANK_CORRECTION_AFTER_ANY_REVIEW.md`: change the optional menu-to-visit FK delete action and rename the migration file to Supabase timestamp format.

### Work performed

1. Read the correction prompt and required T-102 context.
2. Changed `menu_reviews_visit_owner_restaurant_fk` from `ON DELETE RESTRICT` to `ON DELETE SET NULL (visit_id)`.
3. Renamed the active migration file from `20260715_001_initial_schema.sql` to `20260715000001_initial_schema.sql`.
4. Did not start T-103 and did not execute SQL.

### Files changed

- `supabase/migrations/20260715000001_initial_schema.sql` — active T-102 migration artifact
- `WORK_LOG.md` — this correction entry
- `docs/chat/hank-chat.md` — correction handoff

### Validation command/check and result

| Check | Result |
|---|---|
| One active T-102 migration file | OK: only `20260715000001_initial_schema.sql` exists in `supabase/migrations` |
| Optional visit FK action | OK: `ON DELETE SET NULL (visit_id)` |
| FK preserved columns | OK: FK remains `(user_id, restaurant_id, visit_id)` and only `visit_id` is nulled on visit delete |
| RLS enablement | OK: all five tables still enable RLS |
| Policy SQL absent | OK: no `CREATE POLICY` / `ALTER POLICY` |
| `DROP` / secret / URL / password / token scan | OK |
| SQL execution | Not executed by design |

### Findings/risks

- `DECISION_LOG.md` still needs the accepted D-011 correction entry requested by the prompt; the attempted patch was blocked by governance approval safeguards.
- T-102 remains `REVIEW` and awaits final review.

### Decisions needed

- Owner/Toby: explicitly approve adding the D-011 decision-log entry that supersedes only the `ON DELETE RESTRICT` portion of D-010.

### Next action

Final review of corrected T-102 migration after the D-011 log entry is approved or separately handled.

### Handoff note

The active local migration artifact is `supabase/migrations/20260715000001_initial_schema.sql`. The optional visit FK now uses `ON DELETE SET NULL (visit_id)`. No SQL, Supabase connection, package install, React edit, commit, push, deploy, or T-103 work occurred. T-102 remains in `REVIEW`.

---

## 2026-07-15 — Hank — T-102

### Goal

Owner/Toby가 확정한 T-102 schema 결정을 반영해 실행하지 않은 초기 schema migration SQL 파일을 작성하고 정적으로 검증합니다.

### Work performed

1. `TOBY_OPERATING_GUIDE.md`, `AGENTS.md` Required reading order, current chat, T-102 implementation prompt 확인
2. `supabase/migrations/20260715_001_initial_schema.sql` 작성
3. `profiles`, `places`, `user_restaurants`, `visits`, `menu_reviews` 5개 table 정의
4. owner-first composite UNIQUE/FK로 parent/child owner mismatch 방지
5. `updated_at` function과 5개 trigger 작성
6. Phase 1용 최소 index 작성
7. 5개 table 모두 `ENABLE ROW LEVEL SECURITY`; policy SQL은 T-103으로 보류
8. `DECISION_LOG.md`에 D-010 Accepted 기록
9. SQL 실행, Supabase 연결, package/CLI 설치, React 수정, commit/push 미수행

### Files changed

- `supabase/migrations/20260715_001_initial_schema.sql` — initial schema migration SQL
- `DECISION_LOG.md` — D-010 initial schema integrity decision
- `TASK_BOARD.md` — T-102 `REVIEW`
- `WORK_LOG.md` — 본 항목
- `docs/chat/hank-chat.md` — T-102 implementation result and Any review request

### Validation command/check and result

| Check | Result |
|---|---|
| SQL creation/dependency order review | OK: function → parent/shared tables → owner parent → children → indexes → triggers → RLS |
| Composite UNIQUE/FK order | OK: owner-first `user_id, id`; child FK order matches |
| Optional visit FK | OK: `(user_id, restaurant_id, visit_id)` → `visits(user_id, restaurant_id, id)`, `ON DELETE RESTRICT` |
| RLS enablement | OK: all five tables have `ENABLE ROW LEVEL SECURITY` |
| Policy SQL absent | OK: no `create policy` / `alter policy` |
| `pgcrypto` extension absent | OK |
| Secret/URL/password/token scan | OK |
| Destructive DROP scan | OK |
| SQL execution | Not executed by design |

### Findings/risks

- `ON DELETE RESTRICT` on optional menu-to-visit FK is conservative and matches T-102 prompt; Any should review interaction with restaurant-level cascade before external execution.
- With RLS enabled and no policies, browser/client table access is default-deny until T-103 policies are created and applied in the approved order.

### Decisions needed

- Any: independent review of T-102 migration SQL
- Owner/Toby: after T-102 and T-103 are both reviewed, approve one ordered external execution if appropriate

### Next action

Any reviews T-102. Hank does not start T-103 until assigned/approved.

### Handoff note

Migration SQL is a local artifact only. No Supabase connection or SQL execution occurred. No secrets were added. T-102 is in REVIEW.

---

## 2026-07-15 — Gini — T-101 closeout (D-009 + package name)

### Goal

B-006을 D-009로 해결하고 package name을 `tastelog`로 맞춰 T-101을 DONE으로 닫습니다.

### Work performed

1. 빈 `.git/` 재확인 (ChildCount=0, no HEAD/config/objects, not a repo) → 삭제하지 않음
2. `git init -b main`으로 로컬 repository 초기화 (commit/remote/push 없음)
3. `.agents/` 유지 (수정·삭제 없음)
4. `npm.cmd pkg set name=tastelog` → `npm.cmd install`
5. `npm.cmd pkg get name` / `run build` / `run lint` / `git status --short` 검증
6. `DECISION_LOG.md`에 D-009 Accepted 기록

### Commands and results

| Command | Exit / result |
|---|---|
| `git init -b main` | 0; empty repo on `main` |
| `git status` | works; no commits yet; untracked sources listed |
| `git branch --show-current` | `main` |
| `git remote -v` | empty |
| `git rev-list --count --all` | `0` |
| `npm.cmd pkg set name=tastelog` | 0 |
| `npm.cmd install` | 0; up to date; 0 vulnerabilities |
| `npm.cmd pkg get name` | `"tastelog"` |
| `npm.cmd run build` | 0 |
| `npm.cmd run lint` | 0 (`oxlint`) |

### Files changed

- `package.json`, `package-lock.json` — root name `tastelog`
- `.git/` — initialized local metadata (no commits)
- `DECISION_LOG.md`, `TASK_BOARD.md`, `WORK_LOG.md`, `docs/chat/gini-chat.md`

### Git / ignore checks

- `node_modules/`, `dist/`, real `.env` not listed in `git status --short`
- `.env.example` appears as untracked (expected)
- `.agents/` present and untouched
- No remotes; no commits; no `git add`/`commit`/`push`

### Preservation

- Markdown 18 (includes `TOBY_OPERATING_GUIDE.md`)
- Root `README.md` Collaboration Pack preserved
- No Supabase/UI library packages added

### Warnings

- npm `Unknown env config "devdir"` (non-blocking) on npm commands

### Next action

Owner/Toby 승인 대기. T-102·commit·GitHub·Supabase 미시작.

### Handoff note

T-101 DONE. Local git ready on `main` without history or remotes. Package identity is `tastelog`. Next implementation needs explicit Owner/Toby assignment.

---

## 2026-07-15 — Gini — T-101 follow-up (package name) BLOCKED

### Goal

Hank Approve-with-changes 수용 후 `package.json` name을 `tastelog`로 바꿔 T-101을 DONE으로 닫기.

### Work performed

- Pre-check만 실행. `npm.cmd pkg set` / install / build / lint **미실행**
- Markdown 18개 확인 (`TOBY_OPERATING_GUIDE.md` 포함)
- `package.json` name 현재: `"tastelog-vite-temp"`
- `.agents/`: empty, 존재 — Owner 지침대로 **유지**, 수정 없음
- `.git/`: **재출현** — empty directory (ChildCount=0), `git status` → `fatal: not a git repository`, no `.git/HEAD`
- 이번 허용 변경 범위에 `.git` 삭제가 없어 삭제하지 않고 중단

### Files changed

- `TASK_BOARD.md` — B-006, immediate next action
- `WORK_LOG.md` — 본 항목
- `docs/chat/gini-chat.md` — 중단 보고
- `package.json` / `package-lock.json` — **미변경**

### Validation

| Check | Result |
|---|---|
| `package.json` / lock present | yes |
| name | still `tastelog-vite-temp` |
| Markdown 18 | yes |
| root README | present |
| `.env` | absent |
| `.git` | unexpected empty dir present |
| `.agents` | present (kept) |

### Decisions needed

- Owner: 빈 `.git/` 다시 삭제 승인 여부 (B-005와 동일 패턴)
- 승인 후: `npm.cmd pkg set name=tastelog` → install → build → lint → T-101 DONE

### Next action

Owner 결정 대기. package rename 미착수.

### Handoff note

완료 기준에 `.git` 없음이 포함되어 있고, 허용 파일 목록에 `.git` 삭제가 없어 follow-up을 멈춤. `.agents`는 유지.

---

## 2026-07-15 — Gini — T-101

### Goal

B-005 조건부 삭제 후 Vite React foundation을 병합형 scaffold로 root에 구성하고 install/build/dev를 검증합니다.

### Work performed

1. `.git/`·`.agents/` 재확인: 둘 다 empty directory, ChildCount=0, `.git` not a real repo → Owner 승인에 따라 삭제, 경로 gone
2. Conflict checklist 재확인 후 `npm.cmd create vite@latest tastelog-vite-temp -- --template react`
3. Move only: `package.json`, `vite.config.js`, `index.html`, `src/`, `public/`, `.gitignore` (temp `README.md`·`.oxlintrc.json` 미이동)
4. `.gitignore`에 `node_modules/`, `dist/`, `dist-ssr/`, `.env`, `.env.*`, `!.env.example` 확보
5. `.env.example`에 `VITE_SUPABASE_URL=` / `VITE_SUPABASE_ANON_KEY=` 변수명만
6. `tastelog-vite-temp` 제거 (잔여: Vite README + `.oxlintrc.json`)
7. `npm.cmd install` → `npm.cmd run build` → `npm.cmd run dev -- --host 127.0.0.1` smoke → 서버 종료
8. git init / Supabase package / UI library / 외부 설정 / T-102 **미수행**

### Files changed / created

- Created: `package.json`, `package-lock.json`, `vite.config.js`, `index.html`, `src/**`, `public/**`, `.gitignore`, `.env.example`, `node_modules/**`, `dist/**` (build artifact)
- Deleted: empty `.git/`, empty `.agents/`, `tastelog-vite-temp/`
- Updated: `TASK_BOARD.md`, `WORK_LOG.md`, `docs/chat/gini-chat.md`
- Preserved: collaboration Markdown 17개, root `README.md` (Collaboration Pack)

### Validation command/check and result

| Check | Result |
|---|---|
| B-005 delete | `.git` / `.agents` gone |
| `npm.cmd install` | exit 0; lockfile created; 0 vulnerabilities |
| `npm.cmd run build` | exit 0; Vite 8.1.4 built in ~283ms |
| Dev smoke | `http://127.0.0.1:5173/` HTTP 200; `#root`/main present; `/src/main.jsx` 200; server stopped (port 5173 closed) |
| Markdown 17 | OK |
| `.env` / secrets | none |
| Supabase/UI lib | not installed |
| `.git` | still absent (no git init) |

### Warnings / risks

- npm warn: `Unknown env config "devdir"` (environment npmrc; build/dev OK)
- npm notice: newer npm 12 available (not acted on)
- create-vite template includes `oxlint` + `lint` script; `.oxlintrc.json` was left in temp and discarded with temp (not an approved move target). `npm run lint`는 아직 검증하지 않음
- `package.json` `"name"` remains `tastelog-vite-temp` (template default)
- B-001 GitHub URL still open; package name rename optional for later

### Decisions needed

- Hank REVIEW of T-101
- Optional later: package name rename; whether to restore `.oxlintrc.json` if lint is desired

### Next action

Hank review. Do not start T-102 until Owner/Toby approve next stage.

### Handoff note

Foundation is ready locally. No secrets, no git repo, no Supabase client. Dev server is stopped. Reviewer: Hank.

---

## 2026-07-15 — Gini — T-101 (BLOCKED before scaffold)

### Goal

승인된 T-101 Vite React foundation을 Hank 절차대로 시작하기 전 root 충돌 재확인.

### Work performed

- `AGENTS.md`, `TASK_BOARD.md`, `gini-chat.md`, `hank-chat.md`, `WORK_LOG.md` 재확인
- Root conflict checklist 실행 (`package.json`, `vite.config.*`, `index.html`, `src`, `public`, `.gitignore`, `.env`, `tastelog-vite-temp` → 모두 absent)
- 예상 밖 항목 발견: 빈 `.git/`·`.agents/` (ChildCount=0, `git status`는 “not a git repository”)
- Vite scaffold / npm install / file move **미실행** (중단 규칙 준수; 삭제·덮어쓰기 없음)

### Files changed

- `TASK_BOARD.md` — T-101 `BLOCKED`, B-005, immediate next action
- `WORK_LOG.md` — 본 항목
- `docs/chat/gini-chat.md` — T-101 중단 보고

### Validation command/check and result

- Conflict targets for merge: all absent (진행 가능 조건 충족)
- Unexpected: `.git` empty dir exists; `.agents` empty dir exists
- Collaboration Markdown still 17; root `README.md` preserved
- No `tastelog-vite-temp` created

### Findings/risks

- T-100 inventory에는 `.git`/`.agents`가 없었음. T-101 승인 지시의 “git init 안 함”과 root 상태 충돌 가능
- 빈 `.git`은 정식 repo가 아니나 이후 `git init`·도구 동작에 혼동 가능
- 출처 미확인 → 삭제하지 않음

### Decisions needed

- Owner: `.git/`·`.agents/` 유지 / 삭제 / 다른 처리 지시
- Owner/Toby: 처리 후 T-101 재개 승인

### Next action

Owner 결정 대기. 승인 전 scaffold 재개하지 않음.

### Handoff note

T-101은 pre-check에서 중단됨. Hank가 지정한 Vite merge 대상과 충돌하는 파일은 없음. 문제는 예상치 못한 빈 `.git`·`.agents`. React/Vite는 아직 없음.

---

## 2026-07-15 — Gini — T-100

### Goal

실제 project root 현황을 확인하고, React 설치 없이 T-101용 손실 없는 Vite 실행 계획을 남깁니다.

### Work performed

- `AGENTS.md` Required reading order 및 모든 current chat 문서 읽기
- Root file inventory (17 Markdown files; no `package.json` / `src` / Git / `.env`)
- Node `v24.18.0`, npm `11.16.0` 확인
- T-101: non-empty root용 병합형 scaffold, 보존 파일, validation, Owner 질문 정리
- React/Vite **미설치**, 앱 코드 **미작성**

### Files changed

- `docs/chat/gini-chat.md` — T-100 inventory·T-101 계획 (서명: Gini)
- `TASK_BOARD.md` — T-100 `DONE`, T-101 `READY`, immediate next action 갱신
- `WORK_LOG.md` — 본 항목

### Validation

- `Get-ChildItem -Recurse -Force -File`로 file list 확인
- `.git` 없음, `package.json` 없음 확인
- `node -v` / `npm -v` 확인
- install/build **미실행** (의도적)

### Findings or risks

- Root는 협업 pack only → 기존 앱 코드 덮어쓰기 위험 없음
- 디렉터리 non-empty → `create vite` 직접 `.` 실행 시 문서 충돌 위험 → 임시 folder merge 권장
- `README.md`는 pack용; T-101에서 Vite README로 overwrite 금지
- B-001 GitHub URL, D-008 UI style은 T-101 blocking 아님; `git init` 여부는 Owner 확인 필요

### Decisions needed

- Owner/Toby: T-101 시작 승인
- Owner: T-101에서 `git init` 여부
- Hank: T-100 inventory review

### Next action

Hank review → Owner/Toby T-101 승인 → Gini T-101만 실행

### Handoff note

Planning은 완료됐으나 implementation은 시작 전입니다. Gini는 T-100만 완료했고 scaffold는 승인 대기입니다. secret·외부 project·SQL·deploy는 Owner 통제입니다.

---

## 2026-07-15 — Toby — P-001

### Goal

과제 개발기획서와 기존 협업 template을 근거로 Phase 1 착수용 공통 문서를 완성합니다.

### Work performed

- 7쪽 개발기획서의 범위, schema, UI, 구현 순서, 테스트, 보안, 제출 조건 분석
- project context, decisions, task assignment, agent instructions 구체화
- 요구사항, DB/RLS, 테스트·제출 명세 추가
- Agent chat files를 첫 착수 의견 형식으로 초기화

### Files changed

- 협업 pack 내 Markdown 문서 전체

### Validation

- 원본 ZIP file inventory 확인
- PDF text extraction 및 7-page content 확인
- Markdown link/path와 task/decision ID 상호 점검 예정
- 구현 코드·Supabase·GitHub·Vercel은 아직 변경하지 않음

### Findings or risks

- 일정이 짧으므로 scope creep가 가장 큰 위험입니다.
- RLS는 UI 동작만으로 검증할 수 없고 두 사용자 교차 접근 test가 필요합니다.
- 실제 repository 상태는 아직 보지 못했으므로 T-100에서 확인해야 합니다.

### Decisions needed

- D-007 final name
- D-008 UI style
- 실제 repository/Supabase/Vercel 연결 정보(비밀정보는 문서에 기록 금지)

### Next action

Owner가 pack을 project root에 놓고 Gini에게 T-100만 배정합니다.

### Handoff note

현재는 planning complete, implementation not started 상태입니다. Agent는 AGENTS.md 순서대로 문서를 읽고 자기 task만 수행해야 합니다. 외부 변경과 secret 입력은 Owner가 통제합니다.

---

## Entry template

### YYYY-MM-DD HH:MM — [Agent] — [Task ID]

- Goal:
- Work performed:
- Files changed:
- Validation command/check and result:
- Findings/risks:
- Decisions needed:
- Next action:
- Handoff note (3–7 lines):
