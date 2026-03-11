
-- Clean existing data
DELETE FROM public.responses;
DELETE FROM public.results;
DELETE FROM public.answers;
DELETE FROM public.questions;
DELETE FROM public.quiz_sessions;
DELETE FROM public.quizzes;

-- QUIZ 1: Perfil de Raciocínio
INSERT INTO public.quizzes (title, slug, description, short_description, category, icon, duration_minutes, question_count, active)
VALUES ('Perfil de Raciocínio', 'perfil-de-raciocinio', 'Descubra como você processa informações, resolve problemas e toma decisões. Uma análise detalhada do seu estilo cognitivo e padrões de pensamento.', 'Análise do seu estilo cognitivo e padrões de raciocínio.', 'cognitivo', 'Brain', 5, 20, true);

DO $$
DECLARE
  v_quiz_id uuid;
  v_q_id uuid;
  v_questions text[] := ARRAY[
    'Quando enfrento um problema complexo, gosto de analisar cada parte separadamente.',
    'Costumo procurar padrões ou conexões em situações do dia a dia.',
    'Antes de tomar decisões importantes, considero várias possibilidades.',
    'Tenho facilidade em organizar informações mentalmente.',
    'Gosto de atividades que envolvem estratégia ou planejamento.',
    'Prefiro entender como algo funciona antes de utilizá-lo.',
    'Quando surge um problema inesperado, tento encontrar rapidamente uma solução lógica.',
    'Tenho facilidade em identificar inconsistências em argumentos.',
    'Costumo refletir sobre minhas decisões depois de tomá-las.',
    'Tenho interesse em entender o funcionamento de sistemas complexos.',
    'Prefiro resolver problemas por etapas.',
    'Quando algo parece confuso, tento simplificar a situação.',
    'Tenho facilidade em perceber relações entre ideias diferentes.',
    'Gosto de aprender coisas que exigem raciocínio.',
    'Procuro compreender o motivo por trás das coisas.',
    'Sinto satisfação ao resolver desafios intelectuais.',
    'Tenho facilidade em organizar ideias.',
    'Costumo pensar antes de agir.',
    'Prefiro decisões baseadas em lógica.',
    'Gosto de analisar situações profundamente.'
  ];
BEGIN
  SELECT id INTO v_quiz_id FROM public.quizzes WHERE slug = 'perfil-de-raciocinio';
  FOR i IN 1..20 LOOP
    INSERT INTO public.questions (quiz_id, question_text, question_order, question_type)
    VALUES (v_quiz_id, v_questions[i], i, 'likert')
    RETURNING id INTO v_q_id;
    PERFORM public.insert_likert_answers(v_q_id, 'agreement');
  END LOOP;
END $$;

-- QUIZ 2: Cérebro Acima da Média
INSERT INTO public.quizzes (title, slug, description, short_description, category, icon, duration_minutes, question_count, active)
VALUES ('Cérebro Acima da Média', 'cerebro-acima-da-media', 'Avalie sua capacidade intelectual, curiosidade e habilidade de aprendizado. Descubra como seu cérebro processa e absorve conhecimento.', 'Avalie sua capacidade intelectual e curiosidade.', 'cognitivo', 'Zap', 5, 20, true);

DO $$
DECLARE
  v_quiz_id uuid;
  v_q_id uuid;
  v_questions text[] := ARRAY[
    'Gosto de aprender coisas novas frequentemente.',
    'Tenho curiosidade sobre como o mundo funciona.',
    'Costumo questionar informações antes de aceitá-las.',
    'Tenho facilidade em compreender conceitos complexos.',
    'Aprendo novas habilidades rapidamente.',
    'Tenho interesse em temas variados.',
    'Costumo fazer perguntas quando quero entender algo melhor.',
    'Tenho facilidade em conectar ideias diferentes.',
    'Gosto de desafios intelectuais.',
    'Tenho interesse por conhecimento geral.',
    'Sinto satisfação ao aprender algo novo.',
    'Tenho facilidade em interpretar informações.',
    'Costumo refletir sobre ideias abstratas.',
    'Tenho interesse em ciência, tecnologia ou conhecimento.',
    'Gosto de resolver problemas complexos.',
    'Tenho facilidade em compreender explicações detalhadas.',
    'Busco entender conceitos profundamente.',
    'Tenho interesse por debates intelectuais.',
    'Gosto de explorar novas ideias.',
    'Tenho curiosidade natural sobre diferentes assuntos.'
  ];
BEGIN
  SELECT id INTO v_quiz_id FROM public.quizzes WHERE slug = 'cerebro-acima-da-media';
  FOR i IN 1..20 LOOP
    INSERT INTO public.questions (quiz_id, question_text, question_order, question_type)
    VALUES (v_quiz_id, v_questions[i], i, 'likert')
    RETURNING id INTO v_q_id;
    PERFORM public.insert_likert_answers(v_q_id, 'agreement');
  END LOOP;
END $$;

-- QUIZ 3: Personalidade Profunda
INSERT INTO public.quizzes (title, slug, description, short_description, category, icon, duration_minutes, question_count, active)
VALUES ('Personalidade Profunda', 'personalidade-profunda', 'Explore seus traços de personalidade, padrões emocionais e motivações internas. Entenda melhor quem você realmente é.', 'Explore seus traços de personalidade e motivações.', 'personalidade', 'Heart', 5, 20, true);

