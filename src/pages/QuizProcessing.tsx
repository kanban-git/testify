import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useQuizSession } from '@/hooks/useQuizSession';
import { useMetrics } from '@/hooks/useMetrics';
import { calculateScore } from '@/lib/scoring';
import { motion } from 'framer-motion';
import { Brain, BarChart3, FileText, User, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

const steps = [
  { icon: Brain, text: 'Analisando suas respostas...' },
  { icon: BarChart3, text: 'Comparando com padrões de referência...' },
  { icon: FileText, text: 'Gerando seu relatório personalizado...' },
];

export default function QuizProcessing() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { completeSession, saveResult, updateEmail } = useQuizSession();
  const { trackEvent } = useMetrics();
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'collecting' | 'processing'>('collecting');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { sessionId, quizId, isTestMode } = (location.state as { sessionId: string; quizId: string; isTestMode?: boolean }) || {};

  useEffect(() => {
    if (!sessionId || !quizId) {
      navigate(`/quiz/${slug}`);
    }
  }, [sessionId, quizId]);

  const handleSubmitInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setSubmitting(true);

    // Save name and email to session
    await (supabase.from('quiz_sessions').update as any)({ name: name.trim(), email: email.trim() }).eq('id', sessionId);
    trackEvent('user_info_submitted', quizId, sessionId, { name, email });

    setPhase('processing');
    startProcessing();
  };

  const startProcessing = () => {
    // Animate steps
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    }, 2000);

    // Animate progress
    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + 2, 95));
    }, 120);

    const processResult = async () => {
      try {
        await completeSession(sessionId);
        trackEvent('quiz_completed', quizId, sessionId);

        const { data: responses } = await supabase
          .from('responses')
          .select('score_value')
          .eq('session_id', sessionId);

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

        // In test mode, auto-unlock the result
        if (isTestMode) {
          await (supabase.from('results').update as any)({ unlocked: true }).eq('session_id', sessionId);
          await (supabase.from('quiz_sessions').update as any)({ payment_status: 'test_approved' }).eq('id', sessionId);
        }

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
  };

  if (!sessionId || !quizId) return null;

  if (phase === 'collecting') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full">
          <Card>
            <CardContent className="pt-8 space-y-6">
              <div className="text-center space-y-2">
                <div className="h-14 w-14 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                  <Brain className="h-7 w-7 text-primary" />
                </div>
                <h2 className="text-xl font-display font-bold">Quase lá!</h2>
                <p className="text-sm text-muted-foreground">
                  Informe seus dados para gerar seu relatório personalizado
                </p>
              </div>

              <form onSubmit={handleSubmitInfo} className="space-y-4">
                <div className="space-y-2">
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Seu nome"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      required
                      className="pl-10"
                      maxLength={100}
                    />
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="Seu melhor email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      className="pl-10"
                      maxLength={255}
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full" size="lg" disabled={submitting}>
                  {submitting ? 'Processando...' : 'Gerar meu relatório'}
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  Seus dados são usados apenas para enviar o resultado.
                </p>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

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
                {i < currentStep && <span className="text-emerald-500 ml-auto">✓</span>}
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
