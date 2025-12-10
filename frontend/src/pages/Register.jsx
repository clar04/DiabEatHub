// src/pages/Register.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Card from "../components/ui/Card";
import Label from "../components/ui/Label";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

import { useAuth } from "../state/AuthContext";
import { useProfile } from "../state/ProfileContext";

// Pakai helper server-side yang memang memanggil /api/register
import { authRegister } from "../utils/api";

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();          // sekarang TIDAK dipakai, tapi boleh dibiarkan
  const { setProfile } = useProfile();  // juga tidak dipakai di flow baru

  const [form, setForm] = useState({
    username: "",
    password: "",
    confirm: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (key) => (e) => {
    setForm((s) => ({ ...s, [key]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const username = form.username.trim();
    const { password, confirm } = form;

    // Validasi FE — kalau gagal, tidak akan ada network request (ini normal)
    if (!username || !password || !confirm) {
      alert("Semua field wajib diisi.");
      return;
    }
    if (password.length < 6) {
      alert("Password minimal 6 karakter.");
      return;
    }
    if (password !== confirm) {
      alert("Password dan konfirmasi tidak sama.");
      return;
    }

    try {
      setLoading(true);

      // Register ke backend (TANPA auto-login)
      await authRegister(username, password);

      // Beri info lalu arahkan ke halaman login
      alert("Registrasi berhasil! Sekarang login dengan username & password yang baru.");
      navigate("/login", { replace: true });
    } catch (err) {
      console.error("[REGISTER] failed:", err);
      alert(err?.message || "Register gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-lg px-4 py-10 sm:py-14">
      <Card className="p-6 sm:p-7">
        <h1 className="text-2xl sm:text-3xl font-semibold text-ink-900">
          Daftar Akun
        </h1>

        <p className="mt-2 text-sm text-ink-700">
          Buat akun sederhana untuk menyimpan pengaturan dan data profil di
          browser kamu.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <Label htmlFor="username" className="text-ink-900">
              Username
            </Label>
            <Input
              id="username"
              className="mt-1 text-ink-900 placeholder:text-ink-600"
              placeholder="mis. ethan123"
              value={form.username}
              onChange={handleChange("username")}
              required
            />
          </div>

          <div>
            <Label htmlFor="password" className="text-ink-900">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              className="mt-1 text-ink-900 placeholder:text-ink-600"
              placeholder="minimal 6 karakter"
              value={form.password}
              onChange={handleChange("password")}
              required
            />
          </div>

          <div>
            <Label htmlFor="confirm" className="text-ink-900">
              Konfirmasi Password
            </Label>
            <Input
              id="confirm"
              type="password"
              className="mt-1 text-ink-900 placeholder:text-ink-600"
              value={form.confirm}
              onChange={handleChange("confirm")}
              required
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full"
          >
            {loading ? "Mendaftar..." : "Daftar"}
          </Button>

          <p className="mt-3 text-xs text-ink-700">
            Sudah punya akun?{" "}
            <Link to="/login" className="underline">
              Login di sini
            </Link>
            .
          </p>
        </form>
      </Card>
    </section>
  );
}
