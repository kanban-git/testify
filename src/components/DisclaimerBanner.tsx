import { AlertTriangle } from 'lucide-react';

interface Props {
  variant?: 'default' | 'strong';
}

export default function DisclaimerBanner({ variant = 'default' }: Props) {
  return (
    <div className={`rounded-lg p-4 text-sm ${variant === 'strong' ? 'bg-warning/10 border border-warning/30 text-warning' : 'bg-muted text-muted-foreground'}`}>
      <div className="flex items-start gap-2">
        <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
        <p>
          {variant === 'strong'
            ? 'IMPORTANTE: Este teste NÃO fornece diagnóstico de TDAH ou qualquer outra condição. Ele é estritamente informativo e educacional. O diagnóstico só pode ser feito por profissionais de saúde qualificados.'
            : 'Este teste é apenas para fins informativos e educacionais. Ele não constitui diagnóstico médico, psicológico ou psiquiátrico e não substitui avaliação profissional.'}
        </p>
      </div>
    </div>
  );
}
