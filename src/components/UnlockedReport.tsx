import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

const TRAIT_GRADIENTS = [
  'from-primary to-primary-glow',
  'from-accent to-accent',
  'from-success to-success',
  'from-warning to-warning',
  'from-[hsl(271,76%,53%)] to-[hsl(290,76%,60%)]',
  'from-[hsl(330,81%,60%)] to-[hsl(340,81%,65%)]',
  'from-primary/80 to-primary',
  'from-accent/80 to-accent',
  'from-success/80 to-success',
  'from-warning/80 to-warning',
];

function getTraitLabel(level: number): string {
  if (level >= 85) return 'Muito alto';
  if (level >= 70) return 'Alto';
  if (level >= 55) return 'Moderado-alto';
  if (level >= 40) return 'Moderado';
  return 'Em desenvolvimento';
}

function getTraitLabelColor(level: number): string {
  if (level >= 85) return 'text-success';
  if (level >= 70) return 'text-primary';
  if (level >= 55) return 'text-accent';
  if (level >= 40) return 'text-muted-foreground';
  return 'text-muted-foreground';
}

export default function UnlockedReport({ result, email, setEmail, emailSubmitted, onEmailSubmit }: UnlockedReportProps) {
  const report = result.full_report;
  if (!report) return null;

  const sections = report.sections;
  const profileSection = sections.find(s => s.title === 'Perfil Predominante');
  const traitsSection = sections.find(s => s.type === 'traits');
  const otherSections = sections.filter(s => s.title !== 'Perfil Predominante' && s.type !== 'traits');

  const radarData = traitsSection?.traits?.map(t => ({
    trait: t.name.length > 14 ? t.name.substring(0, 12) + '…' : t.name,
    value: t.level,
  })) || [];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Success banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-3 font-semibold bg-success/10 text-success rounded-2xl px-5 py-4 border border-success/20"
      >
        <CheckCircle className="h-5 w-5 shrink-0" />
        <span>Relatório completo desbloqueado</span>
      </motion.div>

      {/* Profile header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="rounded-2xl border-primary/20 overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-primary via-accent to-primary" />
          <CardContent className="pt-10 pb-10 text-center space-y-5 relative">
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
            <div className="relative">
              <div className="h-18 w-18 mx-auto rounded-3xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-xl shadow-primary/25" style={{ height: '72px', width: '72px' }}>
                <Brain className="h-9 w-9 text-primary-foreground" />
              </div>
              <p className="text-xs font-semibold text-primary uppercase tracking-[0.25em] mt-5">Perfil predominante</p>
              <h2 className="text-3xl md:text-4xl font-display font-extrabold mt-2">{result.result_title}</h2>
              <p className="text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed mt-3">
                {profileSection?.content || result.result_summary}
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Radar Chart */}
      {radarData.length >= 3 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="rounded-2xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground">
                  <BarChart3 className="h-5 w-5" />
                </div>
                Mapa de Traços Cognitivos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <ResponsiveContainer width="100%" height={320}>
                <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="62%">
                  <PolarGrid stroke="hsl(var(--border))" strokeOpacity={0.6} />
                  <PolarAngleAxis
                    dataKey="trait"
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                  />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar
                    name="Seu Perfil"
                    dataKey="value"
                    stroke="hsl(230, 75%, 57%)"
                    fill="hsl(230, 75%, 57%)"
                    fillOpacity={0.12}
                    strokeWidth={2.5}
                  />
                </RadarChart>
              </ResponsiveContainer>

              {/* Trait bars */}
              <div className="space-y-4">
                {traitsSection?.traits?.map((trait, i) => (
                  <div key={trait.name} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold">{trait.name}</span>
                      <span className={`text-xs font-semibold ${getTraitLabelColor(trait.level)}`}>{getTraitLabel(trait.level)}</span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${trait.level}%` }}
                        transition={{ delay: 0.3 + i * 0.06, duration: 0.8, ease: 'easeOut' }}
                        className={`h-full rounded-full bg-gradient-to-r ${TRAIT_GRADIENTS[i % TRAIT_GRADIENTS.length]}`}
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
          <Card className="rounded-2xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-3">
                <div className="p-2 rounded-xl bg-primary/10 text-primary">
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
                  <div className="grid gap-2">
                    {section.items?.map((item, j) => (
                      <div key={j} className="flex items-start gap-3 p-3 rounded-xl bg-muted/50 text-sm">
                        <div className="mt-0.5 shrink-0">
                          {section.type === 'environments' ? (
                            <Compass className="h-4 w-4 text-accent" />
                          ) : (
                            <CheckCircle className="h-4 w-4 text-success" />
                          )}
                        </div>
                        <span className="text-muted-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Styles */}
              {section.type === 'styles' && section.styles && (
                <div className="space-y-4">
                  {section.styles.map((style, j) => (
                    <div key={style.name} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold">{style.name}</span>
                        <span className={`text-xs font-semibold ${getTraitLabelColor(style.level)}`}>{getTraitLabel(style.level)}</span>
                      </div>
                      <div className="h-3 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${style.level}%` }}
                          transition={{ delay: 0.5 + j * 0.1, duration: 0.8 }}
                          className={`h-full rounded-full bg-gradient-to-r ${TRAIT_GRADIENTS[(j + 3) % TRAIT_GRADIENTS.length]}`}
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
        <Card className="rounded-2xl border-primary/20 overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary" />
          <CardContent className="pt-6 pb-6">
            {!emailSubmitted ? (
              <form onSubmit={onEmailSubmit} className="space-y-4">
                <div className="flex items-center gap-2.5 mb-1">
                  <div className="p-1.5 rounded-lg bg-primary/10">
                    <Mail className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-sm font-display font-bold">Receba uma cópia do seu relatório</p>
                </div>
                <p className="text-xs text-muted-foreground">Enviaremos seu resultado completo para consultar quando quiser.</p>
                <div className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="Seu melhor email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="flex-1 rounded-xl h-11"
                  />
                  <Button type="submit" className="rounded-xl h-11">
                    <Mail className="mr-1.5 h-4 w-4" /> Enviar
                  </Button>
                </div>
              </form>
            ) : (
              <div className="flex items-center gap-3 text-success">
                <CheckCircle className="h-5 w-5 shrink-0" />
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
          <div className="rounded-2xl border border-border/50 bg-muted/30 p-5">
            <div className="flex items-start gap-3">
              <Shield className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              <p className="text-xs text-muted-foreground leading-relaxed">{report.disclaimer}</p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}