'use client';

import Link from 'next/link';
import { Star } from 'lucide-react';
import { Review } from '@/types';

export default function Reviews({ reviews }: { reviews: Review[] }) {
  return (
    <section id="reviews" className="py-16">
      <div className="container-custom">
        <h2 className="section-title">User Reviews</h2>

        {reviews.length === 0 ? (
          <p className="text-sm text-gray-600 mt-4">
            No reviews yet. Be the first to write one.
          </p>
        ) : (
          <div className="box mt-6 divide-y divide-gray-300">
            {reviews.slice(0, 5).map((r) => (
              <div key={r.id} className="p-4 text-sm">
                <div className="flex items-center mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < r.rating
                          ? 'fill-yellow-500 text-yellow-500'
                          : 'fill-gray-300 text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-gray-800">“{r.review}”</p>
                <p className="text-gray-500 mt-1">
                  — {r.name}, {new Date(r.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4">
          <Link href="/submit-review" className="btn-secondary">
            Write a Review
          </Link>
        </div>
      </div>
    </section>
  );
}
