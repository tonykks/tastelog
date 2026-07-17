# Phase 1 Requirements — TasteLog

## Functional acceptance criteria

### Authentication

- Email/ID-based sign-up and login UI is understandable.
- Login failure and expired session show a user-facing message.
- Refresh preserves a valid session; logout returns to Auth screen.
- Authenticated routes/data are not shown before session resolution.

### Restaurant Read

- Only the signed-in user's restaurants are fetched.
- List/card shows display name, area hint, status, rating/revisit indicator when available, and recent update.
- Loading, empty, and query error states are visibly distinct.
- Empty copy guides the user to save a remembered place.

### Restaurant Create

- `display_name` is the only required restaurant field.
- Optional: area hint, category, recommendation note.
- Blank/whitespace-only name is rejected before DB request.
- Success updates the list without requiring a manual refresh.
- Duplicate free-text names may be allowed; do not silently merge records.

### Restaurant Update

- User can edit display name, area hint, category, and recommendation note.
- Only the selected owner row is changed.
- Form displays validation and server errors without losing typed values.

### Visit

- User can mark visited/unvisited and edit visit date, overall rating, visit note, revisit intention/note.
- Rating is NULL or integer 1–5.
- Unvisited records may have no visit row or cleared/ignored visit fields according to the accepted implementation plan.
- Representative visit/rating selection is deterministic and documented.

### Menu review CRUD

- A restaurant can have multiple menu review rows.
- `menu_name` required; `price` optional integer >= 0; `taste_rating` optional integer 1–5; memo optional.
- Add, edit, delete are available and scoped to the owner.
- Invalid numeric values are blocked with understandable feedback.

### Delete

- Confirmation identifies the restaurant and warns that related visits/menu reviews will be removed if cascade is used.
- Cancel makes no change; confirm removes only the owner's selected restaurant and related rows.

### Search, filter, sort, dashboard

- Keyword searches at least display name; area/category may also be included if documented.
- Filter supports unvisited, visited, and revisit-intended states.
- Rating sort handles unrated records consistently.
- Dashboard displays total, unvisited, visited, revisit counts and a Top 5/ranking view when data exists.

### UI quality

- Usable at representative mobile width (about 360px) and desktop width.
- Form controls have labels; keyboard focus is visible; buttons communicate disabled/loading state.
- Modal/dialog can be dismissed safely; destructive action is visually distinct.
- No raw stack trace, secret, or technical DB error is exposed to users.

## Non-functional requirements

- Production build succeeds without blocking warnings/errors.
- Source is separated into auth, dashboard, restaurants, visits, menus, common UI, services, and Supabase client responsibilities.
- No unnecessary global state library unless a documented need is accepted.
- Database operations live behind service functions rather than being scattered across presentation components.
- README explains setup, environment variables, schema/RLS, AI use, errors, security, limitations, URLs.

## Suggested source structure

```text
src/
  components/
    auth/AuthForm.jsx
    dashboard/SummaryCards.jsx
    restaurants/RestaurantForm.jsx
    restaurants/RestaurantList.jsx
    restaurants/RestaurantCard.jsx
    restaurants/RestaurantDetail.jsx
    visits/VisitEditor.jsx
    menus/MenuReviewForm.jsx
    common/RatingStars.jsx
    common/ConfirmDialog.jsx
  pages/LoginPage.jsx
  pages/DashboardPage.jsx
  services/authService.js
  services/restaurantService.js
  services/visitService.js
  services/menuReviewService.js
  lib/supabase.js
  App.jsx
  App.css
  main.jsx
```

구조는 repository 상태에 맞춰 조정할 수 있지만 책임 분리와 acceptance criteria는 유지합니다.
