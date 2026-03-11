import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useMetrics } from '@/hooks/useMetrics';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PaymentCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { trackEvent } = useMetrics();
  const [status, setStatus] = useState<'processing' | 'approved' | 'failed' | 'pending'>('processing');

  const sessionId = searchParams.get('session_id');
  const quizId = searchParams.get('quiz_id');

  useEffect(() => {
    if (!sessionId) {
      navigate('/');
      return;
    }

    // Server-side verification — never trust URL params for payment status
    const verifyPayment = async () => {
      try {
        const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
        const res = await fetch(`https://${projectId}.supabase.co/functions/v1/mercadopago-verify`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ session_id: sessionId }),
        });

        const data = await res.json();

        if (data.approved) {
          trackEvent('payment_approved', quizId || '', sessionId);
          trackEvent('report_unlocked', quizId || '', sessionId);
          setStatus('approved');
        } else if (data.status === 'pending') {
          setStatus('pending');
        } else {
          setStatus('failed');
        }
      } catch (err) {
        console.error('Payment verification error:', err);
        setStatus('failed');
      }
    };

    // Small delay to allow MP to process
    const timer = setTimeout(verifyPayment, 2000);
    return () => clearTimeout(timer);
  }, [sessionId]);

  const handleViewReport = async () => {
    if (!quizId) { navigate('/'); return; }
    const { data } = await supabase.from('quizzes').select('slug').eq('id', quizId).single();
    const slug = (data as { slug: string } | null)?.slug;
    if (slug) {
      navigate(`/quiz/${slug}/result`, { state: { sessionId, quizId } });
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full text-center space-y-6">
        {status === 'processing' && (
          <>
            <div className="h-12 w-12 mx-auto border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <h2 className="text-xl font-display font-bold">Verificando pagamento...</h2>
            <p className="text-sm text-muted-foreground">Aguarde enquanto confirmamos seu pagamento com o Mercado Pago.</p>
          </>
        )}
        {status === 'approved' && (
          <>
            <CheckCircle className="h-16 w-16 mx-auto text-success" />
            <h2 className="text-2xl font-display font-bold">Pagamento aprovado!</h2>
            <p className="text-muted-foreground">Seu relatório completo foi desbloqueado.</p>
            <Button size="lg" onClick={handleViewReport} className="w-full">
              Ver meu relatório completo
            </Button>
          </>
        )}
        {status === 'pending' && (
          <>
            <Clock className="h-16 w-16 mx-auto text-warning" />
            <h2 className="text-2xl font-display font-bold">Pagamento pendente</h2>
            <p className="text-muted-foreground">Seu pagamento está sendo processado. O relatório será liberado assim que confirmado.</p>
            <Button variant="outline" onClick={() => navigate('/')}>Voltar à home</Button>
          </>
        )}
        {status === 'failed' && (
          <>
            <XCircle className="h-16 w-16 mx-auto text-destructive" />
            <h2 className="text-2xl font-display font-bold">Pagamento não aprovado</h2>
            <p className="text-muted-foreground">Houve um problema com seu pagamento. Tente novamente.</p>
            <Button variant="outline" onClick={() => navigate('/')}>Voltar à home</Button>
          </>
        )}
      </motion.div>
    </div>
  );
}
