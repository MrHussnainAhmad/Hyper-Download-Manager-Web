export default function Footer() {
  return (
    <footer className="border-t border-gray-300 py-6 text-sm text-gray-600">
      <div className="container-custom flex flex-col md:flex-row justify-between gap-2">
        <p>© {new Date().getFullYear()} Hyper Download Manager</p>
        <p>
          <a href="/submit-bug" className="hover:underline">Support</a> ·
          <a href="#" className="hover:underline ml-2">Privacy</a>
        </p>
      </div>
    </footer>
  );
}
