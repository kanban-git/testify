
-- Update the quiz metadata
UPDATE public.quizzes 
SET title = 'Perfil de Raciocínio',
    slug = 'perfil-de-raciocinio',
    description = 'Descubra tendências do seu estilo de pensamento, tomada de decisão e organização mental com um teste rápido e informativo.',
    short_description = 'Descubra seu estilo cognitivo e padrões de raciocínio.',
    icon = 'Brain'
WHERE id = '85942db9-b65d-408c-bbcb-2d8e366235ee';

-- Delete old answers for old questions of this quiz
DELETE FROM public.answers WHERE question_id IN (
  SELECT id FROM public.questions WHERE quiz_id = '85942db9-b65d-408c-bbcb-2d8e366235ee'
);

-- Delete old questions
DELETE FROM public.questions WHERE quiz_id = '85942db9-b65d-408c-bbcb-2d8e366235ee';

-- Insert new 16 Likert questions
INSERT INTO public.questions (quiz_id, question_text, question_type, question_order) VALUES
('85942db9-b65d-408c-bbcb-2d8e366235ee', 'Quando preciso resolver um problema, costumo dividir a situação em partes menores.', 'likert', 1),
('85942db9-b65d-408c-bbcb-2d8e366235ee', 'Antes de tomar uma decisão importante, geralmente analiso várias possibilidades.', 'likert', 2),
('85942db9-b65d-408c-bbcb-2d8e366235ee', 'Tenho facilidade em perceber padrões em informações, números ou comportamentos.', 'likert', 3),
('85942db9-b65d-408c-bbcb-2d8e366235ee', 'Costumo confiar mais na lógica do que na intuição ao decidir algo.', 'likert', 4),
('85942db9-b65d-408c-bbcb-2d8e366235ee', 'Quando algo muda de última hora, consigo adaptar meu raciocínio rapidamente.', 'likert', 5),
('85942db9-b65d-408c-bbcb-2d8e366235ee', 'Prefiro resolver uma tarefa de cada vez em vez de lidar com várias ao mesmo tempo.', 'likert', 6),
('85942db9-b65d-408c-bbcb-2d8e366235ee', 'Costumo revisar mentalmente minhas decisões depois que as tomo.', 'likert', 7),
('85942db9-b65d-408c-bbcb-2d8e366235ee', 'Tenho facilidade em notar detalhes que outras pessoas normalmente deixam passar.', 'likert', 8),
('85942db9-b65d-408c-bbcb-2d8e366235ee', 'Sob pressão, consigo manter o pensamento relativamente organizado.', 'likert', 9),
('85942db9-b65d-408c-bbcb-2d8e366235ee', 'Antes de agir, costumo pensar nas consequências possíveis.', 'likert', 10),
('85942db9-b65d-408c-bbcb-2d8e366235ee', 'Gosto de atividades que envolvem estratégia, análise ou planejamento.', 'likert', 11),
('85942db9-b65d-408c-bbcb-2d8e366235ee', 'Quando recebo novas informações, ajusto minha opinião com facilidade.', 'likert', 12),
('85942db9-b65d-408c-bbcb-2d8e366235ee', 'Costumo decidir rapidamente quando sinto que já entendi o suficiente.', 'likert', 13),
('85942db9-b65d-408c-bbcb-2d8e366235ee', 'Meu pensamento funciona melhor quando tenho estrutura, ordem e clareza.', 'likert', 14),
('85942db9-b65d-408c-bbcb-2d8e366235ee', 'Em discussões, tendo a valorizar mais argumentos lógicos do que argumentos emocionais.', 'likert', 15),
('85942db9-b65d-408c-bbcb-2d8e366235ee', 'Tenho o hábito de buscar sentido, coerência ou padrão nas coisas do dia a dia.', 'likert', 16);

-- Insert Likert answers for each new question using the existing function
DO $$
DECLARE
  q RECORD;
BEGIN
  FOR q IN SELECT id FROM public.questions WHERE quiz_id = '85942db9-b65d-408c-bbcb-2d8e366235ee' ORDER BY question_order
  LOOP
    PERFORM public.insert_likert_answers(q.id, 'agreement');
  END LOOP;
END $$;
