// src/pages/Login.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";

import Card from "../components/ui/Card";
import Label from "../components/ui/Label";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

import { useAuth } from "../state/AuthContext";
import { useProfile } from "../state/ProfileContext";
import { authLogin, authMe } from "../utils/api";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { setProfile } = useProfile();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (key) => (e) =>
    setForm((s) => ({ ...s, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = form.email.trim();
    const password = form.password;

    if (!email || !password) {
      alert("Isi email dan password dulu ya.");
      return;
    }

    try {
      setLoading(true);

      const data = await authLogin(email, password);
      login(data.user, data.token);

      try {
        const me = await authMe();
        setProfile({
          email: me?.user?.name ?? data.user.name,
          sex: "female",
          age: null,
          height: null,
          weight: null,
        });
      } catch {
        setProfile({
          email: data.user.name,
          sex: "female",
          age: null,
          height: null,
          weight: null,
        });
      }

      // ⬇️ setelah login → langsung ke /home
      navigate("/home", { replace: true });
    } catch (err) {
      console.error("[LOGIN] failed:", err);
      alert(err?.message || "Login gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-xl px-4 py-14">
      <Card className="rounded-[32px] px-8 py-10 shadow-xl bg-white">
        {/* Header sign in dengan ikon */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-11 h-11 rounded-full bg-emerald-50 flex items-center justify-center">
            <LogIn className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900">
              Sign In
            </h1>
            <p className="text-sm text-slate-500">
              Masuk untuk mengakses Smart Meal Checker.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-slate-900">
              Email
            </Label>
            <Input
              id="email"
              className="mt-1 text-slate-900 placeholder:text-slate-400 bg-white border border-slate-200 rounded-xl h-11"
              placeholder="mis. ethan123"
              value={form.email}
              onChange={handleChange("email")}
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
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange("password")}
              required
            />
          </div>

          {/* Button mirip button "Check" di FoodCheck */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full"
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>

          <p className="mt-4 text-xs text-slate-600 text-center">
            Belum punya akun?{" "}
            <Link to="/register" className="font-semibold text-emerald-700">
              Register
            </Link>
          </p>
        </form>
      </Card>
    </section>
  );
}
