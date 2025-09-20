
import { Logo } from './logo';
import { cn } from '@/lib/utils';

export function SplashScreen({ className }: { className?: string }) {
  return (
    <div className={cn("flex h-screen w-full items-center justify-center", className)}>
      <div className="animate-splash-in-out">
        <Logo className="h-24 w-auto" />
      </div>
    </div>
  );
}
