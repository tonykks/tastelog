# Work Log — TasteLog Phase 1

최신 기록을 위에 추가합니다. 사실과 미검증 사항을 구분합니다.

---

## 2026-07-17 — Gini — Private GitHub baseline

### Goal

승인된 T-100~T-103 결과를 secret과 local 생성물 없이 최초 Git commit으로 보존하고, 데스크탑에서 clone 가능한 Private GitHub `main` 기준점을 확립합니다.

### Work performed

1. Required reading order와 current chat files 재확인
2. Local branch `main`, commit 0, remote 없음, 전체 untracked file 확인
3. 승인된 migration 두 개의 정확한 이름과 대용량 생성물 부재 확인
4. `.agents/`는 비어 있는 local Cursor working folder로 판단해 `.gitignore`에 제외
5. Supabase local working state(`supabase/.branches/`, `supabase/.temp/`) 제외 규칙 추가
6. Secret-like 문자열과 실제 `.env*` 검사; `.env.example` 외 환경 파일 없음 확인
7. D-013 Accepted 및 B-001 resolved 기록
8. 최초 commit `chore: establish TasteLog Phase 1 baseline` 생성 후 `origin/main`에 push

### Files changed

- `.gitignore` — local agent/Supabase working state 제외
- `DECISION_LOG.md` — D-013 Accepted
- `TASK_BOARD.md` — B-001 resolved; 다음 task 미시작
- `WORK_LOG.md` — 본 기록
- `docs/chat/gini-chat.md` — Git baseline handoff
- 기존 승인된 source, docs, migration files를 최초 baseline에 포함

### Validation

- Repository URL: `https://github.com/tonykks/tastelog`
- Branch: `main`
- Migrations: `20260715000001_initial_schema.sql`, `20260715000002_rls_policies.sql`
- Excluded: `.agents/`, `node_modules/`, `dist/`, actual `.env*`, Supabase local working state, logs/editor/OS temp
- Secret scan: 실제 password/token/API key/service-role key/connection string 없음
- Remote preflight: `git ls-remote` refs 없음 (empty repository)
- Push 후 local `main`과 `origin/main` 동일 commit 및 clean working tree 확인

### Warnings / risks

- GitHub CLI(`gh`)는 이 PC에 설치되어 있지 않아 repository metadata 조회 대신 `git ls-remote`와 standard Git push/verification을 사용
- Supabase project 연결·SQL 실행·React/Auth 구현·package 설치·Vercel 연결은 수행하지 않음

### Next action

Desktop에서 repository를 `git clone`하고 `npm install` 후 local 실행을 확인합니다. T-104 또는 이후 task는 Owner/Toby 승인 전 시작하지 않습니다.

### Handoff note

Private GitHub `main` is the shared Phase 1 baseline. Use clone, not Download ZIP, so Git history and upstream tracking are preserved.

---

## 2026-07-15 — Gini — T-103 final approval / closeout (docs only)

### Goal

Owner/Toby의 T-103 최종 승인을 보드·로그·chat에 반영하고 task를 종료합니다. SQL/Migration/React/env/Supabase/package/Git은 수정·실행하지 않습니다.

### Work performed

1. Any 최종 판정 `Approve` (추가 findings 없음) 및 Owner/Toby T-103 최종 승인 확인
2. `TASK_BOARD.md`: T-103 → `DONE`; 다음 task 상태 임의 변경·시작 없음
3. `WORK_LOG.md` / `docs/chat/gini-chat.md`에 종료 정리 기록
4. Migration SQL 실행, React/env/Supabase/package/Git, 후속 task 구현 **미수행**

### Files changed

- `TASK_BOARD.md` — T-103 DONE, immediate next action = Owner/Toby 승인 대기
- `WORK_LOG.md` — 본 항목
- `docs/chat/gini-chat.md` — T-103 closeout append (서명: Gini)

### Validation

- Documentation status only; no SQL execution
- Migration artifacts unchanged by this closeout

### Findings/risks

- T-102/T-103 SQL remain reviewed static artifacts; Supabase apply still requires explicit Owner ordered execution (D-010)

### Next action

Owner/Toby 다음 stage 승인 대기. 후속 task 미시작.

### Handoff note

