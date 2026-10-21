import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Raghav Metange | CSE Undergrad (3rd Yr, Sem 5) | Symbiosis Institute of Technology',
  description:
    'Personal portfolio of Raghav Metange, 3rd year Computer Science & Engineering undergraduate at Symbiosis Institute of Technology. Building a Multilingual Fake News Detector & FinTech Stock Market Simulator.',
  keywords: [
    'Raghav Metange',
    'Raghav',
    'Symbiosis Institute of Technology',
    'CSE Portfolio',
    'Semester 5',
    'Fake News Detector',
    'FinTech Simulator',
    'Python',
    'Streamlit',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#05060b] text-[#f3f4f6]">
        {children}
      </body>
    </html>
  );
}
