'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Send, Loader2, Bug, Lightbulb } from 'lucide-react';
import toast from 'react-hot-toast';

export default function BugForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [formData, setFormData] = useState({
    email: '',
    title: '',
    description: '',
    type: 'bug' as 'bug' | 'feature',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await fetch('/api/bugs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.details?.fieldErrors) {
          setErrors(data.details.fieldErrors);
          toast.error('Please check the form for errors');
        } else {
          toast.error(data.error || 'Failed to submit');
        }
        return;
      }

      toast.success(
        formData.type === 'bug'
          ? 'Bug report submitted! We\'ll look into it.'
          : 'Feature request submitted! Thanks for your suggestion.'
      );
      setFormData({ email: '', title: '', description: '', type: 'bug' });
      router.push('/');
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto bg-white rounded-2xl shadow-soft border border-gray-100 p-8"
    >
      {/* Type Toggle */}
      <div className="mb-8">
        <label className="block text-gray-700 font-semibold mb-3">Type</label>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setFormData({ ...formData, type: 'bug' })}
            className={`flex items-center justify-center space-x-3 p-4 rounded-xl border-2 transition-all ${
              formData.type === 'bug'
                ? 'border-red-500 bg-red-50 text-red-600'
                : 'border-gray-200 text-gray-500 hover:border-gray-300'
            }`}
          >
            <Bug className="w-6 h-6" />
            <span className="font-semibold">Bug Report</span>
          </button>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, type: 'feature' })}
            className={`flex items-center justify-center space-x-3 p-4 rounded-xl border-2 transition-all ${
              formData.type === 'feature'
                ? 'border-green-500 bg-green-50 text-green-600'
                : 'border-gray-200 text-gray-500 hover:border-gray-300'
            }`}
          >
            <Lightbulb className="w-6 h-6" />
            <span className="font-semibold">Feature Request</span>
          </button>
        </div>
      </div>

      {/* Email */}
      <div className="mb-6">
        <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">
          Your Email
        </label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className={`input-field ${errors.email ? 'border-red-500' : ''}`}
          placeholder="john@example.com"
        />
        {errors.email && <p className="text-red-500 text-xs mt-1 font-medium">{errors.email[0]}</p>}
        <p className="text-gray-500 text-sm mt-2">We&apos;ll contact you if we need more info</p>
      </div>

      {/* Title */}
      <div className="mb-6">
        <label htmlFor="title" className="block text-gray-700 font-semibold mb-2">
          {formData.type === 'bug' ? 'Bug Title' : 'Feature Title'}
        </label>
        <input
          type="text"
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className={`input-field ${errors.title ? 'border-red-500' : ''}`}
          placeholder={
            formData.type === 'bug'
              ? 'e.g., Download fails when pausing...'
              : 'e.g., Add dark mode support...'
          }
        />
        {errors.title && <p className="text-red-500 text-xs mt-1 font-medium">{errors.title[0]}</p>}
      </div>

      {/* Description */}
      <div className="mb-8">
        <label htmlFor="description" className="block text-gray-700 font-semibold mb-2">
          Description
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={6}
          className={`textarea-field ${errors.description ? 'border-red-500' : ''}`}
          placeholder={
            formData.type === 'bug'
              ? 'Please describe the bug in detail. Include steps to reproduce...'
              : 'Describe the feature you\'d like to see and how it would help...'
          }
        />
        {errors.description && <p className="text-red-500 text-xs mt-1 font-medium">{errors.description[0]}</p>}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full py-4 rounded-xl font-semibold transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed ${
          formData.type === 'bug'
            ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/25'
            : 'bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/25'
        }`}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            Submitting...
          </>
        ) : (
          <>
            <Send className="w-5 h-5 mr-2" />
            Submit {formData.type === 'bug' ? 'Bug Report' : 'Feature Request'}
          </>
        )}
      </button>
    </motion.form>
  );
}