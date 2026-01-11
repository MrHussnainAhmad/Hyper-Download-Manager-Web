'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Link as LinkIcon, Image as ImageIcon, Video, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Ad {
  id: string;
  title: string;
  type: 'IMAGE' | 'VIDEO' | 'LINK';
  targetTier: 'FREEMIUM' | 'PLUS';
  contentUrl?: string;
  linkUrl: string;
  isActive: boolean;
  createdAt: string;
}

export default function AdsPage() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'IMAGE' | 'VIDEO' | 'LINK'>('IMAGE');
  const [targetTier, setTargetTier] = useState<'FREEMIUM' | 'PLUS'>('FREEMIUM');
  const [contentUrl, setContentUrl] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      const res = await fetch('/api/admin/ads');
      const data = await res.json();
      setAds(data);
    } catch (error) {
      toast.error('Failed to load ads');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      setContentUrl(data.url);
      toast.success('File uploaded successfully');
    } catch (error: any) {
      toast.error('Upload failed: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (targetTier === 'PLUS' && type === 'VIDEO') {
      toast.error('Plus tier cannot have Video ads');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/ads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          type,
          targetTier,
          contentUrl: type === 'LINK' ? undefined : contentUrl,
          linkUrl,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast.success('Ad created successfully');
      fetchAds();
      // Reset form
      setTitle('');
      setContentUrl('');
      setLinkUrl('');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this ad?')) return;

    try {
      const res = await fetch(`/api/admin/ads/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      
      toast.success('Ad deleted');
      setAds(ads.filter(ad => ad.id !== id));
    } catch (error) {
      toast.error('Could not delete ad');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Ad Management</h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Create Ad Form */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 sticky top-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5" /> Create New Ad
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Ad Title (Internal)
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., Summer Sale Banner"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Target Tier
                  </label>
                  <select
                    value={targetTier}
                    onChange={(e) => setTargetTier(e.target.value as 'FREEMIUM' | 'PLUS')}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="FREEMIUM">Freemium</option>
                    <option value="PLUS">Plus</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Type
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="IMAGE">Image</option>
                    <option value="LINK">Link Only</option>
                    {targetTier === 'FREEMIUM' && <option value="VIDEO">Video</option>}
                  </select>
                </div>
              </div>

              {type !== 'LINK' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Upload {type === 'IMAGE' ? 'Image' : 'Video'}
                  </label>
                  <div className="flex gap-2 items-center">
                     <input
                      type="file"
                      accept={type === 'IMAGE' ? "image/*" : "video/*"}
                      onChange={handleFileUpload}
                      disabled={uploading}
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                  {uploading && <p className="text-xs text-blue-500 mt-1">Uploading...</p>}
                  {contentUrl && (
                    <div className="mt-2 relative group">
                      <p className="text-xs text-green-600 truncate">Uploaded: {contentUrl}</p>
                      {type === 'IMAGE' && (
                        <img src={contentUrl} alt="Preview" className="mt-1 w-full h-32 object-cover rounded-lg border border-gray-200" />
                      )}
                    </div>
                  )}
                  {/* Fallback/Manual URL input just in case */}
                  <input
                    type="url"
                    value={contentUrl}
                    onChange={(e) => setContentUrl(e.target.value)}
                    className="w-full mt-2 px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white placeholder-gray-400"
                    placeholder="Or paste URL manually..."
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Click-through Link
                </label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <input
                    type="url"
                    required
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    placeholder="https://example.com/product"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Publish Ad'}
              </button>
            </form>
          </div>
        </div>

        {/* Ads List */}
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 mx-auto text-gray-400 animate-spin" />
            </div>
          ) : ads.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <p className="text-gray-500">No active ads found.</p>
            </div>
          ) : (
            ads.map((ad) => (
              <div
                key={ad.id}
                className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 flex items-start gap-4"
              >
                <div className="w-24 h-24 shrink-0 bg-gray-100 dark:bg-gray-900 rounded-lg flex items-center justify-center overflow-hidden border border-gray-200 dark:border-gray-700">
                  {ad.type === 'IMAGE' && (
                    <img src={ad.contentUrl} alt={ad.title} className="w-full h-full object-cover" />
                  )}
                  {ad.type === 'VIDEO' && (
                    <Video className="w-8 h-8 text-gray-400" />
                  )}
                  {ad.type === 'LINK' && (
                    <LinkIcon className="w-8 h-8 text-gray-400" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white truncate">
                        {ad.title}
                      </h3>
                      <div className="flex gap-2 mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          ad.targetTier === 'FREEMIUM' 
                            ? 'bg-gray-100 text-gray-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {ad.targetTier}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                          {ad.type}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(ad.id)}
                      className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg transition-colors"
                      title="Delete Ad"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="mt-3 flex items-center gap-2 text-xs text-gray-500 truncate">
                    <LinkIcon className="w-3 h-3" />
                    <a href={ad.linkUrl} target="_blank" rel="noopener noreferrer" className="hover:underline truncate">
                      {ad.linkUrl}
                    </a>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
