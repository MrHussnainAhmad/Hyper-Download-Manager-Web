'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function ReviewForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [form, setForm] = useState({
    name: '',
    email: '',
    rating: 5,
    review: '',
  });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.details?.fieldErrors) {
          setErrors(data.details.fieldErrors);
        } else {
          toast.error(data.error || 'Failed to submit review');
        }
        return;
      }

      toast.success('Review submitted successfully!');
      router.push('/');
      router.refresh();
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="box p-6 max-w-xl mx-auto">
      <div className="mb-4">
        <label className="block text-sm font-bold mb-1">Name</label>
        <input 
          className={`input-field ${errors.name ? 'border-red-500' : ''}`}
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          placeholder="Your full name"
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name[0]}</p>}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-bold mb-1">Email</label>
        <input 
          type="email" 
          className={`input-field ${errors.email ? 'border-red-500' : ''}`}
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          placeholder="your@email.com"
        />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email[0]}</p>}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-bold mb-1">Rating (1–5)</label>
        <input 
          type="number" 
          min={1} 
          max={5} 
          className={`input-field ${errors.rating ? 'border-red-500' : ''}`}
          value={form.rating}
          onChange={e => setForm({ ...form, rating: parseInt(e.target.value) || 0 })}
        />
        {errors.rating && <p className="text-red-500 text-xs mt-1">{errors.rating[0]}</p>}
      </div>

      <div className="mb-6">
        <label className="block text-sm font-bold mb-1">Review</label>
        <textarea 
          rows={4} 
          className={`textarea-field ${errors.review ? 'border-red-500' : ''}`}
          value={form.review}
          onChange={e => setForm({ ...form, review: e.target.value })}
          placeholder="Tell us what you think..."
        />
        {errors.review && <p className="text-red-500 text-xs mt-1">{errors.review[0]}</p>}
      </div>

      <button 
        disabled={loading}
        className="btn-primary w-full disabled:opacity-50"
      >
        {loading ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
}
