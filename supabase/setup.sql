-- Job applications for the portfolio site.
-- Run once in Supabase: Dashboard → SQL Editor → New query → paste → Run.

-- 1. Table (fields follow the applicantinfo schema, plus contact and job details)
create table if not exists public.applicants (
  id               integer generated always as identity primary key,  -- ID NO
  name             varchar(150) not null,
  email            varchar(200) not null,
  mobile_number    varchar(30)  not null,
  country          varchar(100) not null,
  nationality      varchar(100),
  position         varchar(150) not null,
  experience_years numeric(4,1) check (experience_years >= 0),
  visa_status      varchar(60),
  notice_period    varchar(40),
  current_salary   numeric(12,2),
  expected_salary  numeric(12,2),
  linkedin         varchar(300),
  message          text check (char_length(message) <= 5000),
  cv_filename      varchar(255),
  cv_path          varchar(400),   -- file in the private "cvs" storage bucket
  created_at       timestamptz not null default now()
);
create index if not exists idx_applicants_position on public.applicants (position);
create index if not exists idx_applicants_country  on public.applicants (country);

-- 2. Security: anyone can submit, only the admin can read or delete.
alter table public.applicants enable row level security;

drop policy if exists "anyone can apply" on public.applicants;
create policy "anyone can apply" on public.applicants
  for insert to anon, authenticated with check (true);

drop policy if exists "admin reads applications" on public.applicants;
create policy "admin reads applications" on public.applicants
  for select to authenticated using ((auth.jwt() ->> 'email') = 'mohsinshahzad942@gmail.com');

drop policy if exists "admin deletes applications" on public.applicants;
create policy "admin deletes applications" on public.applicants
  for delete to authenticated using ((auth.jwt() ->> 'email') = 'mohsinshahzad942@gmail.com');

-- 3. Private bucket for CVs (PDF only, 5 MB max)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('cvs', 'cvs', false, 5242880, array['application/pdf'])
on conflict (id) do update set public = false, file_size_limit = 5242880, allowed_mime_types = array['application/pdf'];

drop policy if exists "anyone can upload a cv" on storage.objects;
create policy "anyone can upload a cv" on storage.objects
  for insert to anon, authenticated with check (bucket_id = 'cvs');

drop policy if exists "admin reads cvs" on storage.objects;
create policy "admin reads cvs" on storage.objects
  for select to authenticated using (bucket_id = 'cvs' and (auth.jwt() ->> 'email') = 'mohsinshahzad942@gmail.com');

drop policy if exists "admin deletes cvs" on storage.objects;
create policy "admin deletes cvs" on storage.objects
  for delete to authenticated using (bucket_id = 'cvs' and (auth.jwt() ->> 'email') = 'mohsinshahzad942@gmail.com');
