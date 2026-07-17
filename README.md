# TasteLog Phase 1 — AI Collaboration Pack

이 folder는 과제 5의 1단계 구축을 위해 Owner, Toby, Gini, Hank, Any가 같은 범위·결정·검증 기준으로 협업하도록 준비한 project control pack입니다.

## Start here

1. 이 ZIP을 풉니다.
2. `TasteLog_Phase1_Collaboration_Pack` **안의 내용 전체**를 실제 React project root에 복사합니다. `AGENTS.md`가 `package.json`과 같은 root에 있어야 합니다.
3. 아직 React project가 없다면 이 pack을 먼저 root에 놓고, 담당 Agent가 승인된 task에 따라 Vite project를 준비합니다.
4. 모든 Agent에게 “`AGENTS.md`를 먼저 읽고, 배정된 task 외에는 구현하지 말라”고 지시합니다.
5. 실제 계정 생성, GitHub/Vercel 연결, secret 입력, production 배포는 Owner가 직접 승인합니다.

## Current handoff

- 기획·협업문서 작성: Toby 완료
- 다음 Primary Implementer: **Gini** (Owner가 시작 승인한 뒤 T-101부터)
- 초기 Reviewer: **Hank**
- 독립 위험 검토: **Any** (DB/RLS plan을 읽고 수정 없이 의견 제시)
- 현재 구현 상태: 코드 구현 전

## Required reading order

`AGENTS.md` → `PROJECT_CONTEXT.md` → `docs/PHASE1_REQUIREMENTS.md` → `docs/DATABASE_AND_RLS.md` → `AGENT_ROLES.md` → `WORKFLOW.md` → `TASK_BOARD.md` → logs/chat

## Documents

| File | Purpose |
|---|---|
| `AGENTS.md` | 공통 작업 규칙, 읽기 순서, 보안·완료 기준 |
| `PROJECT_CONTEXT.md` | 목적·범위·철학·금지사항 |
| `docs/PHASE1_REQUIREMENTS.md` | 화면/기능별 acceptance criteria |
| `docs/DATABASE_AND_RLS.md` | schema, 관계, validation, RLS 설계 기준 |
| `docs/TEST_AND_SUBMISSION.md` | 테스트와 제출 증빙 체크리스트 |
| `AGENT_ROLES.md` | Owner/Toby/Gini/Hank/Any 역할 |
| `WORKFLOW.md` | 단계별 실행·승인 절차 |
| `TASK_BOARD.md` | 실제 task, 담당자, reviewer, 완료 조건 |
| `DECISION_LOG.md` | 확정 결정과 trade-off |
| `WORK_LOG.md` | 실제 변경·검증·handoff 기록 |
| `USAGE_TRACKER.md` | AI 사용량과 역할 재분배 판단 |
| `docs/chat/*-chat.md` | 각 Agent의 현재 최종 의견 |

## First command to an Agent

```text
당신의 협업 이름을 확인하고 AGENTS.md의 Required reading order를 모두 읽으세요.
현재 TASK_BOARD.md에서 자신에게 배정된 작업만 확인하세요.
아직 구현하지 말고, 이해한 범위·수정 예정 파일·검증 방법·위험을 자신의 chat file에 서명하여 기록하세요.
Owner의 시작 승인을 기다리세요.
```

## Core rule

> 하나의 공통 맥락, 하나의 task당 한 명의 구현자, 독립 검토, 명시적 승인, 검증 증거.
