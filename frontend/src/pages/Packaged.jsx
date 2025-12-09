import PackagedPanel from "../components/packaged/PackagedPanel";

export default function Packaged() {
  return (
    <section className="mx-auto max-w-6xl px-4 pt-0 pb-8">
      {/* TITLE */}
      <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900">
        Packaged Products
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        Search and analyze packaged food products
      </p>

      {/* PANEL */}
      <div className="mt-6">
        <PackagedPanel />
      </div>
    </section>
  );
}
