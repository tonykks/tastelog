# TasteLog Phase 1 Handoff — 2026-07-17

> 새 Agent 창과 다른 PC에서 T-104 완료 상태를 안전하게 이어가기 위한 인계 문서입니다. T-105는 Owner/Toby 승인 전 시작하지 않습니다.

## 1. Project checkpoint

- Project: **TasteLog** (working Korean name: 다시갈집)
- Assignment: React CRUD app, Phase 1
- Submission target: **2026-07-18**
- GitHub: `https://github.com/tonykks/tastelog` (Private)
- Branch: `main`
- Checkpoint 직전 commit: `75bc9079bf02d47bf48d5c0bb7d0f890e093f89f` — `chore: establish TasteLog Phase 1 baseline`
- 이번 checkpoint message: `feat: complete T-104 Supabase authentication`
- T-100~T-104: **DONE — 재수행 금지**
- 다음 task: T-105 Restaurant Read/Create (자동 시작 금지; Owner/Toby 승인 필요)

## 2. T-104 implementation

주요 file:

- `src/lib/supabase.js` — `VITE_SUPABASE_URL`과 `VITE_SUPABASE_PUBLISHABLE_KEY`로 단일 browser client 생성, 누락 설정 안전 처리
- `src/services/authService.js` — sign-up, sign-in, local-scope sign-out, initial session, auth-state subscription, 안전한 한국어 오류 변환
- `src/components/auth/AuthForm.jsx` — email/password 가입·로그인, email confirmation 안내, label/focus/disabled/loading
- `src/App.jsx` — env 오류, 초기 session loading/error, 로그인 전·후 화면, 새로고침 session 유지, logout
- `src/App.css` — plain CSS only
- `.env.example` — 변수명만 포함
- `package.json` / lockfile — `@supabase/supabase-js@2.110.7`, project-scoped Supabase CLI

지원 범위:

- Email/password 회원가입과 로그인
- Email confirmation 필요 상태 안내
- 현재 browser session 로그아웃
- 초기 session 확인, `onAuthStateChange`, 새로고침 session 유지
- 잘못된 로그인/network/초기화 오류의 안전한 사용자 문장
- 환경변수 누락 시 값 없이 변수명만 표시

## 3. Owner and reviewer evidence

Owner manual verification passed:

1. 회원가입 요청 성공
2. 실제 email confirmation mail 수신
3. Confirmation link 인증 성공
4. 인증 후 로그인 session과 환영 화면
5. 로그아웃 후 Auth 화면 복귀
6. 올바른 정보로 재로그인
7. 새로고침 후 session 유지
8. 현재 browser session 로그아웃
9. 잘못된 비밀번호에 `이메일 또는 비밀번호가 올바르지 않습니다.` 표시

Hank narrow re-review: **Approve**, finding 없음.

## 4. Supabase state

- Project: `tastelog-phase1`
- Project ref: `xqgrunybnlblaqlzomkv`
- Region: `ap-northeast-1`
- Remote migrations (local=remote):
  1. `20260715000001_initial_schema.sql`
  2. `20260715000002_rls_policies.sql`
  3. `20260717000003_harden_set_updated_at_search_path.sql`
- Public tables: 5 — `profiles`, `places`, `user_restaurants`, `visits`, `menu_reviews`
- RLS: 5 tables 모두 enabled
- RLS policies: 16 (profiles 3, places 1, user_restaurants 4, visits 4, menu_reviews 4)
- `public.set_updated_at()` config: `search_path=pg_catalog`
- Security Advisor: **No issues found**
- Performance Advisor INFO: `place_id` FK 미인덱싱과 empty DB의 unused indexes. 승인 범위 밖이므로 보류; 임의 수정 금지.

Migration 001·002·003은 remote applied history입니다. 기존 file을 수정·rename·repair·reset하지 않습니다.

## 5. Environment and secrets

- `.env.local`은 Git에 포함하지 않습니다. 각 PC에서 Owner가 별도로 준비합니다.
- 필요한 이름:

```text
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
```

- 실제 value, database password, access token, secret key, service-role key, connection string을 source/Markdown/chat/screenshot/Git에 절대 기록하지 않습니다.
- Frontend에는 publishable key만 사용합니다.

## 6. Required reading order

새 Agent는 구현 전에 다음 순서로 읽습니다.

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
11. 이 문서 `TOBY_HANDOFF_20260717.md`

`AGENTS.md`의 authority, security, task ownership 규칙도 항상 준수합니다.

## 7. Remaining sequence and schedule risk

- T-105: Restaurant Read/Create — Gini
- T-106: Restaurant Update/Delete — Gini
- T-107: Visit editor — Hank
- T-108: Menu review CRUD — Hank
- T-109: Search/filter/rating sort/dashboard — Gini
- T-110: Responsive/accessibility/error states — Gini
- T-111: Integrated security/regression test — Hank
- T-112: README/evidence/screenshots — Toby
- T-113: GitHub main + Vercel — Gini
- T-114: Final acceptance — Toby/Owner

제출 목표가 2026-07-18이므로 남은 task 수에 비해 일정 위험이 높습니다. Scope를 늘리지 말고 task 순서와 Primary Implementer를 지킵니다.

## 8. Restore on another PC

Fresh clone:

```powershell
git clone https://github.com/tonykks/tastelog.git
cd tastelog
npm.cmd ci
Copy-Item .env.example .env.local
```

그다음 Owner가 `.env.local`의 두 value를 직접 입력하고 다음을 실행합니다.

```powershell
npm.cmd run lint
npm.cmd run build
npm.cmd run dev
```

이미 clone한 노트북:

```powershell
cd <existing-tastelog-path>
git status
git pull --ff-only origin main
npm.cmd ci
```

`git pull` 전에 working tree가 clean인지 확인합니다. `.env.local`은 pull/clone으로 복구되지 않으므로 각 PC에서 수동 준비합니다. 기존 local 변경이 있으면 덮어쓰거나 reset하지 말고 먼저 Owner/Toby에게 보고합니다.

## 9. Next gate

T-105를 자동으로 `IN_PROGRESS`로 바꾸지 않습니다. 현재 code, Git status, migrations, `.env.local` ignore를 확인한 뒤 Owner/Toby의 명시적 시작 승인을 받습니다.

— Gini
