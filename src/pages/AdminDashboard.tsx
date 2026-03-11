import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Brain, LogOut, Eye, BarChart3, Users, CreditCard, FlaskConical, Mail, Clock, CheckCircle } from 'lucide-react';

interface Quiz {
  id: string; title: string; slug: string; active: boolean; created_at: string;
}

interface SessionRow {
  id: string;
  name: string | null;
  email: string | null;
  started_at: string | null;
  completed_at: string | null;
  payment_status: string | null;
  amount_paid: number | null;
  is_test: boolean | null;
  quiz_id: string;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ sessions: 0, completions: 0, payments: 0, emails: 0 });
  const [testMode, setTestMode] = useState(() => localStorage.getItem('admin_test_mode') === 'true');

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate('/admin/login'); return; }

      const { data: qs } = await supabase.from('quizzes').select('*').order('created_at');
      setQuizzes((qs as Quiz[]) || []);

      const { data: sessionsData } = await supabase
        .from('quiz_sessions')
        .select('*')
        .order('started_at', { ascending: false })
        .limit(100);
      const allSessions = (sessionsData as SessionRow[]) || [];
      setSessions(allSessions);

      const realSessions = allSessions.filter(s => !s.is_test);
      const { count: paymentCount } = await supabase.from('payments').select('*', { count: 'exact', head: true }).eq('status', 'approved');

      setStats({
        sessions: realSessions.length,
        completions: realSessions.filter(s => s.completed_at).length,
        payments: paymentCount || 0,
        emails: realSessions.filter(s => s.email).length,
      });
      setLoading(false);
    })();
  }, []);

  const toggleTestMode = (checked: boolean) => {
    setTestMode(checked);
    localStorage.setItem('admin_test_mode', String(checked));
  };

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
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <FlaskConical className={`h-4 w-4 ${testMode ? 'text-amber-500' : 'text-muted-foreground'}`} />
              <span className="text-sm font-medium">Modo Teste</span>
              <Switch checked={testMode} onCheckedChange={toggleTestMode} />
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}><LogOut className="mr-1 h-4 w-4" /> Sair</Button>
          </div>
        </div>
      </header>

      {testMode && (
        <div className="bg-amber-500/10 border-b border-amber-500/30 text-amber-700 text-center text-sm py-2 font-medium">
          ⚠️ Modo teste ativo — sessões serão marcadas como teste e o pagamento será ignorado
        </div>
      )}

      <main className="container py-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card><CardContent className="pt-6 flex items-center gap-4">
            <Users className="h-8 w-8 text-primary" />
            <div><p className="text-2xl font-bold">{stats.sessions}</p><p className="text-sm text-muted-foreground">Sessões</p></div>
          </CardContent></Card>
          <Card><CardContent className="pt-6 flex items-center gap-4">
            <BarChart3 className="h-8 w-8 text-emerald-500" />
            <div><p className="text-2xl font-bold">{stats.completions}</p><p className="text-sm text-muted-foreground">Concluídos</p></div>
          </CardContent></Card>
          <Card><CardContent className="pt-6 flex items-center gap-4">
            <Mail className="h-8 w-8 text-blue-500" />
            <div><p className="text-2xl font-bold">{stats.emails}</p><p className="text-sm text-muted-foreground">Emails</p></div>
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
                    <span className={`text-xs px-2 py-1 rounded-full ${q.active ? 'bg-emerald-500/10 text-emerald-600' : 'bg-muted text-muted-foreground'}`}>
                      {q.active ? 'Ativo' : 'Inativo'}
                    </span>
                    <Button variant="ghost" size="sm" onClick={() => window.open(`/quiz/${q.slug}${testMode ? '?test=1' : ''}`, '_blank')}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sessions table */}
        <Card>
          <CardHeader><CardTitle className="font-display">Sessões Recentes</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="pb-2 font-medium text-muted-foreground">Nome</th>
                    <th className="pb-2 font-medium text-muted-foreground">Email</th>
                    <th className="pb-2 font-medium text-muted-foreground">Início</th>
                    <th className="pb-2 font-medium text-muted-foreground">Status</th>
                    <th className="pb-2 font-medium text-muted-foreground">Pagamento</th>
                    <th className="pb-2 font-medium text-muted-foreground">Tipo</th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.map(s => (
                    <tr key={s.id} className="border-b border-border/50">
                      <td className="py-2">{s.name || '—'}</td>
                      <td className="py-2 text-muted-foreground">{s.email || '—'}</td>
                      <td className="py-2 text-muted-foreground">
                        {s.started_at ? new Date(s.started_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) : '—'}
                      </td>
                      <td className="py-2">
                        {s.completed_at ? (
                          <Badge variant="outline" className="text-emerald-600 border-emerald-300 gap-1">
                            <CheckCircle className="h-3 w-3" /> Concluído
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-amber-600 border-amber-300 gap-1">
                            <Clock className="h-3 w-3" /> Em andamento
                          </Badge>
                        )}
                      </td>
                      <td className="py-2">
                        {s.payment_status === 'approved' ? (
                          <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-300">
                            R$ {Number(s.amount_paid || 0).toFixed(2)}
                          </Badge>
                        ) : s.payment_status === 'pending' ? (
                          <Badge variant="outline" className="text-amber-600">Pendente</Badge>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="py-2">
                        {s.is_test ? (
                          <Badge variant="outline" className="text-amber-500 border-amber-300">
                            <FlaskConical className="h-3 w-3 mr-1" /> Teste
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-xs">Real</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {sessions.length === 0 && (
                    <tr><td colSpan={6} className="py-8 text-center text-muted-foreground">Nenhuma sessão encontrada</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
