import { Brain, Shield, Lock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-border/50 bg-card/50 py-10">
      <div className="container space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Brain className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-lg">NeuroTest</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Shield className="h-3.5 w-3.5" /> Dados protegidos</span>
            <span className="flex items-center gap-1"><Lock className="h-3.5 w-3.5" /> Resultados confidenciais</span>
          </div>
        </div>
        <div className="border-t border-border/50 pt-6 text-center space-y-2">
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} NeuroTest. Todos os direitos reservados.</p>
          <p className="max-w-2xl mx-auto text-xs text-muted-foreground/70 leading-relaxed">
            Este site oferece testes informativos e educacionais. Os resultados não constituem diagnóstico
            médico, psicológico ou psiquiátrico e não substituem avaliação profissional.
          </p>
        </div>
      </div>
    </footer>
  );
}