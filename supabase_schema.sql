-- Membuat tabel users_profile yang tersinkronisasi dengan auth.users
create table public.users_profile (
  id uuid references auth.users on delete cascade not null primary key,
  username text unique,
  level integer default 1,
  xp integer default 0,
  hp integer default 100,
  gold integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Membuat tabel tasks (Quests)
create table public.tasks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  description text,
  type text check (type in ('daily', 'habit', 'todo')) not null,
  difficulty text check (difficulty in ('easy', 'medium', 'hard')) not null,
  status boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- --- SET ROW LEVEL SECURITY (RLS) ---
-- Aktifkan RLS pada kedua tabel
alter table public.users_profile enable row level security;
alter table public.tasks enable row level security;

-- Kebijakan untuk users_profile: User hanya bisa Insert, Select, dan Update datanya sendiri
create policy "User dapat melihat profilnya sendiri" on public.users_profile for select using (auth.uid() = id);
create policy "User dapat memperbarui profilnya sendiri" on public.users_profile for update using (auth.uid() = id);
create policy "User dapat membuat profilnya sendiri (Insert)" on public.users_profile for insert with check (auth.uid() = id);

-- Kebijakan untuk tasks: User hanya bisa Insert, Select, Update, Delete datanya sendiri
create policy "User dapat melihat tugasnya sendiri" on public.tasks for select using (auth.uid() = user_id);
create policy "User dapat menambah tugasnya sendiri" on public.tasks for insert with check (auth.uid() = user_id);
create policy "User dapat mengupdate tugasnya sendiri" on public.tasks for update using (auth.uid() = user_id);
create policy "User dapat menghapus tugasnya sendiri" on public.tasks for delete using (auth.uid() = user_id);

-- --- FUNGSI TRIGGER UNTUK USER BARU ---
-- Trigger ini akan otomatis membuat entri di users_profile ketika user baru register di auth.users
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users_profile (id, username)
  values (new.id, new.raw_user_meta_data->>'username');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