T-103 is closed by Owner/Toby after Any final Approve with no added findings. No next task was marked READY or started in this closeout.

---

## 2026-07-15 — Hank — T-103 implementation

### Goal

Implement the approved T-103 RLS policy migration after Any's `Approve with changes` review and Owner/Toby acceptance of D-012.

### Work performed

1. Confirmed preflight: T-102 `DONE`, T-103 `IN_PROGRESS`, Any T-103 verdict `Approve with changes` with one Medium and one Low finding, one active T-102 migration, T-103 migration absent before creation, no SQL execution or Supabase connection recorded.
2. Created `supabase/migrations/20260715000002_rls_policies.sql`.
3. Added D-012 Accepted decision to `DECISION_LOG.md`.
4. Implemented 16 operation-specific RLS policies targeting `authenticated`.
5. Applied Any's accepted changes: simple owner RLS for owner tables, no parent/visit `EXISTS` subqueries, security tests limited to RLS-01 through RLS-14.
6. Set T-103 to `REVIEW`.
7. SQL execution, tests, Supabase connection, package/CLI install, React/env edits, Git commit/push, and T-104 were not performed.

### Files changed

- `supabase/migrations/20260715000002_rls_policies.sql` — T-103 RLS policy migration
- `DECISION_LOG.md` — D-012 Accepted
- `TASK_BOARD.md` — T-103 `REVIEW`
- `WORK_LOG.md` — this implementation entry
- `docs/chat/hank-chat.md` — implementation handoff

### Validation command/check and result

| Check | Result |
|---|---|
| Active migration files | OK: `20260715000001_initial_schema.sql`, `20260715000002_rls_policies.sql` |
| T-103 `CREATE POLICY` count | OK: 16 |
| Target role | OK: 16 `to authenticated` |
| `FOR ALL` | OK: 0 |
| Operation counts | OK: SELECT 5, INSERT 4, UPDATE 4, DELETE 3 |
| UPDATE shape | OK: each update policy has both `USING` and `WITH CHECK` |
| INSERT shape | OK: insert policies use `WITH CHECK` and no `USING` |
| DELETE shape | OK: delete policies use `USING` and no `WITH CHECK` |
| Owner-table `EXISTS` subquery | OK: none |
| `USING (true)` | OK: only authenticated `places` SELECT |
| anon/service-role policy | OK: none |
| `DROP` / URL / password / access token / API key / connection string | OK |
| T-102 migration | Not modified in this implementation |
| SQL/test execution | Not executed |

### Findings/risks

- T-103 is a static SQL artifact only. It still needs Any final review and Owner approval before any ordered Supabase execution.

### Decisions needed

- Any final review of T-103 migration.
- Owner/Toby approval before SQL execution with T-102/T-103 ordered migration.

### Next action

Any reviews `supabase/migrations/20260715000002_rls_policies.sql`.

### Handoff note

T-103 implementation is complete for static review. Policy counts match the approved design. No SQL was executed and no Supabase project was connected. T-103 is `REVIEW`; T-104 was not started.

---

## 2026-07-15 — Hank — T-103 planning

### Goal

T-103 planning phase only: design the RLS policy matrix and reproducible security test plan for `profiles`, `places`, `user_restaurants`, `visits`, and `menu_reviews`.

### Work performed

1. Read `docs/prompts/T103_HANK_RLS_PLAN.md` and required project context.
2. Completed preflight: T-102 is `DONE`, T-103 was `READY`, Any final T-102 verdict is `Approve`, one active migration exists, and no SQL/Supabase execution is recorded.
3. Set T-103 to `IN_PROGRESS`.
4. Wrote the policy matrix, index review, next migration filename proposal, and security test matrix in `docs/chat/hank-chat.md`.

### Files changed

- `TASK_BOARD.md` — T-103 set to `IN_PROGRESS`
- `WORK_LOG.md` — this planning entry
- `docs/chat/hank-chat.md` — complete signed T-103 planning handoff

### Validation command/check and result

| Check | Result |
|---|---|
| T-102 current row | OK: one active row, `DONE` |
| T-103 current row | OK: one active row, `READY` before update |
| Any final T-102 verdict | OK: `Approve` |
| Active schema migration | OK: only `20260715000001_initial_schema.sql` |
| SQL/Supabase execution | Not performed; no connection created |
| SQL file creation | Not performed |

