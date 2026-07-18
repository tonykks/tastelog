# TasteLog Phase 1 — Screenshot Checklist

현재 repository에 제출 증거로 사용할 실제 앱 screenshot은 **0개**입니다.

`src/assets/hero.png`는 Vite scaffold 장식 자산이며 실제 앱 실행·검증 증거가 아니므로 제출 screenshot으로 사용하지 않습니다. 아래 파일은 Owner가 실제 앱에서 직접 캡처한 뒤 개인정보/secret 검토를 거쳐 추가합니다.

## Capture safety

- 이메일 주소는 숨기거나 crop/blur 처리
- token, API key, password, connection string, Supabase dashboard secret은 절대 포함하지 않음
- browser devtools Network/Storage/Application panel은 가급적 캡처하지 않음
- 실제 test data는 제출에 필요한 최소 범위만 노출
- 이미지 추가 후 Git diff에서 예상 파일명·크기를 확인

## Required captures

| # | 권장 파일명 | 화면 | 상태 |
|---|---|---|---|
| 1 | `docs/screenshots/01-auth-login.png` | 다시갈집/TasteLog Auth 및 로그인 화면 | 필요 |
| 2 | `docs/screenshots/02-dashboard.png` | Restaurant dashboard, summary, Restaurant card | 필요 |
| 3 | `docs/screenshots/03-visit-rating.png` | Visit editor, RatingStars, revisit intent | 필요 |
| 4 | `docs/screenshots/04-menu-crud.png` | Menu review 목록/입력/별점 | 필요 |
| 5 | `docs/screenshots/05-search-filter-top5.png` | 검색·filter·sort·Top 5 | 필요 |
| 6 | `docs/screenshots/06-delete-confirmation.png` | Restaurant 또는 Menu 삭제 확인 | 필요 |
| 7 | `docs/screenshots/07-mobile-360.png` | 약 360px mobile dashboard/action/panel | 필요 |
| 8 | `docs/screenshots/08-safe-error.png` | raw DB detail이 없는 safe error 또는 limitation 안내 | 선택/권장 |
| 9 | `docs/screenshots/09-empty-state.png` | owner-empty 또는 filtered-empty 구분 | 선택/권장 |

## Before submission

- [ ] 각 파일이 실제 앱 실행 화면인지 확인
- [ ] 이메일·secret·불필요한 개인정보 없음
- [ ] mobile capture의 viewport 폭이 식별 가능
- [ ] README에 존재하는 이미지 경로만 연결
- [ ] 빈 placeholder나 가짜 URL/image 없음
- [ ] 최종 screenshot 목록과 촬영 환경을 `TEST_EVIDENCE.md`에 추가
