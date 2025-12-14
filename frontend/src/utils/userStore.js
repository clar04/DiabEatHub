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
export function registerUser(email, password) {
  const users = readUsers();
  if (users[email]) {
    return { ok: false, error: "email sudah dipakai, pilih yang lain ya." };
  }
  users[email] = {
    email,
    password,
  };
  writeUsers(users);
  return { ok: true };
}

// Verifikasi login
export function verifyUser(email, password) {
  const users = readUsers();
  const u = users[email];
  if (!u) return { ok: false, error: "email tidak ditemukan." };
  if (u.password !== password) {
    return { ok: false, error: "Password salah." };
  }
  return { ok: true, user: u };
}
