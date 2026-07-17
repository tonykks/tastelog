# AI Prompt Archive

이 folder는 TasteLog Phase 1에서 Agent에게 전달한 주요 작업지시를 task별로 보관합니다.

## Usage

Agent 입력창에는 긴 내용을 다시 붙이지 않고 다음처럼 짧게 전달합니다.

```text
AGENTS.md를 먼저 읽고, 지정된 docs/prompts/<file>.md를 처음부터 끝까지 읽어 그대로 수행하세요.
```

## Rules

- filename은 task ID와 Agent/목적을 포함합니다.
- 실행된 prompt는 사후에 의미를 바꾸지 않습니다.
- 수정이 필요하면 새 version 파일을 만듭니다.
- secret, API key, password, token을 기록하지 않습니다.
- 결과는 `docs/chat/<agent>-chat.md`, `WORK_LOG.md`, `TASK_BOARD.md`에 남깁니다.

## T-102 files

| File | Purpose | Status |
|---|---|---|
| `T102_HANK_SCHEMA_PLAN.md` | Hank의 schema 계획 작성 지시 | Executed |
| `T102_ANY_SCHEMA_REVIEW.md` | Any의 독립 schema 검토 지시 | Executed |
| `T102_HANK_MIGRATION_IMPLEMENT.md` | 최종 결정 반영 migration SQL 파일 작성 지시 | Ready |
