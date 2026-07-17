-- TasteLog Phase 1 - T-103 RLS policies
-- Scope: operation-specific browser/client policies only.
-- T-102 enables RLS and enforces structural owner/parent integrity.

create policy profiles_select_own
  on public.profiles
  for select
  to authenticated
  using ((select auth.uid()) = id);

create policy profiles_insert_own
  on public.profiles
  for insert
  to authenticated
  with check ((select auth.uid()) = id);

create policy profiles_update_own
  on public.profiles
  for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create policy places_select_authenticated
  on public.places
  for select
  to authenticated
  using (true);

create policy user_restaurants_select_own
  on public.user_restaurants
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy user_restaurants_insert_own
  on public.user_restaurants
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy user_restaurants_update_own
  on public.user_restaurants
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy user_restaurants_delete_own
  on public.user_restaurants
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);

create policy visits_select_own
  on public.visits
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy visits_insert_own
  on public.visits
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy visits_update_own
  on public.visits
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy visits_delete_own
  on public.visits
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);

create policy menu_reviews_select_own
  on public.menu_reviews
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy menu_reviews_insert_own
  on public.menu_reviews
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy menu_reviews_update_own
  on public.menu_reviews
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy menu_reviews_delete_own
  on public.menu_reviews
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);
