// src/utils/foodLog.js

const KEY = "smc_food_log_v1";
// sesuaikan dengan USER_KEY di AuthContext
const USER_KEY = "smc_auth_current_user_v1";

/**
 * Ambil identifier user aktif dari localStorage.
 * Kalau belum login → pakai "guest".
 */
function getActiveUserKey() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return "guest";

    const obj = JSON.parse(raw);
    // pakai id kalau ada, kalau tidak pakai name
    if (obj && (obj.id || obj.name || obj.username)) {
      if (obj.id != null) return `id:${obj.id}`;
      return `name:${obj.name || obj.username}`;
    }
  } catch {
    // ignore
  }
  return "guest";
}

/**
 * Baca seluruh data dari localStorage.
 * Struktur baru:
 * {
 *   "id:1": { "2025-12-09": [ ... ], ... },
 *   "name:melati": { ... },
 *   "guest": { ... }
 * }
 */
function readAll() {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : {};

    // kalau ternyata masih format lama (langsung dateKey → array),
    // kita biarkan saja; tiap user baru akan mulai dari kosong.
    if (
      parsed &&
      !Array.isArray(parsed) &&
      Object.values(parsed).every((v) => Array.isArray(v) || typeof v === "object")
    ) {
      return parsed;
    }

    // fallback: treat as empty / akan keisi dengan format baru
    return {};
  } catch {
    return {};
  }
}

function writeAll(obj) {
  localStorage.setItem(KEY, JSON.stringify(obj));
}

/**
 * Helper untuk baca/ tulis log milik user aktif saja
 */
function readUserAll() {
  const all = readAll();
  const ukey = getActiveUserKey();
  const userLog = all[ukey];
  return userLog && typeof userLog === "object" ? userLog : {};
}

function writeUserAll(userObj) {
  const all = readAll();
  const ukey = getActiveUserKey();
  all[ukey] = userObj;
  writeAll(all);
}

export function toDateKey(d = new Date()) {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}

export function readLogByDate(dateKey) {
  const userAll = readUserAll();
  return Array.isArray(userAll[dateKey]) ? userAll[dateKey] : [];
}

export function addToLog(dateKey, item) {
  const userAll = readUserAll();
  if (!Array.isArray(userAll[dateKey])) userAll[dateKey] = [];

  // item minimal:
  // { id?, name, nutr: { kcal, protein, fat, carb, sugar, sodium? } }
  userAll[dateKey].push(item);
  writeUserAll(userAll);
}

export function removeFromLog(dateKey, index) {
  const userAll = readUserAll();
  if (!Array.isArray(userAll[dateKey])) return;
  userAll[dateKey].splice(index, 1);
  writeUserAll(userAll);
}

export function clearLog(dateKey) {
  const userAll = readUserAll();
  delete userAll[dateKey];
  writeUserAll(userAll);
}