DO $$
DECLARE
  v_quiz_id uuid;
  v_q_id uuid;
  v_questions text[] := ARRAY[
    'Gosto de refletir sobre meus próprios pensamentos.',
    'Tenho consciência das minhas emoções.',
    'Costumo analisar minhas próprias atitudes.',
    'Tenho facilidade em compreender sentimentos de outras pessoas.',
    'Busco autoconhecimento.',
    'Gosto de entender minhas motivações.',
    'Reflito sobre minhas experiências.',
    'Procuro aprender com meus erros.',
    'Tenho facilidade em reconhecer meus padrões de comportamento.',
    'Gosto de entender minha personalidade.',
    'Busco evoluir como pessoa.',
    'Reflito sobre decisões importantes.',
    'Tenho interesse em psicologia ou comportamento humano.',
    'Procuro compreender meus sentimentos.',
    'Tenho curiosidade sobre minha própria mente.',
    'Tento melhorar meus hábitos.',
    'Busco equilíbrio emocional.',
    'Tenho interesse em desenvolvimento pessoal.',
    'Gosto de analisar minhas reações.',
    'Procuro entender minhas escolhas.'
  ];
BEGIN
  SELECT id INTO v_quiz_id FROM public.quizzes WHERE slug = 'personalidade-profunda';
  FOR i IN 1..20 LOOP
    INSERT INTO public.questions (quiz_id, question_text, question_order, question_type)
    VALUES (v_quiz_id, v_questions[i], i, 'likert')
    RETURNING id INTO v_q_id;
    PERFORM public.insert_likert_answers(v_q_id, 'agreement');
  END LOOP;
END $$;

-- QUIZ 4: Indicadores de TDAH em Adultos
INSERT INTO public.quizzes (title, slug, description, short_description, category, icon, duration_minutes, question_count, active)
VALUES ('Indicadores de TDAH em Adultos', 'indicadores-de-tdah', 'Identifique padrões comportamentais associados à desatenção e hiperatividade. Este teste é apenas informativo e não substitui avaliação médica.', 'Identifique padrões de desatenção e hiperatividade.', 'psicologico', 'Activity', 5, 20, true);

DO $$
DECLARE
  v_quiz_id uuid;
  v_q_id uuid;
  v_questions text[] := ARRAY[
    'Tenho dificuldade em manter foco por muito tempo.',
    'Frequentemente começo tarefas e não termino.',
    'Esqueço compromissos com facilidade.',
    'Tenho dificuldade em organizar tarefas.',
    'Perco objetos importantes com frequência.',
    'Fico facilmente distraído.',
    'Tenho dificuldade em manter rotina.',
    'Sinto inquietação frequentemente.',
    'Tenho dificuldade em concluir tarefas longas.',
    'Costumo procrastinar.',
    'Tenho dificuldade em priorizar tarefas.',
    'Minha mente muda de assunto rapidamente.',
    'Tenho dificuldade em manter atenção em conversas longas.',
    'Sinto dificuldade em manter organização pessoal.',
    'Tenho dificuldade em planejar tarefas.',
    'Fico entediado facilmente.',
    'Tenho dificuldade em manter disciplina em atividades repetitivas.',
    'Costumo esquecer detalhes importantes.',
    'Tenho dificuldade em terminar projetos.',
    'Tenho dificuldade em manter foco constante.'
  ];
BEGIN
  SELECT id INTO v_quiz_id FROM public.quizzes WHERE slug = 'indicadores-de-tdah';
  FOR i IN 1..20 LOOP
    INSERT INTO public.questions (quiz_id, question_text, question_order, question_type)
    VALUES (v_quiz_id, v_questions[i], i, 'likert')
    RETURNING id INTO v_q_id;
    PERFORM public.insert_likert_answers(v_q_id, 'agreement');
  END LOOP;
END $$;

-- QUIZ 5: Perfil Psicológico Completo
INSERT INTO public.quizzes (title, slug, description, short_description, category, icon, duration_minutes, question_count, active)
VALUES ('Perfil Psicológico Completo', 'perfil-psicologico-completo', 'Uma análise abrangente do seu perfil psicológico, incluindo estabilidade emocional, resiliência, disciplina e capacidade de adaptação.', 'Análise abrangente do seu perfil psicológico.', 'psicologico', 'User', 5, 20, true);

DO $$
DECLARE
  v_quiz_id uuid;
  v_q_id uuid;
  v_questions text[] := ARRAY[
    'Consigo lidar bem com pressão.',
    'Tenho facilidade em manter controle emocional.',
    'Consigo me adaptar a mudanças.',
    'Tenho facilidade em tomar decisões.',
    'Tenho tendência a analisar situações antes de agir.',
    'Sou persistente quando enfrento desafios.',
    'Tenho facilidade em compreender pessoas.',
    'Costumo manter calma em situações difíceis.',
    'Sou organizado com objetivos.',
    'Tenho facilidade em lidar com problemas.',
    'Consigo manter foco em metas.',
    'Tenho facilidade em controlar impulsos.',
    'Tenho disciplina em atividades importantes.',
    'Tenho capacidade de adaptação.',
    'Tenho clareza sobre meus objetivos.',
    'Tenho facilidade em manter equilíbrio emocional.',
    'Consigo lidar com críticas de forma construtiva.',
    'Tenho persistência em projetos.',
    'Tenho facilidade em entender comportamentos humanos.',
    'Procuro evoluir constantemente.'
  ];
BEGIN
  SELECT id INTO v_quiz_id FROM public.quizzes WHERE slug = 'perfil-psicologico-completo';
  FOR i IN 1..20 LOOP
    INSERT INTO public.questions (quiz_id, question_text, question_order, question_type)
    VALUES (v_quiz_id, v_questions[i], i, 'likert')
    RETURNING id INTO v_q_id;
    PERFORM public.insert_likert_answers(v_q_id, 'agreement');
  END LOOP;
END $$;
