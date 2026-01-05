'use client';

import { useState } from 'react';
import { Download, Monitor, Apple, Terminal, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const platforms = [
  { 
    name: 'Windows', 
    icon: Monitor, 
    file: 'FDM-Setup-Windows.exe',
    version: '1.0.0',
    size: '43 MB'
  },
  { 
    name: 'macOS', 
    icon: Apple, 
    file: 'FDM-Setup-macOS.dmg',
    version: '1.0.0',
    size: '43 MB'
  },
  { 
    name: 'Linux', 
    icon: Terminal, 
    file: 'FDM-Setup-Linux.AppImage',
    version: '1.0.0',
    size: '43 MB'
  },
];

export default function DownloadButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async (platform: typeof platforms[0]) => {
    setDownloading(true);
    setIsOpen(false);

    try {
      // Track download
      await fetch('/api/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          platform: platform.name,
          version: platform.version 
        }),
      });

      // Trigger download (replace with actual file URL)
      const link = document.createElement('a');
      link.href = `/downloads/${platform.file}`;
      link.download = platform.file;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download error:', error);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={downloading}
        className="flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-500 hover:to-green-400 px-8 py-4 rounded-xl text-white font-semibold text-lg transition-all glow-green disabled:opacity-50"
      >
        <Download className={`w-6 h-6 ${downloading ? 'animate-bounce' : ''}`} />
        <span>{downloading ? 'Starting Download...' : 'Download Free'}</span>
        <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 right-0 mt-2 glass rounded-xl overflow-hidden z-50"
          >
            {platforms.map((platform) => (
              <button
                key={platform.name}
                onClick={() => handleDownload(platform)}
                className="w-full flex items-center justify-between p-4 hover:bg-white/10 transition"
              >
                <div className="flex items-center space-x-3">
                  <platform.icon className="w-5 h-5 text-gray-400" />
                  <div className="text-left">
                    <p className="text-white font-medium">{platform.name}</p>
                    <p className="text-gray-500 text-xs">v{platform.version} • {platform.size}</p>
                  </div>
                </div>
                <Download className="w-4 h-4 text-blue-500" />
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
