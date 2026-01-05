'use client';

import { Check, X } from 'lucide-react';

const rows: [string, boolean, boolean, boolean][] = [
  ['Multi-threaded downloads', true, true, false],
  ['Pause & Resume', true, true, true],
  ['Batch downloads', true, true, false],
  ['Completely free', true, false, true],
  ['No registration', true, false, true],
];

export default function Comparison() {
  return (
    <section id="comparison" className="py-14">
      <div className="container-custom">
        <h2 className="section-title">Comparison</h2>

        <table className="table mt-6">
          <thead>
            <tr>
              <th>Feature</th>
              <th>HDM</th>
              <th>IDM</th>
              <th>Browser</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([name, hdm, idm, br]) => (
              <tr key={name}>
                <td>{name}</td>
                {[hdm, idm, br].map((v, i) => (
                  <td key={i} className="text-center">
                    {v ? <Check className="inline w-4 h-4 text-green-600" /> : <X className="inline w-4 h-4 text-red-500" />}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
