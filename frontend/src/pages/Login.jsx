import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Card from "../components/ui/Card";
import Label from "../components/ui/Label";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

import { useAuth } from "../state/AuthContext";
import { useProfile } from "../state/ProfileContext";
import { api, setAuthToken } from "../utils/api";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { setProfile } = useProfile();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const handleChange = (key) => (e) => {
    setForm((s) => ({ ...s, [key]: e.target.value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const username = form.username.trim();
  const password = form.password;

  if (!username || !password) return alert("Isi username dan password dulu ya.");

  try {
    const { data } = await api.post('/login', { username, password });
    localStorage.setItem('token', data.token);
    setAuthToken(data.token);

    // update auth state
    login(data.user.name);

    // (opsional) fetch /me, untuk sekarang isi default
    setProfile({
      username: data.user.name,
      sex: "female",
      age: null,
      height: null,
      weight: null,
    });

    navigate("/profile", { replace: true });
  } catch (err) {
    alert(err?.response?.data?.message ?? "Login gagal");
  }
};


  return (
    <section className="mx-auto max-w-lg px-4 py-10 sm:py-14">
      <Card className="p-6 sm:p-7">
        <h1 className="text-2xl sm:text-3xl font-semibold text-ink-900">
          Login untuk Mulai
        </h1>

        <p className="mt-2 text-sm text-ink-700">
          Masuk dengan <span className="font-semibold">username</span> dan{" "}
          <span className="font-semibold">password</span> yang sudah kamu buat di
          halaman Register.
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

          <p className="mt-3 text-xs text-ink-700">
            Belum punya akun?{" "}
            <Link to="/register" className="underline">
              Daftar di sini
            </Link>
            .
          </p>

          <p className="mt-1 text-[11px] text-ink-900">
            * Login ini hanya disimpan di browser dan tidak terhubung ke server
            mana pun. Jangan gunakan password penting.
          </p>
        </form>
      </Card>
    </section>
  );
}
