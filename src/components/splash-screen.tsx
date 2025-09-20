
import { Logo } from './logo';

export function SplashScreen() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <div className="animate-splash-in-out">
        <Logo className="h-24 w-auto" />
      </div>
    </div>
  );
}