### Findings/risks

- Recommended policy plan requires separate SQL migration review before execution.
- `places` is recommended as authenticated read-only for Phase 1; browser writes remain denied.

### Decisions needed

- Any review of T-103 plan.
- Owner/Toby approval before creating or executing the future RLS policy migration.

### Next action

Await Any review and Owner/Toby approval. Do not create SQL migration until approved.

### Handoff note

T-103 is in planning only. No SQL file was created or executed. No Supabase project was connected. No React, env, Git, or later task work was performed.

---

## 2026-07-15 — Gini — T-102 final approval / closeout (docs only)

### Goal

Owner/Toby의 T-102 최종 승인을 보드·로그·chat에 반영하고 task를 종료합니다. SQL/Migration/React/Supabase/Git은 수정하지 않습니다.

### Work performed

1. Any 최종 판정 `Approve` (findings 0) 및 Owner/Toby T-102 최종 승인 확인
2. `TASK_BOARD.md`: T-102 → `DONE`, T-103 → `READY` (시작하지 않음)
3. `WORK_LOG.md` / `docs/chat/gini-chat.md`에 종료 정리 기록
4. Migration SQL 실행, schema 변경, React/Supabase/Git, T-103 구현 **미수행**

### Files changed

- `TASK_BOARD.md` — T-102 DONE, T-103 READY, immediate next action
- `WORK_LOG.md` — 본 항목
- `docs/chat/gini-chat.md` — T-102 closeout (서명: Gini)

### Validation

- Documentation status only; no SQL execution
- Active migration artifact remains `supabase/migrations/20260715000001_initial_schema.sql` (unchanged by this closeout)

### Findings/risks

- Schema is reviewed and accepted as a static artifact; production/Supabase apply still blocked until T-103 + Owner ordered execution (D-010)

### Next action

Owner/Toby T-103 시작 승인 대기. Gini는 T-103을 시작하지 않음.

### Handoff note

T-102 is closed by Owner/Toby after Any final Approve (findings 0). T-103 is READY only. No implementation started in this closeout.

---

## 2026-07-15 — Hank — T-102 correction after Any review

### Goal

Any review after T-102 identified two accepted corrections in `docs/prompts/T102_HANK_CORRECTION_AFTER_ANY_REVIEW.md`: change the optional menu-to-visit FK delete action and rename the migration file to Supabase timestamp format.

### Work performed

1. Read the correction prompt and required T-102 context.
2. Changed `menu_reviews_visit_owner_restaurant_fk` from `ON DELETE RESTRICT` to `ON DELETE SET NULL (visit_id)`.
3. Renamed the active migration file from `20260715_001_initial_schema.sql` to `20260715000001_initial_schema.sql`.
4. Did not start T-103 and did not execute SQL.

### Files changed

- `supabase/migrations/20260715000001_initial_schema.sql` — active T-102 migration artifact
- `WORK_LOG.md` — this correction entry
- `docs/chat/hank-chat.md` — correction handoff

### Validation command/check and result

| Check | Result |
|---|---|
| One active T-102 migration file | OK: only `20260715000001_initial_schema.sql` exists in `supabase/migrations` |
| Optional visit FK action | OK: `ON DELETE SET NULL (visit_id)` |
| FK preserved columns | OK: FK remains `(user_id, restaurant_id, visit_id)` and only `visit_id` is nulled on visit delete |
| RLS enablement | OK: all five tables still enable RLS |
| Policy SQL absent | OK: no `CREATE POLICY` / `ALTER POLICY` |
| `DROP` / secret / URL / password / token scan | OK |
| SQL execution | Not executed by design |

### Findings/risks

- `DECISION_LOG.md` still needs the accepted D-011 correction entry requested by the prompt; the attempted patch was blocked by governance approval safeguards.
- T-102 remains `REVIEW` and awaits final review.

### Decisions needed

- Owner/Toby: explicitly approve adding the D-011 decision-log entry that supersedes only the `ON DELETE RESTRICT` portion of D-010.

### Next action

Final review of corrected T-102 migration after the D-011 log entry is approved or separately handled.

