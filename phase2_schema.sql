-- ==========================================
-- 1. Company Settings
-- ==========================================
create table if not exists company_settings (
  company_id uuid references companies(id) on delete cascade primary key,
  work_interval_minutes integer default 60 not null,  -- e.g., 60 mins work
  break_duration_minutes integer default 2 not null,  -- e.g., 2 mins break
  start_hour integer default 9 not null,              -- 9 AM
  end_hour integer default 17 not null,               -- 5 PM
  work_days text[] default '{"Mon", "Tue", "Wed", "Thu", "Fri"}'::text[],
  timezone text default 'UTC',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table company_settings enable row level security;

-- Policies
create policy "Public read settings" on company_settings for select using (true);
create policy "HR update settings" on company_settings for update using (
  auth.uid() in (
    select id from profiles where company_id = company_settings.company_id and role = 'hr'
  )
);
create policy "HR insert settings" on company_settings for insert with check (
  auth.uid() in (
    select id from profiles where company_id = company_settings.company_id and role = 'hr'
  )
);

-- ==========================================
-- 2. Exercises (The Content)
-- ==========================================
create table if not exists exercises (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  category text check (category in ('stretch', 'eye', 'breath', 'cardio')),
  duration_seconds integer default 60,
  video_url text, -- valid URL or null
  gif_url text,   -- valid URL or null (for lightweight preview)
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table exercises enable row level security;
create policy "Public read exercises" on exercises for select using (true);
-- Only service role can insert/update (managed by system)

-- ==========================================
-- 3. Break Logs (Analytics)
-- ==========================================
create table if not exists break_logs (
  id uuid default gen_random_uuid() primary key,
  employee_id uuid references employees(id) on delete cascade not null,
  company_id uuid references companies(id) on delete cascade not null,
  exercise_id uuid references exercises(id),
  completed_at timestamp with time zone default timezone('utc'::text, now()) not null,
  duration_seconds integer not null,
  mood_rating integer, -- Optional: 1-5 rating after break
  skipped boolean default false
);

alter table break_logs enable row level security;

-- Policies
create policy "Employees can read own logs" on break_logs for select using (
  auth.uid() in (select auth_user_id from employees where id = break_logs.employee_id)
);
create policy "Employees can insert own logs" on break_logs for insert with check (
  auth.uid() in (select auth_user_id from employees where id = break_logs.employee_id)
);
create policy "HR can read company logs" on break_logs for select using (
  auth.uid() in (
    select id from profiles where company_id = break_logs.company_id and role = 'hr'
  )
);

-- Note: We assume 'sessions' table was already created in previous step. 
-- If not, redo specific policies if generic 'sessions' was too broad.
