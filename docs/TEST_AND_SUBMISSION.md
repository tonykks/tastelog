# Test and Submission Plan

## Core acceptance scenarios

| ID | Scenario | Expected evidence |
|---|---|---|
| T1 | New account sign-up/login | Empty dashboard screenshot; session state correct |
| T2 | Create with restaurant name only | Row saved with nullable place/optional fields |
| T3 | Edit area/recommendation | Only selected row changes |
| T4 | Mark visited, rating 5 | Visit saved; list/detail show rating/status |
| T5 | Add two menu reviews | Two rows persist with valid price/rating |
| T6 | Search/filter/sort | Visible results match conditions; unrated behavior noted |
| T7 | Login as second account | First account data invisible; UUID attack attempts rejected |
| T8 | Cancel then confirm delete | Cancel preserves; confirm removes intended parent/children |
| T9 | Browser refresh | Session and DB data persist |
| T10 | Vercel mobile/desktop | No broken layout; core CRUD works |

## Technical checks

- install succeeds from lockfile
- lint (if configured) passes
- production build passes
- browser console has no unresolved runtime error
- environment variable missing state fails safely
- `.env` and secrets absent from Git history/current tracked files
- Auth/RLS tests recorded separately from UI tests

## README required sections

1. Project overview and one-line definition
2. Main CRUD/features
3. Tech stack
4. Data model and relationships
5. Auth/RLS policy summary
6. Local setup and environment variable names
7. AI use record (request, generated result, human review/change)
8. Error-resolution record (error, cause, change, retest)
9. Security checklist
10. Limitations and future improvements
11. GitHub and Vercel URLs

## Required screenshots

- Auth screen/login success
- Empty dashboard
- Restaurant list and quick create
- Edit/visit/rating/revisit
- Menu add/edit/delete
- Search/filter/ranking
- Delete confirmation
- Error state (safe demo if practical)
- Mobile production view

Screenshots must not expose email, tokens, keys, database connection strings, or unnecessary personal data.

## Submission gate

- [ ] Restaurant Read/Create/Update/Delete all work
- [ ] Supabase persistence after refresh
- [ ] Auth and owner-only RLS verified with two accounts
- [ ] Name-only create works
- [ ] Visit/rating/note/revisit edit works
- [ ] Menu review CRUD works
- [ ] Search/filter/rating sort works
- [ ] Loading/empty/error states visible
- [ ] Responsive mobile and desktop verified
- [ ] GitHub main contains source and complete README
- [ ] Vercel production URL smoke-tested
- [ ] No secret in source, docs, screenshots, Git
- [ ] AI prompt/review and error-resolution evidence included
- [ ] Known limitations explicitly stated

## Final review responsibility

- Implementer supplies commands, screenshots, and URLs.
- Hank performs code/security/test review.
- Any may provide targeted independent risk review without editing.
- Toby compares evidence against this checklist.
- Owner gives final submission approval.
