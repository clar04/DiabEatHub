const KEY = "smc_profiles_by_user_v1";

function readMap() {
  if (typeof window === "undefined") return {};
  const raw = localStorage.getItem(KEY);
  if (!raw) return {};
  try {
    const obj = JSON.parse(raw);
    return obj && typeof obj === "object" ? obj : {};
  } catch {
    return {};
  }
}

function writeMap(map) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(map));
}

// Ambil profil milik username tertentu
export function loadProfileForUser(username) {
  if (!username) return null;
  const map = readMap();
  const p = map[username];
  return p || null;
}

// Simpan / update profil
export function saveProfileForUser(profile) {
  if (!profile || !profile.username) return;
  const map = readMap();
  map[profile.username] = profile;
  writeMap(map);
}

// Hapus profil user tertentu (dipakai tombol "hapus data")
export function deleteProfileForUser(username) {
  if (!username) return;
  const map = readMap();
  if (!map[username]) return;
  delete map[username];
  writeMap(map);
}
