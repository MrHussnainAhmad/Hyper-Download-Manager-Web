import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-gray-300 py-6 pb-12 text-sm text-gray-600">
      <div className="container-custom flex flex-col md:flex-row justify-between gap-2">
        <p>© {new Date().getFullYear()} Hyper Download Manager</p>
        <p>
          <Link href="/submit-bug" className="hover:underline">Support</Link> ·
          <Link href="/privacy" className="hover:underline ml-2">Privacy</Link>
        </p>
      </div>
    </footer>
  );
}
