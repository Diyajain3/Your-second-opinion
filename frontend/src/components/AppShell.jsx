import Navbar from "./Navbar";
import Footer from "./Footer";

export function AppShell({ children, user, onLogout }) {
  return (
    <div className="min-h-screen bg-cream text-ink">
      <Navbar user={user} onLogout={onLogout} />
      {children}
      <Footer />
    </div>
  );
}
