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
import { Lock, CheckCircle, Mail, Star, Users, ArrowRight, Shield, CreditCard, Brain, Eye } from 'lucide-react';
import { toast } from 'sonner';

interface Result {
  id: string; total_score: number; max_score: number; percentile: number;
  result_title: string; result_summary: string; full_report: any; unlocked: boolean;
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

  const isTDAH = slug === 'indicadores-de-tdah';
  const report = result.full_report as { sections: any[]; disclaimer: string } | null;

  // Extract some blurred preview sections for paywall
  const previewSections = report?.sections?.filter(s => 
    s.title !== 'Perfil Predominante' && s.type !== 'traits'
  ).slice(0, 3) || [];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 py-8 md:py-16">
        <div className="container max-w-2xl mx-auto space-y-8">
          {/* Preliminary Result - always visible */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4">
            <p className="text-sm font-medium text-primary uppercase tracking-wider">Sua análise está pronta</p>
            
            <div className="h-16 w-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center">
              <Brain className="h-8 w-8 text-primary" />
            </div>

            <p className="text-base text-muted-foreground">Perfil predominante:</p>
            <h1 className="text-3xl md:text-4xl font-display font-bold">{result.result_title}</h1>
            <p className="text-lg text-muted-foreground max-w-lg mx-auto leading-relaxed">{result.result_summary}</p>
            
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-5 py-2 font-semibold text-sm">
              <Users className="h-4 w-4" />
              Seu perfil se destaca entre {result.percentile}% dos participantes
            </div>
          </motion.div>

          {showPaywall ? (
            <>
              {/* Blurred report preview */}
              {previewSections.map((section: any, i: number) => (
                <div key={i} className="blur-content select-none">
                  <Card>
                    <CardHeader><CardTitle className="text-base">{section.title}</CardTitle></CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{section.content?.substring(0, 200)}...</p>
                    </CardContent>
                  </Card>
                </div>
              ))}

              {/* Paywall */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5">
                  <CardContent className="pt-6 space-y-6">
                    <div className="text-center space-y-2">
                      <Lock className="h-8 w-8 mx-auto text-primary" />
                      <h3 className="text-xl font-display font-bold">Desbloqueie seu relatório completo</h3>
                      <p className="text-sm text-muted-foreground">Veja sua análise detalhada e personalizada</p>
                    </div>

                    <ul className="space-y-3 text-sm">
                      {[
                        'Mapa completo de traços cognitivos',
                        'Estilo de pensamento e resolução de problemas',
                        'Potenciais identificados e pontos fortes',
                        'Como seu perfil aparece na vida real',
                        'Áreas de desenvolvimento personalizado',
                        'Comparação com outros participantes',
                        'Estilo de aprendizado',
                        'Interpretação final detalhada',
                        'Envio do resultado por email',
                      ].map((item, i) => (
                        <li key={i} className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-[hsl(var(--success))] shrink-0" />{item}</li>
                      ))}
                    </ul>

                    {/* Email capture */}
                    {!emailSubmitted ? (
                      <form onSubmit={handleEmailSubmit} className="space-y-3">
                        <div className="flex gap-2">
                          <Input type="email" placeholder="Seu melhor email" value={email} onChange={e => setEmail(e.target.value)} required className="flex-1" />
                          <Button type="submit" variant="outline" size="sm"><Mail className="h-4 w-4" /></Button>
                        </div>
                      </form>
                    ) : (
                      <p className="text-sm text-[hsl(var(--success))] flex items-center gap-1"><CheckCircle className="h-4 w-4" /> Email salvo com sucesso!</p>
                    )}

                    <div className="text-center space-y-3">
                      <div className="text-3xl font-display font-bold text-primary">R$ 7,90</div>
                      <p className="text-xs text-muted-foreground">Pagamento único • Acesso imediato</p>
                      <Button 
                        size="lg" 
                        className="w-full text-lg py-6" 
                        onClick={handlePayment}
                        disabled={paymentLoading}
                      >
                        {paymentLoading ? (
                          <div className="h-5 w-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                        ) : (
                          <Star className="mr-2 h-5 w-5" />
                        )}
                        {paymentLoading ? 'Processando...' : 'Desbloquear meu relatório completo'}
                      </Button>
                      <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><CreditCard className="h-3 w-3" /> Pix • Cartão de crédito</span>
                        <span className="flex items-center gap-1"><Shield className="h-3 w-3" /> Pagamento seguro</span>
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
            <Button variant="outline" onClick={() => navigate('/')}>
              <ArrowRight className="mr-1 h-4 w-4" /> Ver outros testes
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
