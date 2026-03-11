import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DisclaimerBanner from '@/components/DisclaimerBanner';
import { Button } from '@/components/ui/button';
import { useMetrics } from '@/hooks/useMetrics';
import { Brain, Zap, Heart, Activity, User, Clock, CheckCircle, ArrowRight, Sparkles, BarChart3, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = { Brain, Zap, Heart, Activity, User };

interface Quiz {
  id: string; title: string; slug: string; description: string; short_description: string;
  category: string; duration_minutes: number; question_count: number; icon: string;
}

export default function QuizLanding() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const { trackEvent } = useMetrics();

  useEffect(() => {
    if (!slug) return;
    supabase.from('quizzes').select('*').eq('slug', slug).single().then(({ data }) => {
      setQuiz(data as Quiz | null);
      setLoading(false);
      if (data) trackEvent('page_view', (data as Quiz).id);
    });
  }, [slug]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  if (!quiz) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Teste não encontrado.</div>;

  const Icon = iconMap[quiz.icon] || Brain;
  const isTDAH = quiz.slug === 'indicadores-de-tdah';

  const features = [
    { icon: BarChart3, text: 'Resultado preliminar gratuito' },
    { icon: Sparkles, text: 'Relatório personalizado completo' },
    { icon: Shield, text: 'Comparação com outros participantes' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="py-20 md:py-28">
          <div className="container max-w-2xl mx-auto space-y-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-6"
            >
              <div className="h-20 w-20 mx-auto rounded-3xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-xl shadow-primary/20">
                <Icon className="h-10 w-10 text-primary-foreground" />
              </div>

              <h1 className="text-3xl md:text-5xl font-display font-extrabold leading-tight">{quiz.title}</h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-lg mx-auto">{quiz.description}</p>

              <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5 bg-muted rounded-full px-4 py-1.5">
                  <Clock className="h-4 w-4 text-primary" /> {quiz.duration_minutes} minutos
                </span>
                <span className="flex items-center gap-1.5 bg-muted rounded-full px-4 py-1.5">
                  <Sparkles className="h-4 w-4 text-primary" /> {quiz.question_count} perguntas
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl bg-card border border-border/50 p-8 space-y-5"
            >
              <h3 className="font-display font-bold text-lg flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-success" /> O que você recebe
              </h3>
              <div className="grid gap-4">
                {features.map((f, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <f.icon className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-sm font-medium">{f.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center"
            >
              <Button
                size="lg"
                className="text-lg px-12 py-7 rounded-2xl shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-shadow font-display font-bold"
                onClick={() => navigate(`/quiz/${slug}/play`)}
              >
                Começar agora <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>

            <DisclaimerBanner variant={isTDAH ? 'strong' : 'default'} />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}