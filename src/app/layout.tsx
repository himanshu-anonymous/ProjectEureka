import type { Metadata } from 'next';
import { Suspense } from 'react';
import './globals.css';
import { AIAssistantWidget } from '@/components/ai/ai-assistant-widget';

export const metadata: Metadata = {
  title: 'Maha-Command Center — DGIPR, Government of Maharashtra',
  description: 'State Information Operations & Performance Dashboard',
  icons: {
    icon: [
      { url: '/MAHAGOV_ICON.svg', type: 'image/svg+xml' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/MAHAGOV_ICON.svg',
    apple: '/MAHAGOV_ICON.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-page text-content-primary antialiased" suppressHydrationWarning>
        {children}
        <Suspense fallback={null}>
          <AIAssistantWidget />
        </Suspense>
      </body>
    </html>
  );
}
