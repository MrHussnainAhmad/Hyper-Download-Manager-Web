import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy - Hyper Download Manager',
  description: 'Privacy Policy for Hyper Download Manager',
};

export default function PrivacyPage() {
  return (
    <div className="container-custom py-12 pt-24 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
      
      <div className="prose prose-blue max-w-none text-gray-700 space-y-8">
        <p className="text-lg">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">1. No Data Collection</h2>
          <p>
            Hyper Download Manager (HDM) is designed with user privacy as a top priority. 
            <strong> We do not collect, store, or transmit any personal data, usage statistics, or browsing history.</strong>
          </p>
          <p className="mt-2">
            The application operates entirely locally on your machine. Your downloads, file locations, and configuration settings 
            stay on your device and are never uploaded to our servers.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">2. How the Software Works</h2>
          <p>
            When you use Hyper Download Manager to download a file, the software connects directly to the server hosting that file. 
            HDM does not act as a proxy or intermediary for your downloads. Your IP address and other standard network information 
            are visible only to the source server you are downloading from, just as they would be in a standard web browser.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">3. Cookies and Web Beacons</h2>
          <p>
            Our website does not use tracking cookies or web beacons to identify users or track their behavior across the web. 
            Any cookies used are purely for essential site functionality or to remember your preferences (such as language or theme) 
            and are stored only in your browser.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">4. Third-Party Links</h2>
          <p>
            Our website may contain links to other sites. If you click on a third-party link, you will be directed to that site. 
            Note that these external sites are not operated by us. Therefore, we strongly advise you to review the Privacy Policy of these websites. 
            We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">5. Changes to This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. 
            These changes are effective immediately after they are posted.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">6. Contact Us</h2>
          <p>
            If you have any questions or suggestions about our Privacy Policy, please reach out to us through our 
            <Link href="/submit-bug" className="text-blue-600 hover:underline ml-1">Support Page</Link>.
          </p>
        </section>
      </div>
    </div>
  );
}