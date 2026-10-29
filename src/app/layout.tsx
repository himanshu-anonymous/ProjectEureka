import type { Metadata } from 'next';
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: 'window.jQuery=window.$=window.jQuery||function(){return window.jQuery;};',
          }}
        />
      </head>
      <body className="min-h-screen bg-page text-content-primary antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
