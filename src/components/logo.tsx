
import { Sprout } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="bg-primary p-2 rounded-lg">
        <Sprout className="h-6 w-6 text-primary-foreground" />
      </div>
      <h1 className="text-xl font-bold text-foreground">Khet-Mitra</h1>
    </div>
  );
}
