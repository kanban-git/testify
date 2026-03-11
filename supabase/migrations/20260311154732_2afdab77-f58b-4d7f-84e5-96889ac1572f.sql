
-- Enum for user roles
create type public.app_role as enum ('admin', 'moderator', 'user');

-- User roles table
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  unique (user_id, role)
);
alter table public.user_roles enable row level security;

-- Security definer function for role checking
create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

-- Quizzes
create table public.quizzes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text,
  short_description text,
  category text,
  duration_minutes int default 3,
  question_count int default 16,
  icon text,
  active boolean default true,
  created_at timestamptz default now()
);
alter table public.quizzes enable row level security;
create policy "public_read_quizzes" on public.quizzes for select using (true);
create policy "admin_insert_quizzes" on public.quizzes for insert to authenticated with check (public.has_role(auth.uid(), 'admin'));
create policy "admin_update_quizzes" on public.quizzes for update to authenticated using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));
create policy "admin_delete_quizzes" on public.quizzes for delete to authenticated using (public.has_role(auth.uid(), 'admin'));

-- Questions
create table public.questions (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid references public.quizzes(id) on delete cascade not null,
  question_text text not null,
  question_type text not null default 'multiple_choice',
  question_order int not null,
  created_at timestamptz default now()
);
alter table public.questions enable row level security;
create policy "public_read_questions" on public.questions for select using (true);
create policy "admin_insert_questions" on public.questions for insert to authenticated with check (public.has_role(auth.uid(), 'admin'));
create policy "admin_update_questions" on public.questions for update to authenticated using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));
create policy "admin_delete_questions" on public.questions for delete to authenticated using (public.has_role(auth.uid(), 'admin'));

-- Answers
create table public.answers (
  id uuid primary key default gen_random_uuid(),
  question_id uuid references public.questions(id) on delete cascade not null,
  answer_text text not null,
  score_value int not null default 0,
  answer_order int not null,
  created_at timestamptz default now()
);
alter table public.answers enable row level security;
create policy "public_read_answers" on public.answers for select using (true);
create policy "admin_insert_answers" on public.answers for insert to authenticated with check (public.has_role(auth.uid(), 'admin'));
create policy "admin_update_answers" on public.answers for update to authenticated using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));
create policy "admin_delete_answers" on public.answers for delete to authenticated using (public.has_role(auth.uid(), 'admin'));

-- Quiz sessions
create table public.quiz_sessions (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid references public.quizzes(id) on delete cascade not null,
  email text,
  started_at timestamptz default now(),
  completed_at timestamptz,
  payment_status text default 'pending',
  payment_provider text,
  amount_paid numeric(10,2),
  source text,
  campaign text
);
alter table public.quiz_sessions enable row level security;
create policy "public_insert_sessions" on public.quiz_sessions for insert with check (true);
create policy "public_select_sessions" on public.quiz_sessions for select using (true);
create policy "public_update_sessions" on public.quiz_sessions for update using (true);

-- Responses
create table public.responses (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references public.quiz_sessions(id) on delete cascade not null,
  question_id uuid references public.questions(id) on delete cascade not null,
  answer_id uuid references public.answers(id) on delete cascade not null,
  score_value int not null default 0,
  created_at timestamptz default now()
);
alter table public.responses enable row level security;
create policy "public_insert_responses" on public.responses for insert with check (true);
create policy "public_select_responses" on public.responses for select using (true);

-- Results
create table public.results (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references public.quiz_sessions(id) on delete cascade not null,
  quiz_id uuid references public.quizzes(id) on delete cascade not null,
  total_score int not null default 0,
  max_score int not null default 0,
  percentile int,
  result_title text,
  result_summary text,
  full_report jsonb,
  unlocked boolean default false,
  created_at timestamptz default now()
);
alter table public.results enable row level security;
create policy "public_insert_results" on public.results for insert with check (true);
create policy "public_select_results" on public.results for select using (true);
create policy "public_update_results" on public.results for update using (true);

-- Payments
create table public.payments (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references public.quiz_sessions(id) on delete cascade not null,
  provider text not null,
  provider_payment_id text,
  amount numeric(10,2) not null,
  currency text default 'BRL',
  status text default 'pending',
  created_at timestamptz default now()
);
alter table public.payments enable row level security;
create policy "public_insert_payments" on public.payments for insert with check (true);
create policy "public_select_payments" on public.payments for select using (true);
create policy "public_update_payments" on public.payments for update using (true);

-- Metrics events
create table public.metrics_events (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid references public.quizzes(id) on delete cascade,
  session_id uuid references public.quiz_sessions(id) on delete cascade,
  event_type text not null,
  metadata jsonb,
  created_at timestamptz default now()
);
alter table public.metrics_events enable row level security;
create policy "public_insert_events" on public.metrics_events for insert with check (true);
create policy "admin_select_events" on public.metrics_events for select to authenticated using (public.has_role(auth.uid(), 'admin'));

-- User roles policies
create policy "admin_all_roles" on public.user_roles for all to authenticated using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));
create policy "users_read_own_roles" on public.user_roles for select to authenticated using (user_id = auth.uid());

-- Helper function for Likert answers
create or replace function public.insert_likert_answers(p_question_id uuid, p_scale_type text)
returns void language plpgsql security definer as $$
begin
  if p_scale_type = 'agreement' then
    insert into public.answers (question_id, answer_text, score_value, answer_order) values
      (p_question_id, 'Discordo totalmente', 1, 1),
      (p_question_id, 'Discordo', 2, 2),
      (p_question_id, 'Neutro', 3, 3),
      (p_question_id, 'Concordo', 4, 4),
      (p_question_id, 'Concordo totalmente', 5, 5);
  elsif p_scale_type = 'frequency' then
    insert into public.answers (question_id, answer_text, score_value, answer_order) values
      (p_question_id, 'Nunca', 0, 1),
      (p_question_id, 'Raramente', 1, 2),
      (p_question_id, 'Às vezes', 2, 3),
      (p_question_id, 'Frequentemente', 3, 4),
      (p_question_id, 'Muito frequentemente', 4, 5);
  end if;
end $$;
