import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import QuizCard from '@/components/QuizCard';
import { Brain, Shield, BarChart3 } from 'lucide-react';

interface Quiz {
  id: string;
  title: string;
  slug: string;
  description: string;
  short_description: string;
  category: string;
  duration_minutes: number;
  question_count: number;
  icon: string;
}

const Index = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('quizzes').select('*').eq('active', true).order('created_at').then(({ data }) => {
      setQuizzes((data as Quiz[]) || []);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
          <div className="container relative text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium">
              <Brain className="h-4 w-4" /> Testes Científicos e Informativos
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight">
              Testes Cognitivos e{' '}
              <span className="text-gradient">Psicológicos</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Descubra mais sobre seu perfil cognitivo, traços psicológicos e padrões de raciocínio
              com testes informativos e relatórios personalizados.
            </p>
          </div>
        </section>

        {/* Quizzes */}
        <section className="py-16 container">
          <h2 className="text-2xl font-display font-bold text-center mb-10">Testes Disponíveis</h2>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3].map(i => <div key={i} className="h-64 rounded-lg bg-muted animate-pulse" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quizzes.map(q => (
                <QuizCard key={q.id} title={q.title} slug={q.slug} description={q.short_description || q.description || ''} icon={q.icon || 'Brain'} duration={q.duration_minutes} questionCount={q.question_count} category={q.category || ''} />
              ))}
            </div>
          )}
        </section>

        {/* Features */}
        <section className="py-16 bg-muted/50">
          <div className="container max-w-4xl">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="space-y-3">
                <div className="h-12 w-12 mx-auto rounded-xl bg-primary/10 flex items-center justify-center">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-display font-semibold">Testes Informativos</h3>
                <p className="text-sm text-muted-foreground">Baseados em padrões de avaliação cognitiva e comportamental reconhecidos.</p>
              </div>
              <div className="space-y-3">
                <div className="h-12 w-12 mx-auto rounded-xl bg-accent/10 flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-display font-semibold">Relatórios Personalizados</h3>
                <p className="text-sm text-muted-foreground">Resultados detalhados com gráficos comparativos e análise individual.</p>
              </div>
              <div className="space-y-3">
                <div className="h-12 w-12 mx-auto rounded-xl bg-success/10 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-success" />
                </div>
                <h3 className="font-display font-semibold">Privacidade Garantida</h3>
                <p className="text-sm text-muted-foreground">Seus dados são protegidos e seus resultados são confidenciais.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
