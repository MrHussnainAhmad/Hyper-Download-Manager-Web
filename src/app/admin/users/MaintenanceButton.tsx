'use client';

import { useState } from 'react';
import { Trash2, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function MaintenanceButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const runMaintenance = async () => {
    if (!confirm('This will delete all expired licenses and send warning emails to users expiring soon. Are you sure?')) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/admin/licenses/cron', {
        method: 'POST',
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error);

      toast.success(`Done! Sent ${data.stats.remindersSent} reminders, Deleted ${data.stats.licensesDeleted} expired.`);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || 'Failed to run maintenance');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={runMaintenance}
      disabled={loading}
      className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Trash2 className="w-4 h-4" />
      )}
      Run Maintenance
    </button>
  );
}
