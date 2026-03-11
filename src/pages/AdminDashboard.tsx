import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, LogOut, Eye, BarChart3, Users, CreditCard } from 'lucide-react';

interface Quiz {
  id: string; title: string; slug: string; active: boolean; created_at: string;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ sessions: 0, completions: 0, payments: 0 });

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate('/admin/login'); return; }

      const { data: qs } = await supabase.from('quizzes').select('*').order('created_at');
      setQuizzes((qs as Quiz[]) || []);

      const { count: sessionCount } = await supabase.from('quiz_sessions').select('*', { count: 'exact', head: true });
      const { count: completionCount } = await supabase.from('quiz_sessions').select('*', { count: 'exact', head: true }).not('completed_at', 'is', null);
      const { count: paymentCount } = await supabase.from('payments').select('*', { count: 'exact', head: true }).eq('status', 'approved');

      setStats({ sessions: sessionCount || 0, completions: completionCount || 0, payments: paymentCount || 0 });
      setLoading(false);
    })();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container flex items-center justify-between h-14">
          <div className="flex items-center gap-2 font-display font-bold">
            <Brain className="h-5 w-5 text-primary" /> Admin NeuroTest
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout}><LogOut className="mr-1 h-4 w-4" /> Sair</Button>
        </div>
      </header>

      <main className="container py-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card><CardContent className="pt-6 flex items-center gap-4">
            <Users className="h-8 w-8 text-primary" />
            <div><p className="text-2xl font-bold">{stats.sessions}</p><p className="text-sm text-muted-foreground">Sessões</p></div>
          </CardContent></Card>
          <Card><CardContent className="pt-6 flex items-center gap-4">
            <BarChart3 className="h-8 w-8 text-success" />
            <div><p className="text-2xl font-bold">{stats.completions}</p><p className="text-sm text-muted-foreground">Concluídos</p></div>
          </CardContent></Card>
          <Card><CardContent className="pt-6 flex items-center gap-4">
            <CreditCard className="h-8 w-8 text-accent" />
            <div><p className="text-2xl font-bold">{stats.payments}</p><p className="text-sm text-muted-foreground">Pagamentos</p></div>
          </CardContent></Card>
        </div>

        {/* Quizzes */}
        <Card>
          <CardHeader><CardTitle className="font-display">Quizzes</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {quizzes.map(q => (
                <div key={q.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium">{q.title}</p>
                    <p className="text-sm text-muted-foreground">/quiz/{q.slug}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${q.active ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}`}>
                      {q.active ? 'Ativo' : 'Inativo'}
                    </span>
                    <Button variant="ghost" size="sm" onClick={() => window.open(`/quiz/${q.slug}`, '_blank')}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
