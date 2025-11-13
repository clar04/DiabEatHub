const KEY = "smc_food_log_v1";

function readAll() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeAll(obj) {
  localStorage.setItem(KEY, JSON.stringify(obj));
}

export function toDateKey(d = new Date()) {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}

export function readLogByDate(dateKey) {
  const all = readAll();
  return Array.isArray(all[dateKey]) ? all[dateKey] : [];
}

export function addToLog(dateKey, item) {
  const all = readAll();
  if (!Array.isArray(all[dateKey])) all[dateKey] = [];
  // item minimal: { id?, name, nutr: { kcal, protein, fat, carb, sugar, sodium? } }
  all[dateKey].push(item);
  writeAll(all);
}

export function removeFromLog(dateKey, index) {
  const all = readAll();
  if (!Array.isArray(all[dateKey])) return;
  all[dateKey].splice(index, 1);
  writeAll(all);
}

export function clearLog(dateKey) {
  const all = readAll();
  delete all[dateKey];
  writeAll(all);
}
