import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  CheckCircle, Mail, Brain, Target, Zap, Eye, Shield, TrendingUp,
  Lightbulb, Briefcase, GraduationCap, Compass, Star, BarChart3,
  BookOpen, Sparkles, Users, Award, ArrowRight,
} from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';

interface ReportSection {
  title: string;
  content: string;
  type?: 'text' | 'traits' | 'list' | 'styles' | 'environments';
  items?: string[];
  traits?: { name: string; level: number }[];
  styles?: { name: string; level: number }[];
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

const SECTION_ICONS: Record<string, React.ReactNode> = {
  'Perfil Predominante': <Brain className="h-5 w-5" />,
  'Mapa de Traços Cognitivos': <BarChart3 className="h-5 w-5" />,
  'Estilo de Pensamento': <Lightbulb className="h-5 w-5" />,
  'Potenciais Identificados': <Star className="h-5 w-5" />,
  'Como Esse Perfil Aparece na Vida Real': <Briefcase className="h-5 w-5" />,
  'Pontos Fortes': <Award className="h-5 w-5" />,
  'Áreas de Desenvolvimento': <TrendingUp className="h-5 w-5" />,
  'Estilo de Resolução de Problemas': <Target className="h-5 w-5" />,
  'Comparação com Outros Participantes': <Users className="h-5 w-5" />,
  'Ambientes Onde Esse Perfil se Destaca': <Compass className="h-5 w-5" />,
  'Estilo de Aprendizado': <GraduationCap className="h-5 w-5" />,
  'Interpretação Final': <Sparkles className="h-5 w-5" />,
};

const TRAIT_COLORS = [
  'bg-primary', 'bg-accent', 'bg-[hsl(var(--success))]', 'bg-[hsl(var(--warning))]',
  'bg-[hsl(271,76%,53%)]', 'bg-[hsl(330,81%,60%)]', 'bg-primary/80', 'bg-accent/80',
  'bg-[hsl(var(--success))]/80', 'bg-[hsl(var(--warning))]/80',
];

function getTraitLabel(level: number): string {
  if (level >= 85) return 'Muito alto';
  if (level >= 70) return 'Alto';
  if (level >= 55) return 'Moderado-alto';
  if (level >= 40) return 'Moderado';
  return 'Em desenvolvimento';
}

export default function UnlockedReport({ result, email, setEmail, emailSubmitted, onEmailSubmit }: UnlockedReportProps) {
  const report = result.full_report;
  if (!report) return null;

  const sections = report.sections;

  const profileSection = sections.find(s => s.title === 'Perfil Predominante');
  const traitsSection = sections.find(s => s.type === 'traits');
  const otherSections = sections.filter(s => s.title !== 'Perfil Predominante' && s.type !== 'traits');

  // Radar data
  const radarData = traitsSection?.traits?.map(t => ({
    trait: t.name.length > 16 ? t.name.substring(0, 14) + '…' : t.name,
    value: t.level,
  })) || [];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Success banner */}
      <div className="flex items-center gap-2 text-[hsl(var(--success))] font-medium bg-[hsl(var(--success))]/10 rounded-lg px-4 py-3">
        <CheckCircle className="h-5 w-5" /> Relatório completo desbloqueado
      </div>

      {/* Profile header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-background to-accent/5 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <CardContent className="pt-8 pb-8 text-center space-y-4 relative">
            <div className="h-16 w-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center">
              <Brain className="h-8 w-8 text-primary" />
            </div>
            <p className="text-xs font-medium text-primary uppercase tracking-[0.2em]">Perfil predominante</p>
            <h2 className="text-3xl md:text-4xl font-display font-bold">{result.result_title}</h2>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
              {profileSection?.content || result.result_summary}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Radar Chart - Mapa de Traços Cognitivos */}
      {radarData.length >= 3 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                  <BarChart3 className="h-5 w-5" />
                </div>
                Mapa de Traços Cognitivos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <ResponsiveContainer width="100%" height={320}>
                <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="65%">
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis
                    dataKey="trait"
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                  />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar
                    name="Seu Perfil"
                    dataKey="value"
                    stroke="hsl(221, 83%, 53%)"
                    fill="hsl(221, 83%, 53%)"
                    fillOpacity={0.15}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>

              {/* Trait bars */}
              <div className="space-y-3">
                {traitsSection?.traits?.map((trait, i) => (
                  <div key={trait.name} className="space-y-1.5">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium">{trait.name}</span>
                      <span className="text-xs text-muted-foreground">{getTraitLabel(trait.level)}</span>
                    </div>
                    <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${trait.level}%` }}
                        transition={{ delay: 0.3 + i * 0.05, duration: 0.8 }}
                        className={`h-full rounded-full ${TRAIT_COLORS[i % TRAIT_COLORS.length]}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* All other sections */}
      {otherSections.map((section, i) => (
        <motion.div
          key={section.title}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 + i * 0.06 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                  {SECTION_ICONS[section.title] || <Brain className="h-5 w-5" />}
                </div>
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Text content */}
              {section.content && section.type !== 'list' && section.type !== 'environments' && (
                <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                  {section.content.split('**').map((part, idx) =>
                    idx % 2 === 1
                      ? <strong key={idx} className="text-foreground font-semibold">{part}</strong>
                      : <span key={idx}>{part}</span>
                  )}
                </div>
              )}

              {/* List items */}
              {(section.type === 'list' || section.type === 'environments') && (
                <>
                  {section.content && (
                    <p className="text-sm text-muted-foreground">{section.content}</p>
                  )}
                  <ul className="space-y-2.5">
                    {section.items?.map((item, j) => (
                      <li key={j} className="flex items-start gap-2.5 text-sm">
                        <div className="mt-0.5 shrink-0">
                          {section.type === 'environments' ? (
                            <Compass className="h-4 w-4 text-accent" />
                          ) : (
                            <CheckCircle className="h-4 w-4 text-[hsl(var(--success))]" />
                          )}
                        </div>
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {/* Styles (problem solving, learning) */}
              {section.type === 'styles' && section.styles && (
                <div className="space-y-3">
                  {section.styles.map((style, j) => (
                    <div key={style.name} className="space-y-1.5">
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-medium">{style.name}</span>
                        <span className="text-xs text-muted-foreground">{getTraitLabel(style.level)}</span>
                      </div>
                      <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${style.level}%` }}
                          transition={{ delay: 0.5 + j * 0.1, duration: 0.8 }}
                          className={`h-full rounded-full ${TRAIT_COLORS[(j + 3) % TRAIT_COLORS.length]}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ))}

      {/* Email capture */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}>
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
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
              <div className="flex items-center gap-2 text-[hsl(var(--success))]">
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

      {/* Disclaimer */}
      {report.disclaimer && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}>
          <div className="rounded-lg border border-border bg-muted/50 p-4">
            <div className="flex items-start gap-2">
              <Shield className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              <p className="text-xs text-muted-foreground leading-relaxed">{report.disclaimer}</p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
