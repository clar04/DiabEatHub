// profile dianggap "siap" kalau semua field dasar terisi wajar
export function isProfileReady(profile) {
  if (!profile) return false;
  const { username, sex, age, height, weight } = profile;
  if (!username || !username.trim()) return false;
  if (sex !== "male" && sex !== "female") return false;
  if (!age || age < 10) return false;
  if (!height || height < 100) return false;
  if (!weight || weight < 20) return false;
  return true;
}

// helper fleksibel: bisa kirim string (username) atau object {username}
export function isLoggedIn(x) {
  if (!x) return false;
  if (typeof x === "string") return !!x;
  if (typeof x === "object") return !!x.username;
  return false;
}
