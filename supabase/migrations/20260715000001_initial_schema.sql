-- TasteLog Phase 1 - T-102 initial schema migration
-- Scope: tables, constraints, indexes, updated_at triggers, and RLS enablement only.
-- Do not execute this migration externally until T-102 and T-103 are both reviewed
-- and Owner approves the ordered execution.
-- RLS policies are intentionally deferred to T-103. With RLS enabled and no
-- policies, browser/client access defaults to deny.

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint profiles_username_not_blank
    check (username is null or btrim(username) <> '')
);

create table public.places (
  id uuid primary key default gen_random_uuid(),
  official_name text not null,
  address text,
  phone text,
  map_url text,
  lat numeric(9, 6),
  lng numeric(9, 6),
  provider text,
  external_place_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint places_official_name_not_blank
    check (btrim(official_name) <> ''),
  constraint places_lat_valid
    check (lat is null or (lat >= -90 and lat <= 90)),
  constraint places_lng_valid
    check (lng is null or (lng >= -180 and lng <= 180))
);

create table public.user_restaurants (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  place_id uuid references public.places(id) on delete set null,
  display_name text not null,
  area_hint text,
  category text,
  recommendation_note text,
  status text not null default 'unvisited',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint user_restaurants_owner_id_unique
    unique (user_id, id),
  constraint user_restaurants_display_name_not_blank
    check (btrim(display_name) <> ''),
  constraint user_restaurants_status_valid
    check (status in ('unvisited', 'visited'))
);

create table public.visits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  restaurant_id uuid not null,
  visited_at date,
  overall_rating smallint,
  visit_note text,
  revisit_intention boolean not null default false,
  revisit_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint visits_owner_restaurant_id_unique
    unique (user_id, restaurant_id, id),
  constraint visits_restaurant_owner_fk
    foreign key (user_id, restaurant_id)
    references public.user_restaurants(user_id, id)
    on delete cascade,
  constraint visits_overall_rating_valid
    check (overall_rating is null or (overall_rating >= 1 and overall_rating <= 5))
);

create table public.menu_reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  restaurant_id uuid not null,
  visit_id uuid,
  menu_name text not null,
  price integer,
  taste_rating smallint,
  memo text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint menu_reviews_restaurant_owner_fk
    foreign key (user_id, restaurant_id)
    references public.user_restaurants(user_id, id)
    on delete cascade,
  constraint menu_reviews_visit_owner_restaurant_fk
    foreign key (user_id, restaurant_id, visit_id)
    references public.visits(user_id, restaurant_id, id)
    on delete set null (visit_id),
  constraint menu_reviews_menu_name_not_blank
    check (btrim(menu_name) <> ''),
  constraint menu_reviews_price_valid
    check (price is null or price >= 0),
  constraint menu_reviews_taste_rating_valid
    check (taste_rating is null or (taste_rating >= 1 and taste_rating <= 5))
);

-- Phase 1 owner-scoped list/filter/sort queries.
create index user_restaurants_user_status_idx
  on public.user_restaurants(user_id, status);

create index user_restaurants_user_updated_at_idx
  on public.user_restaurants(user_id, updated_at desc);

-- Restaurant detail and deterministic latest/representative visit lookup.
create index visits_user_restaurant_visited_at_idx
  on public.visits(user_id, restaurant_id, visited_at desc);

-- Dashboard revisit filtering/counts.
create index visits_user_revisit_intention_idx
  on public.visits(user_id, revisit_intention);

-- Restaurant detail menu review loading and FK support.
create index menu_reviews_user_restaurant_idx
  on public.menu_reviews(user_id, restaurant_id);

-- Optional visit-linked menu lookup. MATCH SIMPLE lets null visit_id represent
-- "not linked to a visit"; this partial index covers only linked rows.
create index menu_reviews_user_restaurant_visit_idx
  on public.menu_reviews(user_id, restaurant_id, visit_id)
  where visit_id is not null;

create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger set_places_updated_at
before update on public.places
for each row execute function public.set_updated_at();

create trigger set_user_restaurants_updated_at
before update on public.user_restaurants
for each row execute function public.set_updated_at();

create trigger set_visits_updated_at
before update on public.visits
for each row execute function public.set_updated_at();

create trigger set_menu_reviews_updated_at
before update on public.menu_reviews
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.places enable row level security;
alter table public.user_restaurants enable row level security;
alter table public.visits enable row level security;
alter table public.menu_reviews enable row level security;

comment on table public.profiles is
  'TasteLog user profile rows. RLS is enabled; policies are added in T-103.';

comment on table public.places is
  'Shared official place rows prepared for nullable links. RLS is enabled; policies are added in T-103.';

comment on table public.user_restaurants is
  'User-owned restaurant records. display_name is the only required create field.';

comment on table public.visits is
  'User-owned restaurant visits. Owner consistency is enforced through composite foreign keys.';

comment on table public.menu_reviews is
  'User-owned menu reviews. visit_id is optional and constrained to the same owner and restaurant when present.';
