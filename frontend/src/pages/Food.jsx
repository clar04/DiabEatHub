// src/pages/Food.jsx
import { useState } from "react";
import { Link } from "react-router-dom";

import FoodCheckPanel from "../components/food/FoodCheckPanel";
import Card from "../components/ui/Card";
import { useProfile } from "../state/ProfileContext";
import { isProfileReady } from "../utils/ensureProfile";

// GIF sukses
import successGif from "../assets/success.gif";

function SuccessOverlay({ open, onClose }) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/25"
      onClick={onClose}
    >
      <div className="bg-surface-100 rounded-3xl shadow-soft px-8 py-6 flex flex-col items-center gap-3 border border-line-200">
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

  const handleAddSuccess = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 1500);
  };

  return (
    <section className="space-y-6">
      {/* card utama seperti desain */}
      <div className="bg-white rounded-3xl p-8 shadow">
        <FoodCheckPanel onAddSuccess={handleAddSuccess} />
      </div>

      {/* overlay sukses */}
      <SuccessOverlay
        open={showSuccess}
        onClose={() => setShowSuccess(false)}
      />
    </section>
  );
}
