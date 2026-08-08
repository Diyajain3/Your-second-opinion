import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight, LogOut, Menu, X, User as UserIcon, FileText, Scale, History } from "lucide-react";
import Logo from "./Logo";

export default function Navbar({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const close = () => setOpen(false);

  function isActive(path) {
    return location.pathname === path;
  }

  return (
    <header className="sticky top-0 z-30 border-b border-ink/10 bg-cream/85 backdrop-blur-md transition-all">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 lg:px-8">
        <Logo />

        <button
          className="flex size-9 items-center justify-center rounded-full border border-ink/10 bg-white/50 text-ink/75 transition-colors hover:bg-white md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>

        <nav
          className={`${
            open ? "flex" : "hidden"
          } absolute inset-x-4 top-16 flex-col gap-1.5 rounded-2xl border border-ink/12 bg-cream/95 p-3 shadow-2xl backdrop-blur-xl md:static md:flex md:flex-row md:items-center md:gap-2 md:border-0 md:bg-transparent md:p-0 md:shadow-none`}
        >
          {user ? (
            <>
              <Link
                onClick={close}
                className={`nav-link ${isActive("/review") ? "active font-bold" : ""}`}
                to="/review"
              >
                <FileText size={15} className="text-amber" />
                Review a product
              </Link>
              <Link
                onClick={close}
                className={`nav-link ${isActive("/compare") ? "active font-bold" : ""}`}
                to="/compare"
              >
                <Scale size={15} className="text-amber" />
                Compare products
              </Link>
              <Link
                onClick={close}
                className={`nav-link ${isActive("/history") ? "active font-bold" : ""}`}
                to="/history"
              >
                <History size={15} className="text-amber" />
                History
              </Link>

              <div className="my-1 h-px w-full bg-ink/10 md:mx-2 md:my-0 md:h-5 md:w-px" />

              <div className="flex items-center justify-between gap-3 px-2 py-1 md:px-0">
                <span className="flex items-center gap-2 rounded-full border border-brown/15 bg-white/70 px-3 py-1 text-xs font-semibold text-brown">
                  <UserIcon size={13} />
                  <span className="max-w-[120px] truncate">{user.name || user.email?.split("@")[0]}</span>
                </span>
                <button
                  onClick={() => {
                    close();
                    onLogout();
                  }}
                  className="nav-link text-red-700 hover:bg-red-50 hover:text-red-800"
                  title="Sign out"
                >
                  <LogOut size={14} />
                  <span className="md:hidden">Sign out</span>
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                onClick={close}
                className={`nav-link ${isActive("/login") ? "active font-bold" : ""}`}
                to="/login"
              >
                Log in
              </Link>
              <Link
                onClick={close}
                className="button button-dark !py-2.5 !px-4 text-xs"
                to="/signup"
              >
                Get started <ArrowRight size={14} />
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
