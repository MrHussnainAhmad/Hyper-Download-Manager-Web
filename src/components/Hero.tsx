'use client';

import { Download } from 'lucide-react';

interface PlatformConfig {
  platform: string;
  version: string;
  downloadUrl: string;
}

export default function Hero({ configs }: { configs: PlatformConfig[] }) {
  const latestVersion = configs[0]?.version || '1.0.0';
  
  return (
    <section className="pt-28 pb-16">
      <div className="container-custom">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* Left */}
          <div>
            <h1 className="text-3xl font-bold mb-4">
              Hyper Download Manager
            </h1>

            <p className="text-gray-700 text-sm mb-4">
              Hyper Download Manager (HDM) is a powerful, lightweight download manager
              that increases download speed by up to 10x using multi-threaded technology.
            </p>

            <ul className="list-disc ml-5 text-sm text-gray-700 mb-6 space-y-1">
              <li>Resume broken downloads</li>
              <li>Multi-threaded acceleration</li>
              <li>Browser integration</li>
              <li>Completely free</li>
            </ul>

            <div className="flex gap-3">
              <a href="#download" className="btn-primary">
                <Download className="w-4 h-4 mr-2" />
                Download
              </a>
              <a href="#features" className="btn-secondary">
                Learn More
              </a>
            </div>
          </div>

          {/* Right */}
          <div className="border border-gray-300 p-4 text-sm bg-gray-50">
            <p className="font-bold mb-2">Latest Version</p>
            <p>Version: {latestVersion}</p>
            <p>Size: ~43 MB</p>
            <p>OS: Windows / Linux</p>
            <p className="mt-2 text-green-700 font-bold">
              100% Free • No Registration
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
