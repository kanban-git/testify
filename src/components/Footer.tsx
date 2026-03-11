export default function Footer() {
  return (
    <footer className="border-t border-border bg-muted/50 py-8">
      <div className="container text-center text-sm text-muted-foreground space-y-2">
        <p>© {new Date().getFullYear()} NeuroTest. Todos os direitos reservados.</p>
        <p className="max-w-2xl mx-auto text-xs">
          Este site oferece testes informativos e educacionais. Os resultados não constituem diagnóstico
          médico, psicológico ou psiquiátrico e não substituem avaliação profissional.
        </p>
      </div>
    </footer>
  );
}
