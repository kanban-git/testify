import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Brain, Zap, Heart, Activity, User, Clock, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Brain, Zap, Heart, Activity, User,
};

const categoryGradients: Record<string, string> = {
  cognitivo: 'from-primary/20 to-primary/5',
  personalidade: 'from-accent/20 to-accent/5',
  comportamental: 'from-warning/20 to-warning/5',
  psicologico: 'from-success/20 to-success/5',
};

const categoryBadgeColors: Record<string, string> = {
  cognitivo: 'bg-primary/10 text-primary border-primary/20',
  personalidade: 'bg-accent/10 text-accent border-accent/20',
  comportamental: 'bg-warning/10 text-warning border-warning/20',
  psicologico: 'bg-success/10 text-success border-success/20',
};

interface QuizCardProps {
  title: string;
  slug: string;
  description: string;
  icon: string;
  duration: number;
  questionCount: number;
  category: string;
}

export default function QuizCard({ title, slug, description, icon, duration, questionCount, category }: QuizCardProps) {
  const Icon = iconMap[icon] || Brain;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
    >
      <Link to={`/quiz/${slug}`} className="block h-full">
        <div className={`group relative h-full rounded-2xl bg-gradient-to-br ${categoryGradients[category] || 'from-muted to-muted/50'} p-[1px] hover:shadow-xl hover:shadow-primary/10 transition-all duration-500`}>
          <div className="h-full rounded-2xl bg-card p-6 flex flex-col gap-5">
            {/* Top row */}
            <div className="flex items-start justify-between">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/30 transition-shadow">
                <Icon className="h-7 w-7 text-primary-foreground" />
              </div>
              <span className={`text-[11px] font-semibold px-3 py-1 rounded-full border ${categoryBadgeColors[category] || 'bg-muted text-muted-foreground border-border'} uppercase tracking-wider`}>
                {category}
              </span>
            </div>

            {/* Content */}
            <div className="flex-1 space-y-2">
              <h3 className="text-lg font-display font-bold leading-tight group-hover:text-primary transition-colors">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{description}</p>
            </div>

            {/* Bottom */}
            <div className="flex items-center justify-between pt-2 border-t border-border/50">
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{duration} min</span>
                <span className="flex items-center gap-1"><Sparkles className="h-3.5 w-3.5" />{questionCount} perguntas</span>
              </div>
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}