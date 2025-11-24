// src/App.jsx
import { Outlet, useLocation, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { useAuth } from "./state/AuthContext";
import { useProfile } from "./state/ProfileContext";
import { isProfileReady } from "./utils/ensureProfile";

export default function App() {
  const location = useLocation();
  const { currentUser } = useAuth();
  const { profile } = useProfile();

  const loggedIn = !!currentUser;
  const profileOk = isProfileReady(profile);
  const path = location.pathname;

  const publicPaths = ["/", "/about", "/login", "/register"];
  const isPublic = publicPaths.includes(path);

  // Belum login & akses protected → lempar ke login
  if (!loggedIn && !isPublic) {
    return <Navigate to="/login" replace />;
  }

  // Sudah login tapi profil belum lengkap, dan bukan ke /profile & bukan halaman public → paksa ke /profile
  if (
    loggedIn &&
    !profileOk &&
    path !== "/profile" &&
    !publicPaths.includes(path)
  ) {
    return <Navigate to="/profile" replace />;
  }

  // Sudah login & profile lengkap, tapi masih ke /login atau /register → lempar ke /home
  if (loggedIn && profileOk && (path === "/login" || path === "/register")) {
    return <Navigate to="/home" replace />;
  }

  return (
    // wrapper global untuk background
    <div className="min-h-screen relative overflow-hidden">
      {/* === BACKGROUND GLOW KIRI–KANAN (hybrid) === */}
      <div className="pointer-events-none absolute -top-28 -left-28 w-[420px] h-[420px] rounded-full bg-accent-600/25 blur-[120px] opacity-70" />
      <div className="pointer-events-none absolute bottom-0 -right-40 w-[500px] h-[500px] rounded-full bg-brand-700/30 blur-[140px] opacity-60" />

      {/* Glow kecil tambahan biar lebih hidup */}
      <div className="pointer-events-none absolute top-1/2 left-1/3 w-40 h-40 rounded-full bg-accent-500/10 blur-3xl opacity-70" />
      <div className="pointer-events-none absolute bottom-1/3 right-1/3 w-32 h-32 rounded-full bg-brand-500/10 blur-3xl opacity-60" />

      {/* Konten utama pakai z-10 supaya di atas background */}
      <div className="relative z-10 min-h-dvh flex flex-col">
        <Header />
        <main className="ring-spot flex-1">
          <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
            <Outlet />
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
