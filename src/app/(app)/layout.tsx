
'use client';

import { Navbar } from '@/components/layout/navbar';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

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
      <div className="min-h-screen w-full bg-muted/30">
        <Navbar />
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
  );
}
