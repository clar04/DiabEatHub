import { useRouteError, Link } from "react-router-dom";

export default function ErrorPage() {
  const err = useRouteError();
  return (
    <div className="min-h-dvh flex items-center justify-center px-4">
      <div className="max-w-lg rounded-2xl bg-surface p-8 border border-line-200 shadow">
        <h1 className="text-2xl font-semibold text-ink-900">Oops!</h1>
        <p className="mt-2 text-ink-700">Terjadi kesalahan saat memuat halaman.</p>
        {err && <pre className="mt-3 text-xs text-ink-700 whitespace-pre-wrap">{String(err.status || "")} {err.statusText || err.message}</pre>}
        <Link to="/" className="inline-block mt-4 text-brand-700 underline">Kembali ke Home</Link>
      </div>
    </div>
  );
}
