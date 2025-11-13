import { useState } from "react";
import Card from "../components/ui/Card";
import Label from "../components/ui/Label";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { useProfile } from "../state/ProfileContext";

export default function Profile() {
  const { profile, updateProfile, resetProfile } = useProfile();

  const [form, setForm] = useState({
    username: profile?.username || "",
    sex: profile?.sex || "female",
    age: profile?.age || "",
    height: profile?.height || "",
    weight: profile?.weight || "",
  });

  const handleChange = (key) => (e) => {
    setForm((s) => ({ ...s, [key]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleaned = {
      username: form.username.trim(),
      sex: form.sex,
      age: Number(form.age) || 0,
      height: Number(form.height) || 0,
      weight: Number(form.weight) || 0,
    };
    updateProfile(cleaned);
    alert("Data profil tersimpan.");
  };

  const handleReset = () => {
    if (!window.confirm("Hapus seluruh data login & profil?")) return;
    resetProfile();
  };

  return (
    <section>
      <h1 className="text-3xl sm:text-4xl font-semibold text-white">Profile</h1>
      <p className="mt-2 text-sm text-surface-200">
        Lengkapi data berikut untuk akurasi perhitungan kalori. Saat ini login-mu
        tercatat sebagai{" "}
        <span className="font-semibold">
          {profile?.username || "(belum diisi)"}
        </span>
        .
      </p>

      <Card className="mt-6 p-6 sm:p-7">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username */}
          <div>
            <Label htmlFor="username" className="text-ink-900">
              Nama / Username
            </Label>
            <Input
              id="username"
              className="mt-1 text-ink-900 placeholder:text-ink-600"
              value={form.username}
              onChange={handleChange("username")}
              required
            />
          </div>

          {/* Sex + age/height/weight */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="sex" className="text-ink-900">
                Jenis kelamin
              </Label>
              <select
                id="sex"
                value={form.sex}
                onChange={handleChange("sex")}
                className="mt-1 w-full rounded-xl border border-line-200 
                           bg-surface-100 px-3 py-2 text-sm text-ink-900
                           focus:outline-none focus:ring-4 focus:ring-brand-100 
                           focus:border-brand-500"
              >
                <option className="text-ink-900" value="female">
                  Perempuan
                </option>
                <option className="text-ink-900" value="male">
                  Laki-laki
                </option>
              </select>
            </div>

            <div>
              <Label htmlFor="age" className="text-ink-900">
                Usia (tahun)
              </Label>
              <Input
                id="age"
                type="number"
                min="10"
                className="mt-1 text-ink-900 placeholder:text-ink-600"
                value={form.age}
                onChange={handleChange("age")}
                required
              />
            </div>

            <div>
              <Label htmlFor="height" className="text-ink-900">
                Tinggi (cm)
              </Label>
              <Input
                id="height"
                type="number"
                min="100"
                className="mt-1 text-ink-900 placeholder:text-ink-600"
                value={form.height}
                onChange={handleChange("height")}
                required
              />
            </div>

            <div>
              <Label htmlFor="weight" className="text-ink-900">
                Berat (kg)
              </Label>
              <Input
                id="weight"
                type="number"
                min="20"
                className="mt-1 text-ink-900 placeholder:text-ink-600"
                value={form.weight}
                onChange={handleChange("weight")}
                required
              />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <Button type="submit">Simpan</Button>
            <Button
              type="button"
              variant="ghost"
              className="bg-red-400 text-red-800 hover:bg-red-300"
              onClick={handleReset}
            >
              Hapus data profil
            </Button>
          </div>
        </form>
      </Card>
    </section>
  );
}
