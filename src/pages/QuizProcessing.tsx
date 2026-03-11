import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useQuizSession } from '@/hooks/useQuizSession';
import { useMetrics } from '@/hooks/useMetrics';
import { calculateScore } from '@/lib/scoring';
import { motion } from 'framer-motion';
import { Brain, BarChart3, FileText, User, Mail, Sparkles } from 'lucide-react';
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

    await (supabase.from('quiz_sessions').update as any)({ name: name.trim(), email: email.trim() }).eq('id', sessionId);
    trackEvent('user_info_submitted', quizId, sessionId, { name, email });

    setPhase('processing');
    startProcessing();
  };

  const startProcessing = () => {
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    }, 2000);

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
          <Card className="rounded-2xl border-border/50 overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-primary via-accent to-primary" />
            <CardContent className="pt-10 pb-8 space-y-8">
              <div className="text-center space-y-3">
                <div className="h-16 w-16 mx-auto rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
                  <Brain className="h-8 w-8 text-primary-foreground" />
                </div>
                <h2 className="text-2xl font-display font-bold">Quase lá!</h2>
                <p className="text-sm text-muted-foreground">
                  Informe seus dados para gerar seu relatório personalizado
                </p>
              </div>

              <form onSubmit={handleSubmitInfo} className="space-y-4">
                <div className="space-y-3">
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Seu nome"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      required
                      className="pl-10 rounded-xl h-12"
                      maxLength={100}
                    />
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="Seu melhor email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      className="pl-10 rounded-xl h-12"
                      maxLength={255}
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full rounded-xl h-12 font-display font-bold text-base" size="lg" disabled={submitting}>
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
      <div className="max-w-md w-full text-center space-y-10">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="h-16 w-16 mx-auto rounded-full border-4 border-primary border-t-transparent"
        />

        <div className="space-y-5">
          {steps.map((step, i) => {
            const Icon = step.icon;
            const isActive = i <= currentStep;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: isActive ? 1 : 0.3, y: 0 }}
                transition={{ delay: i * 0.5, duration: 0.5 }}
                className={`flex items-center gap-3 text-left p-3 rounded-xl ${isActive ? 'bg-card border border-border/50' : ''}`}
              >
                <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${isActive ? 'bg-primary/10' : 'bg-muted'}`}>
                  <Icon className={`h-4 w-4 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                </div>
                <span className="text-sm font-medium">{step.text}</span>
                {i < currentStep && <Sparkles className="text-success ml-auto h-4 w-4" />}
              </motion.div>
            );
          })}
        </div>

        <div className="space-y-3">
          <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <p className="text-sm text-muted-foreground font-medium">{Math.round(progress)}% concluído</p>
        </div>
      </div>
    </div>
  );
}