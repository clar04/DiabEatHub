import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Card from "../components/ui/Card";
import Label from "../components/ui/Label";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { useProfile } from "../state/ProfileContext";

export default function Login() {
  const { profile, updateProfile } = useProfile();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: profile?.username || "",
    password: "",
  });

  const handleChange = (key) => (e) => {
    setForm((s) => ({ ...s, [key]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const username = form.username.trim();
    if (!username || !form.password) {
      alert("Isi username dan password dulu ya.");
      return;
    }

    // Di versi ini password tidak disimpan / dicek ke server
    updateProfile({ username });

    // Setelah “login” → lanjut ke pengisian data diri
    navigate("/profile", { replace: true });
  };

  return (
    <section className="mx-auto max-w-lg">
      <Card className="p-6 sm:p-7">
        <h1 className="text-2xl sm:text-3xl font-semibold text-ink-900">
          Login untuk Mulai
        </h1>

        <p className="mt-2 text-sm text-ink-700">
          Masuk dengan <span className="font-semibold">username</span> dan{" "}
          <span className="font-semibold">password</span>. Setelah login kamu
          akan diminta mengisi data diri (jenis kelamin, usia, tinggi, berat)
          supaya perhitungan kalori lebih akurat.
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
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange("password")}
              required
            />
          </div>

          <Button
            type="submit"
            className="mt-4 w-full bg-brand-700 text-black hover:bg-brand-800"
          >
            Masuk
          </Button>

          <p className="mt-2 text-[11px] text-ink-900">
            * Login ini hanya disimpan di browser dan tidak terhubung ke server
            mana pun. Jangan gunakan password penting.
          </p>
        </form>
      </Card>
    </section>
  );
}
