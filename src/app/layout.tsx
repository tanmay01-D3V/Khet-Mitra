
'use client';

import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { LanguageProvider } from '@/context/language-context';
import { AuthProvider } from '@/context/auth-context';
import { ThemeProvider } from '@/context/theme-provider';
import { SplashScreen } from '@/components/splash-screen';

// This is a temporary solution to satisfy the Metadata type which is not designed for client components.
const metadata: Metadata = {
  title: 'Khet-Mitra',
  description: 'Your friendly farming companion',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Khet-Mitra</title>
        <meta name="description" content="Your friendly farming companion" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <AuthProvider>
                <LanguageProvider>
                  {children}
                  <Toaster />
                </LanguageProvider>
            </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
