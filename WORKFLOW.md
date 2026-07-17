# Standard Workflow

## Core rule

> Plan together, implement once, review independently, decide explicitly.

## Phase 1. Define

Owner와 Toby가 다음을 확정합니다.

- 목적과 기대 결과
- In scope / out of scope
- Acceptance criteria
- 중요한 제약과 금지사항

결과는 `PROJECT_CONTEXT.md` 또는 `TASK_BOARD.md`에 기록합니다.

TasteLog Phase 1의 기준은 이미 `PROJECT_CONTEXT.md`, `docs/PHASE1_REQUIREMENTS.md`, `docs/DATABASE_AND_RLS.md`에 작성되어 있습니다. 변경은 Owner/Toby 결정과 `DECISION_LOG.md` 갱신이 필요합니다.

## Phase 2. Assign

각 작업에 다음을 지정합니다.

- Primary Implementer: 실제 file을 수정하는 Agent 한 명
- Reviewer: 수정하지 않고 검토하는 Agent
- Owner approval required: Yes / No

## Phase 3. Plan

Primary Implementer는 구현 전에 다음을 제시합니다.

- 이해한 요구사항
- 수정할 file
- 구현 순서
- test 방법
- 위험과 가정

복잡하거나 되돌리기 어려운 작업은 Owner 승인 후 진행합니다.

Agent 간 의견 조율이 필요하면 각자 자신의 `docs/chat/<name>-chat.md`에 현재 의견을 남깁니다. 모든 의견을 단순 합산하지 않고, Toby가 차이와 공통점을 정리하여 Owner의 결정을 받습니다.

## Phase 4. Implement

- 승인된 범위만 수정합니다.
- 기존 user changes를 보존합니다.
- 작고 검토 가능한 단위로 변경합니다.
- 관련 test를 실행합니다.

## Phase 5. Review

Reviewer는 다음을 확인합니다.

- 요구사항 누락
- Project 철학과의 충돌
- Bug, security, data-loss 위험
- 불필요한 복잡성
- Test 누락

Reviewer는 기본적으로 직접 수정하지 않고 findings를 전달합니다.

## Phase 6. Decide

Owner 또는 지정된 의사결정자가 review 의견을 다음 중 하나로 분류합니다.

- Accept
- Reject
- Defer
- Need more evidence

중요한 결정은 `DECISION_LOG.md`에 기록합니다.

결정이 확정되면 관련 chat file의 의견은 `Resolved`로 표시하거나 다음 현안으로 교체합니다. chat file을 장기 history 보관소로 사용하지 않습니다.

## Phase 7. Close and hand off

Primary Implementer는 다음을 갱신합니다.

- `TASK_BOARD.md`: 상태와 다음 단계
- `WORK_LOG.md`: 변경 file과 검증 결과
- `DECISION_LOG.md`: 새 결정이 있을 때
- `docs/TEST_AND_SUBMISSION.md`: 완료 evidence가 생기면 checklist 반영

## TasteLog stage gates

1. Foundation: repository inventory와 local build
2. Data security: schema/RLS review 후 Owner가 SQL 실행 승인
3. Secure CRUD: Auth → Read/Create → Update/Delete → visit/menu
4. UX: search/filter/dashboard/responsive/error states
5. Verification: 두 계정 RLS, regression, build
6. Delivery: README/evidence → Owner 승인 → GitHub/Vercel → final audit

## Safe collaboration patterns

### Implementation + independent review

```text
Toby defines criteria
→ Codex implements
→ agy reviews without editing
→ Codex applies accepted findings
→ Owner + Toby accept
```

### Usage-saving pattern

```text
Cursor Auto handles routine work
→ Codex handles complex implementation
→ agy provides targeted second opinion only when needed
```

## Patterns to avoid

- 세 Agent에게 같은 기능을 동시에 구현시키기
- 공통 문서를 읽지 않고 새 설계 만들기
- Review 의견을 Owner 승인 없이 전부 반영하기
- Test 없이 `Done` 처리하기
- 대화 내용만 믿고 결정 기록을 남기지 않기
