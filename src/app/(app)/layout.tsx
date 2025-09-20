
'use client';

import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { SidebarProvider } from '@/context/sidebar-provider';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/ui/sidebar';

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
              <Sidebar>
                <AppSidebar />
              </Sidebar>
              <div className="flex flex-col sm:pl-14 h-screen">
                  <Header />
                  <main className="p-4 sm:px-6 overflow-auto">
                    {children}
                  </main>
              </div>
          </div>
      </SidebarProvider>
  );
}

    