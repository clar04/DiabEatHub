import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Card from "../components/ui/Card";
import Label from "../components/ui/Label";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

import { useAuth } from "../state/AuthContext";
import { useProfile } from "../state/ProfileContext";
import { registerUser } from "../utils/userStore";

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { setProfile } = useProfile();

  const [form, setForm] = useState({
    username: "",
    password: "",
    confirm: "",
  });

  const handleChange = (key) => (e) => {
    setForm((s) => ({ ...s, [key]: e.target.value }));
  };

  const handleSubmit = (e) => {
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

    const res = registerUser(username, password);
    if (!res.ok) {
      alert(res.error);
      return;
    }

    // REGISTER OK → anggap langsung login
    login(username);

    // profil baru (kosong, kecuali username)
    setProfile({
      username,
      sex: "female",
      age: null,
      height: null,
      weight: null,
    });

    alert("Registrasi berhasil! Sekarang lengkapi data diri kamu.");
    navigate("/profile", { replace: true });
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
            className="mt-4 w-full bg-brand-700 text-black hover:bg-brand-800"
          >
            Daftar & Lanjut ke Profil
          </Button>

          <p className="mt-3 text-xs text-ink-700">
            Sudah punya akun?{" "}
            <Link to="/login" className="underline">
              Login di sini
            </Link>
            .
          </p>

          <p className="mt-1 text-[11px] text-ink-900">
            * Akun ini hanya disimpan di browser dan tidak terhubung ke server
            manapun. Jangan gunakan password penting.
          </p>
        </form>
      </Card>
    </section>
  );
}
