# Hank Chat

## Hank → Owner, Toby, Gini, Any

- Date: 2026-07-18
- Related task: T-110 Visit/Menu panel header narrow re-review
- Status: **REVIEW maintained**
- Review model: **GPT-5.6**

### Final verdict

**Approve**

### Findings

- Both Visit and Menu headers render the visual `×` close control with distinct, accurate labels: `방문 기록 닫기` and `메뉴 기록 닫기`. `.panel-close-button` fixes its flex basis and width at 44px, keeps the inherited `min-height: 44px`, and has no padding; the target is therefore 44×44px.
- Both controls retain `.restaurant-action:focus-visible`'s visible 2px accent outline. Their handlers remain exactly `onCancel` (Visit) and `onClose` (Menu); only presentation and accessible naming changed.
- Visit's subtitle is exactly `대표 방문 1건을 표시합니다.` At 360px, the panel has about 290px inner width; reserving the 44px button and 8px header gap leaves about 238px for its `div`. The 13px Korean subtitle fits on one line within that width. `min-width: 0` prevents the text container from forcing header expansion and `white-space: nowrap` prevents wrapping. No clip, overlap, or horizontal overflow is introduced by this text at the reviewed width.
- The subtitle-specific mobile rules are inside `max-width: 480px`, so desktop layout retains its prior 14px normal-flow text behavior. The inspected narrow diffs leave save/cancel/CRUD handlers and the `RatingStars` contract untouched; no services, migrations, packages, DB, Git, or Vercel files are changed.

### Validation evidence

Gini's stated lint, build, and `git diff --check` success is consistent with the inspected source. My own `git diff --check` completed successfully, with only existing LF-to-CRLF warnings. I performed no browser, source/DB/task-status/Git mutation, commit, push, or test-data creation.

### Owner remaining check

At the Owner's normal 360px browser scale, verify the visual `×`, focus ring, and untruncated Visit subtitle. T-110 remains `REVIEW` pending its broader Owner verification.

— Hank

---

## Hank → Owner, Toby, Gini, Any

- Date: 2026-07-18
- Related task: T-110 focus/contrast/360px Auth findings narrow re-review
- Status: **REVIEW — Approve**
- Actual review model: **Codex / GPT-5**

### 1. Final verdict

**Approve**

이전 finding 3건은 모두 최소 수정으로 해결됐습니다. T-110은 `REVIEW`로 유지합니다.

### 2. Finding resolution

#### Finding 1 — RatingStars focus: resolved

- `.rating-star-option:has(input:focus-visible)`이 투명한 1px input이 아니라 실제 44px 별 label에 outline을 표시합니다.
- 동일 name의 native radio 구조가 유지되어 Tab 진입과 arrow 이동 시 focus가 이동한 input을 포함하는 label ring도 함께 이동합니다.
- Disabled radio의 label은 `opacity: 0.55`와 `cursor: not-allowed`로 pending 상태를 시각적으로 구분합니다.
- Selected는 `★` + bold + underline, unselected는 `☆`이므로 색상 외 cue가 있습니다.
- Native radio, radiogroup/screen-reader name, numeric 1–5/null normalization과 Visit/Menu 호출 계약은 변경되지 않았습니다.

#### Finding 2 — contrast: resolved

- 독립 WCAG luminance 계산: gold `#8a6500`/white `5.33:1`, empty `#6f6960`/white `5.43:1`, accent `#7a1fcc`/white와 white/accent `7.25:1`.
- 실제 accent consumer 조합도 page background에서 `6.56:1`, 12% accent tint background에서 `5.92:1`입니다.
- Star control graphics의 3:1 및 normal text의 4.5:1 기준을 충족합니다. White card/form의 gold·empty stars와 accent button/text 조합에 수정 변수가 실제 적용됩니다.

#### Finding 3 — 360px Auth overflow: resolved

- `.auth-card`에 `box-sizing: border-box`가 직접 적용됩니다.
- 360px viewport에서 `.screen.center` 좌우 padding 32px를 제외한 card outer width는 약 328px이며, card padding/border가 이 폭 안에 포함됩니다.
- 좌우 약 16px 여유가 있어 card border와 내부 control focus ring이 root edge에 잘리지 않습니다. 기존 `overflow-x: hidden`은 남아 있지만 이 box model 계산은 clipping에 의존하지 않습니다.
- Desktop에서는 outer max-width가 380px로 일관되며 field/button width와 내부 padding이 그 안에서 계산되어 기능적 layout 회귀가 없습니다.

### 3. Residual accessibility · responsive risk

- Source 기준 잔여 finding은 없습니다.
- `:has()` focus styling, radio arrow 이동, 360px 실측은 최신 Chromium 계열에서 지원되는 구조입니다. Reviewer 환경에는 인앱 browser가 제공되지 않아 실제 화면 조작은 수행하지 못했으므로 Owner의 keyboard/360px browser 확인은 그대로 필요합니다.

### 4. Gini checks

- Gini의 lint, production build, correction-scoped `git diff --check` pass는 수정 source와 일치하므로 수용하고 재실행하지 않았습니다.
- Reviewer는 contrast와 360px box model만 read-only local 계산으로 독립 확인했습니다.

### 5. Scope · regression

- RatingStars normalize 계약, Visit/Menu 저장, readonly 표시, 공백 price trim, `{ aborted: true }` stale 처리에는 finding 수정으로 인한 구조 변경이 없습니다.
- migration 001·002·003, package/lock, services에는 baseline diff가 없습니다. DB data, T-111+, secret, Git commit/push, Vercel 작업도 없습니다.
- Reviewer는 source·DB·task status를 수정하지 않았고 이 Hank chat 기록만 추가했습니다.

— Hank

---

## Hank → Owner, Toby, Gini, Any

- Date: 2026-07-18
- Related task: T-110 Responsive UI + accessibility + RatingStars independent review
- Status: **REVIEW — Approve with changes**
- Actual review model: **Codex / GPT-5**

### 1. Final verdict

**Approve with changes**

RatingStars의 데이터 계약, Visit/Menu 통합, T-108 Low 두 건, readonly 표시, 기존 Dashboard/CRUD 흐름은 통과했습니다. 다만 keyboard focus, 색상 대비, 약 360px Auth 폭에 실제 접근성·반응형 finding이 있어 최소 수정 후 narrow re-review가 필요합니다. T-110은 `REVIEW`로 유지합니다.

### 2. Findings

#### Finding 1 — interactive 별점의 focus indicator가 보이지 않음

- Severity: **Medium**
- Location: `src/App.css:713`, `src/App.css:750` (`.rating-star-option input:focus-visible`, hidden radio styling)
- Actual risk: radio input은 `opacity: 0`이고 크기도 `1px × 1px`인데 outline을 그 input 자체에 적용합니다. Opacity는 outline에도 적용되므로 keyboard 사용자가 현재 별 선택지의 focus를 시각적으로 확인할 수 없습니다. Native radio keyboard 동작과 screen-reader name은 살아 있지만 T-110의 명시적 focus-visible acceptance를 충족하지 않습니다.
- Minimum fix: `input:focus-visible`일 때 보이는 44px label 또는 star에 outline을 적용합니다. 예: `.rating-star-option:has(input:focus-visible)`에 outline/border-radius를 주거나 `input:focus-visible + .rating-star`에 명확한 focus ring을 표시합니다.

#### Finding 2 — star와 일부 accent foreground의 대비 부족

- Severity: **Medium**
- Location: `src/index.css:9-12` (`--accent`, `--star-gold`, `--star-empty`), consumers in `src/App.css`
- Actual risk: source 색상 기준 계산에서 gold `#c79212`/white 대비는 약 `2.78:1`, accent `#aa3bff`/white는 약 `4.39:1`입니다. Gold/empty star는 interactive control과 선택 상태를 식별하는 핵심 시각 정보인데 3:1에 못 미치며, 13–14px accent text도 일반 텍스트 4.5:1 기준에 약간 못 미칩니다. 특히 별의 선택/미선택 상태는 동일한 `★` glyph의 색 변화에 의존하므로 저시력 사용자가 상태를 구분하기 어렵습니다.
- Minimum fix: theme의 gold/purple 정체성은 유지하면서 `--star-gold`, 필요 시 `--star-empty`, normal-text용 accent를 더 어둡게 조정해 control graphics 3:1 및 일반 텍스트 4.5:1을 만족시킵니다. 선택 별에 outline/shape 차이 같은 비색상 cue를 추가하면 더 안전합니다.

#### Finding 3 — 약 360px Auth card가 viewport 폭을 초과

- Severity: **Low**
- Location: `src/App.css:21` `.auth-card`, `src/App.css:837` mobile padding, `src/index.css:59` root overflow clipping
- Actual risk: `.screen.center`의 좌우 padding 16px 안에서 `.auth-card { width: 100% }`가 content-box로 계산되고, mobile card padding 18px와 border가 추가됩니다. 360px에서는 card outer width가 약 366px가 되어 viewport보다 넓고, `#root { overflow-x: hidden }`이 이를 해결하지 않고 가장자리를 clip합니다.
- Minimum fix: `.auth-card { box-sizing: border-box; }`를 적용하고 360px에서 `scrollWidth === clientWidth`와 border/focus ring 비클리핑을 확인합니다.

### 3. RatingStars contract · accessibility

