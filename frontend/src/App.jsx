import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function App() {
  return (
    <div className="min-h-dvh flex flex-col bg-brand-900">
      <Header />
      <main className="ring-spot flex-1">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
          {/* Di sini anak-rute dari main.jsx akan dirender */}
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
}
