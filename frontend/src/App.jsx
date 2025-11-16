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
