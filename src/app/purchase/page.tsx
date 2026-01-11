'use client';

import { useState } from 'react';
import { Check, Loader2, ShieldCheck, Mail, Lock, HelpCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function PurchasePage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState<string | null>(null);

  const handlePurchase = async (plan: 'PLUS' | 'PRO') => {
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(plan);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, plan }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Something went wrong');

      window.location.href = data.url;
    } catch (error) {
      console.error('Purchase error:', error);
      toast.error('Failed to start checkout');
      setLoading(null);
    }
  };

  return (
    <div className="container-custom py-8 pt-20 min-h-screen">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
          Upgrade Your Experience
        </h1>
        <p className="text-lg text-gray-600">
          Unlock the full potential of Hyper Download Manager.
        </p>
      </div>

      <div className="max-w-sm mx-auto mb-10">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Enter your email to start
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          We'll send your license key here. No account creation needed.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
        {/* Freemium Plan */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col">
          <div className="p-6 flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-1">Freemium</h3>
            <p className="text-sm text-gray-500 mb-4">Good for getting started</p>
            <div className="flex items-baseline mb-4">
              <span className="text-3xl font-extrabold text-gray-900">Free</span>
            </div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center text-sm text-gray-700">
                <Check className="w-4 h-4 text-green-500 mr-2 shrink-0" />
                Unlimited Downloads
              </li>
              <li className="flex items-center text-sm text-gray-700">
                <Check className="w-4 h-4 text-green-500 mr-2 shrink-0" />
                Resume Support
              </li>
              <li className="flex items-center text-sm text-gray-700">
                <Check className="w-4 h-4 text-green-500 mr-2 shrink-0" />
                Includes Ads (Image/Video)
              </li>
            </ul>
          </div>
          <div className="p-6 pt-0 mt-auto">
            <button
              className="w-full py-3 rounded-lg font-bold text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 cursor-default transition-colors flex items-center justify-center"
            >
              Current Version
            </button>
          </div>
        </div>

        {/* Plus Plan */}
        <div className="bg-white rounded-xl shadow-md border-2 border-blue-500 hover:shadow-lg transition-all duration-300 flex flex-col transform scale-105 md:scale-100 lg:scale-105 z-10">
          <div className="bg-blue-500 text-white text-center py-1 text-xs font-bold uppercase tracking-wider rounded-t-lg">
            Most Popular
          </div>
          <div className="p-6 flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-1">Plus</h3>
            <p className="text-sm text-gray-500 mb-4">For individual power users</p>
            <div className="flex items-baseline mb-4">
              <span className="text-3xl font-extrabold text-gray-900">$4.99</span>
              <span className="text-gray-500 ml-1 text-sm">/ month</span>
            </div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center text-sm text-gray-700">
                <Check className="w-4 h-4 text-green-500 mr-2 shrink-0" />
                Unlimited Downloads
              </li>
              <li className="flex items-center text-sm text-gray-700">
                <Check className="w-4 h-4 text-green-500 mr-2 shrink-0" />
                Resume Support
              </li>
              <li className="flex items-center text-sm text-gray-700">
                <Check className="w-4 h-4 text-green-500 mr-2 shrink-0" />
                Batch Download
              </li>
              <li className="flex items-center text-sm text-gray-700">
                <Check className="w-4 h-4 text-green-500 mr-2 shrink-0" />
                Speed Limiter
              </li>
              <li className="flex items-center text-sm text-gray-700 group relative cursor-help w-fit">
                <Check className="w-4 h-4 text-green-500 mr-2 shrink-0" />
                <span className="border-b border-dotted border-gray-400">Fewer Ads</span>
                <HelpCircle className="w-3 h-3 text-gray-400 ml-1 inline" />
                <div className="absolute left-0 bottom-full mb-2 w-48 bg-gray-800 text-white text-xs rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-50 shadow-xl">
                  Ads will be image type only (no videos)
                  <div className="absolute -bottom-1 left-4 w-2 h-2 bg-gray-800 rotate-45"></div>
                </div>
              </li>
              <li className="flex items-center text-sm text-gray-700">
                <Check className="w-4 h-4 text-green-500 mr-2 shrink-0" />
                1 System License
              </li>
            </ul>
          </div>
          <div className="p-6 pt-0 mt-auto">
            <button
              onClick={() => handlePurchase('PLUS')}
              disabled={!!loading}
              className="w-full py-3 rounded-lg font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center shadow-lg shadow-blue-200"
            >
              {loading === 'PLUS' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'Choose Plus'
              )}
            </button>
          </div>
        </div>

        {/* Pro Plan */}
        <div className="bg-gray-900 rounded-xl shadow-lg border border-gray-800 hover:shadow-xl transition-all duration-300 flex flex-col relative">
          <div className="absolute top-0 right-0 bg-gradient-to-l from-yellow-400 to-yellow-600 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg rounded-tr-xl uppercase tracking-wider">
            Best Value
          </div>
          <div className="p-6 flex-1">
            <h3 className="text-xl font-bold text-white mb-1">Pro</h3>
            <p className="text-sm text-gray-400 mb-4">The ultimate experience</p>
            <div className="flex items-baseline mb-4">
              <span className="text-3xl font-extrabold text-white">$29.99</span>
              <span className="text-gray-400 ml-1 text-sm">/ one-time</span>
            </div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center text-sm text-gray-300">
                <Check className="w-4 h-4 text-yellow-500 mr-2 shrink-0" />
                Everything in Plus
              </li>
              <li className="flex items-center text-sm text-gray-300">
                <Check className="w-4 h-4 text-yellow-500 mr-2 shrink-0" />
                No Ads
              </li>
              <li className="flex items-center text-sm text-gray-300">
                <Check className="w-4 h-4 text-yellow-500 mr-2 shrink-0" />
                5 System Licenses
              </li>
              <li className="flex items-center text-sm text-gray-300">
                <Check className="w-4 h-4 text-yellow-500 mr-2 shrink-0" />
                Priority Support
              </li>
              <li className="flex items-center text-sm text-gray-300">
                <Check className="w-4 h-4 text-yellow-500 mr-2 shrink-0" />
                Beta Updates
              </li>
              <li className="flex items-center text-sm text-gray-300">
                <Check className="w-4 h-4 text-yellow-500 mr-2 shrink-0" />
                Max Speed Boosting
              </li>
              <li className="flex items-center text-sm text-gray-300 group relative cursor-help w-fit">
                <Check className="w-4 h-4 text-yellow-500 mr-2 shrink-0" />
                <span className="border-b border-dotted border-gray-600">Future Features</span>
                <HelpCircle className="w-3 h-3 text-gray-600 ml-1 inline" />
                <div className="absolute right-0 md:-right-2 bottom-full mb-2 w-64 bg-white text-gray-900 text-xs rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-50 shadow-2xl border border-gray-200">
                  <p className="font-semibold mb-1 text-blue-600">Future Roadmap:</p>
                  Better proxies and free VPN services (this is not compulsory but plans of owner/developer)
                  <div className="absolute -bottom-1 right-4 w-2 h-2 bg-white border-b border-r border-gray-200 rotate-45"></div>
                </div>
              </li>
            </ul>
          </div>
          <div className="p-6 pt-0 mt-auto">
            <button
              onClick={() => handlePurchase('PRO')}
              disabled={!!loading}
              className="w-full py-3 rounded-lg font-bold text-sm text-gray-900 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
               {loading === 'PRO' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'Get Pro Forever'
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Trust & Info Section */}
      <div className="max-w-3xl mx-auto bg-blue-50 border border-blue-100 rounded-xl p-6 md:p-8">
        <div className="flex items-start gap-4">
          <div className="bg-blue-100 p-2 rounded-lg shrink-0">
            <ShieldCheck className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Thinking "No Login/Signup?"</h3>
            <p className="text-gray-700 text-sm leading-relaxed mb-4">
              Is it a scam? Should I pay or not? Here is your answer: Instead of following legacy systems, 
              we are working differently. We value your privacy and simplicity.
            </p>
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-2 text-sm text-gray-700">
                <Check className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                <p>Instead of a complex account, we send you a unique <strong>License Key</strong> directly to your email.</p>
              </div>
              <div className="flex items-start gap-2 text-sm text-gray-700">
                <Lock className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                <p><strong>Security Warning:</strong> Make sure you don't share this key with anyone untrusted. At the end of the day, it's your key! :)</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center mt-8 text-xs text-gray-400">
        <p>Secured by Stripe • SSL Encrypted Payment</p>
      </div>
    </div>
  );
}

