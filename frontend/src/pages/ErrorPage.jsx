// src/pages/ErrorPage.jsx
import { Link } from "react-router-dom";
import errorGif from "../assets/error-404.gif"; // sesuaikan nama file-nya

export default function ErrorPage() {
  return (
    <div className="min-h-dvh flex items-center justify-center px-4">
      <div className="max-w-lg w-full rounded-2xl bg-surface p-8 border border-line-200 shadow">
        <div className="flex justify-center mb-4">
          <img
            src={errorGif}
            alt="404 - Page not found"
            className="max-h-48 w-auto"
          />
        </div>

        <h1 className="text-2xl font-semibold text-ink-900 text-center">
          Oops!
        </h1>
        <p className="mt-2 text-ink-700 text-center">
          Halaman yang kamu tuju tidak ditemukan atau sudah dipindah.
        </p>

        <div className="mt-6 flex justify-center">
          <Link
            to="/"
            className="rounded-xl bg-brand-700 text-white px-4 py-2 hover:bg-brand-800 transition"
          >
            Kembali ke Home
          </Link>
        </div>
      </div>
    </div>
  );
}
