'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Download, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-gray-900" onClick={() => setIsMenuOpen(false)}>
            <Image src="/icon.png" alt="HDM Logo" width={32} height={32} className="w-8 h-8" />
            <span className="hidden sm:inline-block text-lg">Hyper Download Manager</span>
            <span className="sm:hidden text-lg">HDM</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-gray-600">
            <Link href="/#features" className="hover:text-blue-600 transition-colors">Features</Link>
            <Link href="/#comparison" className="hover:text-blue-600 transition-colors">Comparison</Link>
            <Link href="/#reviews" className="hover:text-blue-600 transition-colors">Reviews</Link>
            <Link href="/submit-bug" className="hover:text-blue-600 transition-colors">Support</Link>
            <a href="#download" className="btn-primary">
              <Download className="w-4 h-4 mr-2" />
              Download
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b border-gray-200 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col p-4 space-y-4 text-sm font-medium text-gray-700">
            <Link href="/#features" className="p-2 hover:bg-gray-50 rounded-md" onClick={toggleMenu}>Features</Link>
            <Link href="/#comparison" className="p-2 hover:bg-gray-50 rounded-md" onClick={toggleMenu}>Comparison</Link>
            <Link href="/#reviews" className="p-2 hover:bg-gray-50 rounded-md" onClick={toggleMenu}>Reviews</Link>
            <Link href="/submit-bug" className="p-2 hover:bg-gray-50 rounded-md" onClick={toggleMenu}>Support</Link>
            <a href="#download" className="btn-primary w-full justify-center" onClick={toggleMenu}>
              <Download className="w-4 h-4 mr-2" />
              Download
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
