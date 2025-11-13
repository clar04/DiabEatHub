import Card from "../components/ui/Card";

export default function About() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-10 sm:py-14">
      <Card className="p-6 sm:p-8">
        <h1 className="text-3xl sm:text-4xl font-semibold text-ink-900">
          Tentang Smart Meal Checker
        </h1>

        <p className="mt-4 text-sm sm:text-base text-ink-900">
          Smart Meal Checker adalah{" "}
          <span className="font-semibold">
            pencari makanan & resep ramah diabetes
          </span>{" "}
          yang menggabungkan data dari{" "}
          <span className="font-semibold">Nutritionix</span>,{" "}
          <span className="font-semibold">Spoonacular</span>, dan{" "}
          <span className="font-semibold">Open Food Facts</span>, lalu
          menyederhanakannya menjadi label mudah dibaca:{" "}
          <span className="font-semibold text-green-700">OK</span>,{" "}
          <span className="font-semibold text-yellow-700">Watch Carbs</span>,{" "}
          atau <span className="font-semibold text-red-700">High Sugar</span>.
        </p>

        <p className="mt-3 text-sm sm:text-base text-ink-900">
          Tujuannya sederhana:{" "}
          <span className="font-semibold">
            membantu orang dengan diabetes mengambil keputusan cepat
          </span>{" "}
          apakah suatu makanan, resep, atau produk kemasan cocok untuk mereka,
          tanpa harus membaca tabel gizi yang panjang dan rumit.
        </p>

        <h2 className="mt-8 text-xl font-semibold text-ink-900">
          Arti warna & badge
        </h2>
        <ul className="mt-3 space-y-2 text-sm sm:text-base text-ink-900 list-disc list-inside">
          <li>
            <span className="font-semibold text-green-700">Hijau (OK)</span> –
            Pilihan relatif aman untuk penderita diabetes. Karbo & gula dalam
            batas wajar untuk 1 porsi normal.
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
              Merah (Hindari)
            </span>{" "}
            – Sebaiknya dihindari, terutama bila kadar gula darah sedang tinggi
            atau untuk konsumsi harian.
          </li>
        </ul>

        <h2 className="mt-8 text-xl font-semibold text-ink-900">
          Tentang perhitungan kalori
        </h2>
        <p className="mt-3 text-sm sm:text-base text-ink-900">
          Nilai kalori, karbo, gula, protein, dan lemak diambil dari API
          (Nutritionix, Spoonacular, dan Open Food Facts) dan digunakan sebagai{" "}
          <span className="font-semibold">estimasi</span>. Hasil bisa sedikit
          berbeda dengan produk asli atau cara memasak di rumah.
        </p>

        <h2 className="mt-8 text-xl font-semibold text-ink-900">Disclaimer</h2>
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
    </section>
  );
}
