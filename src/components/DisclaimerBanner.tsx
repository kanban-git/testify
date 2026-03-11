import { AlertTriangle, Info } from 'lucide-react';

interface Props {
  variant?: 'default' | 'strong';
}

export default function DisclaimerBanner({ variant = 'default' }: Props) {
  const isStrong = variant === 'strong';

  return (
    <div className={`rounded-2xl p-5 text-sm border ${
      isStrong
        ? 'bg-warning/5 border-warning/20 text-warning'
        : 'bg-muted/50 border-border/50 text-muted-foreground'
    }`}>
      <div className="flex items-start gap-3">
        {isStrong ? (
          <AlertTriangle className="h-5 w-5 mt-0.5 shrink-0" />
        ) : (
          <Info className="h-5 w-5 mt-0.5 shrink-0 text-muted-foreground" />
        )}
        <p className="leading-relaxed">
          {isStrong
            ? 'IMPORTANTE: Este teste NÃO fornece diagnóstico de TDAH ou qualquer outra condição. Ele é estritamente informativo e educacional. O diagnóstico só pode ser feito por profissionais de saúde qualificados.'
            : 'Este teste é apenas para fins informativos e educacionais. Ele não constitui diagnóstico médico, psicológico ou psiquiátrico e não substitui avaliação profissional.'}
        </p>
      </div>
    </div>
  );
}