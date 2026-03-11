import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useQuizSession } from '@/hooks/useQuizSession';
import { useMetrics } from '@/hooks/useMetrics';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain } from 'lucide-react';

interface Question {
  id: string; question_text: string; question_type: string; question_order: number;
}
interface Answer {
  id: string; question_id: string; answer_text: string; score_value: number; answer_order: number;
}

export default function QuizPlay() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { createSession, saveResponse } = useQuizSession();
  const { trackEvent } = useMetrics();

  const [quizId, setQuizId] = useState<string>('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, Answer[]>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionId, setSessionId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

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
        navigate(`/quiz/${slug}/processing`, { state: { sessionId, quizId } });
      } else {
        setCurrentIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setIsTransitioning(false);
      }
    }, 400);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Progress bar */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="container py-3">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
            <span className="flex items-center gap-1.5"><Brain className="h-4 w-4 text-primary" /> Pergunta {currentIndex + 1} de {questions.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <h2 className="text-xl md:text-2xl font-display font-semibold text-center leading-relaxed">
                {currentQuestion?.question_text}
              </h2>
              <div className="space-y-3">
                {currentAnswers.map((answer) => (
                  <Button
                    key={answer.id}
                    variant={selectedAnswer === answer.id ? "default" : "outline"}
                    className={`w-full justify-start text-left py-4 px-5 h-auto text-base whitespace-normal transition-all ${selectedAnswer === answer.id ? 'ring-2 ring-primary' : 'hover:bg-primary/5'}`}
                    onClick={() => handleAnswer(answer)}
                    disabled={isTransitioning}
                  >
                    {answer.answer_text}
                  </Button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
