'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Loader2, Copy, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<{ key: string; plan: string; email: string } | null>(null);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!sessionId) {
      setError('Invalid session.');
      setLoading(false);
      return;
    }

    // Prevent double fetch in React Strict Mode
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchKey = async () => {
      try {
        const res = await fetch(`/api/checkout/success?session_id=${sessionId}`);
        const json = await res.json();

        if (!res.ok) {
          throw new Error(json.error || 'Failed to retrieve license.');
        }

        setData(json);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchKey();
  }, [sessionId]);

  const copyToClipboard = () => {
    if (data?.key) {
      navigator.clipboard.writeText(data.key);
      toast.success('License key copied!');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4 pt-32">
        <Loader2 className="w-16 h-16 text-blue-600 animate-spin mb-6" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Verifying Payment...</h2>
        <p className="text-gray-600">Please wait while we generate your secure license key.</p>
        <p className="text-sm text-gray-400 mt-2">Do not close this window.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4 max-w-lg mx-auto pt-32">
        <div className="bg-red-100 p-4 rounded-full mb-6">
          <AlertCircle className="w-12 h-12 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Link Expired or Invalid</h2>
        <p className="text-gray-600 mb-8 text-lg">
          {error}
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 w-full text-left">
          <h3 className="font-semibold text-blue-900 mb-2">What happened?</h3>
          <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
            <li>For security, the license key is only shown once on this page.</li>
            <li>If you refreshed the page, the key is hidden for safety.</li>
            <li><strong>Don't worry!</strong> We also sent the key to your email.</li>
          </ul>
        </div>
        <Link 
          href="/" 
          className="mt-8 inline-flex items-center text-blue-600 font-semibold hover:underline"
        >
          Return to Home <ArrowRight className="w-4 h-4 ml-1" />
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] px-4 pt-32 pb-20">
      <div className="bg-white shadow-xl rounded-2xl border border-gray-100 p-8 max-w-lg w-full text-center relative overflow-hidden">
        {/* Success Header */}
        <div className="bg-green-100 p-4 rounded-full inline-flex mb-6">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Payment Successful!</h1>
        <p className="text-gray-600 mb-8">
          Thank you for purchasing the <strong>{data?.plan}</strong> plan.
        </p>

        {/* License Key Box */}
        <div className="text-left mb-8">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Your License Key (Copy Now)
          </label>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-1 flex items-center group focus-within:ring-2 focus-within:ring-blue-500 transition-all">
            <code className="flex-1 font-mono text-xl text-gray-900 px-4 py-3 tracking-widest break-all">
              {data?.key}
            </code>
            <button
              onClick={copyToClipboard}
              className="bg-white hover:bg-gray-100 text-gray-600 p-3 rounded-lg border border-gray-200 transition-colors"
              title="Copy to clipboard"
            >
              <Copy className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            Warning: This key will not be shown again here. Save it!
          </p>
        </div>

        <div className="border-t border-gray-100 pt-6">
          <p className="text-sm text-gray-500 mb-4">
            A copy of this key has also been sent to <strong>{data?.email}</strong>.
          </p>
          <Link
            href="/"
            className="block w-full py-3 bg-gray-900 text-white rounded-lg font-bold hover:bg-gray-800 transition-colors"
          >
            Start Downloading
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PurchaseSuccessPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
