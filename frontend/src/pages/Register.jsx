// src/pages/Register.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";

import Card from "../components/ui/Card";
import Label from "../components/ui/Label";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

import { useAuth } from "../state/AuthContext";
import { useProfile } from "../state/ProfileContext";
import { authRegister } from "../utils/api";

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { setProfile } = useProfile();

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
      const data = await authRegister(username, password);
      login(data.user, data.token);

      setProfile({
        username: data.user.name,
        sex: "female",
        age: null,
        height: null,
        weight: null,
      });

      alert("Registrasi berhasil! Lengkapi data profil kamu di tab Profile.");
      // ⬇️ setelah register → langsung ke /home
      navigate("/home", { replace: true });
    } catch (err) {
      console.error("[REGISTER] failed:", err);
      alert(err?.message || "Register gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-xl px-4 py-14">
      <Card className="rounded-[32px] px-8 py-10 shadow-xl bg-white">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-11 h-11 rounded-full bg-emerald-50 flex items-center justify-center">
            <UserPlus className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900">
              Create Account
            </h1>
            <p className="text-sm text-slate-500">
              Daftar untuk mulai memakai Smart Meal Checker.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
              Confirm Password
            </Label>
            <Input
              id="confirm"
              type="password"
              className="mt-1 text-slate-900 placeholder:text-slate-400 bg-white border border-slate-200 rounded-xl h-11"
              value={form.confirm}
              onChange={handleChange("confirm")}
              required
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="mt-4 w-full h-11 rounded-full bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Registering..." : "Register"}
          </Button>

          <p className="mt-4 text-xs text-slate-600 text-center">
            Sudah punya akun?{" "}
            <Link to="/login" className="font-semibold text-emerald-700">
              Sign In
            </Link>
          </p>
        </form>
      </Card>
    </section>
  );
}
