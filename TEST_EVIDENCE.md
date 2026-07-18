# TasteLog Phase 1 — Test Evidence

> 2026-07-18 긴급 제출 문서 기준입니다. `Pass`는 실제 command, Owner browser 확인 또는 명시된 독립 review 근거가 있을 때만 사용합니다.

## Evidence sources

- `WORK_LOG.md`: 구현 단계별 command와 Owner 확인 기록
- `docs/chat/gini-chat.md`, `docs/chat/hank-chat.md`: 구현자/Reviewer 판정
- `TASK_BOARD.md`: task closeout 상태
- `supabase/migrations/001·002·003`: 적용된 schema/RLS/security hardening

## Automated and static checks

| Check | Result | Evidence / scope |
|---|---|---|
| `npm run lint` | Pass | T-110 최종 source correction까지 Oxlint pass 기록 |
| `npm run build` | Pass | Vite 8.1.4 production build pass 기록 |
| `git diff --check` | Pass | T-110 closeout에서 pass; CRLF conversion warning은 비차단 |
| Rating boundary | Pass | null/0/6/1.5/string → null, integer 1/3/5 유지 smoke |
| Dashboard pure calculations | Pass | search/filter/count/rating order/Top 5/input immutability smoke |
| Secret-like value scan | Pass for checked T-104~T-110 paths | staged/touched path scan 기록; `.env.local` ignored |
| Migration/package protected scope | Pass | T-104~T-110 변경에서 migration 001·002·003/package files unchanged |

이 문서 작성 중 source lint/build는 재실행하지 않았습니다. 위 결과는 완료 task의 기록된 증거를 재사용합니다.

## Owner browser verification

| Area | Result | Confirmed behavior |
|---|---|---|
| Auth | Pass | 가입, email confirmation, 로그인, 잘못된 비밀번호 safe error, 로그아웃, 새로고침 session 유지 |
| Restaurant Create/Read | Pass | 이름만으로 생성, 목록 즉시 반영, 새로고침 persistence, loading/empty/error |
| Restaurant Update/Delete | Pass for current UI | 이름 편집/cancel/save, 삭제 cancel/confirm, 연관 삭제 경고, 다른 row 영향 없음 |
| Visit | Pass | create/read/update, visited/unvisited 전환, 대표 방문 복구, rating validation, cancel, refresh/logout-login persistence |
| Menu review | Pass | 두 row 생성, edit cancel/save, invalid price/rating, delete cancel/confirm, persistence |
| Search/filter/sort/dashboard | Pass | keyword/whitespace/no-result, 네 filter, sort controls, summary counts, Top 5, CRUD/Visit 즉시 재계산 |
| RatingStars | Pass | Visit/Menu 1–5/null, readonly card/Top 5/Menu 표시, keyboard focus/selection |
| Responsive | Pass by Owner browser | desktop 및 약 360px Auth/App/Visit/Menu, action row, panel header, horizontal overflow 없음 |
| Persistence | Pass | 저장 직후 UI, refresh, logout/relogin 후 Restaurant/Visit/Menu 유지 |
| Menu/dashboard isolation | Pass | Menu CRUD가 summary/Top 5에 영향 없음 |

## Core scenarios T1–T10

| ID | Scenario | Status | Note |
|---|---|---|---|
| T1 | New account sign-up/login | Pass | Owner 실제 가입/confirmation/login 및 session 확인 |
| T2 | Restaurant name-only create | Pass | `display_name`만으로 저장 |
| T3 | Edit area/recommendation | Not verified / UI not exposed | 현재 UI/service update는 `display_name` 편집만 제공 |
| T4 | Mark visited, rating | Pass | 대표 별점 4 포함 Visit 흐름 확인 |
| T5 | Add two menu reviews | Pass | 두 row 생성 후 edit/delete/persistence 확인 |
| T6 | Search/filter/sort | Pass | unrated-last 규칙과 Top 5 포함 |
| T7 | Second-account isolation attacks | Not run | 임의 test account 생성 금지; T-111에서 Owner 승인 필요 |
| T8 | Cancel then confirm delete | Pass | Restaurant와 Menu에서 확인 |
| T9 | Browser refresh | Pass | Auth session과 저장 데이터 유지 |
| T10 | Vercel mobile/desktop | Not run | Vercel 미배포; local browser responsive 확인만 완료 |

## RLS and security evidence

| Item | Status |
|---|---|
| Schema constraints/composite FK static review | Pass — Hank implementation, Any independent review |
| RLS policy static review | Pass — Hank implementation, Any independent review |
| Migration 001·002·003 remote application | Recorded complete |
| Browser uses publishable key only | Static/source check pass |
| `service_role` absent from frontend/docs | Checked; no intentional value recorded |
| Single-account owner-scoped CRUD | Owner pass |
| Two-account SELECT/UPDATE/DELETE/parent-link attacks | Not run in this final cycle |

## Final retained Owner data

- Restaurant: `산방밀면`
  - status: `visited`
  - representative overall rating: `4`
  - revisit intention: `true`
- Menu review: `밀면`
  - price: `8500`
  - taste rating: `4`
  - memo: `담백하고 시원했습니다.`

## Open evidence

- T-111: approved second-account owner isolation and UUID attack verification
- T-113: Vercel production URL, environment setup, production mobile/desktop smoke
- Submission screenshots listed in `docs/SCREENSHOT_CHECKLIST.md`
