import { useProfile } from "../state/ProfileContext";
import { useState } from "react";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Label from "../components/ui/Label";
import Button from "../components/ui/Button";

export default function Profile() {
  const { profile, setProfile } = useProfile();
  const [form, setForm] = useState(profile || { sex: "male", age: "", height: "", weight: "" });

  const handle = (key) => (e) => {
    const value = e.target.type === "number" ? Number(e.target.value) : e.target.value;
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    setProfile(form);
    alert("Profil disimpan!");
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-10 sm:py-14">
      <div className="w-full max-w-xl">
        <Card className="p-8 text-ink-900">
          <h2 className="text-lg font-semibold">Profile</h2>
          <p className="mt-1 text-sm text-ink-700">
            Lengkapi data berikut untuk akurasi perhitungan.
          </p>

          <div className="mt-5 space-y-4">
            {/* Jenis Kelamin */}
            <div>
              <Label htmlFor="sex">Jenis kelamin</Label>
              <select
                id="sex"
                className="mt-1 w-full rounded-xl border border-line-200 bg-surface-100 px-3 py-2 text-sm"
                value={form.sex}
                onChange={handle("sex")}
              >
                <option value="male">Laki-laki</option>
                <option value="female">Perempuan</option>
              </select>
            </div>

            {/* Usia, Tinggi, Berat */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="age">Usia (tahun)</Label>
                <Input
                  id="age"
                  type="number"
                  className="mt-1"
                  value={form.age}
                  onChange={handle("age")}
                />
              </div>

              <div>
                <Label htmlFor="height">Tinggi (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  className="mt-1"
                  value={form.height}
                  onChange={handle("height")}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="weight">Berat (kg)</Label>
              <Input
                id="weight"
                type="number"
                className="mt-1"
                value={form.weight}
                onChange={handle("weight")}
              />
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <Button
              onClick={handleSave}
              className="rounded-xl bg-brand-700 text-white px-5 py-2 hover:bg-brand-800"
            >
              Simpan
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
