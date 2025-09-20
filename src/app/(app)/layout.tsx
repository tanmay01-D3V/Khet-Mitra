
'use client';

import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { Header } from '@/components/layout/header';
import { SidebarProvider } from '@/context/sidebar-provider';
import { ChatWidget } from '@/components/chat/chat-widget';
import { SplashScreen } from '@/components/splash-screen';


export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [isSplashVisible, setIsSplashVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsSplashVisible(false);
        }, 4000); // Match animation duration

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    if (isSplashVisible || authLoading || !user) {
        return (
            <SplashScreen />
        );
    }

  return (
      <SidebarProvider>
          <div className="w-full bg-muted/30">
              <AppSidebar />
              <div className="flex flex-col sm:pl-14">
                  <Header />
                  <main className="p-4 sm:px-6">
                    {children}
                  </main>
                  <ChatWidget />
              </div>
          </div>
      </SidebarProvider>
  );
}
