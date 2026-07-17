# Task Board — TasteLog Phase 1

Status: `BACKLOG` · `READY` · `IN_PROGRESS` · `REVIEW` · `BLOCKED` · `DONE`

## Current priority

- Phase: T-104 DONE — Auth Owner manual verification passed; Hank narrow re-review `Approve`; await T-105 approval
- Milestone: M1 foundation → M2 secure CRUD → M3 UX → M4 deploy/submit
- Primary goal: 2026-07-18까지 배포 가능한 과제 1단계 완성

## Execution rule

- 아래 순서대로 진행하며 선행 task가 `DONE` 또는 명시 승인되지 않으면 다음 task를 시작하지 않습니다.
- task마다 Primary Implementer는 한 명입니다.
- production/external mutation은 Owner approval이 필요합니다.

## Active backlog

| ID | Task | Status | Primary | Reviewer | Acceptance summary | Owner approval |
|---|---|---|---|---|---|---|
| T-100 | Repository 현황·과제 자료 점검 | DONE | Gini | Hank | 기존 파일/변경/환경 확인, 손실 없는 실행 계획 | No |
| T-101 | Vite React foundation | DONE | Gini | Hank | dev build, 구조, `.gitignore`, `.env.example`, no secrets | No |
| T-102 | Supabase schema·constraints·indexes migration 작성 | DONE | Hank | Any | 5 tables/관계/검증 조건, 재현 가능한 SQL | SQL 실행 Yes |
| T-103 | RLS policy·security test plan | DONE | Hank | Any | 3 owner tables CRUD policies, cross-user 차단 계획 | SQL 실행 Yes |
| T-104 | Supabase client + Auth | DONE | Gini | Hank | sign-up/login/logout/session/error | Yes if project mutation |
| T-105 | Restaurant Read/Create | BACKLOG | Gini | Hank | own list states, name-only create | No |
| T-106 | Restaurant Update/Delete | BACKLOG | Gini | Hank | edit, validation, confirm/cascade behavior | No |
| T-107 | Visit editor | BACKLOG | Hank | Gini | visited fields/rating/revisit; unvisited nullable | No |
| T-108 | Menu review CRUD | BACKLOG | Hank | Gini | multiple menus, price/rating validation | No |
| T-109 | Search/filter/rating sort/dashboard | BACKLOG | Gini | Hank | keyword, status/revisit, ranking, summary | No |
| T-110 | Responsive UI + accessibility/error states | BACKLOG | Gini | Hank | mobile/desktop, keyboard/labels, empty/error/loading | No |
| T-111 | Integrated security/regression test | BACKLOG | Hank | Any | T1–T10 evidence incl. second account | Yes for test accounts |
| T-112 | README·AI/error logs·screenshots | BACKLOG | Toby | Owner | submission sections and evidence complete | No |
| T-113 | GitHub main + Vercel production | BACKLOG | Gini | Hank | build, env, deployed URL smoke test | Yes |
| T-114 | Final acceptance audit | BACKLOG | Toby | Owner | all Phase 1 checklist, known limits disclosed | Yes |

## Immediate next action

1. T-104 완료 checkpoint를 Private GitHub `main`에 보존하고 새 Agent/다른 PC 인계 상태를 확인합니다.
2. 다음 task는 T-105 Restaurant Read/Create이지만 Owner/Toby의 별도 승인 전 시작하지 않습니다.
3. T-100~T-104를 재수행하거나 applied migration을 수정하지 않습니다.

## Known blockers / Owner inputs

| ID | Item | Needed by |
|---|---|---|
| B-006 | ~~Root empty `.git/` reappeared~~ — **RESOLVED 2026-07-15 (D-009)**: Owner+Toby chose `git init -b main` instead of repeated delete; local repo only, no commit/remote/push | T-101 |
| B-005 | ~~Root empty `.git/`·`.agents/`~~ — **RESOLVED 2026-07-15**: reconfirmed empty + non-repo; Owner-approved delete by Gini; paths gone | T-101 |
| B-001 | ~~GitHub repository name/URL 확정~~ — **RESOLVED 2026-07-17 (D-013)**: Private repository `https://github.com/tonykks/tastelog`; baseline branch `main` | T-113 |
| B-002 | ~~Supabase URL·publishable key local 입력~~ — **RESOLVED 2026-07-17**: Owner가 `.env.local`에 직접 입력; Git ignore 확인; 값은 어디에도 미기록 | T-104 |
| B-003 | Vercel project 연결 및 env 설정 승인 | T-113 |
| B-004 | 최종 앱 이름과 visual theme 확정 | T-110/T-112 |

## Recently completed

| ID | Result | By | Verified | Date |
|---|---|---|---|---|
| T-104 | Supabase client/Auth DONE: signup+email confirm+login/logout+refresh session+safe login error verified; Hank final Approve | Gini | Owner + Hank | 2026-07-17 |
| T-103 | RLS policy migration DONE: Any final Approve (no added findings); Owner/Toby closed; SQL not executed | Hank | Any + Owner/Toby | 2026-07-15 |
| T-102 | Initial schema migration DONE: Any final Approve (findings 0); Owner/Toby closed; SQL not executed | Hank | Any + Owner/Toby | 2026-07-15 |
| T-101 | Vite React foundation DONE: name=`tastelog`; local `git init -b main` (D-009); build/lint OK; no commit/remote | Gini | Hank | 2026-07-15 |
| T-100 | Root inventory: docs-only pack, no React/Git/secrets; T-101 merge scaffold plan in `gini-chat.md` | Gini | Hank pending | 2026-07-15 |
| P-001 | 개발기획서 분석 및 Phase 1 협업문서 작성 | Toby | Owner pending | 2026-07-15 |
