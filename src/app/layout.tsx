import type { Metadata } from 'next';
import './globals.css';

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
    <html lang="en">
      <head>
        <link rel="icon" href="/MAHAGOV_ICON.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/MAHAGOV_ICON.svg" />
      </head>
      <body className="min-h-screen bg-page text-content-primary antialiased">
        {children}
      </body>
    </html>
  );
}