- `normalizeStarRating`은 integer 1–5만 유지하고 null/undefined/0/6/negative/fraction/string을 null로 만듭니다. Interactive `onChange`도 numeric constants 1–5 또는 clear의 null만 생성합니다.
- Visit/Menu 호출부는 restaurant/menu id 기반의 고유 `id`와 `name`을 전달해 동시에 렌더링되어도 radio group 충돌이 없습니다.
- radiogroup label, 각 radio의 숨김 `N점` name, native checked/disabled semantics, readonly outer `aria-label="5점 만점에 N점"`와 hidden glyph는 적절합니다.
- Pending 중 radios는 실제 disabled되지만 label cursor/opacity는 active처럼 남습니다. Finding 1 수정 때 disabled label도 `cursor: not-allowed`와 시각적 dimming을 주는 것이 권장됩니다.

### 4. Visit · Menu · Dashboard regression

- VisitEditor는 rating을 number/null로 유지하고 기존 service는 이를 integer 1–5/null payload로 정상 처리합니다. 저장·취소·retry·대표 방문·unvisited historical-detail 비노출 흐름은 구조 변경이 없습니다.
- Menu 맛 평가는 price와 별도 state이며 number/null로 전달됩니다. 공백 price는 UI submit 전에 trim되어 service에서 null이 되고, menu service가 unchanged이므로 UPDATE 시 기존 `visit_id`가 payload에서 계속 제외되어 보존됩니다.
- Restaurant card는 visited일 때만 대표 별점을 렌더링합니다. Menu card와 Restaurant card의 invalid local rating은 RatingStars 내부에서 `평가 없음`으로 축소되고, Top 5는 T-109 integer guard를 지난 rating만 받습니다.
- Restaurant CRUD, Visit save, Menu CRUD, summary/Top 5, search/filter/sort state/query 구조와 Supabase 호출 수에는 T-110 변경이 없습니다. Loading/empty/error/retry와 safe error mapping도 유지됩니다.

### 5. Responsive · theme

- `다시갈집` primary, `TasteLog` secondary, document title `다시갈집 | TasteLog`가 D-007과 일치합니다. D-008의 plain CSS, warm off-white, purple, gold, status badge, destructive red도 구현됐고 package 추가가 없습니다.
- visited/unvisited는 badge text를 유지하고 error는 text+role을 사용하므로 색상만으로 의미를 전달하지 않습니다.
- Header/user row, summary grid, Restaurant cards/actions, Menu grid는 768/480 breakpoints에서 wrap/column 전환됩니다. Visit/Menu panel은 mobile width/max-width/box-sizing이 있어 정적 구조상 안전합니다.
- Finding 3 외에는 명백한 width overflow를 찾지 못했습니다. 인앱 browser가 현재 제공되지 않아 viewport 실측은 수행하지 못했으며 Owner 실제 browser 확인이 필요합니다.

### 6. T-108 Low findings

- **Low A pass:** MenuReviewForm은 price를 trim한 뒤 validate/submit하여 whitespace-only가 empty/null로 service와 일치합니다. Taste rating state와 독립입니다.
- **Low B pass:** stale create/update는 `{ aborted: true }`를 반환하고 MenuReviewForm은 이를 error/success보다 먼저 확인해 form reset과 edit close를 실행하지 않습니다. Mounted request mismatch에서는 pending도 정리됩니다.

### 7. Gini checks

- Gini의 lint pass, production build pass, normalize smoke pass는 source 계약과 일치하므로 수용합니다.
- Reviewer의 full `git diff --check`도 CRLF warning만 있고 pass했습니다. JSX를 Node ESM으로 직접 import한 추가 normalize 시도는 확장자 loader 부재로 product 실행 전에 중단되어 판정 근거로 사용하지 않았고 package/transform 도구를 추가하지 않았습니다.

### 8. Owner 12-step manual plan

- 기록된 범위(theme, Visit/Menu stars, mobile overflow, keyboard, CRUD/dashboard regression, persistence)는 통합 acceptance에 충분합니다.
- 수정 후 keyboard Tab/arrow focus ring, 360px Auth `scrollWidth/clientWidth`, selected/unselected star visibility와 contrast를 명시적으로 포함해야 합니다. Contrast는 육안만이 아니라 devtools/a11y checker 수치 확인이 적절합니다.

### 9. Out-of-scope confirmation

- Baseline HEAD `376ee045cd4ace0ac40a2281015bebd124d39d17`와 일치합니다.
- migration 001·002·003, package/lock, services에는 diff가 없습니다. 새 DB fetch/mutation, DB data 작업, secret/service-role credential, T-111+, Git commit/push, Vercel 작업도 없습니다.
- Reviewer는 source·DB·task status를 수정하지 않았고 이 Hank chat 기록만 추가했습니다.

— Hank

---

## Hank → Owner, Toby, Gini, Any

- Date: 2026-07-18
- Related task: T-109 `getRepresentativeRating` Low finding narrow re-review
- Status: **REVIEW — Approve**

### 1. Final verdict

**Approve**

Low finding은 최소 수정으로 해결됐습니다. T-109은 `REVIEW`로 유지합니다.

### 2. Valid·invalid verification

- `getRepresentativeRating`은 visited Restaurant의 rating이 `Number.isInteger(rating) && rating >= 1 && rating <= 5`를 모두 만족할 때만 값을 반환합니다.
- `null`, `undefined`, missing summary, `0`, `6`, `-1`, `1.5`, `"4"`, `"좋음"`은 모두 `null`로 처리됨을 독립 Node ESM smoke로 확인했습니다.
- 정수 `1`, `3`, `5`는 각각 그대로 반환됩니다.

### 3. Downstream regression

- invalid rating은 rated-first 그룹에 들어가지 않고 Top 5에서도 제외됩니다.
- valid rating의 높은순 정렬과 Top 5 순서는 유지됩니다.
- unvisited Restaurant은 historical valid rating이 있어도 rating 대상에서 제외됩니다.
- helper 실행 전후 `restaurants` 배열과 `visitSummaries` 객체 직렬화 값이 동일해 input mutation이 없습니다.
- `filterAndSortRestaurants`와 `computeTopRated` 구조에는 finding 수정 외 refactor가 없습니다.

### 4. Checks acceptance

- 독립 narrow pure smoke: pass.
- Gini의 pure smoke, lint, production build, correction-scoped `git diff --check` pass는 현재 guard와 실제 결과가 일치하므로 수용하며 재실행하지 않았습니다.

### 5. Out-of-scope confirmation

- 이전 T-109 working-tree 범위 외 UI, DB, migration 001·002·003, package/lock, service, Auth/Visit/Menu 변경은 없습니다.
- T-110+, Agent DB mutation, Supabase CLI/network, Git commit/push, Vercel 작업을 수행하지 않았습니다.
- Reviewer는 source/common status를 수정하지 않았고 이 Hank chat 기록만 추가했습니다.

— Hank

---

## Hank → Owner, Toby, Gini, Any

- Date: 2026-07-18
- Related task: T-109 Search/filter/rating sort/dashboard independent review
- Status: **REVIEW — Approve with changes**

### 1. Final verdict

**Approve with changes**

정상적인 DB-backed T-109 입력에서는 search/filter/sort/count/Top 5, CRUD·Visit local sync, loading/error/empty 격리가 요구사항과 일치합니다. 다만 malformed 대표 평점 `0` 또는 문자열을 rated로 오인하는 Low finding 1건은 최소 방어 후 closeout하는 편이 안전합니다. T-109은 `REVIEW`로 유지합니다.

### 2. Passed items

- 기존 owner-scoped `restaurants`와 `visitSummaries`만 사용하며 새 Supabase query/mutation/refetch, menu-derived count/ranking, 원본 배열 mutation이 없습니다.
- 검색은 trim/case-insensitive이며 `display_name`·`area_hint`·`category`만 대상으로 하고 null 필드와 빈 keyword에 안전합니다. owner-empty와 filtered-empty 문구도 구분됩니다.
- 필터는 all/unvisited/visited/revisit 규칙과 정확히 일치합니다. historical summary가 있어도 unvisited row는 revisit/rated 대상에서 제외됩니다.
- 최근 수정순과 rating tie-break는 `updated_at DESC → id DESC`입니다. invalid/missing date 차이는 `NaN`일 때 `||`의 id fallback으로 comparator가 숫자 결과를 반환해 deterministic합니다.
- Summary는 전체 owner list 기준이며 current search/filter/sort와 독립적입니다. Top 5도 전체 owner list의 visited+non-null rating만 사용하고 최대 5개입니다.
- 검색/filter/sort는 local state만 바꾸며 접근 가능한 label/radiogroup/current checked/select/focus-visible이 있습니다. star UI, editor/navigation, T-110 responsive redesign은 추가되지 않았습니다.

### 3. Finding

#### Finding 1 — malformed rating을 rated로 인정

- Severity: **Low**
- Location: `src/utils/restaurantDashboard.js:15` `getRepresentativeRating` (downstream: `filterAndSortRestaurants`, `computeTopRated`)
- Actual risk: 함수는 `null`/`undefined`만 제외하고 `0`, `"4"`, 비수치 문자열도 그대로 반환합니다. 따라서 예상 밖 local/API shape가 들어오면 0이나 문자열이 rated-first 정렬과 Top 5에 포함되고 raw 값이 표시될 수 있습니다. 현재 DB `smallint` + 1–5 CHECK와 Visit 입력 validation이 정상 저장 경로를 막으므로 데이터 무결성 위험은 낮지만, Toby가 요청한 pure boundary는 충족하지 않습니다.
- Minimum fix: 대표 평점을 `Number.isInteger(rating) && rating >= 1 && rating <= 5`일 때만 반환하고 그 외에는 `null`로 처리합니다. `0`, numeric string, nonnumeric string 회귀 smoke를 추가하면 충분하며 Owner DB data 생성은 필요 없습니다.

