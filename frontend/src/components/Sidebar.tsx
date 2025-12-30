import { NavLink } from "react-router-dom";
import { HomeIcon, BuildingOffice2Icon, ClipboardDocumentListIcon, ArrowLeftOnRectangleIcon, UsersIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { to: "/", label: "Dashboard", icon: HomeIcon },
  { to: "/biens", label: "Biens", icon: BuildingOffice2Icon },
  { to: "/clients", label: "Clients", icon: UsersIcon },
  { to: "/reservations", label: "Réservations", icon: ClipboardDocumentListIcon },
];

export const Sidebar = () => {
  const { logout } = useAuth();
  return (
    <aside className="bg-slate-950 text-white w-64 min-h-screen p-6 flex flex-col">
      <div className="text-2xl font-semibold mb-8 tracking-tight">Immobilier</div>
      <nav className="space-y-2 flex-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                isActive ? "bg-white/10 text-white" : "text-slate-200 hover:bg-white/5"
              }`
            }
          >
            <Icon className="w-5 h-5" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
      <button
        onClick={logout}
        className="mt-6 flex items-center gap-2 text-sm text-slate-200 hover:text-white transition"
      >
        <ArrowLeftOnRectangleIcon className="w-5 h-5" />
        Déconnexion
      </button>
    </aside>
  );
};

