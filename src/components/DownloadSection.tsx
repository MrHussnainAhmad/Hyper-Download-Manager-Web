'use client';

import { Download, Monitor, Terminal } from 'lucide-react';

interface PlatformConfig {
  platform: string;
  version: string;
  downloadUrl: string;
}

export default function DownloadSection({ configs }: { configs: PlatformConfig[] }) {
  const windowsConfig = configs.find(c => c.platform === 'windows') || {
    platform: 'windows',
    version: '1.0.0',
    downloadUrl: '/downloads/FDM-Setup-Windows.exe'
  };

  const linuxConfig = configs.find(c => c.platform === 'linux') || {
    platform: 'linux',
    version: '1.0.0',
    downloadUrl: '/downloads/FDM-Setup-Linux.AppImage'
  };

  const handleDownload = async (platform: string, version: string) => {
    try {
      await fetch('/api/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform, version }),
      });
    } catch (error) {
      console.error('Failed to track download:', error);
    }
  };

  const platforms = [
    {
      name: 'Windows',
      id: 'windows',
      icon: Monitor,
      desc: 'Windows 10 / 11 (64-bit)',
      size: '43 MB',
      config: windowsConfig
    },
    {
      name: 'Linux',
      id: 'linux',
      icon: Terminal,
      desc: 'Ubuntu, Debian, Fedora',
      size: '43 MB',
      config: linuxConfig
    }
  ];

  return (
    <section id="download" className="py-20 bg-white">
      <div className="container-custom text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">Start Downloading Now</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-12">
          Hyper Download Manager is 100% free and open-source. No hidden costs or registration.
        </p>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {platforms.map((platform) => (
            <div key={platform.id} className="p-8 rounded-2xl border border-gray-200 bg-white hover:border-blue-500 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <platform.icon className="w-8 h-8 text-gray-700" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{platform.name}</h3>
              <p className="text-gray-600 mb-1">{platform.desc}</p>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-8">
                <span>v{platform.config.version}</span>
                <span>•</span>
                <span>{platform.size}</span>
              </div>
              
              <a
                href={platform.config.downloadUrl}
                onClick={() => handleDownload(platform.id, platform.config.version)}
                className="btn-primary w-full py-4 rounded-xl text-lg flex items-center justify-center gap-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Download className="w-5 h-5" />
                Download for {platform.name}
              </a>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm font-medium text-gray-500">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
            </div>
            Verified Malware-free
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
            </div>
            No Ads or Trackers
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
            </div>
            Open Source
          </div>
        </div>
      </div>
    </section>
  );
}
