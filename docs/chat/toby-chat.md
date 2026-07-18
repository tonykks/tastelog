지니, 나는 Toby야.

Hank의 T-105 narrow re-review 최종 판정 `Approve`를 확인했다. Owner 수동 검증도 모두 통과했으므로 T-105를 `DONE`으로 종료하고 T-106 Restaurant Update/Delete 시작을 승인한다.

## 먼저 T-105 종료 기록

* `TASK_BOARD.md`: T-105 → `DONE`
* `WORK_LOG.md`: Owner 수동 검증과 Hank 최종 Approve 기록
* `docs/chat/gini-chat.md`: 두 finding 수정 및 최종 승인 기록
* 기존 `docs/chat/hank-chat.md`, `docs/chat/toby-chat.md` 변경을 덮어쓰거나 되돌리지 마.

T-105 source를 추가 refactor하지 마.

## T-106 범위

로그인한 사용자가 자신의 식당 이름을 수정하고 자신의 식당을 삭제할 수 있게 구현해.

### Update

* 각 식당 카드에 명확한 `수정` 동작 제공
* 기존 이름을 편집 form에 표시
* 저장과 취소 제공
* 이름 trim 및 빈값 validation
* service layer에서도 trim/빈값 invariant 보장
* 현재 session user id와 restaurant id를 모두 사용해 owner-scoped UPDATE
* 수정 중 중복 제출 방지
* 성공 후 해당 local 목록 항목을 반환 row로 갱신
* `updated_at` 및 목록 정렬이 기존 정책과 일관되게 반영
* 안전한 오류 표시, raw Supabase error 미노출

### Delete

* 각 식당 카드에 명확한 `삭제` 동작 제공
* 실제 DELETE 전에 사용자 확인 절차 제공
* 취소하면 DB 요청과 local 변경이 없어야 함
* 현재 session user id와 restaurant id를 모두 사용해 owner-scoped DELETE
* 삭제 중 중복 요청 방지
* 성공 후 해당 식당을 local 목록에서 제거
* 마지막 식당 삭제 시 기존 empty state로 복귀
* 안전한 오류 표시, raw error 미노출

### 비동기·사용자 전환 안전성

T-105에서 적용한 사용자 remount/request guard 원칙을 유지해.

* logout, 사용자 변경, unmount 후 늦은 UPDATE/DELETE 결과가 새 사용자 화면을 변경하지 않게 처리
* 한 row의 mutation 상태가 다른 row를 잘못 변경하지 않게 처리
* 정상 update/delete 결과는 정확한 row에만 반영

## 기존 DB 동작

식당 삭제의 child cascade는 이미 승인·적용된 FK migration 동작을 사용한다. migration, constraint, RLS를 수정하거나 cascade를 application code로 재구현하지 마.

T-106에서는 visit/menu UI를 만들지 않는다.

## UI·접근성

* 기존 plain CSS 유지
* button type 명시
* 입력 label 제공
* keyboard Tab/Enter 기본 동작 유지
* focus-visible 유지
* destructive delete와 일반 edit action을 시각적으로 구분
* mobile에서 버튼과 입력이 화면 밖으로 밀리지 않도록 기존 구조 안에서 최소 대응

## 범위 밖

* T-107 visit
* T-108 menu review
* search/filter/sort/dashboard
* 새 package
* migration/schema/RLS 변경
* Supabase CLI 또는 remote 관리 명령
* Agent의 test row/account 생성·수정·삭제
* Git commit/push
* Vercel

Owner의 기존 `산방밀면` row는 Agent가 수정하거나 삭제하지 마.

## 기록

* T-106만 `IN_PROGRESS`로 변경
* 짧은 구현 계획 기록
* 구현 후 `TASK_BOARD.md`, `WORK_LOG.md`, `docs/chat/gini-chat.md` 갱신
* T-105 종료 근거와 T-106 구현 근거를 구분해서 기록
* 협업 제출 증거가 되도록 Primary/Reviewer, 주요 owner-scope 판단, 검증 결과를 간결하게 남김

## 자동 검증

* IDE/static diagnostics
* `npm.cmd run lint`
* `npm.cmd run build`
* dev smoke
* `git diff --check`
* `.env.local`·secret 미포함
* migration 001·002·003 무변경
* package 변경 없음 확인

Agent가 실제 row mutation을 수행하지 마.

완료 후 T-106을 `REVIEW`로 변경하고 다음을 보고한 뒤 멈춰.

1. T-105 DONE 기록 결과
2. update/delete 구현 내용
3. Supabase owner-scoped UPDATE/DELETE 방식
4. 사용자 전환 및 stale mutation 차단 방식
5. 생성·수정 파일
6. 자동 검증 결과
7. Owner 최소 수동 테스트 순서
8. Hank review 요청 범위
9. warning·blocker

T-107은 시작하지 마.

— Toby
