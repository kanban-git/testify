import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, Zap, Heart, Activity, User, Clock, ArrowRight } from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Brain, Zap, Heart, Activity, User,
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
  const categoryColors: Record<string, string> = {
    cognitivo: 'bg-primary/10 text-primary',
    personalidade: 'bg-accent/10 text-accent',
    comportamental: 'bg-warning/10 text-warning',
    psicologico: 'bg-success/10 text-success',
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${categoryColors[category] || 'bg-muted text-muted-foreground'}`}>
            {category}
          </span>
        </div>
        <CardTitle className="text-lg font-display">{title}</CardTitle>
        <CardDescription className="text-sm">{description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
          <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{duration} min</span>
          <span>{questionCount} perguntas</span>
        </div>
        <Link to={`/quiz/${slug}`}>
          <Button className="w-full group-hover:bg-primary" size="sm">
            Começar teste <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
