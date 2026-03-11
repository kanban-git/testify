import { Link } from 'react-router-dom';
import { Brain } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link to="/" className="flex items-center gap-2 font-display font-bold text-lg">
          <Brain className="h-6 w-6 text-primary" />
          <span>NeuroTest</span>
        </Link>
      </div>
    </header>
  );
}
