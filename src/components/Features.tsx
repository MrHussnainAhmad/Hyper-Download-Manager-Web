'use client';

import { 
  Zap, 
  RefreshCcw, 
  Chrome, 
  Layers, 
  Calendar, 
  Gauge, 
  ShieldCheck, 
  FastForward 
} from 'lucide-react';

export default function Features() {
  const features = [
    { name: 'Accelerated Downloads', desc: 'Multi-threaded technology for up to 10x faster speeds.', icon: Zap },
    { name: 'Resume Support', desc: 'Resume broken or interrupted downloads from where they left off.', icon: RefreshCcw },
    { name: 'Browser Integration', desc: 'Seamlessly catch downloads from all popular browsers.', icon: Chrome },
    { name: 'Batch Downloads', desc: 'Download multiple files simultaneously with ease.', icon: Layers },
    { name: 'Scheduled Downloads', desc: 'Plan your downloads for a later time or during off-peak hours.', icon: Calendar },
    { name: 'Speed Limiter', desc: 'Control your bandwidth usage while downloading.', icon: Gauge, upcoming: true },
    { name: 'Lightweight', desc: 'Low memory footprint and optimized for performance.', icon: FastForward },
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">Powerful Features</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need in a professional download manager, built for speed and reliability.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <div key={feature.name} className="p-6 rounded-xl border border-gray-100 bg-gray-50 hover:bg-white hover:shadow-lg transition-all duration-300 group relative overflow-hidden">
              {feature.upcoming && (
                <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg uppercase tracking-wider">
                  Upcoming
                </div>
              )}
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors">
                <feature.icon className="w-6 h-6 text-blue-600 group-hover:text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{feature.name}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
