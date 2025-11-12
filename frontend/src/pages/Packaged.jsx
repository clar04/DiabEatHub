import PackagedPanel from "../components/packaged/PackagedPanel";

export default function Packaged() {
  return (
    <section>
      <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
        <h1 className="text-4xl font-semibold text-white">Packaged Product</h1>
        <div className="mt-6">
          <PackagedPanel />
        </div>
      </div>
    </section>
  );
}
