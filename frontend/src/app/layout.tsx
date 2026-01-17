import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Daffodil AI Club | DIU',
    template: '%s | Daffodil AI Club',
  },
  description: 'Official AI Club of Daffodil International University. Learn AI, Machine Learning, and Deep Learning with us through workshops, projects, and events.',
  keywords: [
    'AI Club',
    'Daffodil International University',
    'DIU',
    'Artificial Intelligence',
    'Machine Learning',
    'Deep Learning',
    'Student Club',
    'Bangladesh',
  ],
  authors: [{ name: 'Daffodil AI Club' }],
  creator: 'Daffodil AI Club',
  publisher: 'Daffodil International University',
  metadataBase: new URL('https://aiclub.diu.edu.bd'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://aiclub.diu.edu.bd',
    title: 'Daffodil AI Club | DIU',
    description: 'Official AI Club of Daffodil International University. Learn AI, Machine Learning, and Deep Learning with us.',
    siteName: 'Daffodil AI Club',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Daffodil AI Club',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Daffodil AI Club | DIU',
    description: 'Official AI Club of Daffodil International University',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.variable} ${poppins.variable} font-sans`} style={{ background: '#000000', color: '#FFFFFF' }}>
        <div id="root">{children}</div>
      </body>
    </html>
  );
}
