-- Bankszámlák / zsebok
create table accounts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text check (type in ('personal', 'business', 'savings')) not null,
  nordigen_id text,
  balance numeric default 0,
  last_synced_at timestamptz,
  created_at timestamptz default now()
);

-- Kategóriák
create table categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text check (type in ('income', 'expense')) not null,
  color text default '#94a3b8',
  icon text,
  is_preset boolean default false
);

-- Tranzakciók
create table transactions (
  id uuid primary key default gen_random_uuid(),
  date date not null default current_date,
  amount numeric not null,
  type text check (type in ('income', 'expense')) not null,
  category_id uuid references categories(id),
  account_id uuid references accounts(id),
  description text,
  source text check (source in ('manual', 'bank_sync', 'szamlazz')) default 'manual',
  external_id text,
  is_cash boolean default false,
  note text,
  created_at timestamptz default now()
);

-- Ismétlődő tételek
create table recurring_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  amount numeric not null,
  type text check (type in ('income', 'expense')) not null,
  category_id uuid references categories(id),
  frequency text check (frequency in ('weekly', 'monthly', 'annual')) not null,
  day_of_month int,
  next_due_date date,
  active boolean default true
);

-- Munkanapló
create table sessions (
  id uuid primary key default gen_random_uuid(),
  date date not null default current_date,
  type text not null,
  duration_minutes int,
  income numeric,
  notes text,
  transaction_id uuid references transactions(id),
  created_at timestamptz default now()
);

-- Feladatok
create table tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  due_date date,
  completed_at timestamptz,
  priority text check (priority in ('low', 'medium', 'high')) default 'medium',
  reminder_date date,
  created_at timestamptz default now()
);

-- Egyenleg pillanatképek
create table cash_snapshots (
  id uuid primary key default gen_random_uuid(),
  account_id uuid references accounts(id),
  date date not null default current_date,
  amount numeric not null,
  note text,
  created_at timestamptz default now()
);

-- Kezdeti adatok: zsebok
insert into accounts (name, type, balance) values
  ('Erste Főszámla', 'personal', 803331),
  ('Vállalkozói zseb', 'business', 0),
  ('Megtakarítás', 'savings', 0);

-- Kezdeti adatok: bevételi kategóriák
insert into categories (name, type, color, is_preset) values
  ('Pszicho praxis', 'income', '#6366f1', true),
  ('Iskola', 'income', '#8b5cf6', true),
  ('Csengery albérlet', 'income', '#ec4899', true),
  ('Workshop (online)', 'income', '#14b8a6', true),
  ('Workshop (offline)', 'income', '#0ea5e9', true),
  ('Céges együttműködés', 'income', '#f97316', true),
  ('Szakkör', 'income', '#eab308', true),
  ('Születésnap', 'income', '#84cc16', true),
  ('Zuglói tábor', 'income', '#22c55e', true),
  ('EduFun', 'income', '#06b6d4', true),
  ('Engame', 'income', '#a855f7', true),
  ('Egyéb bevétel', 'income', '#94a3b8', true);

-- Kezdeti adatok: kiadási kategóriák
insert into categories (name, type, color, is_preset) values
  ('Adó', 'expense', '#ef4444', true),
  ('Élet / megélhetés', 'expense', '#f97316', true),
  ('Pszicho franchise', 'expense', '#eab308', true),
  ('Ülések leadandó', 'expense', '#84cc16', true),
  ('Marketing', 'expense', '#06b6d4', true),
  ('Könyvelő', 'expense', '#6366f1', true),
  ('Módszerspec', 'expense', '#8b5cf6', true),
  ('Weboldal', 'expense', '#ec4899', true),
  ('IPA', 'expense', '#14b8a6', true),
  ('Kamarai tagság', 'expense', '#0ea5e9', true),
  ('Sybell', 'expense', '#f43f5e', true),
  ('Domain', 'expense', '#a78bfa', true),
  ('Egyéb kiadás', 'expense', '#94a3b8', true);

-- Ismétlődő tételek (Excel alapján)
insert into recurring_items (name, amount, type, frequency, day_of_month, next_due_date, active) values
  ('Adó', 101682, 'expense', 'monthly', 1, '2026-07-01', true),
  ('Élet / megélhetés', 112500, 'expense', 'weekly', null, '2026-06-16', true),
  ('Pszicho franchise', 37973, 'expense', 'monthly', 5, '2026-07-05', true),
  ('Ülések leadandó', 38100, 'expense', 'monthly', 5, '2026-08-05', true),
  ('Marketing', 30000, 'expense', 'monthly', 1, '2026-10-01', true),
  ('Könyvelő', 18500, 'expense', 'monthly', 1, '2027-01-01', true),
  ('IPA', 67000, 'expense', 'annual', null, '2027-06-01', true),
  ('Kamarai tagság', 5000, 'expense', 'annual', null, '2027-01-01', true),
  ('Sybell', 20000, 'expense', 'annual', null, '2027-01-01', true),
  ('Domain', 3200, 'expense', 'annual', null, '2027-01-01', true);
