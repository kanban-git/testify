import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useQuizSession } from '@/hooks/useQuizSession';
import { useMetrics } from '@/hooks/useMetrics';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DisclaimerBanner from '@/components/DisclaimerBanner';
import UnlockedReport from '@/components/UnlockedReport';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { Lock, CheckCircle, Mail, Star, Users, ArrowRight, Shield, CreditCard, Brain, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface Result {
  id: string; total_score: number; max_score: number; percentile: number;
  result_title: string; result_summary: string; full_report: any; unlocked: boolean;
}

function getIQClassification(iq: number): string {
  if (iq >= 140) return 'Gênio ou quase gênio';
  if (iq >= 130) return 'Superdotado';
  if (iq >= 120) return 'Inteligência superior';
  if (iq >= 110) return 'Inteligência acima da média';
  if (iq >= 90) return 'Inteligência normal';
  return 'Inteligência abaixo da média';
}

export default function QuizResult() {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { unlockResult, updateEmail } = useQuizSession();
  const { trackEvent } = useMetrics();

  const { sessionId, quizId } = (location.state as { sessionId: string; quizId: string }) || {};
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [showPaywall, setShowPaywall] = useState(true);
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {
    if (!sessionId) { navigate(`/quiz/${slug}`); return; }
    supabase.from('results').select('*').eq('session_id', sessionId).single().then(({ data }) => {
      const r = data as Result | null;
      setResult(r);
      setShowPaywall(!r?.unlocked);
      setLoading(false);
      trackEvent('paywall_viewed', quizId, sessionId);
    });
  }, [sessionId]);

  const handlePayment = async () => {
    if (!sessionId || !result) return;
    setPaymentLoading(true);
    trackEvent('payment_initiated', quizId, sessionId);

    try {
      const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
      const res = await fetch(`https://${projectId}.supabase.co/functions/v1/mercadopago-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          session_id: sessionId,
          quiz_id: quizId,
          amount: 7.90,
          description: `Relatório completo - ${result.result_title}`,
          payer_email: email || undefined,
        }),
      });

      const data = await res.json();

      if (data.init_point) {
        window.location.href = data.init_point;
      } else if (data.error) {
        toast.error('Erro ao iniciar pagamento. Tente novamente.');
        console.error('Payment error:', data.error);
      }
    } catch (err) {
      toast.error('Erro ao conectar com o serviço de pagamento.');
      console.error(err);
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !sessionId) return;
    await updateEmail(sessionId, email);
    trackEvent('email_submitted', quizId, sessionId, { email });
    setEmailSubmitted(true);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  if (!result) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Resultado não encontrado.</div>;

  const isIQTest = slug === 'teste-de-qi';
  const isTDAH = slug === 'indicadores-de-tdah';
  const report = result.full_report as { sections: any[]; disclaimer: string; iqScore?: number } | null;
  const iqScore = report?.iqScore;

  const previewSections = report?.sections?.filter(s =>
    s.title !== 'Perfil Predominante' && s.type !== 'traits'
  ).slice(0, 3) || [];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 py-6 md:py-20 px-4 md:px-0">
        <div className="container max-w-2xl mx-auto space-y-6 md:space-y-8">
          {/* Preliminary Result */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="h-20 w-20 mx-auto rounded-3xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-xl shadow-primary/25"
            >
              <Brain className="h-10 w-10 text-primary-foreground" />
            </motion.div>

            {isIQTest && iqScore ? (
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4, type: 'spring', stiffness: 150 }}
                className="space-y-2"
              >
                <p className="text-sm font-semibold text-primary uppercase tracking-[0.2em]">Seu QI estimado</p>
                <div className="text-6xl md:text-8xl font-display font-black text-gradient">{iqScore}</div>
                <p className="text-lg font-semibold text-muted-foreground">{getIQClassification(iqScore)}</p>
              </motion.div>
            ) : null}

            <div className="space-y-3">
              <p className="text-sm font-semibold text-primary uppercase tracking-[0.2em]">Sua análise está pronta</p>
              <p className="text-base text-muted-foreground">Perfil predominante:</p>
              <h1 className="text-3xl md:text-5xl font-display font-extrabold">{result.result_title}</h1>
              <p className="text-lg text-muted-foreground max-w-lg mx-auto leading-relaxed">{result.result_summary}</p>
            </div>

            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-6 py-2.5 font-semibold text-sm border border-primary/20">
              <Users className="h-4 w-4" />
              Seu perfil se destaca entre {result.percentile}% dos participantes
            </div>
          </motion.div>

          {showPaywall ? (
            <>
              {/* Blurred preview */}
              {previewSections.map((section: any, i: number) => (
                <div key={i} className="blur-content select-none">
                  <Card className="rounded-2xl">
                    <CardHeader><CardTitle className="text-base">{section.title}</CardTitle></CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{section.content?.substring(0, 200)}...</p>
                    </CardContent>
                  </Card>
                </div>
              ))}

              {/* Paywall */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <Card className="rounded-2xl border-primary/20 overflow-hidden">
                  <div className="h-1.5 bg-gradient-to-r from-primary via-accent to-primary" />
                  <CardContent className="pt-8 pb-8 space-y-8">
                    <div className="text-center space-y-3">
                      <div className="h-14 w-14 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center">
                        <Lock className="h-7 w-7 text-primary" />
                      </div>
                      <h3 className="text-xl font-display font-bold">Desbloqueie seu relatório completo</h3>
                      <p className="text-sm text-muted-foreground">Análise detalhada e personalizada do seu perfil</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        'Mapa de traços cognitivos',
                        'Estilo de pensamento',
                        'Potenciais identificados',
                        'Pontos fortes',
                        'Áreas de desenvolvimento',
                        'Comparação com participantes',
                        'Estilo de aprendizado',
                        'Interpretação final detalhada',
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-2 p-2.5 rounded-xl bg-muted/50 text-sm">
                          <CheckCircle className="h-4 w-4 text-success shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>

                    {/* Email capture */}
                    {!emailSubmitted ? (
                      <form onSubmit={handleEmailSubmit} className="space-y-3">
                        <div className="flex gap-2">
                          <Input type="email" placeholder="Seu melhor email" value={email} onChange={e => setEmail(e.target.value)} required className="flex-1 rounded-xl" />
                          <Button type="submit" variant="outline" size="icon" className="rounded-xl shrink-0"><Mail className="h-4 w-4" /></Button>
                        </div>
                      </form>
                    ) : (
                      <p className="text-sm text-success flex items-center gap-1.5"><CheckCircle className="h-4 w-4" /> Email salvo com sucesso!</p>
                    )}

                    <div className="text-center space-y-4">
                      <div>
                        <div className="text-4xl font-display font-extrabold text-gradient">R$ 7,90</div>
                        <p className="text-xs text-muted-foreground mt-1">Pagamento único • Acesso imediato</p>
                      </div>
                      <Button
                        size="lg"
                        className="w-full text-lg py-7 rounded-2xl shadow-lg shadow-primary/20 font-display font-bold"
                        onClick={handlePayment}
                        disabled={paymentLoading}
                      >
                        {paymentLoading ? (
                          <div className="h-5 w-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                        ) : (
                          <Sparkles className="mr-2 h-5 w-5" />
                        )}
                        {paymentLoading ? 'Processando...' : 'Desbloquear meu relatório'}
                      </Button>
                      <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><CreditCard className="h-3.5 w-3.5" /> Pix • Cartão</span>
                        <span className="flex items-center gap-1"><Shield className="h-3.5 w-3.5" /> Pagamento seguro</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </>
          ) : (
            <UnlockedReport
              result={result as any}
              email={email}
              setEmail={setEmail}
              emailSubmitted={emailSubmitted}
              onEmailSubmit={handleEmailSubmit}
            />
          )}

          <DisclaimerBanner variant={isTDAH ? 'strong' : 'default'} />

          <div className="text-center">
            <Button variant="outline" onClick={() => navigate('/')} className="rounded-xl">
              <ArrowRight className="mr-1.5 h-4 w-4" /> Ver outros testes
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}