'use client';

import { useEffect, useState } from 'react';
import { 
  Download, 
  Bug, 
  MessageSquare, 
  Clock,
  ArrowUpRight,
  TrendingUp
} from 'lucide-react';

interface Stats {
  totalDownloads: number;
  totalBugs: number;
  totalReviews: number;
  pendingReviews: number;
  downloadsByPlatform: Array<{ platform: string; _count: { id: number } }>;
}

interface PlatformConfig {
  id?: string;
  platform: string;
  version: string;
  downloadUrl: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [configs, setConfigs] = useState<PlatformConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/stats').then(res => res.json()),
      fetch('/api/admin/config').then(res => res.json())
    ])
      .then(([statsData, configsData]) => {
        setStats(statsData);
        // Ensure both platforms exist in state
        const platforms = ['windows', 'linux'];
        const fullConfigs = platforms.map(p => {
          return configsData.find((c: any) => c.platform === p) || { platform: p, version: '', downloadUrl: '' };
        });
        setConfigs(fullConfigs);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleUpdateConfig = async (platform: string, version: string, downloadUrl: string) => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform, version, downloadUrl }),
      });
      if (res.ok) {
        const updated = await res.json();
        setConfigs(prev => {
          const index = prev.findIndex(c => c.platform === platform);
          if (index > -1) {
            const newConfigs = [...prev];
            newConfigs[index] = updated;
            return newConfigs;
          }
          return [...prev, updated];
        });
        alert('Configuration updated successfully');
      }
    } catch (error) {
      console.error(error);
      alert('Failed to update configuration');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="animate-pulse space-y-8">
      <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl w-full"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1,2,3,4].map(i => (
          <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
        ))}
      </div>
    </div>;
  }

  const statCards = [
    { name: 'Total Downloads', value: stats?.totalDownloads || 0, icon: Download, color: 'bg-blue-500' },
    { name: 'Bug Reports', value: stats?.totalBugs || 0, icon: Bug, color: 'bg-red-500' },
    { name: 'Total Reviews', value: stats?.totalReviews || 0, icon: MessageSquare, color: 'bg-green-500' },
    { name: 'Pending Reviews', value: stats?.pendingReviews || 0, icon: Clock, color: 'bg-orange-500' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold dark:text-white">Dashboard Overview</h1>
        <p className="text-gray-600 dark:text-gray-400">Welcome back to the FDM management panel.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">{stat.name}</p>
                  <p className="text-2xl font-bold mt-1 dark:text-white">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg text-white shadow-lg`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold dark:text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Downloads by Platform
            </h2>
          </div>
          <div className="space-y-4">
            {stats?.downloadsByPlatform.map((item) => (
              <div key={item.platform}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium dark:text-gray-300">{item.platform}</span>
                  <span className="text-sm font-medium dark:text-gray-300">{item._count.id}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${(item._count.id / (stats.totalDownloads || 1)) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-bold mb-6 dark:text-white">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href="/admin/reviews" className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-600 hover:border-blue-500 transition-colors text-center group">
              <MessageSquare className="w-6 h-6 mx-auto mb-2 text-blue-600" />
              <span className="text-sm font-medium dark:text-gray-300">Moderate Reviews</span>
            </a>
            <a href="/admin/bugs" className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-600 hover:border-blue-500 transition-colors text-center group">
              <Bug className="w-6 h-6 mx-auto mb-2 text-red-500" />
              <span className="text-sm font-medium dark:text-gray-300">View Bug Reports</span>
            </a>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h2 className="text-lg font-bold mb-6 dark:text-white flex items-center gap-2">
          <Download className="w-5 h-5 text-green-600" />
          Download Configuration
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {['windows', 'linux'].map(platform => {
            const config = configs.find(c => c.platform === platform) || { platform, version: '', downloadUrl: '' };
            return (
              <div key={platform} className="space-y-4 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-100 dark:border-gray-600">
                <h3 className="font-bold capitalize dark:text-white">{platform}</h3>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Latest Version</label>
                  <input 
                    type="text" 
                    value={config.version}
                    onChange={(e) => {
                      const newVersion = e.target.value;
                      setConfigs(prev => prev.map(c => c.platform === platform ? { ...c, version: newVersion } : c));
                    }}
                    placeholder="e.g. 1.0.0"
                    className="w-full p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded text-sm dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Download URL (CDN/GitHub)</label>
                  <input 
                    type="text" 
                    value={config.downloadUrl}
                    onChange={(e) => {
                      const newUrl = e.target.value;
                      setConfigs(prev => prev.map(c => c.platform === platform ? { ...c, downloadUrl: newUrl } : c));
                    }}
                    placeholder="https://..."
                    className="w-full p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded text-sm dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
                <button
                  disabled={saving}
                  onClick={() => handleUpdateConfig(platform, config.version, config.downloadUrl)}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-bold transition-colors disabled:opacity-50"
                >
                  {saving ? 'Updating...' : `Update ${platform} Link`}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
