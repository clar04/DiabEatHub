import { Outlet, useLocation, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { useProfile } from "./state/ProfileContext";
import { isLoggedIn, isProfileReady } from "./utils/ensureProfile";

export default function App() {
  const { profile } = useProfile();
  const location = useLocation();

  const loggedIn = isLoggedIn(profile);
  const ready = isProfileReady(profile);

  const onLoginPage = location.pathname === "/login";
  const onProfilePage = location.pathname === "/profile";

  // Belum login → paksa ke /login
  if (!loggedIn && !onLoginPage) {
    return <Navigate to="/login" replace />;
  }

  // Sudah login tapi profil belum lengkap → paksa isi profile dulu
  if (loggedIn && !ready && !onProfilePage && !onLoginPage) {
    return <Navigate to="/profile" replace />;
  }

  // Sudah login & profil lengkap, tapi masih di /login → pindah ke home
  if (loggedIn && ready && onLoginPage) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-dvh flex flex-col">
      <Header />

      <main className="ring-spot flex-1">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
          <Outlet />
        </div>
      </main>

      <Footer />
    </div>
  );
}
