'use client';

export default function Features() {
  const features = [
    'Accelerated multi-threaded downloads',
    'Resume broken or interrupted downloads',
    'Browser integration',
    'Batch downloads',
    'Scheduled downloads',
    'Speed limiter',
    'Built-in virus scan',
    'Lightweight and fast',
  ];

  return (
    <section id="features" className="py-14 bg-gray-50">
      <div className="container-custom">
        <h2 className="section-title">Features</h2>
        <p className="section-subtitle">
          Everything you need in a professional download manager.
        </p>

        <div className="mt-6 box p-4">
          <ul className="grid md:grid-cols-2 gap-2 text-sm">
            {features.map((f) => (
              <li key={f}>✔ {f}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
