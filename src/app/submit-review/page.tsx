import ReviewForm from '@/components/ReviewForm';
import { Star } from 'lucide-react';

export const metadata = {
  title: 'Write a Review - Hyper Download Manager',
  description: 'Share your experience with Hyper Download Manager',
};

export default function SubmitReviewPage() {
  return (
    <div className="pt-28 pb-20 bg-gray-50 min-h-screen">
      <div className="container-custom">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-6">
            <Star className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Write a Review
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            Your feedback helps us improve and helps others discover Hyper Download Manager.
          </p>
        </div>
        <ReviewForm />
      </div>
    </div>
  );
}