### 4. Search/filter/sort/count/Top 5 verification

- 독립 Node ESM smoke에서 null area/category, whitespace/case keyword, visited rated/revisit, visited unrated, unvisited+historical rating, rating order, updated/id tie, 7개 row의 Top 5, input 불변성, missing summary key, invalid dates를 확인했습니다. 정상 사례와 invalid-date fallback은 통과했습니다.
- 같은 smoke에서 `getRepresentativeRating`이 `0`과 `"4"`를 그대로 반환하는 것을 재현했습니다. Finding 1 외 count/order/filter 규칙은 source와 계산 결과가 일치합니다.
- 빈 배열은 helper loop/filter/map/slice 구조상 total 0, empty list로 안전하며 UI는 0 counts와 rated-empty copy를 구분합니다.

### 5. CRUD·Visit local sync

- Restaurant Create/Update/Delete가 기존 `restaurants` state를 갱신하면 derived summary, visible list, ordering, Top 5가 다음 render에서 즉시 재계산됩니다.
- Visit save가 restaurant status와 `visitSummaries`를 함께 갱신하므로 rating/revisit filter, counts, Top 5가 즉시 바뀌며 unvisited 전환은 historical summary가 남아도 rated/revisit 대상에서 제외됩니다.
- Menu CRUD는 두 source state를 변경하지 않으며 dashboard에 영향을 주지 않습니다. 이를 위한 전체 DB refetch도 없습니다.

### 6. Loading/error/empty boundaries

- initial loading은 Summary/Top 5의 준비 문구를 표시하고 확정된 0을 노출하지 않습니다. Restaurant query error에서는 dashboard를 숨기고 기존 retry UI를 유지합니다.
- representative-summary failure는 기존 빈 map fallback으로 Restaurant 목록을 유지하고 rating/revisit/Top 5만 안전하게 축소합니다.
- owner-empty와 filtered-empty copy가 다르며 raw error, stack, 환경값, secret 노출은 발견되지 않았습니다.

### 7. Checks and evidence acceptance

- Gini의 lint pass, production build pass, `git diff --check` pass, pure smoke pass는 실제 diff 및 독립 계산 결과와 일치하는 범위에서 수용합니다.
- 독립 smoke의 앞선 두 호출은 export명/인자명 착오로 product assertion 전에 실패했으며, source/data 변경 없이 실제 signature로 재실행해 위 결과를 얻었습니다.

### 8. Owner manual test plan

- WORK_LOG의 10단계 계획은 실제 DB-backed 데이터에서 counts, search/filter/sort, tie, Top 5, CRUD·Visit 즉시 재계산, Menu 무영향, persistence를 확인하기에 충분합니다.
- Finding 1은 DB 제약상 Owner가 invalid row를 만들 필요가 없으며, 최소 수정 뒤 local pure smoke로 닫는 것이 적절합니다.

### 9. Out-of-scope confirmation

- Baseline HEAD는 `10c2184f33dcab2c92944db8cc14bc7f8f9c007f`와 일치합니다.
- package/lock, migrations 001·002·003, services, Auth/Visit/Menu components에는 T-109 diff가 없습니다. T-110+ 구현, Agent DB mutation, Supabase CLI/network, Git commit/push, Vercel 작업도 수행하지 않았습니다.
- Reviewer는 source/common status를 수정하지 않았고 이 Hank chat 기록만 추가했습니다.

— Hank

---

## Hank → Owner, Toby, Gini, Any

- Date: 2026-07-18
- Related task: T-108 final closeout
- Status: **DONE — Owner/Toby final approval received**

T-108 is closed with Gini final `Approve`, Owner's complete manual menu CRUD verification, and accepted lint/build/source-diff evidence. New menu rows keep `visit_id` null by omission; updates preserve any existing `visit_id` by excluding it from the payload.

Full working-tree `git diff --check` passed during closeout; lint/build were not unnecessarily rerun.

The two accepted Low findings—stale-abort `null` return contract and whitespace-only price UI/service interpretation—are non-blocking and may be revisited during T-110 or final cleanup.

Final Owner data remains `산방밀면`, its existing representative visit, and one `밀면` menu review (`price=8500`, `taste_rating=4`, memo `담백하고 시원했습니다.`).

T-109 remains `BACKLOG` with Gini as Primary Implementer and Hank as Reviewer. Hank will not start or review T-109 until Owner/Toby explicitly approves it. No source, DB, migration/package, Git, or Vercel operation was performed for this closeout.

— Hank

---

## Hank → Owner, Toby, Gini, Any

- Date: 2026-07-18
- Related task: T-108 Menu review CRUD
- Status: **REVIEW — implementation and static checks complete**

### Reviewer handoff

- Added owner+restaurant-scoped multi-menu CRUD in `menuReviewService`, with `id` added for update/delete and fixed Korean error mapping.
- Added `MenuReviewForm` and `MenuReviewPanel`: loading/empty/error-retry, name-only create, optional integer price/rating, memo, inline edit/cancel/save, and menu-name delete confirmation.
- Deterministic ordering is `updated_at` DESC → `id` DESC. Successful create/update/delete changes only the local menu list for the open Restaurant.
- New rows omit `visit_id`; existing rows preserve any current `visit_id` because update payloads never include it. VisitEditor and representative-visit logic are untouched.
- Panel mount/load/create and per-row mutation request guards isolate Restaurant switches, logout/user changes, unmounts, stale results, and different-row pending/errors.

### Checks

- lint: pass
- production build: pass
- T-108 scoped diff/trailing-whitespace: pass
- full `git diff --check`: blocked only by pre-existing trailing spaces in Gini's own `docs/chat/gini-chat.md:54-61`; Hank did not edit it
- owner-scope/visit-id/protected-path scans: pass
- secret scan: no matches
- migration/package/VisitEditor/visit service/T-109+: unchanged

### Owner manual test — existing `산방밀면` only

1. Open `메뉴 기록` for `산방밀면` and confirm the empty state.
2. Add the first menu using only a menu name.
3. Add a second menu with price, taste rating, and memo; duplicate names may remain separate.
4. Refresh and confirm both menus persist in `updated_at` DESC → `id` DESC order.
5. Edit the first menu: confirm cancel preserves values, then save changed values and verify only that row changes.
6. Confirm price `-1`/`1.5` and taste rating `0`/`6`/`1.5` show Korean validation without a DB request or typed-value loss.
7. Start deleting the second menu, cancel, and confirm it remains.
8. Confirm deletion of the second menu and verify only the first menu remains.
9. Refresh, then logout/relogin, and confirm the first menu persists.
10. Confirm the Restaurant and existing representative visit/status/card summary are unchanged.

### Review request

Gini: review only T-108 owner scope, validation, nullable `visit_id` preservation, deterministic ordering/local updates, lifecycle guards, accessibility, and protected-scope compliance. T-108 must remain `REVIEW` until review and Owner verification complete.

— Hank

---

## Hank → Owner, Toby, Gini, Any

- Date: 2026-07-18
- Related task: T-108 Menu review CRUD
- Status: **IN_PROGRESS**

### Implementation plan

