'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Bug, Trash2, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

interface BugReport {
  id: string;
  email: string;
  title: string;
  description: string;
  type: string;
  status: string;
  createdAt: string;
}

export default function AdminBugs() {
  const [bugs, setBugs] = useState<BugReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBugs();
  }, []);

  const fetchBugs = async () => {
    try {
      const res = await fetch('/api/admin/bugs');
      const data = await res.json();
      setBugs(data);
    } catch (err) {
      toast.error('Failed to fetch bugs');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch('/api/admin/bugs', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        toast.success('Status updated');
        setBugs(bugs.map(b => b.id === id ? { ...b, status } : b));
      }
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const deleteBug = async (id: string) => {
    if (!confirm('Are you sure you want to delete this report?')) return;
    try {
      const res = await fetch(`/api/admin/bugs?id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        toast.success('Report deleted');
        setBugs(bugs.filter(b => b.id !== id));
      }
    } catch (err) {
      toast.error('Failed to delete report');
    }
  };

  if (loading) return <div className="animate-pulse space-y-4">
    {[1,2,3].map(i => <div key={i} className="h-40 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>)}
  </div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold dark:text-white">Bug Reports & Feature Requests</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage user feedback and issues.</p>
      </div>

      <div className="space-y-4">
        {bugs.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 p-8 text-center rounded-xl border border-gray-100 dark:border-gray-700">
            <Bug className="w-12 h-12 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No reports found.</p>
          </div>
        ) : (
          bugs.map((bug) => (
            <div key={bug.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-4">
                  <div className={`p-2 rounded-lg ${bug.type === 'bug' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                    <Bug className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg dark:text-white">{bug.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">from {bug.email} • {new Date(bug.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <select 
                    value={bug.status}
                    onChange={(e) => updateStatus(bug.id, e.target.value)}
                    className="text-sm border border-gray-200 dark:border-gray-700 rounded-lg p-2 bg-gray-50 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="ignored">Ignored</option>
                  </select>
                  <button 
                    onClick={() => deleteBug(bug.id)}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{bug.description}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
