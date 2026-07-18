지니, 나는 Toby야.

T-105·T-106 Restaurant CRUD checkpoint가 commit `57a70115014d380e413f9b834d4391e214423972`로 origin/main에 push됐고 working tree clean임을 확인했다.

새 Toby 창과 Hank 구현 창에서 T-107부터 이어가기 위한 인계 문서를 작성하고 GitHub에 보존하는 것을 승인한다. Source code와 task 상태는 변경하지 마.

## Preflight

* branch `main`
* HEAD `57a70115014d380e413f9b834d4391e214423972`
* local main = origin/main
* working tree clean

하나라도 다르면 작업하지 말고 보고 후 멈춰.

## 새 인계 문서

`TOBY_HANDOFF_20260718.md`를 새로 작성해. 기존 `TOBY_HANDOFF_20260715.md`, `TOBY_HANDOFF_20260717.md`는 이력으로 보존하고 수정·삭제하지 마.

다음을 간결하지만 새 Agent가 재작업하지 않을 만큼 명확하게 포함해.

### Project checkpoint

* Project: TasteLog Phase 1
* Private GitHub repository와 branch
* Application checkpoint 전체 hash와 message
* 제출 목표일 2026-07-18
* T-100~T-106 `DONE`, 재수행 금지
* T-107 `BACKLOG`, Primary Hank, Reviewer Gini
* T-107 자동 시작 금지, Owner/Toby 승인 필요

### 구현 완료 상태

* Supabase project와 migration 001·002·003 적용 상태
* 5개 table, RLS 5개, policy 16개
* Security Advisor `No issues found`
* Auth 회원가입·email confirmation·로그인·session 유지·local logout 완료
* Restaurant Read/Create/Update/Delete 완료
* owner-scoped query와 stale-request/mutation 방어
* T-105·T-106 Hank final Approve
* Owner CRUD 수동 검증 통과
* 현재 Owner test data로 `산방밀면` 한 row가 유지되고 있으며 삭제용 임시 row는 제거됐다는 사실
* migration, schema, RLS, package는 T-105·T-106에서 변경되지 않았음

### 다음 T-107 경계

* Visit editor는 실제 schema와 `docs/PHASE1_REQUIREMENTS.md`, `docs/DATABASE_AND_RLS.md`를 기준으로 설계
* DB는 restaurant 1:N visits를 지원하지만 Phase 1 UI는 D-005에 따라 현재/대표 방문 1건 중심으로 제한 가능
* 정확한 field, nullable 조건, rating/revisit validation은 migration과 요구사항에서 확인
* restaurant CRUD를 재구현하거나 migration을 수정하지 않음
* visit 이후 menu review는 T-108이며 T-107에 섞지 않음
* 실제 DB row mutation은 Owner 수동 검증에서만 수행
* 구현 후 Gini review와 Owner 확인 전 DONE 금지

### 협업과 제출 기록

* Toby: 조정·승인·Owner 검증·최종 제출 문서
* Gini: T-105·T-106 구현, T-107 reviewer
* Hank: T-105·T-106 reviewer, T-107 Primary
* Any: T-111 보안·회귀 단계의 독립 검토
* 각 task에서 `TASK_BOARD.md`, `WORK_LOG.md`, 해당 Agent chat을 갱신
* T-112에서 README, AI 협업 과정, 결정·review·수정 사례, 오류 해결, test evidence, screenshots, URL을 통합
* 일정이 촉박하므로 제출 필수 범위를 우선하고 기능 확장 금지

### Required reading order

새 Agent가 다음을 우선 읽도록 명시해.

1. `AGENTS.md`
2. `PROJECT_CONTEXT.md`
3. `docs/PHASE1_REQUIREMENTS.md`
4. `docs/DATABASE_AND_RLS.md`
5. `AGENT_ROLES.md`
6. `WORKFLOW.md`
7. `TASK_BOARD.md`
8. `DECISION_LOG.md`
9. `WORK_LOG.md` 최신 기록
10. `docs/TEST_AND_SUBMISSION.md`
11. `docs/chat/CHAT_PROTOCOL.md`
12. 모든 current Agent chat
13. `TOBY_HANDOFF_20260718.md`

### Environment와 보안

* `.env.local`은 Git에 없으며 각 PC에서 별도 유지
* 필요한 variable name만 기록
* 실제 URL/key/password/token/connection string은 기록하지 않음
* Frontend는 publishable key만 사용
* `.env.local`, `dist`, `node_modules` 제외
* Supabase CLI/DB mutation/Git push/Vercel은 승인 경계 준수

## 기록 파일

필요한 경우 다음 협업 기록만 갱신해.

* `docs/chat/gini-chat.md`: 인계 문서 작성 결과
* `docs/chat/toby-chat.md`: 이번 Toby 지시 보존

`TASK_BOARD.md`, `WORK_LOG.md`, `DECISION_LOG.md`, source, CSS, package, migration은 현재 완료 상태를 변경하지 마.

## 검증과 Git

* 변경이 새 handoff와 위 chat 기록뿐인지 확인
* `git diff --check`
* secret과 `.env.local` 미포함 확인
* source/package/migration 무변경 확인

검증 통과 시 다음 message로 일반 commit과 push를 승인한다.

`docs: hand off T-107 visit editor`

* amend/rebase/reset/force push 금지
* `git push origin main`

완료 후 다음을 보고하고 멈춰.

1. 생성·수정 문서
2. 새 commit 전체 hash와 message
3. push 결과
4. local main = origin/main
5. working tree clean
6. T-100~T-106 DONE, T-107 BACKLOG
7. warning·blocker

T-107 구현은 시작하지 마.

— Toby
