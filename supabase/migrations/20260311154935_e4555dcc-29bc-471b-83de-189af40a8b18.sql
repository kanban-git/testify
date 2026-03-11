
DO $$
DECLARE
  v_quiz_id uuid;
  v_q_id uuid;
BEGIN
  -- Quiz 1: Teste de QI Rápido
  INSERT INTO public.quizzes (title, slug, description, short_description, category, duration_minutes, question_count, icon)
  VALUES ('Teste de QI Rápido', 'teste-de-qi', 'Descubra sua faixa estimada de raciocínio lógico com um teste rápido e objetivo.', 'Responda 16 perguntas e veja sua pontuação preliminar antes de desbloquear o relatório completo.', 'cognitivo', 3, 16, 'Brain')
  RETURNING id INTO v_quiz_id;

  INSERT INTO public.questions (quiz_id, question_text, question_type, question_order) VALUES (v_quiz_id, 'Qual número vem a seguir? 2, 4, 8, 16, ?', 'multiple_choice', 1) RETURNING id INTO v_q_id;
  INSERT INTO public.answers (question_id, answer_text, score_value, answer_order) VALUES (v_q_id, '24', 0, 1), (v_q_id, '30', 0, 2), (v_q_id, '32', 1, 3), (v_q_id, '34', 0, 4);

  INSERT INTO public.questions (quiz_id, question_text, question_type, question_order) VALUES (v_quiz_id, 'Qual palavra não pertence ao grupo?', 'multiple_choice', 2) RETURNING id INTO v_q_id;
  INSERT INTO public.answers (question_id, answer_text, score_value, answer_order) VALUES (v_q_id, 'Maçã', 0, 1), (v_q_id, 'Banana', 0, 2), (v_q_id, 'Cenoura', 1, 3), (v_q_id, 'Laranja', 0, 4);

  INSERT INTO public.questions (quiz_id, question_text, question_type, question_order) VALUES (v_quiz_id, 'Se todos os bloops são razzies e todos os razzies são lazzies, então todos os bloops são lazzies?', 'multiple_choice', 3) RETURNING id INTO v_q_id;
  INSERT INTO public.answers (question_id, answer_text, score_value, answer_order) VALUES (v_q_id, 'Sim', 1, 1), (v_q_id, 'Não', 0, 2), (v_q_id, 'Não é possível saber', 0, 3);

  INSERT INTO public.questions (quiz_id, question_text, question_type, question_order) VALUES (v_quiz_id, 'Qual número é diferente dos demais? 3, 5, 7, 11, 14, 17', 'multiple_choice', 4) RETURNING id INTO v_q_id;
  INSERT INTO public.answers (question_id, answer_text, score_value, answer_order) VALUES (v_q_id, '3', 0, 1), (v_q_id, '5', 0, 2), (v_q_id, '11', 0, 3), (v_q_id, '14', 1, 4), (v_q_id, '17', 0, 5);

  INSERT INTO public.questions (quiz_id, question_text, question_type, question_order) VALUES (v_quiz_id, 'Quanto é 15% de 200?', 'multiple_choice', 5) RETURNING id INTO v_q_id;
  INSERT INTO public.answers (question_id, answer_text, score_value, answer_order) VALUES (v_q_id, '20', 0, 1), (v_q_id, '25', 0, 2), (v_q_id, '30', 1, 3), (v_q_id, '35', 0, 4);

  INSERT INTO public.questions (quiz_id, question_text, question_type, question_order) VALUES (v_quiz_id, 'Qual letra vem a seguir? A, C, F, J, O, ?', 'multiple_choice', 6) RETURNING id INTO v_q_id;
  INSERT INTO public.answers (question_id, answer_text, score_value, answer_order) VALUES (v_q_id, 'S', 0, 1), (v_q_id, 'T', 0, 2), (v_q_id, 'U', 1, 3), (v_q_id, 'V', 0, 4);

  INSERT INTO public.questions (quiz_id, question_text, question_type, question_order) VALUES (v_quiz_id, 'Complete a analogia: Pássaro está para voar assim como peixe está para:', 'multiple_choice', 7) RETURNING id INTO v_q_id;
  INSERT INTO public.answers (question_id, answer_text, score_value, answer_order) VALUES (v_q_id, 'Nadar', 1, 1), (v_q_id, 'Correr', 0, 2), (v_q_id, 'Saltar', 0, 3), (v_q_id, 'Respirar', 0, 4);

  INSERT INTO public.questions (quiz_id, question_text, question_type, question_order) VALUES (v_quiz_id, 'Se um relógio marca 3:15, qual é o ângulo aproximado entre os ponteiros?', 'multiple_choice', 8) RETURNING id INTO v_q_id;
  INSERT INTO public.answers (question_id, answer_text, score_value, answer_order) VALUES (v_q_id, '0 graus', 0, 1), (v_q_id, '7,5 graus', 1, 2), (v_q_id, '15 graus', 0, 3), (v_q_id, '30 graus', 0, 4);

  INSERT INTO public.questions (quiz_id, question_text, question_type, question_order) VALUES (v_quiz_id, 'Se um trem percorre 120 km em 2 horas, qual é sua velocidade média?', 'multiple_choice', 9) RETURNING id INTO v_q_id;
  INSERT INTO public.answers (question_id, answer_text, score_value, answer_order) VALUES (v_q_id, '40 km/h', 0, 1), (v_q_id, '50 km/h', 0, 2), (v_q_id, '60 km/h', 1, 3), (v_q_id, '70 km/h', 0, 4);

  INSERT INTO public.questions (quiz_id, question_text, question_type, question_order) VALUES (v_quiz_id, 'Qual número completa a sequência? 5, 10, 20, 40, ?', 'multiple_choice', 10) RETURNING id INTO v_q_id;
  INSERT INTO public.answers (question_id, answer_text, score_value, answer_order) VALUES (v_q_id, '60', 0, 1), (v_q_id, '70', 0, 2), (v_q_id, '80', 1, 3), (v_q_id, '90', 0, 4);

  INSERT INTO public.questions (quiz_id, question_text, question_type, question_order) VALUES (v_quiz_id, 'Qual palavra é sinônimo de "rápido"?', 'multiple_choice', 11) RETURNING id INTO v_q_id;
  INSERT INTO public.answers (question_id, answer_text, score_value, answer_order) VALUES (v_q_id, 'Lento', 0, 1), (v_q_id, 'Ágil', 1, 2), (v_q_id, 'Pesado', 0, 3), (v_q_id, 'Calmo', 0, 4);

  INSERT INTO public.questions (quiz_id, question_text, question_type, question_order) VALUES (v_quiz_id, 'Se Maria é mais alta que João e João é mais alto que Pedro, quem é o mais baixo?', 'multiple_choice', 12) RETURNING id INTO v_q_id;
  INSERT INTO public.answers (question_id, answer_text, score_value, answer_order) VALUES (v_q_id, 'Maria', 0, 1), (v_q_id, 'João', 0, 2), (v_q_id, 'Pedro', 1, 3), (v_q_id, 'Não é possível saber', 0, 4);

  INSERT INTO public.questions (quiz_id, question_text, question_type, question_order) VALUES (v_quiz_id, 'Qual número vem a seguir? 1, 3, 6, 10, 15, ?', 'multiple_choice', 13) RETURNING id INTO v_q_id;
  INSERT INTO public.answers (question_id, answer_text, score_value, answer_order) VALUES (v_q_id, '18', 0, 1), (v_q_id, '20', 0, 2), (v_q_id, '21', 1, 3), (v_q_id, '22', 0, 4);

  INSERT INTO public.questions (quiz_id, question_text, question_type, question_order) VALUES (v_quiz_id, 'Se você reorganizar as letras da palavra "ROMA", qual palavra conhecida pode ser formada?', 'multiple_choice', 14) RETURNING id INTO v_q_id;
  INSERT INTO public.answers (question_id, answer_text, score_value, answer_order) VALUES (v_q_id, 'AMOR', 0, 1), (v_q_id, 'RAMO', 0, 2), (v_q_id, 'MORA', 0, 3), (v_q_id, 'Todas as alternativas anteriores', 1, 4);

  INSERT INTO public.questions (quiz_id, question_text, question_type, question_order) VALUES (v_quiz_id, 'Quantos lados têm dois triângulos separados?', 'multiple_choice', 15) RETURNING id INTO v_q_id;
  INSERT INTO public.answers (question_id, answer_text, score_value, answer_order) VALUES (v_q_id, '3', 0, 1), (v_q_id, '4', 0, 2), (v_q_id, '5', 0, 3), (v_q_id, '6', 1, 4);

  INSERT INTO public.questions (quiz_id, question_text, question_type, question_order) VALUES (v_quiz_id, 'Uma caneta custa R$ 7 e um caderno custa R$ 13. Quanto custam 2 canetas e 2 cadernos?', 'multiple_choice', 16) RETURNING id INTO v_q_id;
  INSERT INTO public.answers (question_id, answer_text, score_value, answer_order) VALUES (v_q_id, 'R$ 34', 0, 1), (v_q_id, 'R$ 40', 1, 2), (v_q_id, 'R$ 38', 0, 3), (v_q_id, 'R$ 42', 0, 4);

  -- Quiz 2: Seu Cérebro Está Acima da Média?
  INSERT INTO public.quizzes (title, slug, description, short_description, category, duration_minutes, question_count, icon)
  VALUES ('Seu Cérebro Está Acima da Média?', 'cerebro-acima-da-media', 'Avalie sua percepção de padrões, raciocínio e velocidade mental com este teste objetivo.', 'Teste rápido de raciocínio e percepção de padrões.', 'cognitivo', 3, 16, 'Zap')
  RETURNING id INTO v_quiz_id;

  INSERT INTO public.questions (quiz_id, question_text, question_type, question_order) VALUES (v_quiz_id, 'Qual número vem a seguir? 10, 20, 30, 40, ?', 'multiple_choice', 1) RETURNING id INTO v_q_id;
  INSERT INTO public.answers (question_id, answer_text, score_value, answer_order) VALUES (v_q_id, '45', 0, 1), (v_q_id, '50', 1, 2), (v_q_id, '55', 0, 3), (v_q_id, '60', 0, 4);

  INSERT INTO public.questions (quiz_id, question_text, question_type, question_order) VALUES (v_quiz_id, 'Complete: 2, 6, 12, 20, ?', 'multiple_choice', 2) RETURNING id INTO v_q_id;
  INSERT INTO public.answers (question_id, answer_text, score_value, answer_order) VALUES (v_q_id, '28', 0, 1), (v_q_id, '30', 1, 2), (v_q_id, '32', 0, 3), (v_q_id, '34', 0, 4);

  INSERT INTO public.questions (quiz_id, question_text, question_type, question_order) VALUES (v_quiz_id, 'Qual item foge do padrão?', 'multiple_choice', 3) RETURNING id INTO v_q_id;
  INSERT INTO public.answers (question_id, answer_text, score_value, answer_order) VALUES (v_q_id, 'Quadrado', 0, 1), (v_q_id, 'Triângulo', 0, 2), (v_q_id, 'Círculo', 0, 3), (v_q_id, 'Garfo', 1, 4);

  INSERT INTO public.questions (quiz_id, question_text, question_type, question_order) VALUES (v_quiz_id, 'Se ontem foi domingo, que dia será amanhã?', 'multiple_choice', 4) RETURNING id INTO v_q_id;
  INSERT INTO public.answers (question_id, answer_text, score_value, answer_order) VALUES (v_q_id, 'Segunda', 0, 1), (v_q_id, 'Terça', 1, 2), (v_q_id, 'Quarta', 0, 3), (v_q_id, 'Domingo', 0, 4);

  INSERT INTO public.questions (quiz_id, question_text, question_type, question_order) VALUES (v_quiz_id, 'Qual palavra melhor completa a relação? Livro : Ler :: Música : ?', 'multiple_choice', 5) RETURNING id INTO v_q_id;
  INSERT INTO public.answers (question_id, answer_text, score_value, answer_order) VALUES (v_q_id, 'Escutar', 1, 1), (v_q_id, 'Correr', 0, 2), (v_q_id, 'Pintar', 0, 3), (v_q_id, 'Somar', 0, 4);

  INSERT INTO public.questions (quiz_id, question_text, question_type, question_order) VALUES (v_quiz_id, 'Qual número é o dobro de 18?', 'multiple_choice', 6) RETURNING id INTO v_q_id;
  INSERT INTO public.answers (question_id, answer_text, score_value, answer_order) VALUES (v_q_id, '32', 0, 1), (v_q_id, '34', 0, 2), (v_q_id, '36', 1, 3), (v_q_id, '38', 0, 4);

  INSERT INTO public.questions (quiz_id, question_text, question_type, question_order) VALUES (v_quiz_id, 'Qual opção representa maior capacidade de generalização?', 'multiple_choice', 7) RETURNING id INTO v_q_id;
  INSERT INTO public.answers (question_id, answer_text, score_value, answer_order) VALUES (v_q_id, 'Repetir sempre o mesmo processo', 0, 1), (v_q_id, 'Identificar padrões entre casos diferentes', 1, 2), (v_q_id, 'Ignorar detalhes', 0, 3), (v_q_id, 'Decorar respostas', 0, 4);

  INSERT INTO public.questions (quiz_id, question_text, question_type, question_order) VALUES (v_quiz_id, 'Qual sequência cresce mais rápido?', 'multiple_choice', 8) RETURNING id INTO v_q_id;
  INSERT INTO public.answers (question_id, answer_text, score_value, answer_order) VALUES (v_q_id, '1, 2, 3, 4', 0, 1), (v_q_id, '2, 4, 8, 16', 1, 2), (v_q_id, '5, 6, 7, 8', 0, 3), (v_q_id, '10, 11, 12, 13', 0, 4);

  INSERT INTO public.questions (quiz_id, question_text, question_type, question_order) VALUES (v_quiz_id, 'Se uma peça gira 90 graus para a direita duas vezes, quantos graus ela girou ao todo?', 'multiple_choice', 9) RETURNING id INTO v_q_id;
  INSERT INTO public.answers (question_id, answer_text, score_value, answer_order) VALUES (v_q_id, '90', 0, 1), (v_q_id, '120', 0, 2), (v_q_id, '180', 1, 3), (v_q_id, '360', 0, 4);

  INSERT INTO public.questions (quiz_id, question_text, question_type, question_order) VALUES (v_quiz_id, 'Um objeto cai mais rápido no vácuo ou no ar com resistência?', 'multiple_choice', 10) RETURNING id INTO v_q_id;
  INSERT INTO public.answers (question_id, answer_text, score_value, answer_order) VALUES (v_q_id, 'No ar', 0, 1), (v_q_id, 'No vácuo', 1, 2), (v_q_id, 'Nos dois igual', 0, 3), (v_q_id, 'Não é possível saber', 0, 4);

  INSERT INTO public.questions (quiz_id, question_text, question_type, question_order) VALUES (v_quiz_id, 'Qual número está fora do padrão? 12, 24, 36, 37', 'multiple_choice', 11) RETURNING id INTO v_q_id;
  INSERT INTO public.answers (question_id, answer_text, score_value, answer_order) VALUES (v_q_id, '12', 0, 1), (v_q_id, '24', 0, 2), (v_q_id, '36', 0, 3), (v_q_id, '37', 1, 4);

  INSERT INTO public.questions (quiz_id, question_text, question_type, question_order) VALUES (v_quiz_id, 'Qual palavra tem significado mais próximo de "analisar"?', 'multiple_choice', 12) RETURNING id INTO v_q_id;
  INSERT INTO public.answers (question_id, answer_text, score_value, answer_order) VALUES (v_q_id, 'Observar cuidadosamente', 1, 1), (v_q_id, 'Ignorar', 0, 2), (v_q_id, 'Apagar', 0, 3), (v_q_id, 'Repetir', 0, 4);

  INSERT INTO public.questions (quiz_id, question_text, question_type, question_order) VALUES (v_quiz_id, 'Se 5 máquinas fazem 5 peças em 5 minutos, quantas peças 5 máquinas fazem em 10 minutos?', 'multiple_choice', 13) RETURNING id INTO v_q_id;
  INSERT INTO public.answers (question_id, answer_text, score_value, answer_order) VALUES (v_q_id, '5', 0, 1), (v_q_id, '10', 1, 2), (v_q_id, '15', 0, 3), (v_q_id, '20', 0, 4);

  INSERT INTO public.questions (quiz_id, question_text, question_type, question_order) VALUES (v_quiz_id, 'Qual dessas tarefas exige mais raciocínio abstrato?', 'multiple_choice', 14) RETURNING id INTO v_q_id;
  INSERT INTO public.answers (question_id, answer_text, score_value, answer_order) VALUES (v_q_id, 'Copiar um texto', 0, 1), (v_q_id, 'Decorar uma senha', 0, 2), (v_q_id, 'Resolver um padrão lógico', 1, 3), (v_q_id, 'Organizar objetos por cor', 0, 4);

  INSERT INTO public.questions (quiz_id, question_text, question_type, question_order) VALUES (v_quiz_id, 'Se A = 1, B = 2 e C = 3, quanto vale CAB?', 'multiple_choice', 15) RETURNING id INTO v_q_id;
  INSERT INTO public.answers (question_id, answer_text, score_value, answer_order) VALUES (v_q_id, '312', 1, 1), (v_q_id, '321', 0, 2), (v_q_id, '231', 0, 3), (v_q_id, '213', 0, 4);

  INSERT INTO public.questions (quiz_id, question_text, question_type, question_order) VALUES (v_quiz_id, 'Qual número completa a sequência? 3, 9, 27, ?', 'multiple_choice', 16) RETURNING id INTO v_q_id;
  INSERT INTO public.answers (question_id, answer_text, score_value, answer_order) VALUES (v_q_id, '54', 0, 1), (v_q_id, '72', 0, 2), (v_q_id, '81', 1, 3), (v_q_id, '90', 0, 4);

  -- Quiz 3: Teste de Personalidade Profunda
  INSERT INTO public.quizzes (title, slug, description, short_description, category, duration_minutes, question_count, icon)
  VALUES ('Teste de Personalidade Profunda', 'personalidade-profunda', 'Descubra tendências importantes do seu perfil comportamental e da forma como você reage ao mundo.', 'Descubra seu perfil comportamental e tendências psicológicas.', 'personalidade', 4, 16, 'Heart')
  RETURNING id INTO v_quiz_id;

  INSERT INTO public.questions (quiz_id, question_text, question_type, question_order) VALUES (v_quiz_id, 'Gosto de passar tempo sozinho.', 'likert', 1) RETURNING id INTO v_q_id;
  PERFORM public.insert_likert_answers(v_q_id, 'agreement');
  INSERT INTO public.questions (quiz_id, question_text, question_type, question_order) VALUES (v_quiz_id, 'Costumo pensar muito antes de agir.', 'likert', 2) RETURNING id INTO v_q_id;
  PERFORM public.insert_likert_answers(v_q_id, 'agreement');
  INSERT INTO public.questions (quiz_id, question_text, question_type, question_order) VALUES (v_quiz_id, 'Sinto-me energizado em ambientes sociais.', 'likert', 3) RETURNING id INTO v_q_id;
  PERFORM public.insert_likert_answers(v_q_id, 'agreement');
  INSERT INTO public.questions (quiz_id, question_text, question_type, question_order) VALUES (v_quiz_id, 'Tenho facilidade em perceber emoções nas outras pessoas.', 'likert', 4) RETURNING id INTO v_q_id;
  PERFORM public.insert_likert_answers(v_q_id, 'agreement');
  INSERT INTO public.questions (quiz_id, question_text, question_type, question_order) VALUES (v_quiz_id, 'Prefiro rotina a improviso.', 'likert', 5) RETURNING id INTO v_q_id;
  PERFORM public.insert_likert_answers(v_q_id, 'agreement');
  INSERT INTO public.questions (quiz_id, question_text, question_type, question_order) VALUES (v_quiz_id, 'Gosto de explorar ideias novas.', 'likert', 6) RETURNING id INTO v_q_id;
  PERFORM public.insert_likert_answers(v_q_id, 'agreement');
  INSERT INTO public.questions (quiz_id, question_text, question_type, question_order) VALUES (v_quiz_id, 'Sou mais racional do que impulsivo.', 'likert', 7) RETURNING id INTO v_q_id;
  PERFORM public.insert_likert_answers(v_q_id, 'agreement');
  INSERT INTO public.questions (quiz_id, question_text, question_type, question_order) VALUES (v_quiz_id, 'Fico desconfortável com ambientes caóticos.', 'likert', 8) RETURNING id INTO v_q_id;
  PERFORM public.insert_likert_answers(v_q_id, 'agreement');
  INSERT INTO public.questions (quiz_id, question_text, question_type, question_order) VALUES (v_quiz_id, 'Costumo refletir sobre meus próprios comportamentos.', 'likert', 9) RETURNING id INTO v_q_id;
  PERFORM public.insert_likert_answers(v_q_id, 'agreement');
  INSERT INTO public.questions (quiz_id, question_text, question_type, question_order) VALUES (v_quiz_id, 'Tenho facilidade para tomar decisões.', 'likert', 10) RETURNING id INTO v_q_id;
  PERFORM public.insert_likert_answers(v_q_id, 'agreement');
  INSERT INTO public.questions (quiz_id, question_text, question_type, question_order) VALUES (v_quiz_id, 'Busco profundidade nas minhas relações.', 'likert', 11) RETURNING id INTO v_q_id;
  PERFORM public.insert_likert_answers(v_q_id, 'agreement');
  INSERT INTO public.questions (quiz_id, question_text, question_type, question_order) VALUES (v_quiz_id, 'Gosto de planejar antes de começar algo.', 'likert', 12) RETURNING id INTO v_q_id;
  PERFORM public.insert_likert_answers(v_q_id, 'agreement');
  INSERT INTO public.questions (quiz_id, question_text, question_type, question_order) VALUES (v_quiz_id, 'Adapto-me facilmente a mudanças inesperadas.', 'likert', 13) RETURNING id INTO v_q_id;
  PERFORM public.insert_likert_answers(v_q_id, 'agreement');
  INSERT INTO public.questions (quiz_id, question_text, question_type, question_order) VALUES (v_quiz_id, 'Sou exigente comigo mesmo.', 'likert', 14) RETURNING id INTO v_q_id;
  PERFORM public.insert_likert_answers(v_q_id, 'agreement');
  INSERT INTO public.questions (quiz_id, question_text, question_type, question_order) VALUES (v_quiz_id, 'Tenho tendência a observar detalhes que outras pessoas ignoram.', 'likert', 15) RETURNING id INTO v_q_id;
  PERFORM public.insert_likert_answers(v_q_id, 'agreement');
  INSERT INTO public.questions (quiz_id, question_text, question_type, question_order) VALUES (v_quiz_id, 'Gosto de entender o motivo das coisas.', 'likert', 16) RETURNING id INTO v_q_id;
  PERFORM public.insert_likert_answers(v_q_id, 'agreement');

  -- Quiz 4: Indicadores de TDAH em Adultos
  INSERT INTO public.quizzes (title, slug, description, short_description, category, duration_minutes, question_count, icon)
  VALUES ('Indicadores de TDAH em Adultos', 'indicadores-de-tdah', 'Responda a este questionário informativo e veja sinais comportamentais que podem merecer atenção.', 'Questionário informativo sobre sinais de desatenção e hiperatividade.', 'comportamental', 3, 16, 'Activity')
  RETURNING id INTO v_quiz_id;

  INSERT INTO public.questions (quiz_id, question_text, question_type, question_order) VALUES (v_quiz_id, 'Tenho dificuldade para manter foco em tarefas longas.', 'likert', 1) RETURNING id INTO v_q_id;
  PERFORM public.insert_likert_answers(v_q_id, 'frequency');
  INSERT INTO public.questions (quiz_id, question_text, question_type, question_order) VALUES (v_quiz_id, 'Começo atividades e deixo várias sem terminar.', 'likert', 2) RETURNING id INTO v_q_id;
  PERFORM public.insert_likert_answers(v_q_id, 'frequency');
  INSERT INTO public.questions (quiz_id, question_text, question_type, question_order) VALUES (v_quiz_id, 'Esqueço compromissos com facilidade.', 'likert', 3) RETURNING id INTO v_q_id;
  PERFORM public.insert_likert_answers(v_q_id, 'frequency');
  INSERT INTO public.questions (quiz_id, question_text, question_type, question_order) VALUES (v_quiz_id, 'Sinto inquietação quando preciso ficar parado por muito tempo.', 'likert', 4) RETURNING id INTO v_q_id;
  PERFORM public.insert_likert_answers(v_q_id, 'frequency');
  INSERT INTO public.questions (quiz_id, question_text, question_type, question_order) VALUES (v_quiz_id, 'Interrompo outras pessoas sem perceber.', 'likert', 5) RETURNING id INTO v_q_id;
  PERFORM public.insert_likert_answers(v_q_id, 'frequency');
  INSERT INTO public.questions (quiz_id, question_text, question_type, question_order) VALUES (v_quiz_id, 'Tenho dificuldade para organizar tarefas do dia a dia.', 'likert', 6) RETURNING id INTO v_q_id;
  PERFORM public.insert_likert_answers(v_q_id, 'frequency');
  INSERT INTO public.questions (quiz_id, question_text, question_type, question_order) VALUES (v_quiz_id, 'Perco objetos importantes com frequência.', 'likert', 7) RETURNING id INTO v_q_id;
  PERFORM public.insert_likert_answers(v_q_id, 'frequency');
  INSERT INTO public.questions (quiz_id, question_text, question_type, question_order) VALUES (v_quiz_id, 'Procrastino até tarefas simples.', 'likert', 8) RETURNING id INTO v_q_id;
  PERFORM public.insert_likert_answers(v_q_id, 'frequency');
  INSERT INTO public.questions (quiz_id, question_text, question_type, question_order) VALUES (v_quiz_id, 'Minha mente parece mudar de assunto muito rápido.', 'likert', 9) RETURNING id INTO v_q_id;
  PERFORM public.insert_likert_answers(v_q_id, 'frequency');
  INSERT INTO public.questions (quiz_id, question_text, question_type, question_order) VALUES (v_quiz_id, 'Tenho dificuldade em seguir instruções longas.', 'likert', 10) RETURNING id INTO v_q_id;
  PERFORM public.insert_likert_answers(v_q_id, 'frequency');
  INSERT INTO public.questions (quiz_id, question_text, question_type, question_order) VALUES (v_quiz_id, 'Sinto dificuldade para priorizar o que é mais importante.', 'likert', 11) RETURNING id INTO v_q_id;
  PERFORM public.insert_likert_answers(v_q_id, 'frequency');
  INSERT INTO public.questions (quiz_id, question_text, question_type, question_order) VALUES (v_quiz_id, 'Fico facilmente distraído por estímulos ao redor.', 'likert', 12) RETURNING id INTO v_q_id;
  PERFORM public.insert_likert_answers(v_q_id, 'frequency');
  INSERT INTO public.questions (quiz_id, question_text, question_type, question_order) VALUES (v_quiz_id, 'Tenho tendência a agir antes de pensar.', 'likert', 13) RETURNING id INTO v_q_id;
  PERFORM public.insert_likert_answers(v_q_id, 'frequency');
  INSERT INTO public.questions (quiz_id, question_text, question_type, question_order) VALUES (v_quiz_id, 'Sinto frustração por não concluir o que planejo.', 'likert', 14) RETURNING id INTO v_q_id;
  PERFORM public.insert_likert_answers(v_q_id, 'frequency');
  INSERT INTO public.questions (quiz_id, question_text, question_type, question_order) VALUES (v_quiz_id, 'Preciso de pressão de tempo para conseguir terminar tarefas.', 'likert', 15) RETURNING id INTO v_q_id;
  PERFORM public.insert_likert_answers(v_q_id, 'frequency');
  INSERT INTO public.questions (quiz_id, question_text, question_type, question_order) VALUES (v_quiz_id, 'Tenho dificuldade em manter constância em rotinas.', 'likert', 16) RETURNING id INTO v_q_id;
  PERFORM public.insert_likert_answers(v_q_id, 'frequency');

  -- Quiz 5: Perfil Psicológico Completo
  INSERT INTO public.quizzes (title, slug, description, short_description, category, duration_minutes, question_count, icon)
  VALUES ('Perfil Psicológico Completo', 'perfil-psicologico-completo', 'Descubra tendências do seu estilo emocional, comportamental e cognitivo em um relatório resumido e informativo.', 'Análise integrada do seu perfil emocional, comportamental e cognitivo.', 'psicologico', 4, 16, 'User')
  RETURNING id INTO v_quiz_id;

  INSERT INTO public.questions (quiz_id, question_text, question_type, question_order) VALUES (v_quiz_id, 'Costumo controlar bem minhas emoções.', 'likert', 1) RETURNING id INTO v_q_id;
  PERFORM public.insert_likert_answers(v_q_id, 'agreement');
  INSERT INTO public.questions (quiz_id, question_text, question_type, question_order) VALUES (v_quiz_id, 'Tenho facilidade em lidar com pressão.', 'likert', 2) RETURNING id INTO v_q_id;
  PERFORM public.insert_likert_answers(v_q_id, 'agreement');
  INSERT INTO public.questions (quiz_id, question_text, question_type, question_order) VALUES (v_quiz_id, 'Penso demais antes de decidir.', 'likert', 3) RETURNING id INTO v_q_id;
  PERFORM public.insert_likert_answers(v_q_id, 'agreement');
  INSERT INTO public.questions (quiz_id, question_text, question_type, question_order) VALUES (v_quiz_id, 'Confio facilmente nas pessoas.', 'likert', 4) RETURNING id INTO v_q_id;
  PERFORM public.insert_likert_answers(v_q_id, 'agreement');
  INSERT INTO public.questions (quiz_id, question_text, question_type, question_order) VALUES (v_quiz_id, 'Reajo intensamente a críticas.', 'likert', 5) RETURNING id INTO v_q_id;
  PERFORM public.insert_likert_answers(v_q_id, 'agreement');
  INSERT INTO public.questions (quiz_id, question_text, question_type, question_order) VALUES (v_quiz_id, 'Sou disciplinado com metas.', 'likert', 6) RETURNING id INTO v_q_id;
  PERFORM public.insert_likert_answers(v_q_id, 'agreement');
  INSERT INTO public.questions (quiz_id, question_text, question_type, question_order) VALUES (v_quiz_id, 'Tenho tendência a evitar conflitos.', 'likert', 7) RETURNING id INTO v_q_id;
  PERFORM public.insert_likert_answers(v_q_id, 'agreement');
  INSERT INTO public.questions (quiz_id, question_text, question_type, question_order) VALUES (v_quiz_id, 'Sinto necessidade de aprovação com frequência.', 'likert', 8) RETURNING id INTO v_q_id;
  PERFORM public.insert_likert_answers(v_q_id, 'agreement');
  INSERT INTO public.questions (quiz_id, question_text, question_type, question_order) VALUES (v_quiz_id, 'Tenho facilidade em me adaptar.', 'likert', 9) RETURNING id INTO v_q_id;
  PERFORM public.insert_likert_answers(v_q_id, 'agreement');
  INSERT INTO public.questions (quiz_id, question_text, question_type, question_order) VALUES (v_quiz_id, 'Sou muito observador.', 'likert', 10) RETURNING id INTO v_q_id;
  PERFORM public.insert_likert_answers(v_q_id, 'agreement');
  INSERT INTO public.questions (quiz_id, question_text, question_type, question_order) VALUES (v_quiz_id, 'Costumo assumir liderança naturalmente.', 'likert', 11) RETURNING id INTO v_q_id;
  PERFORM public.insert_likert_answers(v_q_id, 'agreement');
  INSERT INTO public.questions (quiz_id, question_text, question_type, question_order) VALUES (v_quiz_id, 'Tenho dificuldade em desacelerar a mente.', 'likert', 12) RETURNING id INTO v_q_id;
  PERFORM public.insert_likert_answers(v_q_id, 'agreement');
  INSERT INTO public.questions (quiz_id, question_text, question_type, question_order) VALUES (v_quiz_id, 'Gosto de ambientes previsíveis.', 'likert', 13) RETURNING id INTO v_q_id;
  PERFORM public.insert_likert_answers(v_q_id, 'agreement');
  INSERT INTO public.questions (quiz_id, question_text, question_type, question_order) VALUES (v_quiz_id, 'Tomo decisões mais pela lógica do que pela emoção.', 'likert', 14) RETURNING id INTO v_q_id;
  PERFORM public.insert_likert_answers(v_q_id, 'agreement');
  INSERT INTO public.questions (quiz_id, question_text, question_type, question_order) VALUES (v_quiz_id, 'Sou persistente mesmo quando algo fica difícil.', 'likert', 15) RETURNING id INTO v_q_id;
  PERFORM public.insert_likert_answers(v_q_id, 'agreement');
  INSERT INTO public.questions (quiz_id, question_text, question_type, question_order) VALUES (v_quiz_id, 'Tenho facilidade para perceber minhas próprias mudanças de humor.', 'likert', 16) RETURNING id INTO v_q_id;
  PERFORM public.insert_likert_answers(v_q_id, 'agreement');
END $$;
