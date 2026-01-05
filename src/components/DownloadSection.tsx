'use client';

import { Download } from 'lucide-react';

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

  return (
    <section id="download" className="py-16 bg-gray-50">
      <div className="container-custom">
        <h2 className="section-title">Download</h2>
        <p className="section-subtitle">
          Hyper Download Manager is completely free. No registration required.
        </p>

        <div className="box mt-6 p-6">
          <table className="table">
            <tbody>
              <tr>
                <td className="font-bold">Windows</td>
                <td>Windows 10 / 11 (64-bit) {windowsConfig.version && `(v${windowsConfig.version})`}</td>
                <td>43 MB</td>
                <td>
                  <a
                    href={windowsConfig.downloadUrl}
                    onClick={() => handleDownload('windows', windowsConfig.version)}
                    className="btn-primary"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </a>
                </td>
              </tr>
              <tr>
                <td className="font-bold">Linux</td>
                <td>Ubuntu, Fedora {linuxConfig.version && `(v${linuxConfig.version})`}</td>
                <td>43 MB</td>
                <td>
                  <a
                    href={linuxConfig.downloadUrl}
                    onClick={() => handleDownload('linux', linuxConfig.version)}
                    className="btn-primary"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </a>
                </td>
              </tr>
            </tbody>
          </table>

          <p className="text-sm text-gray-600 mt-4">
            ✔ No ads &nbsp; ✔ No malware &nbsp; ✔ Free forever
          </p>
        </div>
      </div>
    </section>
  );
}
