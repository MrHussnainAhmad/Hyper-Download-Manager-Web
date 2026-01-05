import type { Metadata } from 'next';
import './globals.css';
import LayoutContent from '@/components/LayoutContent';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'Hyper Download Manager - Free Download Accelerator',
  description: 'Download files up to 10x faster with Hyper Download Manager. Free, lightweight, and powerful.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Toaster position="top-center" />
        <LayoutContent>
          {children}
        </LayoutContent>
      </body>
    </html>
  );
}