-- Phase 9: editable homepage hero and category images
create table if not exists public.site_settings (
  id boolean primary key default true check (id),
  hero_image_url text,
  updated_at timestamptz not null default now()
);

insert into public.site_settings (id, hero_image_url)
values (true, null)
on conflict (id) do nothing;

create trigger site_settings_set_updated_at
before update on public.site_settings
for each row execute function public.set_updated_at();

alter table public.site_settings enable row level security;

create policy "public can read site settings"
on public.site_settings for select
to anon, authenticated
using (true);

create policy "admins can manage site settings"
on public.site_settings for all
to authenticated
using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
with check ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
