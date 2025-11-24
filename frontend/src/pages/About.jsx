// src/pages/About.jsx
import Card from "../components/ui/Card";
import {
  HeartPulse,
  UtensilsCrossed,
  Salad,
  Package,
  Info,
  ShieldCheck,
} from "lucide-react";

export default function About() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:py-14">
      <div className="grid gap-6 lg:grid-cols-[3fr,2fr] items-start">
        {/* KONTEN UTAMA */}
        <Card className="p-6 sm:p-8">
          {/* Header dengan icon */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-accent-600/20 flex items-center justify-center">
              {/* pakai warna gelap biar kelihatan */}
              <HeartPulse className="w-5 h-5 stroke-brand-800" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-semibold text-ink-900">
                Tentang Smart Meal Checker
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-ink-700">
                Bantu kamu membaca nutrisi makanan dengan cara yang lebih
                sederhana dan ramah untuk penderita diabetes.
              </p>
            </div>
          </div>

          {/* Intro */}
          <p className="mt-4 text-sm sm:text-base text-ink-900">
            <span className="font-semibold">Smart Meal Checker</span> adalah{" "}
            <span className="font-semibold">
              pencari makanan & resep ramah diabetes
            </span>{" "}
            yang menggabungkan data dari:
          </p>

          {/* Badge sumber API */}
          <div className="mt-3 flex flex-wrap gap-2 text-xs sm:text-sm">
            <span className="inline-flex items-center gap-1 rounded-full bg-surface-100 px-3 py-1 border border-line-200 text-ink-900">
              <UtensilsCrossed className="w-4 h-4 stroke-brand-800" />
              <span>Nutritionix</span>
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-surface-100 px-3 py-1 border border-line-200 text-ink-900">
              <Salad className="w-4 h-4 stroke-brand-800" />
              <span>Spoonacular</span>
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-surface-100 px-3 py-1 border border-line-200 text-ink-900">
              <Package className="w-4 h-4 stroke-brand-800" />
              <span>Open Food Facts</span>
            </span>
          </div>

          <p className="mt-3 text-sm sm:text-base text-ink-900">
            Data dari API tersebut lalu disederhanakan menjadi label mudah
            dibaca:{" "}
            <span className="font-semibold text-green-700">OK</span>,{" "}
            <span className="font-semibold text-yellow-700">Watch Carbs</span>,{" "}
            atau <span className="font-semibold text-red-700">High Sugar</span>.
          </p>

          <p className="mt-4 text-sm sm:text-base text-ink-900">
            Tujuannya sederhana:{" "}
            <span className="font-semibold">
              membantu orang dengan diabetes mengambil keputusan cepat
            </span>{" "}
            apakah suatu makanan, resep, atau produk kemasan cocok untuk mereka,
            tanpa harus membaca tabel gizi yang panjang dan rumit.
          </p>

          {/* Arti warna */}
          <h2 className="mt-8 text-xl font-semibold text-ink-900 flex items-center gap-2">
            <Info className="w-5 h-5 stroke-brand-800" />
            <span>Arti warna & badge</span>
          </h2>
          <ul className="mt-3 space-y-2 text-sm sm:text-base text-ink-900 list-disc list-inside">
            <li>
              <span className="font-semibold text-green-700">Hijau (OK)</span>{" "}
              – Pilihan relatif aman untuk penderita diabetes. Karbo & gula
              dalam batas wajar untuk 1 porsi normal.
            </li>
            <li>
              <span className="font-semibold text-yellow-700">
                Kuning (Watch Carbs / Perhatikan porsi)
              </span>{" "}
              – Masih boleh dikonsumsi, tapi batasi porsi atau jangan terlalu
              sering. Biasanya karbo atau gula sedikit lebih tinggi.
            </li>
            <li>
              <span className="font-semibold text-red-700">
                Merah (High Sugar / Hindari)
              </span>{" "}
              – Sebaiknya dihindari, terutama bila kadar gula darah sedang
              tinggi atau untuk konsumsi harian.
            </li>
          </ul>

          {/* Kalori */}
          <h2 className="mt-8 text-xl font-semibold text-ink-900">
            Tentang perhitungan kalori
          </h2>
          <p className="mt-3 text-sm sm:text-base text-ink-900">
            Nilai kalori, karbo, gula, protein, dan lemak diambil dari API
            (Nutritionix, Spoonacular, dan Open Food Facts) dan digunakan
            sebagai <span className="font-semibold">estimasi</span>. Hasil bisa
            sedikit berbeda dengan produk asli atau cara memasak di rumah.
          </p>

          {/* Disclaimer */}
          <h2 className="mt-8 text-xl font-semibold text-ink-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 stroke-brand-800" />
            <span>Disclaimer</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-ink-900">
            Aplikasi ini dibuat untuk{" "}
            <span className="font-semibold">edukasi & pendamping</span> dalam
            memilih makanan,{" "}
            <span className="font-semibold">
              bukan pengganti konsultasi dengan dokter atau ahli gizi
            </span>
            . Selalu diskusikan dengan tenaga kesehatan sebelum mengubah pola
            makanmu.
          </p>
        </Card>

        {/* KOLOM SAMPING: ilustrasi kecil biar nggak sepi */}
        <div className="hidden lg:flex">
          <div className="w-full h-full rounded-3xl bg-brand-900/10 border border-line-200/40 flex items-center justify-center relative overflow-hidden">
            {/* Lingkaran dekoratif */}
            <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-accent-600/20 blur-2xl" />
            <div className="absolute -bottom-16 -left-12 w-40 h-40 rounded-full bg-brand-700/25 blur-2xl" />

            <div className="relative z-10 flex flex-col items-center gap-4 text-center px-6">
              <div className="flex -space-x-3">
                <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center border border-line-200 shadow-sm">
                  <UtensilsCrossed className="w-5 h-5 stroke-brand-800" />
                </div>
                <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center border border-line-200 shadow-sm">
                  <Salad className="w-5 h-5 stroke-brand-800" />
                </div>
                <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center border border-line-200 shadow-sm">
                  <Package className="w-5 h-5 stroke-brand-800" />
                </div>
              </div>
              <p className="text-sm font-semibold text-ink-100">
                Cek makanan, resep, & produk kemasan
              </p>
              <p className="text-sm text-surface-200/90">
                Satu tempat untuk melihat{" "}
                <span className="font-semibold">karbo, gula, dan badge</span>{" "}
                yang ramah diabetes, tanpa harus pusing baca tabel gizi.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
