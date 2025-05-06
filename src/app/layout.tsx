import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '../styles/globals.css';
import ClientLayout from '@/components/ClientLayout';
import AuthCheckWrapper from '@/components/AuthCheckWrapper';
import { Providers } from '@/lib/Providers';
import { ClientPathCheck } from '@/components/ClientPathCheck';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Học Lập Trình Cùng H3',
  description:
    'Nền tảng học lập trình trực tuyến với khóa học và bài viết chất lượng',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <AuthCheckWrapper>
            <ClientPathCheck excludePaths={['/admin', '/not-found']}>
              <ClientLayout>{children}</ClientLayout>
            </ClientPathCheck>
          </AuthCheckWrapper>
        </Providers>
        {children}
      </body>
    </html>
  );
}
