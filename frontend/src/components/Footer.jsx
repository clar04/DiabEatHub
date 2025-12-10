export default function Footer() {
  return (
    <footer className="mt-8 border-t border-white/10 bg-[#275a4f]">
      <div className="mx-auto max-w-6xl px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/80">
        <p>© {new Date().getFullYear()} Smart Meal Checker.</p>
        <p>Budak Kopi</p>
      </div>
    </footer>
  );
}
