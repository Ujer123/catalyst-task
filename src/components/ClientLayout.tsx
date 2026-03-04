'use client';
import { Suspense } from 'react';
import Header from '@/components/Header';
import Providers from '@/components/Providers';
import Loading from '@/app/loading';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <Header />
      <main className="min-h-full bg-gray-50">
        <Suspense fallback={<Loading />}>
          {children}
        </Suspense>
      </main>
    </Providers>
  );
}