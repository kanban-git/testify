import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DisclaimerBanner from '@/components/DisclaimerBanner';
import { Button } from '@/components/ui/button';
import { useMetrics } from '@/hooks/useMetrics';
import { Brain, Zap, Heart, Activity, User, Clock, CheckCircle, ArrowRight } from 'lucide-react';

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

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="py-16 md:py-24">
          <div className="container max-w-2xl mx-auto text-center space-y-8">
            <div className="h-20 w-20 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center">
              <Icon className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-3xl md:text-5xl font-display font-bold">{quiz.title}</h1>
            <p className="text-lg text-muted-foreground">{quiz.description}</p>

            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> Leva cerca de {quiz.duration_minutes} minutos</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4" /> {quiz.question_count} perguntas</span>
            </div>

            <div className="bg-card rounded-xl p-6 border border-border text-left space-y-3">
              <h3 className="font-display font-semibold text-lg">O que você recebe:</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-success shrink-0" /> Resultado preliminar gratuito</li>
                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-success shrink-0" /> Relatório personalizado completo</li>
                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-success shrink-0" /> Comparação com outros participantes</li>
                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-success shrink-0" /> Envio do resultado por email</li>
              </ul>
            </div>

            <Button size="lg" className="text-lg px-10 py-6" onClick={() => navigate(`/quiz/${slug}/play`)}>
              Começar agora <ArrowRight className="ml-2 h-5 w-5" />
            </Button>

            <DisclaimerBanner variant={isTDAH ? 'strong' : 'default'} />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