1. Add `menuReviewService` for owner+restaurant-scoped list/create/update/delete with service-level name, price, and taste-rating validation and fixed Korean errors.
2. Add separate menu form/list/editor components with loading, empty, retry, create, edit/cancel, delete confirmation, per-row pending state, and accessible labels/actions.
3. Use deterministic ordering `updated_at` DESC → `id` DESC`; successful mutations update only the selected restaurant's local menu state.
4. New rows will omit `visit_id` so it remains null. Existing linked rows will preserve `visit_id` because updates modify only menu name, price, taste rating, and memo.
5. Connect one menu editor at a time to the current Restaurant list and add mount/request-id guards for Restaurant changes, logout, user switch, and stale operations.
6. Run local static checks, lint, production build, diff/secret/scope checks only. Gini reviews; Owner performs real DB verification with existing `산방밀면`.

— Hank

---

## Hank → Owner, Toby, Gini, Any

- Date: 2026-07-18
- Related task: T-107 final closeout
- Status: **DONE — Owner/Toby final approval received**

T-107 is closed with Gini final `Approve`, Owner's full manual verification, and accepted lint/build/diff evidence. The deterministic representative rule remains `visited_at` DESC nulls last → `updated_at` DESC → `id` DESC. The final card summary is `방문함 · 대표 별점 4 · 다시 갈 의향 있음`.

T-108 remains `BACKLOG` with Hank as Primary Implementer and Gini as Reviewer. Hank will not start T-108 until Owner/Toby explicitly approves it. No source, DB, migration/package, Git, or Vercel operation was performed for this document-only closeout.

— Hank

---

## Hank → Owner, Toby, Gini, Any

- Date: 2026-07-18
- Related task: T-107 card-summary copy correction
- Status: **REVIEW — copy correction complete**

- Card label changed from `재방문 있음/없음` to `다시 갈 의향 있음/없음`.
- The rendered boolean remains the existing `revisit_intention`; DB field, service, save/read behavior, and representative-visit logic are unchanged.
- `npm.cmd run lint`: pass
- `npm.cmd run build`: pass (Vite 8.1.4)
- `git diff --check`: pass

— Hank

---

## Hank → Owner, Toby, Gini, Any

- Date: 2026-07-18
- Related task: T-107 card-summary error isolation
- Status: **REVIEW — correction complete; awaiting Gini narrow re-review**

### Correction

- `src/App.jsx` now treats Restaurant SELECT and representative-summary SELECT errors separately.
- Restaurant failure still uses the existing blocking `restaurantError` and retry screen.
- Summary-only failure clears `visitSummaries` and explicitly keeps `restaurantError` null, so only rating/revisit labels disappear; loaded Restaurant cards and CRUD controls remain available.
- No summary error or raw Supabase detail is rendered or logged.

### Verification

- Static summary-failure/list-success path: pass
- Static Restaurant-failure/error-retry path: pass
- `npm.cmd run lint`: pass
- `npm.cmd run build`: pass (Vite 8.1.4)
- `git diff --check`: pass
- Out-of-scope path scan: no migration/package/T-108+ changes
- T-107 remains `REVIEW`; all prohibited scopes remain unchanged

Gini: please narrow re-review only this summary-error isolation path.

— Hank

---

## Hank → Owner, Toby, Gini, Any

- Date: 2026-07-18
- Related task: T-107 card representative summary acceptance gap
- Status: **REVIEW — correction complete; awaiting Gini narrow re-review**

### Owner verification received

Owner confirmed all six T-107 manual flows: visit create/read/update and refresh persistence, rating validation/cancel preservation, visited/unvisited transitions, historical visit preservation while unvisited, representative restoration when revisited, and logout/relogin persistence.

### Card-summary correction

- A visited card now shows `대표 별점 N` when the representative visit has a rating, plus `재방문 있음/없음`.
- After a successful editor save, `VisitEditor` passes the returned visit to `App`; only that restaurant's local summary map entry is updated, without refetching the list.
- On initial load/refresh, `getRepresentativeVisitSummaries()` queries only the current owner and loaded restaurant ids, applies the existing `visited_at` → `updated_at` → `id` descending rule, and selects the first visit per restaurant.
- Cards with `status === 'unvisited'` never render the preserved historical summary. Existing list request-id, mount, and user-key guards cover the added summary request.

### Checks

- `npm.cmd run lint`: pass
- `npm.cmd run build`: pass (Vite 8.1.4)
- `git diff --check`: pass
- Static visited-render/unvisited-hide flow: pass
- Migration/package/T-108+/DB data/Git push/Vercel: unchanged

Gini: please narrow re-review only the card-summary owner query, deterministic representative selection, local post-save update, refresh behavior, and unvisited visibility guard.

— Hank

---

## Hank → Owner, Toby, Gini, Any

- Date: 2026-07-18
- Related task: T-107 Medium finding correction
- Status: **REVIEW — correction complete; awaiting Gini narrow re-review**

### Correction summary

- If a successful visit INSERT/UPDATE is followed by a restaurant status failure, `saveVisitState()` now returns the written `visit` together with the existing safe Korean error instead of discarding it.
- On that error path, `VisitEditor` stores `result.visit` as `representativeVisit` before displaying the error and keeps the editor open.
- The next submit therefore passes the preserved `representativeVisit.id`; `visitService` selects its UPDATE branch and retains the existing `id + user_id + restaurant_id` scope rather than issuing another INSERT.
- T-107 remains `REVIEW`. RPC/transaction/rollback/delete, migrations/schema/RLS, packages, Restaurant CRUD/Auth, T-108+, DB test data, Git push, and Vercel were not changed.

### Verification

- Narrow static review: corrected service return and editor error paths confirmed
- `npm.cmd run lint`: pass
- `npm.cmd run build`: pass (Vite 8.1.4)
- Correction-scoped diff/trailing-whitespace checks: pass
- Full working-tree `git diff --check`: the correction is clean, but the command remains nonzero because Gini's pre-existing `docs/chat/gini-chat.md:65-70` contains trailing spaces; Hank did not edit another Agent's chat file
- Migration/package/T-108+ protected scope: unchanged

Gini: please perform a narrow re-review of only this Medium finding correction.

— Hank

---

## Hank → Owner, Toby, Gini, Any

- Date: 2026-07-15
- Related task: T-102
- Status: Implementation complete — awaiting Any review

### Context reviewed

- `TOBY_OPERATING_GUIDE.md`
- `AGENTS.md` Required reading order 전체
- `docs/chat/hank-chat.md`
- `docs/chat/any-chat.md`
- `docs/prompts/T102_HANK_MIGRATION_IMPLEMENT.md`

### Implementation summary

Created local SQL migration artifact only:

- `supabase/migrations/20260715_001_initial_schema.sql`

Updated required collaboration records:

- `DECISION_LOG.md` — added D-010 Accepted schema integrity decision
- `TASK_BOARD.md` — set T-102 to `REVIEW`
- `WORK_LOG.md` — added T-102 implementation entry
- `docs/chat/hank-chat.md` — this handoff

No SQL was executed. No Supabase connection, CLI/package install, React source edit, Git commit, remote, push, or deploy was performed.

### Schema implemented

- Five tables: `profiles`, `places`, `user_restaurants`, `visits`, `menu_reviews`
- `places` table and nullable `user_restaurants.place_id` kept for Phase 1
- `profiles.username` nullable and non-unique
- `gen_random_uuid()` used directly; no `pgcrypto` extension statement
- One shared `public.set_updated_at()` trigger function
- `updated_at` triggers on all five tables
- Owner-first composite uniqueness/FK:
  - `user_restaurants unique (user_id, id)`
  - `visits foreign key (user_id, restaurant_id)` -> `user_restaurants(user_id, id)`
  - `visits unique (user_id, restaurant_id, id)`
  - `menu_reviews foreign key (user_id, restaurant_id)` -> `user_restaurants(user_id, id)`
  - nullable optional visit FK `(user_id, restaurant_id, visit_id)` -> `visits(user_id, restaurant_id, id)`
- Optional visit FK uses `ON DELETE RESTRICT`
- Restaurant deletion cascades to visits and menu reviews
- Place deletion sets `user_restaurants.place_id` to null
- Auth user deletion cascades to owned profile/restaurant/visit/menu rows
- RLS enabled on all five tables; no policies added

### Static checks performed

- SQL creation/dependency order reviewed:
  - function -> parent/shared tables -> owner parent -> children -> indexes -> triggers -> RLS
- Verified composite UNIQUE/FK column order and referenced columns match
- Verified all five tables have `ENABLE ROW LEVEL SECURITY`
- Verified no `create policy` or `alter policy`
- Verified no `pgcrypto`
- Verified no destructive `DROP`
- Verified no secret-like strings, URL, password, or token in SQL
- Confirmed SQL was not executed

### Notes for Any review

- Please review the interaction between direct restaurant cascades and the optional menu-to-visit `ON DELETE RESTRICT` FK before any external execution. This follows the implementation prompt, but it is the main point worth reviewing carefully.
- Please verify that the minimal indexes are sufficient for Phase 1 and not excessive.
- Please verify that RLS enable-only/default-deny in T-102 is acceptable before T-103 policy SQL is applied.

### Remaining risks

- T-102 and T-103 must be applied in one approved ordered execution later. If T-102 is applied alone, RLS default-deny is secure but the app will not be usable until policies exist.
- External Supabase PostgreSQL compatibility is not verified because no connection or SQL execution was allowed.

### Next requested action

Any should independently review `supabase/migrations/20260715_001_initial_schema.sql`.

T-103 is not started.

— Hank

---

## Hank → Owner, Toby, Gini, Any

- Date: 2026-07-18
- Related task: T-107 Visit editor
- Status: **REVIEW — implementation and static checks complete**

### Reviewer handoff

- Added `src/services/visitService.js` and `src/components/visits/VisitEditor.jsx`; connected the existing authenticated restaurant list through one `방문 기록` action per row.
- The Phase 1 UI edits one deterministic representative visit: newest non-null `visited_at`, then `updated_at`, then `id`, all descending. `unvisited` retains historical visit rows but ignores them until the restaurant is marked visited again.
- The editor supports visited/unvisited, date, optional integer 1–5 overall rating, visit note, revisit intention/note, loading, safe query-error retry, validation, pending save, and cancel. It uses owner `user_id` + `restaurant_id` filters; existing RLS and composite FK are unchanged.
- The visit editor has its own mount/load/save request guards, while the parent keeps the existing keyed-session guard. Late query/save results cannot update an unmounted or newly authenticated user's UI.
- T-108 menu data/UI, search/dashboard, migration/RLS/package/Auth changes, restaurant CRUD redesign, database test data, Git commit/push, and deployment were not performed.

### Checks

- `npm.cmd run lint` — pass
- `npm.cmd run build` — pass
- `git diff --check` — pass
- migration 001·002·003 and package files — unchanged
- changed visit paths contain no service-role/secret matches

### Owner manual test — existing `산방밀면` only

1. Log in and click `방문 기록` for `산방밀면`; confirm the no-visit/unvisited explanation appears.
2. Select `방문함`, enter a date, rating `5`, visit note, enable revisit, enter revisit note, and save. Confirm the card changes to `방문함` and the editor closes.
3. Reopen it; confirm the saved fields persist. Change rating/note, save, refresh, and reopen to confirm persistence and the updated value.
4. Enter `0`, `6`, or `1.5` as rating and confirm the fixed Korean validation error; cancel without saving and reopen to confirm the persisted value was unchanged.
5. Select `미방문`, save, refresh, and confirm the card shows `미방문` and the empty explanation. Select `방문함` again and confirm the earlier representative visit values are available for editing.
6. Log out/relogin and confirm the existing user data persists. Do not create any additional account or row for this task.

### Known boundary

The browser client saves a visit followed by its restaurant status; this cannot be one atomic transaction without an out-of-scope approved RPC. If status update fails after a visit write, the app presents a safe error and retry targets the deterministic representative visit. No automatic rollback or deletion is attempted.

Gini review and Owner manual persistence verification are required before T-107 can close.

— Hank

---

## Hank → Owner, Toby, Gini, Any

- Date: 2026-07-18
- Related task: T-105 Restaurant Read/Create narrow code review
- Status: Review complete

### Final verdict

**Approve with changes**

### Passed review points

- `getRestaurants()` scopes the query to the signed-in session's supplied `userId` and the applied `user_restaurants` owner RLS remains the enforcement boundary. `createRestaurant()` writes only `user_id` and `display_name`; nullable `place_id` is not required. No service-role client or RLS bypass was added.
- Database errors are converted to fixed Korean messages before rendering. The reviewed restaurant path neither renders raw Supabase errors nor logs environment values, keys, or session objects.
- The list has distinct loading, empty, and safe-error/retry states. The form has an associated label, visible keyboard focus, `type="submit"`, and disabled input/button while creation is pending. It validates the blank/whitespace-only UI input before the DB call.
- A successful insert is selected through the existing owner-visible policy and prepended, which is consistent with the descending `updated_at` list ordering. No edit/delete, visit/menu, or search/dashboard behavior was introduced.

### Findings

#### 1. Previous user's list can remain or win during a direct session-user change

- Severity: Medium
- File/location: `src/App.jsx:60-93`, especially `loadRestaurants()` at lines 69-81
- Problem and actual risk: `SignedInScreen` is retained when its `session` prop changes from one authenticated user to another. It neither clears the old `restaurants` state nor invalidates an in-flight request. If this happens without an intervening logged-out render, user B can briefly see user A's already loaded card; a slower A request can also resolve after B's request and overwrite B's list. RLS prevents a new cross-user read, but it cannot retract rows already held in browser state.
- Minimum recommendation: On `userId` change, clear `restaurants` and error state before loading; guard each request with an active/request-id check (or equivalent cancellation) so only the current user/request can commit its result. Apply the same guard to the create completion path if the auth state can change while an insert is pending.

#### 2. Service does not itself guarantee its advertised trimmed name invariant

- Severity: Low
- File/location: `src/services/restaurantService.js:27-35`
- Problem and actual risk: The current form trims and rejects blanks, but `createRestaurant()` inserts its `displayName` argument verbatim. A future caller can therefore bypass the form invariant and submit leading/trailing whitespace or a whitespace-only name, relying on a generic database error rather than the required client validation. This conflicts with the requested service-level review criterion of inserting a trimmed name.
- Minimum recommendation: Normalize with `const trimmedName = displayName.trim()` inside `createRestaurant()` and reject an empty value there with the same safe validation message (or make the service accept only an already validated value through an explicit contract plus test). Keep the form validation for immediate feedback.

### Remaining Owner confirmation

The Owner's recorded name-only create, immediate list update, refresh persistence, and logout/relogin checks satisfy the requested manual boundary. After Gini resolves the two findings and Hank re-reviews only those changes, Toby/Owner may decide whether to close T-105. I did not change T-105 status, source, SQL, common documents, Git, external services, or start T-106.

— Hank

---

## Hank → Owner, Toby, Gini, Any

- Date: 2026-07-17
- Related task: T-104 / D-014 security hardening migration review
- Status: Review complete

### Final verdict

**Approve**

### Findings

No blocking or non-blocking findings.

### Review evidence

1. `supabase/migrations/20260717000003_harden_set_updated_at_search_path.sql` is exactly one 70-byte SQL line with one statement and no BOM:

   ```sql
   alter function public.set_updated_at() set search_path = pg_catalog;
   ```

   It changes only the existing function's per-function `search_path`; it does not create, drop, or alter any table, schema, index, policy, constraint, trigger, grant, or function body.

2. The existing definition is `public.set_updated_at()` with no arguments, returns `trigger`, and uses `language plpgsql`. The migration's empty argument list therefore identifies the correct function signature. `ALTER FUNCTION ... SET search_path = pg_catalog` is valid PostgreSQL syntax.

3. The existing body only assigns `new.updated_at = now()` and returns `new`. `NEW` is the PL/pgSQL trigger record and `now()` is available from `pg_catalog`, so the fixed path does not break name resolution. `ALTER FUNCTION` changes an auxiliary function property without replacing the function object or body; the five existing `BEFORE UPDATE` triggers continue to reference and execute the same function.

4. The remote pre-check recorded by Gini found no existing fixed function configuration. Setting `search_path` to the trusted `pg_catalog` schema directly addresses Supabase Security Advisor check `0011 function search path mutable`. After the approved migration is actually applied, rerun Security Advisor to confirm the WARN is cleared; that runtime confirmation is not part of this static review.

5. Both already-applied migrations are unchanged in staged and unstaged Git diff, and their working-tree Git blobs exactly match `HEAD`:

   - `20260715000001_initial_schema.sql`: SHA256 `5AAB6F902052D15A104D78A4DC1B3A8611E7BE227FF8B914CC0DC566869C7C85`
   - `20260715000002_rls_policies.sql`: SHA256 `A948160A02E4C2CFFCCF17BECB75CB1FD1C2958431ADE16E5341D41E6824B9B0`

6. The new migration contains no unnecessary schema, index, policy, performance-advisor, or other database changes. Its SHA256 is `BCAD57CD16E90C47B79B2321B9DEFF77AEDE0813EA7DCAA790ABCC49941F5FBC`.

7. Gini's migration-history and dry-run evidence consistently records migrations 1 and 2 as local=remote and only `20260717000003_harden_set_updated_at_search_path.sql` as local pending. The actual `db push` was not executed. I did not repeat the linked dry-run or perform any remote operation in this review.

8. The reviewed migration contains no password, token, key, connection string, `service_role`, destructive command, or data-changing DML. No secret or dangerous command was introduced or executed during this review.

### Scope confirmation

No code, SQL, shared project document, database, Auth implementation, Git state, or migration history was changed. This review records findings only in Hank's own chat file. Actual `supabase db push`, migration repair/reset, Advisor rerun, Auth work, and Git operations remain outside this review and require the existing Owner/Toby approval flow.

— Hank

---

## Hank → Owner, Toby, Gini, Any

- Date: 2026-07-15
- Related task: T-103 RLS policy and security test plan
- Status: Planning complete — T-103 remains `IN_PROGRESS`

### Preflight result

Passed.

- T-102 has one current task row and status `DONE`.
- T-103 has one current task row and was `READY` before this planning start.
- Any final T-102 verdict is `Approve` with zero new findings.
- One active initial schema migration exists: `supabase/migrations/20260715000001_initial_schema.sql`.
- No SQL has been executed and no Supabase project is connected according to current logs/chat.

I set only T-103 to `IN_PROGRESS`.

### Planning verdict

Recommended RLS design: create separate operation policies for each table, target only `authenticated`, keep `anon` default-denied, and do not use `service_role` in browser/client flows. Owner tables use `(select auth.uid()) = user_id` plus parent ownership checks for child rows. No `FOR ALL` policy is recommended.

Proposed next migration filename, not created: `supabase/migrations/20260715000002_rls_policies.sql`.

### Policy Matrix

#### profiles

| Operation | Role | Policy name | USING | WITH CHECK | Rationale / behavior |
|---|---|---|---|---|---|
| SELECT | `authenticated` | `profiles_select_own` | `(select auth.uid()) = id` | n/a | A user can read only their profile row; B and anon cannot read it. |
| INSERT | `authenticated` | `profiles_insert_own` | n/a | `(select auth.uid()) = id` | Allows client/onboarding creation of the user's own profile only. A cannot create B's profile. |
| UPDATE | `authenticated` | `profiles_update_own` | `(select auth.uid()) = id` | `(select auth.uid()) = id` | User can update own nullable username only; changing `id`/ownership fails. SELECT policy is also needed for PostgREST update visibility/returning behavior. |
| DELETE | none | none | none | none | Direct browser profile delete is not needed in Phase 1; account deletion should remain the deletion path through `auth.users` cascade. |

#### places

| Operation | Role | Policy name | USING | WITH CHECK | Rationale / behavior |
|---|---|---|---|---|---|
| SELECT | `authenticated` | `places_select_authenticated` | `true` | n/a | Shared place rows are non-owner reference data. Authenticated users may read them if the UI later resolves nullable `place_id`. |
| INSERT | none | none | none | none | Phase 1 has no browser place creation. |
| UPDATE | none | none | none | none | Phase 1 has no browser place editing. |
| DELETE | none | none | none | none | Phase 1 has no browser place deletion. |

Anon has no `places` policy and should be denied. Do not add any always-true write policy.

#### user_restaurants

| Operation | Role | Policy name | USING | WITH CHECK | Expected behavior |
|---|---|---|---|---|---|
| SELECT | `authenticated` | `user_restaurants_select_own` | `(select auth.uid()) = user_id` | n/a | User sees only their rows. |
| INSERT | `authenticated` | `user_restaurants_insert_own` | n/a | `(select auth.uid()) = user_id` | User can create own restaurant, including name-only create. Cross-user insert fails. |
| UPDATE | `authenticated` | `user_restaurants_update_own` | `(select auth.uid()) = user_id` | `(select auth.uid()) = user_id` | User can update own row; attempting to change `user_id` fails. SELECT policy is required so the update target is visible and returned correctly. |
| DELETE | `authenticated` | `user_restaurants_delete_own` | `(select auth.uid()) = user_id` | n/a | User can delete own restaurant; B cannot delete A's row. Cascades are handled by FK. |

#### visits

Parent ownership expression:

```sql
exists (
  select 1
  from public.user_restaurants ur
  where ur.user_id = (select auth.uid())
    and ur.id = visits.restaurant_id
)
```

| Operation | Role | Policy name | USING | WITH CHECK | Expected behavior |
|---|---|---|---|---|---|
| SELECT | `authenticated` | `visits_select_own` | `(select auth.uid()) = user_id and exists (...)` | n/a | User reads only visits attached to their restaurants. |
| INSERT | `authenticated` | `visits_insert_own` | n/a | `(select auth.uid()) = user_id and exists (...)` | User can insert a visit only for their restaurant. B cannot attach a visit to A's restaurant. |
| UPDATE | `authenticated` | `visits_update_own` | `(select auth.uid()) = user_id and exists (...)` | `(select auth.uid()) = user_id and exists (...)` | User can update own visit; changing `user_id` or moving to another user's restaurant fails. SELECT policy is required for target visibility/returning. |
| DELETE | `authenticated` | `visits_delete_own` | `(select auth.uid()) = user_id and exists (...)` | n/a | User can delete own visit; linked `menu_reviews.visit_id` becomes null by D-011/T-102 FK behavior. |

For SQL generation, replace `visits` in the expression with the table alias accepted by PostgreSQL policy syntax if needed; do not change the logic.

#### menu_reviews

Restaurant ownership expression:

```sql
exists (
  select 1
  from public.user_restaurants ur
  where ur.user_id = (select auth.uid())
    and ur.id = menu_reviews.restaurant_id
)
```

Optional visit consistency expression:

```sql
(
  visit_id is null
  or exists (
    select 1
    from public.visits v
    where v.user_id = (select auth.uid())
      and v.restaurant_id = menu_reviews.restaurant_id
      and v.id = menu_reviews.visit_id
  )
)
```

| Operation | Role | Policy name | USING | WITH CHECK | Expected behavior |
|---|---|---|---|---|---|
| SELECT | `authenticated` | `menu_reviews_select_own` | `(select auth.uid()) = user_id and restaurant ownership expression` | n/a | User reads only menu reviews for their restaurants. |
| INSERT | `authenticated` | `menu_reviews_insert_own` | n/a | `(select auth.uid()) = user_id and restaurant ownership expression and optional visit consistency expression` | User can insert a menu review only for own restaurant; cross-owner or cross-restaurant visit links fail. |
| UPDATE | `authenticated` | `menu_reviews_update_own` | `(select auth.uid()) = user_id and restaurant ownership expression` | `(select auth.uid()) = user_id and restaurant ownership expression and optional visit consistency expression` | User can update own menu review; changing owner, restaurant, or linking to another owner/restaurant visit fails. SELECT policy is required for target visibility/returning. |
| DELETE | `authenticated` | `menu_reviews_delete_own` | `(select auth.uid()) = user_id and restaurant ownership expression` | n/a | User can delete own menu review; B cannot delete A's row. |

The composite FK already enforces owner/restaurant integrity at the DB layer. The RLS checks duplicate the security intent and fail earlier for browser clients.

### Anonymous And Privileged Access

- `anon`: no policies are proposed for `anon`; all five RLS-enabled tables should default-deny browser access.
- `service_role`: do not use in frontend, tests, screenshots, Markdown, or client code. Service-role bypass testing is out of browser-client scope.
- No secrets, URLs, tokens, passwords, or keys are needed for this plan.

### Index Review

No additional index is recommended in T-103.

- `profiles`: primary key on `id` supports own-row lookup.
- `places`: primary key is enough; read-only shared lookup volume is Phase 1-small.
- `user_restaurants`: `UNIQUE(user_id, id)`, `(user_id, status)`, and `(user_id, updated_at desc)` cover owner predicates and list filters.
- `visits`: `UNIQUE(user_id, restaurant_id, id)` and `(user_id, restaurant_id, visited_at desc)` support owner/parent checks and representative visit lookup.
- `menu_reviews`: `(user_id, restaurant_id)` and partial `(user_id, restaurant_id, visit_id) where visit_id is not null` support owner and optional visit checks.

### Security Test Matrix

| ID | Actor | Setup | Action | Expected result | Evidence |
|---|---|---|---|---|---|
| RLS-01 | anon | T-102 applied, before login | SELECT from each table | Denied/no rows due to no anon policies | Query result/error screenshot without secrets |
| RLS-02 | User A | A signed in | Insert/select/update/delete A restaurant | Allowed | Row id, before/after values, final delete result |
| RLS-03 | User A | A owns restaurant | Insert/select/update/delete A visit | Allowed | Visit row evidence and updated fields |
| RLS-04 | User A | A owns restaurant/visit | Insert/select/update/delete A menu review | Allowed | Menu review CRUD evidence |
| RLS-05 | User B | A has restaurant/visit/menu | B selects known A ids | No rows or denied | Query result showing invisibility |
| RLS-06 | User B | A restaurant id known | B inserts visit/menu with B `user_id` but A `restaurant_id` | Denied by RLS/FK | Error category, no row created |
| RLS-07 | User B | A row ids known | B updates/deletes A restaurant/visit/menu | No affected rows or denied | Row remains unchanged for A |
| RLS-08 | User A | A owns row | A updates `user_id` to B's id | Denied by `WITH CHECK` | Error/no ownership change |
| RLS-09 | User A | A and B both have restaurants | A inserts/updates child with mismatched restaurant owner | Denied by RLS/FK | Error and no child row |
| RLS-10 | User A | A has two restaurants and visits | Menu review for restaurant 1 linked to visit from restaurant 2 | Denied by optional visit consistency/FK | Error and no invalid link |
| RLS-11 | User A | A menu review linked to A visit | Delete the visit | Visit deleted; menu review remains with `visit_id = null` | Before/after row evidence |
| RLS-12 | User A | A restaurant has visits/menu reviews | Delete the restaurant | Owned visits/menu reviews cascade; B rows unaffected | Counts before/after for A and B |
| RLS-13 | User A/B | Profile rows exist or are inserted | A select/insert/update own profile; B attempts A profile; direct delete attempt | Own select/insert/update allowed; cross-user denied; direct delete denied | Profile query/update/delete evidence |
| RLS-14 | authenticated A/B | Shared place row exists from privileged setup | SELECT places, then attempt browser INSERT/UPDATE/DELETE | SELECT allowed; writes denied | Read result and denied write evidence |
| RLS-15 | User A | Temporarily evaluate T-102-only state before T-103 policies in a disposable project | Browser SELECT/INSERT owner tables | Default-deny until policies exist | Recorded query error/no rows |
| RLS-16 | User A | UPDATE tests prepared | Remove/withhold SELECT policy in disposable check or reason from docs | UPDATE target not visible/returning breaks | Evidence or documented note proving SELECT policy necessity |

Test accounts must be non-sensitive. Screenshots must not show keys, tokens, connection strings, or private emails beyond what Owner approves.

### Important Open Decisions

- Approve `places` as authenticated read-only in Phase 1, with no browser writes.
- Confirm whether the app will create profile rows client-side after sign-up; if not, `profiles_insert_own` can be deferred, but my recommendation is to include it for simple onboarding.
- T-103 SQL migration must be reviewed by Any and approved by Owner/Toby before creation/execution.

### Files Changed

- `TASK_BOARD.md`
- `WORK_LOG.md`
- `docs/chat/hank-chat.md`

No SQL file was created or executed. No Supabase project was connected. No package install, React edit, env edit, Git change, T-104, or later task work occurred.

Plan awaits Any review and Owner/Toby approval.

— Hank

---

## Hank → Owner, Toby, Gini, Any

- Date: 2026-07-15
- Related task: T-102 correction after Any review
- Status: Correction applied — T-102 remains `REVIEW`

### Correction summary

Applied only the two accepted corrections from `docs/prompts/T102_HANK_CORRECTION_AFTER_ANY_REVIEW.md`:

- Renamed active migration artifact to `supabase/migrations/20260715000001_initial_schema.sql`.
- Changed the optional `menu_reviews` to `visits` FK from `ON DELETE RESTRICT` to `ON DELETE SET NULL (visit_id)`, preserving `user_id` and `restaurant_id`.

### Files changed

- `supabase/migrations/20260715000001_initial_schema.sql`
- `WORK_LOG.md`
- `docs/chat/hank-chat.md`

### Static verification

- Only one active T-102 migration file exists.
- Active filename is `20260715000001_initial_schema.sql`.
- Optional visit FK uses `ON DELETE SET NULL (visit_id)`.
- FK still uses `(user_id, restaurant_id, visit_id)` and only `visit_id` is nullable on delete.
- All five tables still enable RLS.
- No `CREATE POLICY` or `ALTER POLICY` exists.
- No `DROP`, secret, URL, password, access token, or service-role key was found.
- No SQL was executed.

### Remaining item

`DECISION_LOG.md` still needs the requested accepted D-011 entry superseding only the `ON DELETE RESTRICT` portion of D-010. My attempted patch was blocked by governance approval safeguards, so this needs explicit Owner/Toby approval or separate handling.

T-103 was not started.

— Hank

---

## Hank → Owner, Toby, Gini, Any

- Date: 2026-07-15
- Related task: T-102 D-011 governance completion
- Status: Completed — T-102 remains REVIEW

### Completion record

- `DECISION_LOG.md`에 D-011 Accepted 추가 완료
- D-010의 `ON DELETE RESTRICT` 부분만 `ON DELETE SET NULL (visit_id)`로 대체
- D-010의 나머지 결정은 계속 유효
- SQL 실행, Supabase 연결, T-103 시작 없음

— Hank

---

## Hank → Owner, Toby, Gini, Any

- Date: 2026-07-15
- Related task: T-103 RLS migration implementation
- Status: Implementation complete — T-103 is `REVIEW`

### Context and decisions

- Any T-103 plan review verdict: `Approve with changes`
- Findings accepted: one Medium, one Low
- D-012 added to `DECISION_LOG.md` as Accepted
- Final RLS design uses simple owner checks for owner tables: `((select auth.uid()) = user_id)`
- Parent, owner, restaurant, and optional visit integrity rely on T-102 composite `UNIQUE` and `FOREIGN KEY` constraints
- No duplicate parent/visit `EXISTS` subqueries are used in RLS
- `profiles`: own-row SELECT, INSERT, UPDATE only; no DELETE policy
- `places`: authenticated SELECT only; no browser writes
- `anon`: no policies
- `service_role`: not used or exposed in browser/client scope

### Files created or changed

- `supabase/migrations/20260715000002_rls_policies.sql`
- `DECISION_LOG.md`
- `TASK_BOARD.md`
- `WORK_LOG.md`
- `docs/chat/hank-chat.md`

### Policy counts

| Table | SELECT | INSERT | UPDATE | DELETE | Total |
|---|---:|---:|---:|---:|---:|
| `profiles` | 1 | 1 | 1 | 0 | 3 |
| `places` | 1 | 0 | 0 | 0 | 1 |
| `user_restaurants` | 1 | 1 | 1 | 1 | 4 |
| `visits` | 1 | 1 | 1 | 1 | 4 |
| `menu_reviews` | 1 | 1 | 1 | 1 | 4 |
| Total | 5 | 4 | 4 | 3 | 16 |

### Static verification

- Exactly two active migration files exist:
  - `20260715000001_initial_schema.sql`
  - `20260715000002_rls_policies.sql`
- T-103 has exactly 16 `CREATE POLICY` statements
- All 16 target `authenticated`
- No `FOR ALL`
- Operation counts: SELECT 5, INSERT 4, UPDATE 4, DELETE 3
- Every UPDATE has both `USING` and `WITH CHECK`
- INSERT policies use `WITH CHECK` and no `USING`
- DELETE policies use `USING` and no `WITH CHECK`
- No owner-table `EXISTS` subquery
- The only `USING (true)` is the authenticated `places` SELECT policy
- No anon policy
- No `service_role` policy or secret
- No `DROP`, URL, password, access token, API key, or connection string
- T-102 migration content was not modified in this implementation
- No SQL or test was executed
- Supabase was not connected

### Final security test matrix

| ID | Actor | Setup | Operation | Expected result | Submission evidence |
|---|---|---|---|---|---|
| RLS-01 | anon | T-102/T-103 applied, no login | SELECT/INSERT attempts on all five tables | Denied/default blocked | Query result or UI error without secrets |
| RLS-02 | User A | A signed in | Restaurant SELECT/INSERT/UPDATE/DELETE on A rows | Allowed | Row id and before/after values |
| RLS-03 | User A | A owns restaurant | Visit SELECT/INSERT/UPDATE/DELETE on A rows | Allowed | Visit row evidence |
| RLS-04 | User A | A owns restaurant | Menu review SELECT/INSERT/UPDATE/DELETE on A rows | Allowed | Menu review CRUD evidence |
| RLS-05 | User B | A has restaurant/visit/menu rows | B SELECTs A known ids | No rows or denied | B query result plus A row still present |
| RLS-06 | User B | A restaurant id known | B INSERTs visit/menu with B `user_id` and A `restaurant_id` | Denied by FK/RLS; no row created | Error category and row absence |
| RLS-07 | User B | A row ids known | B UPDATEs/DELETEs A restaurant/visit/menu rows | No affected rows or denied | A rows unchanged |
| RLS-08 | User A | A owns rows | A tries to change `user_id` to B id | Denied by `WITH CHECK`/FK | Error and unchanged owner |
| RLS-09 | User A/B | A and B each have restaurants | Child row with mismatched restaurant ownership | Denied by T-102 composite FK and owner policy | Error and no invalid child row |
| RLS-10 | User A | A has two restaurants and visits | Menu review links to visit from a different restaurant or owner | Denied by T-102 optional visit FK | Error and no invalid link |
| RLS-11 | User A | Menu review linked to A visit | Delete visit | Visit deleted; menu review remains with `visit_id = null` | Before/after row evidence |
| RLS-12 | User A/B | A restaurant has visits/menu reviews; B has separate data | Delete A restaurant | A child rows cascade; B data unaffected | Counts before/after |
| RLS-13 | User A/B | Profile rows exist or are inserted | A own SELECT/INSERT/UPDATE; B attempts A profile; direct DELETE | Own operations allowed except DELETE; cross-user denied | Profile operation evidence |
| RLS-14 | authenticated user | Shared place row exists from privileged setup | SELECT places; attempt browser INSERT/UPDATE/DELETE | SELECT allowed; writes denied | Read result and denied write evidence |

RLS-15 and RLS-16 are intentionally excluded per D-012 and Any's Low finding.

### Remaining risk and next action

T-103 is still a static artifact. Any should final-review `supabase/migrations/20260715000002_rls_policies.sql`. T-102/T-103 SQL execution remains blocked until final review and Owner-approved ordered execution.

No package install, React/env edit, Git commit/push, deployment, Supabase connection, SQL execution, test execution, or T-104 work was performed.

— Hank

---

## Hank → Owner, Toby, Gini, Any

- Date: 2026-07-17
- Related task: T-104 Supabase client + Auth independent review
- Status: Review complete

### Final verdict

**Approve with changes**

### Scope and passed checks

- `src/lib/supabase.js` is the sole `createClient` call and creates one module-scoped browser client only when both `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` exist.
- `.env.local` has only those two non-empty variable names, is ignored by both `.env.*` and `*.local`, is absent from Git status, and no environment file other than the empty-value `.env.example` is tracked. The local key is an `sb_publishable_` key; it and the URL appear in the production bundle as expected. No secret/service-role key, database password, token, or connection string was found in source or bundle.
- Missing configuration renders variable *names only*; values are neither logged nor rendered. Raw Supabase errors are mapped to fixed Korean messages, and React text rendering safely escapes both those messages and `session.user?.email`.
- `getSession` starts before the subscription but the subscription is registered synchronously before the login UI can render; `onAuthStateChange` also emits `INITIAL_SESSION`. The effect's active guard and cleanup unsubscribe the component listener correctly. Default browser `persistSession` behavior is compatible with refresh persistence.
- Email-confirmation handling correctly uses the documented Supabase signal (`data.session === null` after sign-up). Password is controlled component state only and is not stored, logged, or rendered elsewhere. Submit/sign-out controls disable while requests are pending.
- Labels, `htmlFor`, password/email autocomplete values, visible focus styles, alert/status messages, and disabled states are present. No T-105 feature or UI library was added.
- `@supabase/supabase-js` is locked at `2.110.7`; package and lockfile are consistent. `npm run lint`, `npm run build` (Vite `8.1.4`), `npm ls`, and production-only `npm audit` all passed; audit reports 0 vulnerabilities.
- Read-only `supabase migration list --linked` confirms 001, 002, and 003 are each local=remote. All three local SHA256 values match the previously recorded baselines; this Auth implementation did not alter migrations or the remote DB.

### Findings

#### 1. Initial-session errors are silently converted to the logged-out screen

- Severity: Low
- File/location: `src/App.jsx:93`
- Cause: `getInitialSession()` returns a mapped safe `error`, but the promise handler destructures only `session` and discards it.
- Impact: A storage/initialization failure can present as a normal logged-out state, giving the user no actionable explanation and obscuring a session-lifecycle failure.
- Recommended change: Keep an initialization-error state; when `getInitialSession()` returns `error`, finish loading and render that existing safe Korean message with a retry/reload instruction. Do not render the raw error.

#### 2. Logout uses Supabase's global default scope

- Severity: Low
- File/location: `src/services/authService.js:47`
- Cause: `supabase.auth.signOut()` is called without options; Supabase's default scope is `global`.
- Impact: One device's “로그아웃” invalidates all of the user's active sessions, which is surprising for a standard browser logout and broader than the UI communicates.
- Recommended change: Call `supabase.auth.signOut({ scope: 'local' })` unless Owner/Toby explicitly intend a global all-devices logout; keep the UI wording aligned with that decision.

#### 3. Declared tab roles lack the corresponding tab keyboard behavior

- Severity: Low
- File/location: `src/components/auth/AuthForm.jsx:64-85`
- Cause: The buttons declare `role="tab"` inside a `tablist`, but have no `aria-controls`/tabpanel association or ArrowLeft/ArrowRight navigation and roving `tabIndex` handling.
- Impact: Keyboard and assistive-technology users receive tab semantics that do not behave as expected.
- Recommended change: Either implement the complete WAI-ARIA tabs pattern, or remove the tab/tablist roles and present these as ordinary mode-switch buttons (the simpler Phase 1 option).

### Remaining verification boundary

No test account or Auth request was made in this review. Owner's manual sign-up, confirmation-required, login failure, login success, refresh, and logout checks remain required before T-104 can move from `IN_PROGRESS` to `DONE`.

No code, SQL, migration, database, common document, or Git commit/push was changed by Hank; this entry is findings only.

— Hank

---

## Hank → Owner, Toby, Gini, Any

- Date: 2026-07-17
- Related task: T-104 Auth Low findings narrow re-review
- Status: Review complete

### Final verdict

**Approve**

### Re-review result

All three previously accepted Low findings are resolved. No new findings in the requested narrow scope.

1. `src/App.jsx`
   - `getInitialSession()` now retains the mapped `error` in `initializationError`; it cannot silently fall through to the logged-out `AuthForm` screen.
   - The error branch renders only the already-mapped Korean message, a Korean retry instruction, and an explicit `type="button"` reload action.
   - It does not render raw Supabase errors, session data, or environment values. React renders the safe message as text.

2. `src/services/authService.js`
   - `signOut()` now calls `supabase.auth.signOut({ scope: 'local' })`, limiting the UI's logout action to the current browser session.
   - `toSafeMessage()` and its fixed Korean-message mapping are unchanged; no raw error is returned for rendering.

3. `src/components/auth/AuthForm.jsx`
   - The incomplete `tablist`, `tab`, and `aria-selected` semantics are removed.
   - Both mode controls remain native `button` elements with the correct boolean `aria-pressed` state and existing disabled behavior.
   - No custom keyboard handler, `tabIndex`, or role overrides were introduced, so native Tab focus and Enter/Space button activation remain available; the existing visible `:focus-visible` style continues to apply.

Per Toby's narrow-review instruction, I did not repeat lint/build, dependency audit, migration/hash/history checks, network commands, or Supabase CLI operations. No code, SQL, database, or common document was changed by Hank.

— Hank

---

## Hank → Owner, Toby, Gini, Any

- Date: 2026-07-18
- Related task: T-105 two-findings narrow re-review
- Status: Review complete

### Final verdict

**Approve**

Both prior findings are resolved; no new issue was found in the requested narrow scope.

- `src/App.jsx:60-115,205`: `key={session.user.id}` remounts the signed-in surface for a different authenticated user. The unmount cleanup invalidates both request counters and sets the old component's mount flag to false. Each list/retry request gets a new list id, and each create gets a new create id; only the current mounted component's newest corresponding request can update state. Therefore old A SELECT/create completions cannot populate B's screen, while the current initial load, retry, and successful create retain their normal state updates and loading completion.
- `src/services/restaurantService.js:27-40`: `createRestaurant()` normalizes with `String(displayName ?? '').trim()` before any Supabase call, returns the specified fixed Korean validation contract for blank input, and inserts only the normalized value. The existing form validation and safe raw-error mapping remain intact.
- The diff contains no T-106 update/delete behavior and does not expand the T-105 data/error scope.

Per Toby's instruction, I did not rerun lint, build, dev smoke, audit, Supabase CLI/network/remote DB operations, or create test data. No source, SQL, common document/status, Git, or external service was changed by Hank. T-106 was not started.

— Hank

---

## Hank → Owner, Toby, Gini, Any

- Date: 2026-07-18
- Related task: T-106 Restaurant Update/Delete narrow code review
- Status: Review complete

### Final verdict

**Approve with changes**

### Passed review points

- `src/services/restaurantService.js:43-72` applies both `id` and current `user_id` filters to UPDATE and DELETE. Update normalizes/rejects blank names before its DB request; both operations use `maybeSingle()` and convert an error **or no returned row** to the existing safe user-facing error contract.
- `src/App.jsx:146-190` replaces only the returned row and re-sorts by `updated_at`, or removes only the server-returned deleted id. The per-row request map, mount flag, keyed signed-in screen, and cleanup prevent stale UPDATE/DELETE completions from modifying a new user or unmounted screen. Current initial loads, retries, and mutations retain a completion path, with no persistent loading state in the mounted screen.
- `src/components/restaurants/RestaurantList.jsx:38-77,181-206` performs no mutation on edit/delete cancellation. The confirmation names the target restaurant and accurately warns that its related visit/menu records are deleted by the applied restaurant-owned FK cascades. Labels, disabled pending controls, focus-visible styling, and the distinct destructive action remain present. No T-107+ feature was added.

### Finding

#### 1. The existing edit trigger remains active while that row's inline edit form is open

- Severity: Low
- File/location: `src/components/restaurants/RestaurantList.jsx:25-30,111-150,163-180`
- Problem and actual risk: While editing, the card still shows its original `수정` button. Activating it calls `beginEdit()` again and resets `editingName` to the persisted restaurant name, silently discarding the user's unsaved typed change. This does not cause a remote mutation, but creates an avoidable action conflict and is especially confusing for keyboard users navigating the card controls.
- Minimum recommendation: Hide or disable the card's `수정` trigger for `editingId === restaurant.id` (or make it a clearly labeled non-destructive reset with explicit confirmation). Keeping `삭제` available is acceptable if it intentionally cancels editing before opening the separate confirmation, as the current code does.

Per Toby's efficiency limits, I did not rerun lint/build/dev smoke/audit or use Supabase CLI, network, remote DB, or test data. I changed no source, common document/status, Git, or external state, and did not start T-107.

— Hank

---

## Hank → Owner, Toby, Gini, Any

- Date: 2026-07-18
- Related task: T-106 Low finding 1 narrow re-review
- Status: Review complete

### Final verdict

**Approve**

`src/components/restaurants/RestaurantList.jsx:163-182` now renders the card-level `수정` trigger only when `editingId !== restaurant.id`. Thus the edited card retains only the inline form's `저장`/`취소` editing controls plus its intentionally separate `삭제` path; pressing delete still clears edit state before confirmation. A non-editing card, including every other row, retains its normal `수정` trigger and `beginEdit(restaurant)` path. No finding-external behavior or T-107 scope was added.

Per Toby's instruction, I did not repeat lint/build/smoke/audit or perform Supabase CLI, network, DB, source/common-document/status, or Git work. T-107 was not started.

— Hank

---

## Hank → Owner, Toby, Gini, Any

- Date: 2026-07-18
- Related task: T-107 Visit editor
- Status: **IN_PROGRESS**

### Implementation plan

1. Add `visitService` for owner-scoped representative-visit read, create/update, and restaurant visit-status update; map all database failures to fixed Korean messages.
2. Use one representative visit per restaurant in the Phase 1 UI. The deterministic selection rule will be: newest non-null `visited_at`, then `updated_at`, then `id`, each descending; an `unvisited` restaurant keeps historical visit rows but the UI ignores them until it is marked visited again.
3. Add a separate `VisitEditor` with visited/unvisited control, date, nullable 1–5 rating, note, revisit intention/note, local validation, cancel/pending/empty states.
4. Connect the editor to the existing authenticated screen without changing restaurant CRUD, migrations/RLS/packages/Auth, menu features, or dashboard features. Reuse keyed-session, mount, and request-id guards for visit requests/mutations.
5. Run only local static checks, lint, build, and `git diff --check`; Gini reviews source and Owner manually verifies the existing `산방밀면` record.

— Hank
# Hank Chat

## Hank → Owner, Toby, Gini, Any

- Date: 2026-07-18
- Related task: T-110 mobile restaurant-card footer narrow re-review
- Status: **REVIEW maintained**
- Review model: **GPT-5.6**

### Final verdict

**Approve**

### 360px single-row basis

At the `max-width: 480px` breakpoint, `.app-main` is 332px wide at a 360px viewport (14px horizontal padding each side). The card's 18px padding plus 1px borders leave an approximately 294px content width. Its direct footer action row is `width: 100%`, `flex-wrap: nowrap`, with three 4px gaps; four `flex: 1 1 0` controls therefore receive approximately 70.5px each. The longest labels (`방문 기록`, `메뉴 기록`) fit at 12px with 4px horizontal padding, and `white-space: nowrap` prevents label wrapping.

### Touch, overflow, and scope

- `.restaurant-action` retains `min-height: 44px`; the mobile rule changes only horizontal padding, font size, flex sizing, and nowrap.
- The selector starts with `.restaurant-card-footer > .restaurant-actions`, so it applies only to the card footer's direct action row. The edit-form and delete-confirmation action rows are not direct children of `.restaurant-card-footer`; Visit/Menu panels are likewise unaffected.
- The no-wrap row fills its available width without an intrinsic minimum-width constraint (`min-width: 0`), so this rule does not introduce horizontal overflow at the reviewed width. Real-device font rendering/zoom remains an Owner browser check.
- The rule is inside `max-width: 480px`; desktop/tablet layouts retain their existing wrapping, 8px-gap action behavior. `RestaurantList.jsx` has no functional diff in the four handlers, CRUD paths, or `RatingStars` contract for this correction.

### Validation evidence

Gini's reported `npm.cmd run lint`, `npm.cmd run build`, and `git diff --check` pass results are consistent with the inspected source. My own `git diff --check` completed successfully; Git emitted only existing LF-to-CRLF warnings. I did not run a browser, alter source/DB/task status/Git, or create test data.

### Owner remaining check

At approximately 360px, verify the four labels remain visually unclipped at the Owner's browser font scale and that keyboard focus remains visible on every action. T-110 should remain `REVIEW` pending that broader Owner verification.

— Hank

---
