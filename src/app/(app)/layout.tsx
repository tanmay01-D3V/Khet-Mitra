
'use client';

import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { SidebarProvider, Sidebar } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { Header } from '@/components/layout/header';

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
          <div className="flex min-h-screen w-full flex-col bg-muted/30">
              <Sidebar>
                <AppSidebar />
              </Sidebar>
              <div className="flex flex-col sm:pl-14">
                  <Header />
                  <main className="p-4 sm:px-6">
                    {children}
                  </main>
              </div>
          </div>
      </SidebarProvider>
  );
}
