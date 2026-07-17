# Instructions for All Agents — TasteLog Phase 1

## Identity

- Owner: 최종 결정·승인
- Toby: 요구사항·설계·업무분배·최종 감리
- Gini: Cursor Agent, 기본 Primary Implementer
- Hank: Codex, 복잡한 구현·테스트·code review
- Any: Antigravity CLI, 독립 second opinion

모든 의견과 log에는 위 이름으로 서명합니다.

## Required reading order

작업 전에 반드시 읽습니다.

1. `PROJECT_CONTEXT.md`
2. `docs/PHASE1_REQUIREMENTS.md`
3. `docs/DATABASE_AND_RLS.md`
4. `AGENT_ROLES.md`
5. `WORKFLOW.md`
6. `TASK_BOARD.md`
7. `DECISION_LOG.md`
8. `WORK_LOG.md` 최신 항목
9. `docs/TEST_AND_SUBMISSION.md`
10. `docs/chat/CHAT_PROTOCOL.md`와 모든 current chat file

누락·충돌·불명확한 사항은 추측하지 말고 Owner와 Toby에게 보고합니다.

## Authority and scope

- Owner가 최종 의사결정권자입니다.
- `TASK_BOARD.md`에 지정된 한 명만 해당 task의 Primary Implementer입니다.
- Reviewer는 요청받지 않은 코드를 수정하지 않습니다.
- 외부 계정/프로젝트 생성, secret 설정, GitHub push, production deploy, 삭제는 Owner 승인 후 수행합니다.
- Accepted 결정은 `Superseded`가 되기 전까지 유효합니다.

## Work rules

1. 작업 시작 전 task를 `IN_PROGRESS`로 바꾸고 계획을 own chat file에 남깁니다.
2. 배정 범위 밖 file·기능을 임의로 수정하지 않습니다.
3. 다른 Agent와 같은 file을 동시에 수정하지 않습니다.
4. 작은 단계로 구현하고 각 단계에서 test합니다.
5. 변경 후 `WORK_LOG.md`에 files, commands/checks, results, risks를 기록합니다.
6. 중요한 결정은 `DECISION_LOG.md`에 제안하고 Owner/Toby 승인 전 확정으로 취급하지 않습니다.
7. 실제 코드·DB·문서 상태가 다르면 `DONE`으로 표시하지 않습니다.

## Security rules

- `service_role` key, DB password, OAuth secret, access token을 frontend, Markdown, screenshot, Git에 넣지 않습니다.
- `.env`는 ignore하고 `.env.example`에는 이름만 둡니다.
- RLS가 활성화되고 사용자별 SELECT/INSERT/UPDATE/DELETE가 검증되기 전 production-ready로 판단하지 않습니다.
- SQL Editor용 privileged operation과 browser client operation을 구분합니다.
- destructive migration/delete 전에 영향과 rollback을 제시하고 Owner 승인을 받습니다.

## Project boundaries

- Phase 1 제외: 지도 API, 사진 Storage, Social Login, password recovery, 공개 feed, admin, 결제.
- `display_name`만으로 restaurant 저장 가능해야 합니다.
- `place_id`는 nullable입니다.
- rating은 NULL 또는 1–5, price는 NULL 또는 0 이상 integer입니다.
- 장기 확장을 이유로 Phase 1을 불필요하게 복잡하게 만들지 않습니다.

## Collaboration

- 각 Agent는 자기 `docs/chat/<name>-chat.md`만 수정합니다.
- Any는 interactive 또는 `agy -p`로 호출되며 결과는 자동 승인되지 않습니다.
- 의견 충돌은 Toby가 비교하고 Owner가 결정합니다.
- 결정은 chat에 묻어두지 않고 `DECISION_LOG.md`로 이동합니다.

## Definition of done

- task acceptance criteria 충족
- 관련 automated/manual test 완료 및 결과 기록
- regression과 의도하지 않은 변경 없음
- security check 통과
- 문서와 코드 일치
- `TASK_BOARD.md`, `WORK_LOG.md` 갱신
- 배포 task는 production URL에서 확인
- Owner 확인 필요 사항 명시
