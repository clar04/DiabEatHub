import { createContext, useContext, useEffect, useMemo, useState } from "react";
// SESUAIKAN path utils-mu:
// kalau filenya `src/utils/api.js`, pakai "../utils/api"
import { apiFetch, setAuthToken, getAuthToken } from "../utils/api";

const AuthCtx = createContext(null);

// simpan user di localStorage (nama key yang sudah kamu pakai)
const USER_KEY = "smc_auth_current_user_v1";

/**
 * Helper parse user dari localStorage:
 * - dukung format lama (string email)
 * - dukung format baru (JSON { id?, name })
 */
function readStoredUser() {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;

  // format baru (JSON)
  try {
    const obj = JSON.parse(raw);
    if (obj && (obj.name || obj.email)) {
      return { id: obj.id ?? null, name: obj.name ?? obj.email };
    }
  } catch (_) {
    // format lama (string email)
    return { id: null, name: raw };
  }
  // fallback: treat as plain string
  return { id: null, name: String(raw) };
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => readStoredUser());
  const [bootstrapping, setBootstrapping] = useState(true);

  // Simpan user ke localStorage (format baru: JSON)
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (currentUser) {
      localStorage.setItem(USER_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  }, [currentUser]);

  /**
   * Bootstrap saat app start/refresh:
   * - kalau ada token di localStorage → set header → verifikasi ke /api/me
   * - kalau valid → set user dari server
   * - kalau gagal → bersihkan token & user
   */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const token = getAuthToken?.() || null;
        if (!token) return; // tidak logged in
        // pastikan header Authorization terpasang
        setAuthToken(token);

        const me = await apiFetch("/me", { method: "GET" });
        if (!cancelled && me?.success && me?.user) {
          setCurrentUser({
            id: me.user.id ?? null,
            name: me.user.name ?? null,
          });
        }
      } catch (_) {
        // token invalid/expired → bersihkan
        setAuthToken(null);
        setCurrentUser(null);
      } finally {
        if (!cancelled) setBootstrapping(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  /**
   * Login helper:
   * - terima user (objek {id,name}) dan token (string)
   * - simpan token (header + localStorage) & user
   */
  const login = (user, token) => {
    if (token) setAuthToken(token);
    // dukung pemanggilan lama: login("email")
    if (typeof user === "string") {
      setCurrentUser({ id: null, name: user });
    } else {
      setCurrentUser({ id: user?.id ?? null, name: user?.name ?? null });
    }
  };

  /**
   * Logout:
   * - panggil /api/logout (kalau token masih ada)
   * - bersihkan token & state lokal
   */
  const logout = async () => {
    try {
      // optional: kalau belum ada token, ini akan error → diabaikan
      await apiFetch("/logout", { method: "POST" });
    } catch (e) {
      // abaikan error network/401
    } finally {
      setAuthToken(null);
      setCurrentUser(null);
    }
  };

  const isAuthenticated = !!currentUser && !!(getAuthToken?.() || null);

  const value = useMemo(
    () => ({
      currentUser,         // { id, name } | null
      isAuthenticated,     // boolean
      bootstrapping,       // true saat verifikasi awal /me
      login,               // login(userOrName, token?)
      logout,              // async
    }),
    [currentUser, isAuthenticated, bootstrapping]
  );

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
