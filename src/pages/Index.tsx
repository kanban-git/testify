import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import QuizCard from '@/components/QuizCard';
import { Brain, Shield, BarChart3, Sparkles, ArrowDown } from 'lucide-react';
import { motion } from 'framer-motion';

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
        <section className="relative py-24 md:py-36 overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-glow" />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1.5s' }} />
          </div>

          <div className="container relative text-center max-w-3xl mx-auto space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-5 py-2 text-sm font-semibold border border-primary/20">
                <Sparkles className="h-4 w-4" /> Análises Cognitivas Personalizadas
              </div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-extrabold tracking-tight leading-[1.1]">
                Descubra seu{' '}
                <span className="text-gradient">Perfil Cognitivo</span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Testes baseados em padrões de avaliação cognitiva e comportamental.
                Receba relatórios detalhados com análise individual do seu perfil.
              </p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="pt-4"
              >
                <a href="#testes" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                  Explorar testes <ArrowDown className="h-4 w-4 animate-float" />
                </a>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Quizzes */}
        <section id="testes" className="py-20 scroll-mt-16">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-14 space-y-3"
            >
              <h2 className="text-3xl md:text-4xl font-display font-bold">Testes Disponíveis</h2>
              <p className="text-muted-foreground max-w-lg mx-auto">Escolha um teste e receba uma análise personalizada do seu perfil</p>
            </motion.div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-72 rounded-2xl bg-muted/50 animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {quizzes.map((q, i) => (
                  <motion.div
                    key={q.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <QuizCard
                      title={q.title}
                      slug={q.slug}
                      description={q.short_description || q.description || ''}
                      icon={q.icon || 'Brain'}
                      duration={q.duration_minutes}
                      questionCount={q.question_count}
                      category={q.category || ''}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Features */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/30 to-transparent" />
          <div className="container max-w-5xl relative">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Brain,
                  title: 'Testes Informativos',
                  desc: 'Baseados em padrões de avaliação cognitiva e comportamental reconhecidos.',
                  gradient: 'from-primary to-primary-glow',
                },
                {
                  icon: BarChart3,
                  title: 'Relatórios Detalhados',
                  desc: 'Resultados com gráficos comparativos e análise individual do seu perfil.',
                  gradient: 'from-accent to-accent',
                },
                {
                  icon: Shield,
                  title: 'Privacidade Garantida',
                  desc: 'Seus dados são protegidos e seus resultados são completamente confidenciais.',
                  gradient: 'from-success to-success',
                },
              ].map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="group text-center space-y-4 p-6 rounded-2xl hover:bg-card/80 transition-all duration-300"
                >
                  <div className={`h-14 w-14 mx-auto rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg shadow-primary/10`}>
                    <feature.icon className="h-7 w-7 text-primary-foreground" />
                  </div>
                  <h3 className="font-display font-bold text-lg">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;