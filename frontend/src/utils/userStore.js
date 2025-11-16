// src/utils/userStore.js
const KEY = "smc_users_v1";

function readUsers() {
  if (typeof window === "undefined") return {};
  const raw = localStorage.getItem(KEY);
  if (!raw) return {};
  try {
    const data = JSON.parse(raw);
    return data && typeof data === "object" ? data : {};
  } catch {
    return {};
  }
}

function writeUsers(map) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(map));
}

// Register user baru
export function registerUser(username, password) {
  const users = readUsers();
  if (users[username]) {
    return { ok: false, error: "Username sudah dipakai, pilih yang lain ya." };
  }
  users[username] = {
    username,
    // NOTE: untuk belajar, password disimpan apa adanya.
    // Di BE beneran HARUS di-hash.
    password,
  };
  writeUsers(users);
  return { ok: true };
}

// Verifikasi login
export function verifyUser(username, password) {
  const users = readUsers();
  const u = users[username];
  if (!u) return { ok: false, error: "Username tidak ditemukan." };
  if (u.password !== password) {
    return { ok: false, error: "Password salah." };
  }
  return { ok: true, user: u };
}
