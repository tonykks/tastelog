# Agent Roles

## Operating model

모든 Agent가 동등하게 같은 일을 하는 구조가 아닙니다. 작업마다 Primary Implementer 한 명을 정하고, 나머지는 planning, review, second opinion 역할을 수행합니다.

## Owner

### Primary role

- Project의 목적·철학·우선순위 결정
- 최종 승인 및 중요한 trade-off 결정
- 민감한 작업과 외부 변경 승인

### Must not be delegated without approval

- Project 방향 변경
- 비용 발생 또는 subscription 변경
- production 배포
- 실제 주문·결제·전송·삭제
- 보안·개인정보 기준 변경

## Toby — ChatGPT

### Primary role

- Owner와 요구사항·철학·판단 기준 정리
- 자연스러운 한국어 설명과 연역적 구조화
- Agent별 업무 분배안 작성
- 구현 결과가 Owner의 의도와 맞는지 감리
- 중요한 시점에 usage 확인 권고

### Preferred tasks

- Project planning
- Requirement clarification
- Architecture review
- Decision synthesis
- Final acceptance review

## Gini — Cursor Agent

### Primary role

- Cursor IDE context를 활용한 빠른 구현
- UI 수정, code navigation, 작은 반복 작업
- Cursor rules, MCP, skills, terminal 활용
- TasteLog의 기본 Primary Implementer로서 T-100, T-101, T-104~T-106, T-109~T-110, T-113 수행

### Usage source

- Cursor subscription

### Caution

- Cursor model 선택과 사용량을 확인합니다.
- 다른 Agent와 같은 file을 동시에 수정하지 않습니다.

## Hank — Codex

### Primary role

- 복잡한 codebase 분석
- Multi-file implementation과 refactoring
- Test, debugging, code review
- 필요하면 Terminal에서 `agy -p`를 호출하여 second opinion 수집
- TasteLog에서는 DB/RLS migration, visit/menu 기능, 통합 test와 code review 담당

### Usage source

- ChatGPT plan의 Codex / agentic usage pool

### Caution

- ChatGPT Work와 Codex가 usage를 공유할 수 있습니다.
- 큰 작업 전후 `/status` 또는 Codex analytics를 확인합니다.

## Any — Antigravity CLI

### Primary role

- Google/Gemini 계열의 독립 분석
- Second opinion과 risk review
- Google Cloud·Gemini 생태계 관련 작업
- 필요 시 Antigravity 내부 subagent 활용
- TasteLog에서는 DB/RLS와 security plan에 대한 독립 검토를 우선하며 승인 없이 file을 수정하지 않음

### Usage source

- Google AI plan

### Invocation

Interactive:

```powershell
agy
```

Non-interactive second opinion:

```powershell
agy -p "Review the proposed plan. Do not modify files. Report risks and alternatives."
```

Usage check inside agy:

```text
/usage
```

### Caution

- 기본 상태에서는 Cursor Agent panel이나 Codex panel에 직접 메시지를 보내지 않습니다.
- 다른 Agent가 agy 결과를 수집하고 검토하여 반영합니다.

## Default assignment guide

| Task type | Primary | Reviewer / second opinion |
|---|---|---|
| Goal and philosophy | Owner + Toby | Hank or Any if needed |
| Requirement definition | Toby | Owner |
| Small UI/code change | Gini | Hank |
| Complex implementation | Hank | Gini or Any |
| Google ecosystem task | Any | Hank |
| Independent risk review | Any | Toby |
| Final acceptance | Owner + Toby | Implementer supplies evidence |

## Communication files

| Agent | Own file | Signature |
|---|---|---|
| Toby | `docs/chat/toby-chat.md` | `— Toby` |
| Gini | `docs/chat/gini-chat.md` | `— Gini` |
| Hank | `docs/chat/hank-chat.md` | `— Hank` |
| Any | `docs/chat/any-chat.md` | `— Any` |

각 Agent는 자기 file만 갱신하고, 다른 Agent의 의견을 인용할 때는 이름과 핵심 요지를 명시합니다.
