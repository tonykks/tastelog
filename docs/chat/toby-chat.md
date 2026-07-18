담당 Agent: Gini
역할: T-112 문서 작성 지원
Primary 책임: Toby
Reviewer: Owner
권장 모델: GPT-5.6 Sol Medium
권장 Reasoning: 기본
MAX Mode: Off

긴급 마감 대응으로 T-112 최소 제출 문서를 시작해줘.

현재 기준:
- HEAD: 1e6001914c233e5927463ff28aa02d05f51048f3
- T-100~T-110 DONE
- T-111은 기존 증거 중심 축약 점검 예정
- T-113 Vercel은 문서 확보 후 최대 15분 시도
- GitHub: https://github.com/tonykks/tastelog
- Vercel URL은 아직 없음
- 두 번째 계정은 임의 생성하지 않으며 미검증 제약으로 공개

먼저 현재 README와 docs를 읽고, 기존 유효 내용을 보존하면서 제출 가능한 README.md를 완성해줘.

README 필수 구성:

1. 프로젝트 소개
- 주 이름: 다시갈집
- 보조 이름: TasteLog
- 한 줄 정의
- Phase 1 목표와 현재 완성 범위

2. 주요 기능
- 회원가입·로그인·로그아웃·세션 유지
- Restaurant CRUD
- 방문 여부·방문일·대표 별점·메모·재방문 의사
- Menu review CRUD
- 별점 1~5/null 및 별 UI
- 요약·Top 5·검색·필터·정렬
- 모바일·데스크톱 반응형과 접근성
- safe loading/empty/error/delete confirmation

3. 기술 스택과 구조
- React/Vite/Supabase/Vercel 예정
- auth, services, Restaurant, Visit, Menu, Dashboard, RatingStars 책임 분리
- 실제 package/source 기준으로만 작성하고 추측 금지

4. 데이터 모델
- restaurants, visits, menu_reviews 관계
- owner user_id, restaurant FK, optional visit_id
- 대표 방문 결정:
  visited_at DESC nulls last → updated_at DESC → id DESC
- migration 001·002·003은 적용 완료·불변이라고 기록하되 SQL을 임의 변경하지 말 것

5. Auth·RLS·보안
- owner-scoped SELECT/INSERT/UPDATE/DELETE
- client는 publishable key만 사용
- service_role 금지
- .env.local, secrets, dist, node_modules 제외
- safe Korean error
- 실제 확인한 범위와 정적 확인을 구분

6. 로컬 실행
- npm install 또는 lockfile 기준 명령
- npm run dev
- npm run lint
- npm run build
- 필요한 환경변수 이름만 기록
- 실제 URL·키·비밀번호·token 값은 절대 기록하지 말 것

7. AI 협업 과정
- Toby: 조정·승인 gate·Owner 검증·제출 통합
- Gini/Hank: task별 Primary/Reviewer 역할 교대
- Any: T-111 독립 보안·회귀 검토 예정
- 한 task 한 Primary, 독립 Reviewer, Owner 최종 검증 구조
- Work 환경의 공유 문서·task board·decision/work/chat 기록이 연속성과 책임 분리를 높였다는 점
- 성과가 특정 모델 하나 때문이라고 단정하지 말고,
  모델 역량 + Work의 공유 맥락 + 역할 분담 + 승인 gate의 결합으로 설명
- 상황별 Agent·모델 선택 이유를 포함
- Owner가 요청한 “역할분담과 그 이유”를 제출 사례로 명확히 기록

8. 대표 review·수정 사례
최소 다음 사례를 표로 정리:
- T-107 status 실패 후 중복 INSERT 위험 → 성공 visit 보존·id UPDATE 재시도
- summary 실패가 목록 전체를 가리던 문제 → summary만 비우고 Restaurant CRUD 유지
- T-108 stale mutation → { aborted: true }로 성공 side effect 차단
- whitespace price → trim 후 null
- T-109 invalid rating → 정수 1~5만 rated
- T-110 투명 radio focus → visible label focus ring
- star/accent contrast 수정
- 360px Auth overflow 수정
- 모바일 action 버튼 한 줄
- panel ×·subtitle 한 줄
각 사례에 발견 Agent, 위험, 수정, 재검토 결과를 간결히 기록

9. 테스트 증거
- 이미 완료된 lint/build/git diff 결과
- Owner Restaurant/Visit/Menu CRUD
- 별점 1~5/null
- 저장 직후 반영·새로고침 persistence
- 검색·필터·Top 5
- keyboard focus
- 360px Auth/App/Visit/Menu 반응형
- 최종 Owner data:
  산방밀면 visited / 대표 별점 4 / revisit true
  밀면 8500 / 맛 평가 4 / 담백하고 시원했습니다.
- 수행하지 않은 테스트를 pass로 쓰지 말 것

10. 스크린샷
- repository에 이미 있는 실제 스크린샷만 사용
- 이메일·token·key·connection string 등 개인정보/secret이 보이는 이미지는 포함하지 말 것
- 안전한 이미지가 부족하면 README에 가짜 이미지를 넣지 말고
  docs/SCREENSHOT_CHECKLIST.md에 필요한 캡처와 권장 파일명을 작성
- 현재 확보 여부와 추가 필요 여부를 보고할 것

필요 항목:
- Auth/login
- Restaurant dashboard
- Visit/rating/revisit
- Menu CRUD
- Search/filter/Top 5
- Delete confirmation
- Mobile view
- safe error 또는 limitation

11. 오류 해결 기록
- 대표 오류, 원인, 수정, 재시험을 실제 기록에 근거해 작성

12. Known limitations·향후 개선
반드시 공개:
- 두 번째 계정 owner-isolation 실제 재검증 미실시
- Visit 저장과 Restaurant status 갱신은 브라우저 순차 요청이며 원자 transaction이 아님
- 이번 긴급 제출에서 미완료된 배포/검증 항목
- 별점 데이터는 integer 1~5/null이며 UI만 별 표시
- 향후 개선 사항

13. 링크
- GitHub URL
- Vercel은 “배포 예정 — T-113”으로 명시하고 가짜 URL 금지

추가 문서:
- TEST_EVIDENCE.md 또는 기존 적절한 문서에 test evidence 표 정리
- docs/SCREENSHOT_CHECKLIST.md가 필요하면 생성
- TASK_BOARD.md: T-112를 IN_PROGRESS로만 전환
- WORK_LOG.md 및 docs/chat/gini-chat.md 최상단에 문서 작성 기록
- T-112는 아직 DONE으로 닫지 말 것

검증:
- README 내부 링크와 명령 확인
- secret-like 실제 값이 없는지 검사
- 문서 범위 git diff --check
- source lint/build 재실행 금지
- source·DB·migration·package 변경 금지
- commit·push·Vercel deploy 금지

보고:
1. 생성·수정 문서
2. README 필수 11개 항목 충족 여부
3. 포함된 실제 screenshot과 부족한 screenshot
4. 사실로 확인하지 못해 limitation으로 남긴 항목
5. GitHub/Vercel 링크 상태
6. secret 검사와 diff-check 결과
7. warning/blocker
8. 실제 작업 모델

— Toby