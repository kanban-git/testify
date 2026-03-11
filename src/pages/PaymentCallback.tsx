import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useQuizSession } from '@/hooks/useQuizSession';
import { useMetrics } from '@/hooks/useMetrics';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PaymentCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { unlockResult } = useQuizSession();
  const { trackEvent } = useMetrics();
  const [status, setStatus] = useState<'processing' | 'approved' | 'failed' | 'pending'>('processing');

  const paymentStatus = searchParams.get('status');
  const sessionId = searchParams.get('session_id');
  const quizId = searchParams.get('quiz_id');

  useEffect(() => {
    if (!sessionId || !paymentStatus) {
      navigate('/');
      return;
    }

    (async () => {
      if (paymentStatus === 'approved') {
        // Update payment status
        await (supabase.from('payments').update as any)({ status: 'approved' })
          .eq('session_id', sessionId);
        
        await (supabase.from('quiz_sessions').update as any)({ 
          payment_status: 'approved',
          payment_provider: 'mercadopago',
          amount_paid: 7.90,
        }).eq('id', sessionId);

        await unlockResult(sessionId);
        trackEvent('payment_approved', quizId || '', sessionId);
        trackEvent('report_unlocked', quizId || '', sessionId);
        setStatus('approved');
      } else if (paymentStatus === 'pending') {
        setStatus('pending');
      } else {
        setStatus('failed');
      }
    })();
  }, [paymentStatus, sessionId]);

  // Find quiz slug to redirect
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
            <h2 className="text-xl font-display font-bold">Processando pagamento...</h2>
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
