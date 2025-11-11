// src/utils/foodLog.js
const KEY = "smc_food_log_v1";

// ambil seluruh log: { '2025-11-11': [ {id, name, qty, unit, nutr} ] , ... }
export function readAllLogs() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function readLogByDate(dateKey) {
  const all = readAllLogs();
  return Array.isArray(all[dateKey]) ? all[dateKey] : [];
}

export function saveLogByDate(dateKey, items) {
  const all = readAllLogs();
  all[dateKey] = items;
  localStorage.setItem(KEY, JSON.stringify(all));
}

export function addItemToDate(dateKey, item) {
  const items = readLogByDate(dateKey);
  const withId = { id: crypto.randomUUID(), ...item };
  const updated = [withId, ...items];
  saveLogByDate(dateKey, updated);
  return updated;
}

export function removeItem(dateKey, id) {
  const items = readLogByDate(dateKey).filter((it) => it.id !== id);
  saveLogByDate(dateKey, items);
  return items;
}
