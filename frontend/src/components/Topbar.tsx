import { useAuth } from "../context/AuthContext";

export const Topbar = () => {
  const { token } = useAuth();
  return (
    <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-slate-200">
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-500">Front API Gateway</p>
        <p className="text-lg font-semibold text-slate-900">Dashboard immobilier</p>
      </div>
      <div className="text-xs text-slate-500">
        <span className="font-semibold text-slate-700">JWT chargé :</span>{" "}
        {token ? "Oui" : "Non"}
      </div>
    </header>
  );
};

