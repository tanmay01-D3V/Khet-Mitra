
'use client';

import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { Header } from '@/components/layout/header';
import { SidebarProvider } from '@/context/sidebar-provider';
import { ChatWidget } from '@/components/chat/chat-widget';


export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    if (loading || !user) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <p>Loading...</p>
            </div>
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
