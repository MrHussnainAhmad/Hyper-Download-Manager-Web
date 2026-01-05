'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Download } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-300">
      <div className="container-custom">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-lg text-gray-900">
            <Image src="/icon.png" alt="HDM Logo" width={32} height={32} />
            Hyper Download Manager
          </Link>

          {/* Nav */}
          <nav className="flex items-center space-x-5 text-sm">
            <Link href="/#features" className="hover:underline">Features</Link>
            <Link href="/#comparison" className="hover:underline">Comparison</Link>
            <Link href="/#reviews" className="hover:underline">Reviews</Link>
            <Link href="/submit-bug" className="hover:underline">Support</Link>
            <a href="#download" className="btn-primary">
              <Download className="w-4 h-4 mr-1" />
              Download
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