### Handoff note

The active local migration artifact is `supabase/migrations/20260715000001_initial_schema.sql`. The optional visit FK now uses `ON DELETE SET NULL (visit_id)`. No SQL, Supabase connection, package install, React edit, commit, push, deploy, or T-103 work occurred. T-102 remains in `REVIEW`.

---

## 2026-07-15 — Hank — T-102

### Goal

Owner/Toby가 확정한 T-102 schema 결정을 반영해 실행하지 않은 초기 schema migration SQL 파일을 작성하고 정적으로 검증합니다.

### Work performed

1. `TOBY_OPERATING_GUIDE.md`, `AGENTS.md` Required reading order, current chat, T-102 implementation prompt 확인
2. `supabase/migrations/20260715_001_initial_schema.sql` 작성
3. `profiles`, `places`, `user_restaurants`, `visits`, `menu_reviews` 5개 table 정의
4. owner-first composite UNIQUE/FK로 parent/child owner mismatch 방지
5. `updated_at` function과 5개 trigger 작성
6. Phase 1용 최소 index 작성
7. 5개 table 모두 `ENABLE ROW LEVEL SECURITY`; policy SQL은 T-103으로 보류
8. `DECISION_LOG.md`에 D-010 Accepted 기록
9. SQL 실행, Supabase 연결, package/CLI 설치, React 수정, commit/push 미수행

### Files changed

- `supabase/migrations/20260715_001_initial_schema.sql` — initial schema migration SQL
- `DECISION_LOG.md` — D-010 initial schema integrity decision
- `TASK_BOARD.md` — T-102 `REVIEW`
- `WORK_LOG.md` — 본 항목
- `docs/chat/hank-chat.md` — T-102 implementation result and Any review request

### Validation command/check and result

| Check | Result |
|---|---|
| SQL creation/dependency order review | OK: function → parent/shared tables → owner parent → children → indexes → triggers → RLS |
| Composite UNIQUE/FK order | OK: owner-first `user_id, id`; child FK order matches |
| Optional visit FK | OK: `(user_id, restaurant_id, visit_id)` → `visits(user_id, restaurant_id, id)`, `ON DELETE RESTRICT` |
| RLS enablement | OK: all five tables have `ENABLE ROW LEVEL SECURITY` |
| Policy SQL absent | OK: no `create policy` / `alter policy` |
| `pgcrypto` extension absent | OK |
| Secret/URL/password/token scan | OK |
| Destructive DROP scan | OK |
| SQL execution | Not executed by design |

### Findings/risks

- `ON DELETE RESTRICT` on optional menu-to-visit FK is conservative and matches T-102 prompt; Any should review interaction with restaurant-level cascade before external execution.
- With RLS enabled and no policies, browser/client table access is default-deny until T-103 policies are created and applied in the approved order.

### Decisions needed

- Any: independent review of T-102 migration SQL
- Owner/Toby: after T-102 and T-103 are both reviewed, approve one ordered external execution if appropriate

### Next action

Any reviews T-102. Hank does not start T-103 until assigned/approved.

### Handoff note

Migration SQL is a local artifact only. No Supabase connection or SQL execution occurred. No secrets were added. T-102 is in REVIEW.

---

## 2026-07-15 — Gini — T-101 closeout (D-009 + package name)

### Goal

B-006을 D-009로 해결하고 package name을 `tastelog`로 맞춰 T-101을 DONE으로 닫습니다.

### Work performed

1. 빈 `.git/` 재확인 (ChildCount=0, no HEAD/config/objects, not a repo) → 삭제하지 않음
2. `git init -b main`으로 로컬 repository 초기화 (commit/remote/push 없음)
3. `.agents/` 유지 (수정·삭제 없음)
4. `npm.cmd pkg set name=tastelog` → `npm.cmd install`
5. `npm.cmd pkg get name` / `run build` / `run lint` / `git status --short` 검증
6. `DECISION_LOG.md`에 D-009 Accepted 기록

### Commands and results

