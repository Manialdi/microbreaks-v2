-- Microbreaks Personal - Simplified Schema

-- 1. Profiles (Extends auth.users)
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text,
  is_pro boolean default false,
  stripe_customer_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Profiles
alter table public.profiles enable row level security;
create policy "Users can read own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Function to handle new user signup
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- 2. Personal Logs (Syncs from Extension)
create table public.personal_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  duration_seconds integer not null,
  completed_at timestamp with time zone not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Logs
alter table public.personal_logs enable row level security;
create policy "Users can insert own logs" on public.personal_logs for insert with check (auth.uid() = user_id);
create policy "Users can read own logs" on public.personal_logs for select using (auth.uid() = user_id);
