# Chat Protocol

## Purpose

이 folder는 Toby, Gini, Hank, Any가 서로의 **현재 최종 의견**을 읽고 Project 맥락을 공유하기 위한 임시 협의 공간입니다.

전체 대화 history를 보관하지 않습니다. 결정과 결과는 각각 `DECISION_LOG.md`와 `WORK_LOG.md`에 남깁니다.

## Identity mapping

| Name | Agent |
|---|---|
| Toby | ChatGPT |
| Gini | Cursor Agent |
| Hank | Codex |
| Any | Antigravity CLI |

## Ownership

- Toby는 `toby-chat.md`만 작성합니다.
- Gini는 `gini-chat.md`만 작성합니다.
- Hank는 `hank-chat.md`만 작성합니다.
- Any는 `any-chat.md`만 작성합니다.
- 다른 Agent의 file은 읽되 대신 수정하지 않습니다.

## Required format

각 chat file은 다음 내용만 포함합니다.

1. 누구에게 보내는 의견인지
2. 어떤 task·결정에 관한 것인지
3. 읽은 공통 문서와 전제
4. 현재의 최종 의견
5. 근거
6. 반대 의견·위험
7. 다른 Agent 또는 Owner에게 필요한 결정
8. 자신의 이름 서명

## Lifecycle

```text
Open issue
→ Each agent writes its current opinion
→ Toby compares the opinions
→ Owner decides
→ Decision moves to DECISION_LOG.md
→ Implementation moves to TASK_BOARD.md
→ Result moves to WORK_LOG.md
→ Chat files are cleared or replaced for the next issue
```

## Rules

- 긴 대화 내용을 그대로 복사하지 않습니다.
- 이미 합의된 내용을 매번 반복하지 않습니다.
- 상대 의견을 수정하거나 지우지 않습니다.
- 사실, 가정, 제안을 구분합니다.
- 구현 명령과 검토 의견을 구분합니다.
- `Approved`, `Rejected`, `Deferred`는 Owner 또는 권한을 위임받은 역할만 확정합니다.
- 비밀정보, API key, password, token을 기록하지 않습니다.

## Suggested request to every agent

```text
Read AGENTS.md and the shared project documents first.
Then read every file in docs/chat.
Write only your current final opinion in your own chat file,
use your assigned name, and sign the message.
Do not implement anything until the Owner assigns you as Primary Implementer.
```

## TasteLog required context

의견 작성 전 `docs/PHASE1_REQUIREMENTS.md`, `docs/DATABASE_AND_RLS.md`, `docs/TEST_AND_SUBMISSION.md`를 포함한 `AGENTS.md`의 읽기 순서를 지킵니다. 단순히 “동의합니다”라고 쓰지 말고 acceptance criterion 또는 task ID를 근거로 씁니다.