| Command | Exit / result |
|---|---|
| `git init -b main` | 0; empty repo on `main` |
| `git status` | works; no commits yet; untracked sources listed |
| `git branch --show-current` | `main` |
| `git remote -v` | empty |
| `git rev-list --count --all` | `0` |
| `npm.cmd pkg set name=tastelog` | 0 |
| `npm.cmd install` | 0; up to date; 0 vulnerabilities |
| `npm.cmd pkg get name` | `"tastelog"` |
| `npm.cmd run build` | 0 |
| `npm.cmd run lint` | 0 (`oxlint`) |

### Files changed

- `package.json`, `package-lock.json` — root name `tastelog`
- `.git/` — initialized local metadata (no commits)
- `DECISION_LOG.md`, `TASK_BOARD.md`, `WORK_LOG.md`, `docs/chat/gini-chat.md`

### Git / ignore checks

- `node_modules/`, `dist/`, real `.env` not listed in `git status --short`
- `.env.example` appears as untracked (expected)
- `.agents/` present and untouched
- No remotes; no commits; no `git add`/`commit`/`push`

### Preservation

- Markdown 18 (includes `TOBY_OPERATING_GUIDE.md`)
- Root `README.md` Collaboration Pack preserved
- No Supabase/UI library packages added

### Warnings

- npm `Unknown env config "devdir"` (non-blocking) on npm commands

### Next action

Owner/Toby 승인 대기. T-102·commit·GitHub·Supabase 미시작.

### Handoff note

T-101 DONE. Local git ready on `main` without history or remotes. Package identity is `tastelog`. Next implementation needs explicit Owner/Toby assignment.

---

## 2026-07-15 — Gini — T-101 follow-up (package name) BLOCKED

### Goal

Hank Approve-with-changes 수용 후 `package.json` name을 `tastelog`로 바꿔 T-101을 DONE으로 닫기.

### Work performed

- Pre-check만 실행. `npm.cmd pkg set` / install / build / lint **미실행**
- Markdown 18개 확인 (`TOBY_OPERATING_GUIDE.md` 포함)
- `package.json` name 현재: `"tastelog-vite-temp"`
- `.agents/`: empty, 존재 — Owner 지침대로 **유지**, 수정 없음
- `.git/`: **재출현** — empty directory (ChildCount=0), `git status` → `fatal: not a git repository`, no `.git/HEAD`
- 이번 허용 변경 범위에 `.git` 삭제가 없어 삭제하지 않고 중단

### Files changed

- `TASK_BOARD.md` — B-006, immediate next action
- `WORK_LOG.md` — 본 항목
- `docs/chat/gini-chat.md` — 중단 보고
- `package.json` / `package-lock.json` — **미변경**

### Validation

| Check | Result |
|---|---|
| `package.json` / lock present | yes |
| name | still `tastelog-vite-temp` |
| Markdown 18 | yes |
| root README | present |
| `.env` | absent |
| `.git` | unexpected empty dir present |
| `.agents` | present (kept) |

### Decisions needed

- Owner: 빈 `.git/` 다시 삭제 승인 여부 (B-005와 동일 패턴)
- 승인 후: `npm.cmd pkg set name=tastelog` → install → build → lint → T-101 DONE

### Next action

Owner 결정 대기. package rename 미착수.

### Handoff note

완료 기준에 `.git` 없음이 포함되어 있고, 허용 파일 목록에 `.git` 삭제가 없어 follow-up을 멈춤. `.agents`는 유지.

---

## 2026-07-15 — Gini — T-101

### Goal

B-005 조건부 삭제 후 Vite React foundation을 병합형 scaffold로 root에 구성하고 install/build/dev를 검증합니다.

### Work performed

1. `.git/`·`.agents/` 재확인: 둘 다 empty directory, ChildCount=0, `.git` not a real repo → Owner 승인에 따라 삭제, 경로 gone
2. Conflict checklist 재확인 후 `npm.cmd create vite@latest tastelog-vite-temp -- --template react`
3. Move only: `package.json`, `vite.config.js`, `index.html`, `src/`, `public/`, `.gitignore` (temp `README.md`·`.oxlintrc.json` 미이동)
4. `.gitignore`에 `node_modules/`, `dist/`, `dist-ssr/`, `.env`, `.env.*`, `!.env.example` 확보
5. `.env.example`에 `VITE_SUPABASE_URL=` / `VITE_SUPABASE_ANON_KEY=` 변수명만
6. `tastelog-vite-temp` 제거 (잔여: Vite README + `.oxlintrc.json`)
7. `npm.cmd install` → `npm.cmd run build` → `npm.cmd run dev -- --host 127.0.0.1` smoke → 서버 종료
8. git init / Supabase package / UI library / 외부 설정 / T-102 **미수행**

