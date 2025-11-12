// kunci penyimpanan
const KEY = "smc_food_log_v1";

/** ambil seluruh log (object) */
function readAll() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/** simpan seluruh log */
function writeAll(obj) {
  localStorage.setItem(KEY, JSON.stringify(obj));
}

/** format YYYY-MM-DD */
export function toDateKey(d = new Date()) {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}

/** baca log per tanggal (array) */
export function readLogByDate(dateKey) {
  const all = readAll();
  return Array.isArray(all[dateKey]) ? all[dateKey] : [];
}

/** tambah item ke log tanggal tsb */
export function addToLog(dateKey, item) {
  const all = readAll();
  if (!Array.isArray(all[dateKey])) all[dateKey] = [];
  // item minimal: { id?, name, nutr: { kcal, protein, fat, carb, sugar, sodium? } }
  all[dateKey].push(item);
  writeAll(all);
}

/** hapus satu item by index */
export function removeFromLog(dateKey, index) {
  const all = readAll();
  if (!Array.isArray(all[dateKey])) return;
  all[dateKey].splice(index, 1);
  writeAll(all);
}

/** hapus semua pada dateKey */
export function clearLog(dateKey) {
  const all = readAll();
  delete all[dateKey];
  writeAll(all);
}
