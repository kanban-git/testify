import { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useQuizSession } from '@/hooks/useQuizSession';
import { useMetrics } from '@/hooks/useMetrics';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, ChevronRight } from 'lucide-react';

interface Question {
  id: string; question_text: string; question_type: string; question_order: number;
}
interface Answer {
  id: string; question_id: string; answer_text: string; score_value: number; answer_order: number;
}

const answerEmojis = ['😕', '🤔', '😐', '🙂', '😄'];

export default function QuizPlay() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { createSession, saveResponse } = useQuizSession();
  const { trackEvent } = useMetrics();

  const isTestMode = searchParams.get('test') === '1';

  const [quizId, setQuizId] = useState<string>('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, Answer[]>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionId, setSessionId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [motivation, setMotivation] = useState('');
  const [motivationSubmitted, setMotivationSubmitted] = useState(false);

  useEffect(() => {
    if (!slug) return;
    (async () => {
      const { data: quiz } = await supabase.from('quizzes').select('id').eq('slug', slug).single();
      if (!quiz) return;
      const qId = (quiz as { id: string }).id;
      setQuizId(qId);

      const { data: qs } = await supabase.from('questions').select('*').eq('quiz_id', qId).order('question_order');
      const questionList = (qs as Question[]) || [];
      setQuestions(questionList);

      const qIds = questionList.map(q => q.id);
      const { data: ans } = await supabase.from('answers').select('*').in('question_id', qIds).order('answer_order');
      const grouped: Record<string, Answer[]> = {};
      ((ans as Answer[]) || []).forEach(a => {
        if (!grouped[a.question_id]) grouped[a.question_id] = [];
        grouped[a.question_id].push(a);
      });
      setAnswers(grouped);

      const sid = await createSession(qId);

      if (isTestMode) {
        await (supabase.from('quiz_sessions').update as any)({ is_test: true }).eq('id', sid);
      }

      setSessionId(sid);
      trackEvent('quiz_started', qId, sid);
      setLoading(false);
    })();
  }, [slug]);

  const currentQuestion = questions[currentIndex];
  const currentAnswers = currentQuestion ? (answers[currentQuestion.id] || []) : [];
  const progress = questions.length > 0 ? ((currentIndex) / questions.length) * 100 : 0;

  const handleAnswer = async (answer: Answer) => {
    if (isTransitioning) return;
    setSelectedAnswer(answer.id);
    setIsTransitioning(true);

    await saveResponse(sessionId, currentQuestion.id, answer.id, answer.score_value);
    trackEvent('question_answered', quizId, sessionId, { question_order: currentIndex + 1 });

    setTimeout(() => {
      if (currentIndex + 1 >= questions.length) {
        navigate(`/quiz/${slug}/processing`, { state: { sessionId, quizId, isTestMode } });
      } else {
        setCurrentIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setIsTransitioning(false);
      }
    }, 400);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {isTestMode && (
        <div className="bg-warning/10 text-warning text-center text-xs py-1.5 font-semibold">
          ⚠️ Modo teste ativo
        </div>
      )}

      {/* Progress bar */}
      <div className="sticky top-0 z-50 bg-background/90 backdrop-blur-xl border-b border-border/50">
        <div className="container py-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
            <span className="flex items-center gap-2 font-medium">
              <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Brain className="h-4 w-4 text-primary-foreground" />
              </div>
              Pergunta {currentIndex + 1} de {questions.length}
            </span>
            <span className="text-xs font-semibold bg-primary/10 text-primary rounded-full px-3 py-1">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <h2 className="text-xl md:text-2xl font-display font-bold text-center leading-relaxed">
                {currentQuestion?.question_text}
              </h2>

              <div className="space-y-3">
                {currentAnswers.map((answer, i) => {
                  const isSelected = selectedAnswer === answer.id;
                  return (
                    <motion.button
                      key={answer.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={`w-full text-left rounded-xl p-4 border-2 transition-all duration-200 flex items-center gap-3 ${
                        isSelected
                          ? 'border-primary bg-primary/10 shadow-lg shadow-primary/10'
                          : 'border-border/50 bg-card hover:border-primary/40 hover:bg-primary/5'
                      }`}
                      onClick={() => handleAnswer(answer)}
                      disabled={isTransitioning}
                    >
                      <span className="text-lg">{answerEmojis[i] || '•'}</span>
                      <span className="text-sm font-medium flex-1">{answer.answer_text}</span>
                      {isSelected && <ChevronRight className="h-4 w-4 text-primary" />}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}