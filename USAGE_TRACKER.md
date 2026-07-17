# AI Usage Tracker

이 문서는 정확한 과금 장부가 아니라 Agent 배분을 위한 운영 기록입니다.

## Check commands and locations

### Cursor

- Cursor account의 Usage / Billing 화면 확인
- Included usage, on-demand usage, selected model 확인

### Codex

- Codex panel: `/status`
- Codex analytics: weekly remaining, reset time, turns by model / surface 확인
- `Remaining credits 0`은 추가 구매 credit이 없다는 뜻이며 기본 weekly allowance 0이라는 뜻이 아님

### Antigravity CLI

agy prompt에서:

```text
/usage
```

- Model별 remaining quota 확인
- 5-hour refresh와 weekly limit을 구분

## Operating thresholds

| Remaining | Guidance |
|---:|---|
| 70–100% | Normal use |
| 40–70% | Move routine work to lighter models |
| 20–40% | Reserve expensive Agent for complex work |
| 10–20% | Use only for high-value tasks |
| 0–10% | Check reset time before new large work |

## Checkpoints

Usage를 다음 시점에 확인합니다.

1. 큰 기능 개발 전
2. 장시간 Agent 작업 후
3. Agent 역할 재분배 전
4. Weekly reset 전후
5. 제한 또는 fallback model 안내가 나타날 때

## History

| Date | Cursor | Codex remaining / reset | Antigravity remaining / reset | Decision |
|---|---|---|---|---|
| YYYY-MM-DD | | | | |
| 2026-07-15 | Owner to check before implementation | Owner to check analytics before T-102/T-111 | Run `/usage` before independent DB/RLS review | Prefer Gini Auto for routine UI, Hank for DB/tests, Any for targeted review |

## Toby reminder points for this project

- T-101 시작 전: Cursor + Codex 사용량 확인
- T-102/T-103 시작 전: Codex + Any 사용량 확인
- T-107/T-108 전: 남은 기간과 사용량에 따라 Gini/Hank 재배분
- T-111/T-114 전: 검토용 quota를 남겼는지 확인
