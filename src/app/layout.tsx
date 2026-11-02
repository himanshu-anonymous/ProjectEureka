import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Maha Connect Centre — DGIPR, Government of Maharashtra',
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

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="w-full h-full min-h-screen bg-page text-content-primary antialiased overflow-hidden" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
