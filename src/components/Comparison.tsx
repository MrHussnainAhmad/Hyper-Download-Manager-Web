'use client';

import { Check, X } from 'lucide-react';

const rows: [string, boolean, boolean, boolean][] = [
  ['Multi-threaded downloads', true, true, false],
  ['Pause & Resume', true, true, true],
  ['Batch downloads', true, true, false],
  ['Completely free', true, false, true],
  ['No registration', true, false, true],
  ['No Ads', true, false, true],
];

export default function Comparison() {
  return (
    <section id="comparison" className="py-20 bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">Why Choose HDM?</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            See how Hyper Download Manager compares to other popular solutions.
          </p>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-4 md:p-6 font-bold text-gray-900">Feature</th>
                <th className="p-4 md:p-6 font-bold text-blue-600 text-center bg-blue-50/50">HDM</th>
                <th className="p-4 md:p-6 font-bold text-gray-900 text-center">IDM</th>
                <th className="p-4 md:p-6 font-bold text-gray-900 text-center">Browser</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {rows.map(([name, hdm, idm, br]) => (
                <tr key={name} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 md:p-6 text-gray-700 font-medium">{name}</td>
                  <td className="p-4 md:p-6 text-center bg-blue-50/30">
                    {hdm ? <Check className="inline w-5 h-5 text-green-600" /> : <X className="inline w-5 h-5 text-red-500" />}
                  </td>
                  <td className="p-4 md:p-6 text-center">
                    {idm ? <Check className="inline w-5 h-5 text-green-600" /> : <X className="inline w-5 h-5 text-red-500" />}
                  </td>
                  <td className="p-4 md:p-6 text-center">
                    {br ? <Check className="inline w-5 h-5 text-green-600" /> : <X className="inline w-5 h-5 text-red-500" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
