// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { MemberProvider } from '@/context/MemberContext';
import ErrorBoundary from '@/components/ErrorBoundary';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FitTrack - Gym Management System',
  description: 'Professional gym membership management system',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary>
          <MemberProvider>
            {children}
          </MemberProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}