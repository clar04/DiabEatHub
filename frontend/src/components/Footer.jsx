export default function Footer() {
  return (
    <footer className="mt-auto border-t border-line-200/40 bg-brand-900/60">
      <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-white/80 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p>© {new Date().getFullYear()} Smart Meal Checker</p>
        <p>Budak Kopi</p>
      </div>
    </footer>
  );
}
