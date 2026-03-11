import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useQuizSession } from '@/hooks/useQuizSession';
import { useMetrics } from '@/hooks/useMetrics';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DisclaimerBanner from '@/components/DisclaimerBanner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { Lock, CheckCircle, Mail, Star, BarChart3, FileText, Users, ArrowRight, Shield, CreditCard } from 'lucide-react';
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
        // Redirect to Mercado Pago checkout
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
  const isCognitiveProfile = slug === 'perfil-de-raciocinio';
  const report = result.full_report as { sections: { title: string; content: string; score?: number; maxScore?: number }[]; disclaimer: string } | null;

  // Find consistency score from report for cognitive profile
  const consistencySection = isCognitiveProfile ? report?.sections.find(s => s.title === 'Consistência do Perfil') : null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 py-8 md:py-16">
        <div className="container max-w-2xl mx-auto space-y-8">
          {/* Preliminary Result */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4">
            <p className="text-sm font-medium text-primary uppercase tracking-wider">Seu resultado preliminar está pronto</p>
            
            {isCognitiveProfile ? (
              <>
                <p className="text-base text-muted-foreground">Perfil predominante:</p>
                <h1 className="text-3xl md:text-4xl font-display font-bold">{result.result_title}</h1>
                <p className="text-lg text-muted-foreground max-w-lg mx-auto">{result.result_summary}</p>
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-5 py-2 font-semibold text-sm">
                  <Users className="h-4 w-4" />
                  Seu perfil mostrou maior consistência analítica do que {result.percentile}% dos participantes
                </div>
                {consistencySection && (
                  <div className="pt-2">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex justify-between text-sm mb-2">
                          <span>Consistência do perfil</span>
                          <span className="font-semibold">{consistencySection.score}/{consistencySection.maxScore}</span>
                        </div>
                        <Progress value={((consistencySection.score || 0) / Math.max(consistencySection.maxScore || 10, 1)) * 100} className="h-3" />
                      </CardContent>
                    </Card>
                  </div>
                )}
              </>
            ) : (
              <>
                <h1 className="text-3xl md:text-4xl font-display font-bold">{result.result_title}</h1>
                <p className="text-lg text-muted-foreground">{result.result_summary}</p>
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-5 py-2 font-semibold">
                  <Users className="h-4 w-4" />
                  Você pontuou acima de {result.percentile}% dos participantes
                </div>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Pontuação</span>
                      <span className="font-semibold">{result.total_score}/{result.max_score}</span>
                    </div>
                    <Progress value={(result.total_score / Math.max(result.max_score, 1)) * 100} className="h-3" />
                  </CardContent>
                </Card>
              </>
            )}
          </motion.div>

          {showPaywall ? (
            <>
              {/* Blurred report preview */}
              {report && report.sections.slice(2, 5).map((section, i) => (
                <div key={i} className="blur-content select-none">
                  <Card>
                    <CardHeader><CardTitle className="text-base">{section.title}</CardTitle></CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{section.content}</p>
                      {section.score !== undefined && (
                        <Progress value={(section.score / Math.max(section.maxScore || 100, 1)) * 100} className="h-2 mt-3" />
                      )}
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
                        'Pontuação detalhada por traço',
                        'Interpretação do resultado',
                        'Comparação com participantes',
                        'Perfil cognitivo / psicológico',
                        'Relatório personalizado',
                        'Envio do resultado por email',
                      ].map((item, i) => (
                        <li key={i} className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-success shrink-0" />{item}</li>
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
                      <p className="text-sm text-success flex items-center gap-1"><CheckCircle className="h-4 w-4" /> Email salvo com sucesso!</p>
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
            <>
              {/* Full report */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div className="flex items-center gap-2 text-success font-medium">
                  <CheckCircle className="h-5 w-5" /> Relatório completo desbloqueado
                </div>

                {report?.sections.map((section, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                    <Card>
                      <CardHeader><CardTitle className="text-base flex items-center gap-2">
                        {i === 0 ? <BarChart3 className="h-4 w-4 text-primary" /> : <FileText className="h-4 w-4 text-primary" />}
                        {section.title}
                      </CardTitle></CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground leading-relaxed">{section.content}</p>
                        {section.score !== undefined && section.maxScore && (
                          <div className="mt-4">
                            <div className="flex justify-between text-xs text-muted-foreground mb-1">
                              <span>Pontuação</span>
                              <span>{section.score}/{section.maxScore}</span>
                            </div>
                            <Progress value={(section.score / section.maxScore) * 100} className="h-2" />
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>

              {/* Email capture if not done */}
              {!emailSubmitted && (
                <Card>
                  <CardContent className="pt-6">
                    <form onSubmit={handleEmailSubmit} className="space-y-3">
                      <p className="text-sm font-medium">Receba seu relatório por email:</p>
                      <div className="flex gap-2">
                        <Input type="email" placeholder="Seu email" value={email} onChange={e => setEmail(e.target.value)} required className="flex-1" />
                        <Button type="submit"><Mail className="mr-1 h-4 w-4" /> Enviar</Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}
            </>
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
