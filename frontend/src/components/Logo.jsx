import { Feather } from "lucide-react";
import { Link } from "react-router-dom";

export default function Logo() {
  return (
    <Link
      to="/"
      className="flex items-center gap-3"
      aria-label="Second Opinion home"
    >
      <span className="logo-mark">
        <Feather size={18} strokeWidth={2.5} />
      </span>
      <span className="font-serif text-lg font-semibold tracking-tight">
        second opinion
      </span>
    </Link>
  );
}
