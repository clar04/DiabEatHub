export default function About() {
  const rules = [
    { tone: "bg-green-100 text-green-900 border-green-300", title: "Hijau = OK", desc: "Boleh dikonsumsi, tetap perhatikan porsi." },
    { tone: "bg-yellow-100 text-yellow-900 border-yellow-300", title: "Kuning = Watch Carbs", desc: "Kontrol porsi, cek karbo & gula per porsi." },
    { tone: "bg-red-100 text-red-900 border-red-300", title: "Merah = High Sugar", desc: "Hindari bila memungkinkan, cari alternatif." },
  ];
  return (
    <section>
      <div className="mx-auto max-w-4xl px-4 py-10 sm:py-14">
        <h1 className="text-4xl font-semibold text-white">Tentang Penilaian Diabetes</h1>
        <p className="mt-3 text-surface-200 max-w-3xl">
          Warna indikator berasal dari flag <b>diabetes</b> pada API. Gunakan ini sebagai panduan umum, bukan pengganti saran medis.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {rules.map((r) => (
            <div key={r.title} className={`rounded-2xl border p-4 ${r.tone}`}>
              <p className="font-semibold">{r.title}</p>
              <p className="text-sm mt-1">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
