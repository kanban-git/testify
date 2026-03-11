import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle, Mail, BarChart3, Users, Brain, Target, Zap, Eye, Shield, TrendingUp } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';
import { useState } from 'react';

interface ReportSection {
  title: string;
  content: string;
  score?: number;
  maxScore?: number;
}

interface FullReport {
  sections: ReportSection[];
  disclaimer: string;
}

interface Result {
  id: string;
  total_score: number;
  max_score: number;
  percentile: number;
  result_title: string;
  result_summary: string;
  full_report: FullReport | null;
  unlocked: boolean;
}

interface UnlockedReportProps {
  result: Result;
  email: string;
  setEmail: (email: string) => void;
  emailSubmitted: boolean;
  onEmailSubmit: (e: React.FormEvent) => void;
}

const TRAIT_ICONS: Record<string, React.ReactNode> = {
  'Raciocínio Analítico': <Brain className="h-4 w-4" />,
  'Praticidade': <Target className="h-4 w-4" />,
  'Flexibilidade Mental': <Zap className="h-4 w-4" />,
  'Velocidade Decisória': <TrendingUp className="h-4 w-4" />,
  'Atenção a Detalhes': <Eye className="h-4 w-4" />,
  'Organização do Pensamento': <Shield className="h-4 w-4" />,
  'Velocidade de Decisão': <Zap className="h-4 w-4" />,
  'Preferência por Estrutura': <BarChart3 className="h-4 w-4" />,
  'Adaptação a Novas Informações': <TrendingUp className="h-4 w-4" />,
  'Lógica vs Intuição': <Brain className="h-4 w-4" />,
};

const CHART_COLORS = [
  'hsl(221, 83%, 53%)',  // primary
  'hsl(199, 89%, 48%)',  // accent
  'hsl(142, 76%, 36%)',  // success
  'hsl(38, 92%, 50%)',   // warning
  'hsl(271, 76%, 53%)',  // purple
  'hsl(330, 81%, 60%)',  // pink
  'hsl(199, 89%, 48%)',  // accent repeat
  'hsl(142, 76%, 36%)',  // success repeat
  'hsl(38, 92%, 50%)',   // warning repeat
  'hsl(221, 83%, 53%)',  // primary repeat
];

