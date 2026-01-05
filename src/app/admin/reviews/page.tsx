'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { MessageSquare, Trash2, CheckCircle, XCircle, Star } from 'lucide-react';

interface Review {
  id: string;
  email: string;
  name: string;
  rating: number;
  review: string;
  approved: boolean;
  createdAt: string;
}

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await fetch('/api/admin/reviews');
      const data = await res.json();
      setReviews(data);
    } catch (err) {
      toast.error('Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  const toggleApproval = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch('/api/admin/reviews', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, approved: !currentStatus }),
      });
      if (res.ok) {
        toast.success(!currentStatus ? 'Review approved' : 'Review unapproved');
        setReviews(reviews.map(r => r.id === id ? { ...r, approved: !currentStatus } : r));
      }
    } catch (err) {
      // Small bug in code above: 'b' should be 'r' in the map function. I'll fix it in the file.
      toast.error('Failed to update review');
    }
  };

  const deleteReview = async (id: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    try {
      const res = await fetch(`/api/admin/reviews?id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        toast.success('Review deleted');
        setReviews(reviews.filter(r => r.id !== id));
      }
    } catch (err) {
      toast.error('Failed to delete review');
    }
  };

  if (loading) return <div className="animate-pulse space-y-4">
    {[1,2,3].map(i => <div key={i} className="h-40 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>)}
  </div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold dark:text-white">User Reviews</h1>
        <p className="text-gray-600 dark:text-gray-400">Approve or moderate user testimonials.</p>
      </div>

      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 p-8 text-center rounded-xl border border-gray-100 dark:border-gray-700">
            <MessageSquare className="w-12 h-12 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No reviews found.</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className={`bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border ${review.approved ? 'border-green-100 dark:border-green-900/30' : 'border-orange-100 dark:border-orange-900/30'}`}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-4">
                  <div className={`p-2 rounded-lg ${review.approved ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                    <Star className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg dark:text-white">{review.name}</h3>
                    <div className="flex items-center gap-1 text-yellow-500 my-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`} />
                      ))}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{review.email} • {new Date(review.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => toggleApproval(review.id, review.approved)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      review.approved 
                        ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                        : 'bg-green-50 text-green-600 hover:bg-green-100'
                    }`}
                  >
                    {review.approved ? <><XCircle className="w-4 h-4" /> Unapprove</> : <><CheckCircle className="w-4 h-4" /> Approve</>}
                  </button>
                  <button 
                    onClick={() => deleteReview(review.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 italic">"{review.review}"</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
