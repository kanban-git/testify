import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useQuizSession } from '@/hooks/useQuizSession';
import { useMetrics } from '@/hooks/useMetrics';
import { calculateScore } from '@/lib/scoring';
import { motion } from 'framer-motion';
import { Brain, BarChart3, FileText } from 'lucide-react';

const steps = [
  { icon: Brain, text: 'Analisando suas respostas...' },
  { icon: BarChart3, text: 'Comparando com padrões de referência...' },
  { icon: FileText, text: 'Gerando seu relatório personalizado...' },
];

export default function QuizProcessing() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { completeSession, saveResult } = useQuizSession();
  const { trackEvent } = useMetrics();
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const { sessionId, quizId } = (location.state as { sessionId: string; quizId: string }) || {};

  useEffect(() => {
    if (!sessionId || !quizId) {
      navigate(`/quiz/${slug}`);
      return;
    }

    // Animate steps
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    }, 2000);

    // Animate progress
    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + 2, 95));
    }, 120);

    // Process result
    const processResult = async () => {
      try {
        await completeSession(sessionId);
        trackEvent('quiz_completed', quizId, sessionId);

        // Get responses
        const { data: responses } = await supabase
          .from('responses')
          .select('score_value')
          .eq('session_id', sessionId);

        // Get max score
        const { data: questions } = await supabase
          .from('questions')
          .select('id')
          .eq('quiz_id', quizId);

        const qIds = ((questions as { id: string }[]) || []).map(q => q.id);
        let maxScore = 0;
        if (qIds.length > 0) {
          const { data: allAnswers } = await supabase
            .from('answers')
            .select('question_id, score_value')
            .in('question_id', qIds);
          
          // Get max score per question
          const maxPerQ: Record<string, number> = {};
          ((allAnswers as { question_id: string; score_value: number }[]) || []).forEach(a => {
            maxPerQ[a.question_id] = Math.max(maxPerQ[a.question_id] || 0, a.score_value);
          });
          maxScore = Object.values(maxPerQ).reduce((s, v) => s + v, 0);
        }

        const result = calculateScore(
          slug || '',
          (responses as { score_value: number }[]) || [],
          maxScore
        );

        await saveResult(sessionId, quizId, result);

        // Wait for animation to finish
        setTimeout(() => {
          setProgress(100);
          setTimeout(() => {
            navigate(`/quiz/${slug}/result`, { state: { sessionId, quizId } });
          }, 500);
        }, 1500);
      } catch (err) {
        console.error(err);
        setTimeout(() => navigate(`/quiz/${slug}/result`, { state: { sessionId, quizId } }), 3000);
      }
    };

    processResult();

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
    };
  }, [sessionId, quizId]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="h-16 w-16 mx-auto rounded-full border-4 border-primary border-t-transparent"
        />

        <div className="space-y-4">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: i <= currentStep ? 1 : 0.3, y: 0 }}
                transition={{ delay: i * 0.5, duration: 0.5 }}
                className={`flex items-center gap-3 text-left ${i <= currentStep ? 'text-foreground' : 'text-muted-foreground'}`}
              >
                <Icon className={`h-5 w-5 shrink-0 ${i <= currentStep ? 'text-primary' : ''}`} />
                <span className="text-sm">{step.text}</span>
                {i < currentStep && <span className="text-success ml-auto">✓</span>}
              </motion.div>
            );
          })}
        </div>

        <div className="space-y-2">
          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <p className="text-sm text-muted-foreground">{Math.round(progress)}% concluído</p>
        </div>
      </div>
    </div>
  );
}
