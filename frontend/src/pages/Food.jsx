// src/pages/Food.jsx
import { useState } from "react";
import FoodCheckPanel from "../components/food/FoodCheckPanel";
import Card from "../components/ui/Card";
import { Link } from "react-router-dom";
import { useProfile } from "../state/ProfileContext";
import { isProfileReady } from "../utils/ensureProfile";

// IMPORT GIF-NYA DI SINI
import successGif from "../assets/success.gif";

function SuccessOverlay({ open, onClose }) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/25"
      onClick={onClose}
    >
      <div className="bg-surface-100 rounded-3xl shadow-soft px-8 py-6 flex flex-col items-center gap-3 border border-line-200">
        {/* GIF ditampilkan sebagai <img>, jadi pasti kelihatan */}
        <img
          src={successGif}
          alt="Success"
          className="w-40 h-40 object-contain"
        />
        <p className="text-ink-900 font-semibold text-sm">
          Berhasil ditambahkan ke log!
        </p>
      </div>
    </div>
  );
}

export default function Food() {
  const { profile } = useProfile();
  const [showSuccess, setShowSuccess] = useState(false);

  // dipanggil dari FoodCheckPanel ketika Add to log sukses
  const handleAddSuccess = () => {
    setShowSuccess(true);
    // auto close setelah 1.5 detik
    setTimeout(() => setShowSuccess(false), 1500);
  };

  return (
    <section>
      <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
        <h1 className="text-3xl font-semibold text-white">Food Check</h1>

        {!isProfileReady(profile) && (
          <Card className="mt-4 p-4 text-sm">
            Lengkapi data di halaman{" "}
            <Link to="/profile" className="underline">
              Profile
            </Link>{" "}
            agar rekomendasi akurat.
          </Card>
        )}

        <div className="mt-6">
          {/* kirim callback ke Panel */}
          <FoodCheckPanel onAddSuccess={handleAddSuccess} />
        </div>
      </div>

      {/* overlay sukses */}
      <SuccessOverlay open={showSuccess} onClose={() => setShowSuccess(false)} />
    </section>
  );
}