### Files changed / created

- Created: `package.json`, `package-lock.json`, `vite.config.js`, `index.html`, `src/**`, `public/**`, `.gitignore`, `.env.example`, `node_modules/**`, `dist/**` (build artifact)
- Deleted: empty `.git/`, empty `.agents/`, `tastelog-vite-temp/`
- Updated: `TASK_BOARD.md`, `WORK_LOG.md`, `docs/chat/gini-chat.md`
- Preserved: collaboration Markdown 17개, root `README.md` (Collaboration Pack)

### Validation command/check and result

| Check | Result |
|---|---|
| B-005 delete | `.git` / `.agents` gone |
| `npm.cmd install` | exit 0; lockfile created; 0 vulnerabilities |
| `npm.cmd run build` | exit 0; Vite 8.1.4 built in ~283ms |
| Dev smoke | `http://127.0.0.1:5173/` HTTP 200; `#root`/main present; `/src/main.jsx` 200; server stopped (port 5173 closed) |
| Markdown 17 | OK |
| `.env` / secrets | none |
| Supabase/UI lib | not installed |
| `.git` | still absent (no git init) |

### Warnings / risks

- npm warn: `Unknown env config "devdir"` (environment npmrc; build/dev OK)
- npm notice: newer npm 12 available (not acted on)
- create-vite template includes `oxlint` + `lint` script; `.oxlintrc.json` was left in temp and discarded with temp (not an approved move target). `npm run lint`는 아직 검증하지 않음
- `package.json` `"name"` remains `tastelog-vite-temp` (template default)
- B-001 GitHub URL still open; package name rename optional for later

### Decisions needed

- Hank REVIEW of T-101
- Optional later: package name rename; whether to restore `.oxlintrc.json` if lint is desired

### Next action

Hank review. Do not start T-102 until Owner/Toby approve next stage.

### Handoff note

Foundation is ready locally. No secrets, no git repo, no Supabase client. Dev server is stopped. Reviewer: Hank.

---

## 2026-07-15 — Gini — T-101 (BLOCKED before scaffold)

### Goal

승인된 T-101 Vite React foundation을 Hank 절차대로 시작하기 전 root 충돌 재확인.

### Work performed

- `AGENTS.md`, `TASK_BOARD.md`, `gini-chat.md`, `hank-chat.md`, `WORK_LOG.md` 재확인
- Root conflict checklist 실행 (`package.json`, `vite.config.*`, `index.html`, `src`, `public`, `.gitignore`, `.env`, `tastelog-vite-temp` → 모두 absent)
- 예상 밖 항목 발견: 빈 `.git/`·`.agents/` (ChildCount=0, `git status`는 “not a git repository”)
- Vite scaffold / npm install / file move **미실행** (중단 규칙 준수; 삭제·덮어쓰기 없음)

### Files changed

- `TASK_BOARD.md` — T-101 `BLOCKED`, B-005, immediate next action
- `WORK_LOG.md` — 본 항목
- `docs/chat/gini-chat.md` — T-101 중단 보고

### Validation command/check and result

- Conflict targets for merge: all absent (진행 가능 조건 충족)
- Unexpected: `.git` empty dir exists; `.agents` empty dir exists
- Collaboration Markdown still 17; root `README.md` preserved
- No `tastelog-vite-temp` created

### Findings/risks

- T-100 inventory에는 `.git`/`.agents`가 없었음. T-101 승인 지시의 “git init 안 함”과 root 상태 충돌 가능
- 빈 `.git`은 정식 repo가 아니나 이후 `git init`·도구 동작에 혼동 가능
- 출처 미확인 → 삭제하지 않음

### Decisions needed

- Owner: `.git/`·`.agents/` 유지 / 삭제 / 다른 처리 지시
- Owner/Toby: 처리 후 T-101 재개 승인

### Next action

Owner 결정 대기. 승인 전 scaffold 재개하지 않음.

