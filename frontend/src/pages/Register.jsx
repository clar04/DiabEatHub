// src/pages/Register.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";

import Card from "../components/ui/Card";
import Label from "../components/ui/Label";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

import { useAuth } from "../state/AuthContext";
import { useProfile } from "../state/ProfileContext";
import { authRegister } from "../utils/api";

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();         // masih boleh ada walau belum dipakai
  const { setProfile } = useProfile(); // sama seperti di login

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

      await authRegister(username, password);

      alert(
        "Registrasi berhasil! Sekarang login dengan username & password yang baru."
      );
      navigate("/login", { replace: true });
    } catch (err) {
      console.error("[REGISTER] failed:", err);
      alert(err?.message || "Register gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    // ⬇️ BEDA DI SINI: tidak pakai min-h-screen & items-center lagi
    <section className="flex justify-center px-4 pt-16 pb-16">
      <Card className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-xl">
        {/* HEADER – sama style dengan login */}
        <div className="flex items-start gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
            <LogIn className="w-5 h-5" />
          </span>
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900">
              Daftar Akun
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Buat akun sederhana untuk menyimpan pengaturan dan data profil di
              browser kamu.
            </p>
          </div>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <Label htmlFor="username" className="text-slate-900">
              Username
            </Label>
            <Input
              id="username"
              className="mt-1 text-slate-900 placeholder:text-slate-400 bg-white border border-slate-200 rounded-xl h-11"
              placeholder="mis. ethan123"
              value={form.username}
              onChange={handleChange("username")}
              required
            />
          </div>

          <div>
            <Label htmlFor="password" className="text-slate-900">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              className="mt-1 text-slate-900 placeholder:text-slate-400 bg-white border border-slate-200 rounded-xl h-11"
              placeholder="minimal 6 karakter"
              value={form.password}
              onChange={handleChange("password")}
              required
            />
          </div>

          <div>
            <Label htmlFor="confirm" className="text-slate-900">
              Konfirmasi Password
            </Label>
            <Input
              id="confirm"
              type="password"
              className="mt-1 text-slate-900 placeholder:text-slate-400 bg-white border border-slate-200 rounded-xl h-11"
              placeholder="ulang password"
              value={form.confirm}
              onChange={handleChange("confirm")}
              required
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-full"
          >
            {loading ? "Mendaftar..." : "Daftar"}
          </Button>

          <p className="mt-4 text-xs sm:text-sm text-slate-600 text-center">
            Sudah punya akun?{" "}
            <Link to="/login" className="font-medium text-emerald-700">
              Login di sini.
            </Link>
          </p>
        </form>
      </Card>
    </section>
  );
}
