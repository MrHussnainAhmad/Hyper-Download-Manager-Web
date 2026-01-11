import BugForm from '@/components/BugForm';
import { Bug } from 'lucide-react';

export const metadata = {
  title: 'Report Bug or Request Feature - Hyper Download Manager',
  description: 'Help us improve Hyper Download Manager by reporting bugs or requesting features',
};

export default function SubmitBugPage() {
  return (
    <div className="pt-28 pb-20 bg-gray-50 min-h-screen">
      <div className="container-custom">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-6">
            <Bug className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Help Us Improve
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            Found a bug? Have an idea for a new feature? We&apos;d love to hear from you!
          </p>
        </div>
        <BugForm />
      </div>
    </div>
  );
}