### Handoff note

T-101은 pre-check에서 중단됨. Hank가 지정한 Vite merge 대상과 충돌하는 파일은 없음. 문제는 예상치 못한 빈 `.git`·`.agents`. React/Vite는 아직 없음.

---

## 2026-07-15 — Gini — T-100

### Goal

실제 project root 현황을 확인하고, React 설치 없이 T-101용 손실 없는 Vite 실행 계획을 남깁니다.

### Work performed

- `AGENTS.md` Required reading order 및 모든 current chat 문서 읽기
- Root file inventory (17 Markdown files; no `package.json` / `src` / Git / `.env`)
- Node `v24.18.0`, npm `11.16.0` 확인
- T-101: non-empty root용 병합형 scaffold, 보존 파일, validation, Owner 질문 정리
- React/Vite **미설치**, 앱 코드 **미작성**

### Files changed

- `docs/chat/gini-chat.md` — T-100 inventory·T-101 계획 (서명: Gini)
- `TASK_BOARD.md` — T-100 `DONE`, T-101 `READY`, immediate next action 갱신
- `WORK_LOG.md` — 본 항목

### Validation

- `Get-ChildItem -Recurse -Force -File`로 file list 확인
- `.git` 없음, `package.json` 없음 확인
- `node -v` / `npm -v` 확인
- install/build **미실행** (의도적)

### Findings or risks

- Root는 협업 pack only → 기존 앱 코드 덮어쓰기 위험 없음
- 디렉터리 non-empty → `create vite` 직접 `.` 실행 시 문서 충돌 위험 → 임시 folder merge 권장
- `README.md`는 pack용; T-101에서 Vite README로 overwrite 금지
- B-001 GitHub URL, D-008 UI style은 T-101 blocking 아님; `git init` 여부는 Owner 확인 필요

### Decisions needed

- Owner/Toby: T-101 시작 승인
- Owner: T-101에서 `git init` 여부
- Hank: T-100 inventory review

### Next action

Hank review → Owner/Toby T-101 승인 → Gini T-101만 실행

### Handoff note

Planning은 완료됐으나 implementation은 시작 전입니다. Gini는 T-100만 완료했고 scaffold는 승인 대기입니다. secret·외부 project·SQL·deploy는 Owner 통제입니다.

---

## 2026-07-15 — Toby — P-001

### Goal

과제 개발기획서와 기존 협업 template을 근거로 Phase 1 착수용 공통 문서를 완성합니다.

### Work performed

- 7쪽 개발기획서의 범위, schema, UI, 구현 순서, 테스트, 보안, 제출 조건 분석
- project context, decisions, task assignment, agent instructions 구체화
- 요구사항, DB/RLS, 테스트·제출 명세 추가
- Agent chat files를 첫 착수 의견 형식으로 초기화

### Files changed

- 협업 pack 내 Markdown 문서 전체

### Validation

- 원본 ZIP file inventory 확인
- PDF text extraction 및 7-page content 확인
- Markdown link/path와 task/decision ID 상호 점검 예정
- 구현 코드·Supabase·GitHub·Vercel은 아직 변경하지 않음

### Findings or risks

- 일정이 짧으므로 scope creep가 가장 큰 위험입니다.
- RLS는 UI 동작만으로 검증할 수 없고 두 사용자 교차 접근 test가 필요합니다.
- 실제 repository 상태는 아직 보지 못했으므로 T-100에서 확인해야 합니다.

### Decisions needed

- D-007 final name
- D-008 UI style
- 실제 repository/Supabase/Vercel 연결 정보(비밀정보는 문서에 기록 금지)

### Next action

Owner가 pack을 project root에 놓고 Gini에게 T-100만 배정합니다.

### Handoff note

현재는 planning complete, implementation not started 상태입니다. Agent는 AGENTS.md 순서대로 문서를 읽고 자기 task만 수행해야 합니다. 외부 변경과 secret 입력은 Owner가 통제합니다.

---

## Entry template

### YYYY-MM-DD HH:MM — [Agent] — [Task ID]

- Goal:
- Work performed:
- Files changed:
- Validation command/check and result:
- Findings/risks:
- Decisions needed:
- Next action:
- Handoff note (3–7 lines):