export default function UnlockedReport({ result, email, setEmail, emailSubmitted, onEmailSubmit }: UnlockedReportProps) {
  const report = result.full_report;
  if (!report) return null;

  // Extract trait sections (those with score/maxScore, excluding consistency and comparison)
  const traitSections = report.sections.filter(
    s => s.score !== undefined && s.maxScore !== undefined
      && s.title !== 'Consistência do Perfil'
      && s.title !== 'Comparação com Outros Participantes'
  );

  const consistencySection = report.sections.find(s => s.title === 'Consistência do Perfil');
  const comparisonSection = report.sections.find(s => s.title === 'Comparação com Outros Participantes');
  const profileSection = report.sections.find(s => s.title === 'Perfil Predominante');
  const analysisSection = report.sections.find(s => s.title === 'Análise Integrada');

  // Radar chart data
  const radarData = traitSections.map(s => ({
    trait: s.title.length > 18 ? s.title.substring(0, 16) + '…' : s.title,
    fullName: s.title,
    value: Math.round(((s.score || 0) / Math.max(s.maxScore || 1, 1)) * 100),
  }));

  // Bar chart data
  const barData = traitSections.map((s, i) => ({
    name: s.title,
    shortName: s.title.split(' ').slice(0, 2).join(' '),
    score: Math.round(((s.score || 0) / Math.max(s.maxScore || 1, 1)) * 100),
    fill: CHART_COLORS[i % CHART_COLORS.length],
  }));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Success banner */}
      <div className="flex items-center gap-2 text-success font-medium bg-success/10 rounded-lg px-4 py-3">
        <CheckCircle className="h-5 w-5" /> Relatório completo desbloqueado
      </div>

      {/* Profile header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
          <CardContent className="pt-6 text-center space-y-3">
            <p className="text-xs font-medium text-primary uppercase tracking-wider">Perfil predominante</p>
            <h2 className="text-2xl md:text-3xl font-display font-bold">{result.result_title}</h2>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">{profileSection?.content || result.result_summary}</p>
            <div className="flex items-center justify-center gap-4 pt-2">
              <div className="flex items-center gap-1.5 bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-medium">
                <Users className="h-3 w-3" /> Top {100 - result.percentile}%
              </div>
              {consistencySection && (
                <div className="flex items-center gap-1.5 bg-accent/10 text-accent-foreground rounded-full px-3 py-1 text-xs font-medium">
                  <Shield className="h-3 w-3" /> Consistência: {consistencySection.score}/10
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Radar Chart */}
      {radarData.length >= 3 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Brain className="h-4 w-4 text-primary" /> Mapa Cognitivo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis
                    dataKey="trait"
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                  />
                  <PolarRadiusAxis
                    angle={30}
                    domain={[0, 100]}
                    tick={{ fontSize: 9 }}
                    stroke="hsl(var(--border))"
                  />
                  <Radar
                    name="Seu Perfil"
                    dataKey="value"
                    stroke="hsl(221, 83%, 53%)"
                    fill="hsl(221, 83%, 53%)"
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Bar Chart - Trait Comparison */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" /> Pontuação por Traço
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={barData.length * 44 + 20}>
              <BarChart data={barData} layout="vertical" margin={{ left: 10, right: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis
                  type="category"
                  dataKey="shortName"
                  width={120}
                  tick={{ fontSize: 11, fill: 'hsl(var(--foreground))' }}
                  stroke="hsl(var(--border))"
                />
                <Tooltip
                  formatter={(value: number) => [`${value}%`, 'Pontuação']}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="score" radius={[0, 6, 6, 0]} barSize={24}>
                  {barData.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Individual trait details */}
      <div className="grid gap-3">
        {traitSections.map((section, i) => {
          const pct = Math.round(((section.score || 0) / Math.max(section.maxScore || 1, 1)) * 100);
          return (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 + i * 0.05 }}>
              <Card>
                <CardContent className="pt-5 pb-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 p-1.5 rounded-md bg-primary/10 text-primary shrink-0">
                      {TRAIT_ICONS[section.title] || <BarChart3 className="h-4 w-4" />}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm font-semibold">{section.title}</h4>
                        <span className="text-xs font-bold text-primary">{pct}%</span>
                      </div>
                      <Progress value={pct} className="h-2" />
                      <p className="text-xs text-muted-foreground leading-relaxed">{section.content}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Consistency */}
      {consistencySection && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <Card className="border-accent/20">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="h-4 w-4 text-accent-foreground" /> Consistência do Perfil
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Nota de consistência</span>
                <span className="font-bold text-lg">{consistencySection.score}/10</span>
              </div>
              <Progress value={((consistencySection.score || 0) / 10) * 100} className="h-3" />
              <p className="text-xs text-muted-foreground leading-relaxed">{consistencySection.content}</p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Social comparison */}
      {comparisonSection && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}>
          <Card className="bg-gradient-to-r from-primary/5 to-accent/5">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" /> Comparação com Participantes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Seu percentil</span>
                <span className="text-2xl font-bold text-primary">{result.percentile}%</span>
              </div>
              <div className="relative h-6 bg-muted rounded-full overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary/60 to-primary rounded-full transition-all duration-1000"
                  style={{ width: `${result.percentile}%` }}
                />
                <div
                  className="absolute inset-y-0 flex items-center text-[10px] font-bold text-primary-foreground pl-2"
                  style={{ left: `${Math.max(result.percentile - 8, 2)}%` }}
                >
                  Você
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{comparisonSection.content}</p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Integrated analysis */}
      {analysisSection && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Brain className="h-4 w-4 text-primary" /> Análise Integrada
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">{analysisSection.content}</p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Email capture / send */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 }}>
        <Card className="border-primary/20">
          <CardContent className="pt-6">
            {!emailSubmitted ? (
              <form onSubmit={onEmailSubmit} className="space-y-3">
                <div className="flex items-center gap-2 mb-1">
                  <Mail className="h-4 w-4 text-primary" />
                  <p className="text-sm font-semibold">Receba uma cópia do seu relatório por email</p>
                </div>
                <p className="text-xs text-muted-foreground">Enviaremos seu resultado completo para consultar quando quiser.</p>
                <div className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="Seu melhor email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="flex-1"
                  />
                  <Button type="submit">
                    <Mail className="mr-1 h-4 w-4" /> Enviar
                  </Button>
                </div>
              </form>
            ) : (
              <div className="flex items-center gap-2 text-success">
                <CheckCircle className="h-5 w-5" />
                <div>
                  <p className="text-sm font-semibold">Email salvo com sucesso!</p>
                  <p className="text-xs text-muted-foreground">Você receberá uma cópia do relatório em breve.</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
