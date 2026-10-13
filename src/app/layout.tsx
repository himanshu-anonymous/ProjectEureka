import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Maha-Command Center — DGIPR, Government of Maharashtra',
  description: 'State Information Operations & Performance Dashboard',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-page text-content-primary antialiased">
        {children}
      </body>
    </html>
  );
}
