import { useEffect, useState } from "react";
import { useApiClient } from "../api/client";
import { StatCard } from "../components/StatCard";

type Bien = {
  id: number;
  titre: string;
  ville: string;
  prix: number;
  disponible: boolean;
};

export const DashboardPage = () => {
  const api = useApiClient();
  const [biens, setBiens] = useState<Bien[]>([]);
  const [commandesLast, setCommandesLast] = useState<number | null>(null);

  useEffect(() => {
    api.get<Bien[]>("/catalogue/biens").then((r) => setBiens(r.data)).catch(() => setBiens([]));
    api.get<{ commandesLast: number }>("/reservations/config/last").then((r) => setCommandesLast(r.data.commandesLast)).catch(() => setCommandesLast(null));
  }, [api]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Biens actifs" value={biens.length} />
        <StatCard label="Fenêtre réservations (jours)" value={commandesLast ?? "-"} />
        <StatCard label="Disponibles" value={biens.filter((b) => b.disponible).length} />
      </div>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-slate-900">Biens récents</h2>
        <p className="text-sm text-slate-500 mb-4">Aperçu rapide.</p>
        <div className="grid md:grid-cols-3 gap-4">
          {biens.slice(0, 3).map((bien) => (
            <div key={bien.id} className="rounded-xl border border-slate-100 p-4 bg-slate-50">
              <p className="text-sm text-slate-500">{bien.ville}</p>
              <p className="text-lg font-semibold text-slate-900">{bien.titre}</p>
              <p className="text-sm text-slate-600 mt-1">{bien.prix.toLocaleString("fr-FR")} €</p>
              <span className={`text-xs px-2 py-1 rounded-full mt-2 inline-block ${bien.disponible ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                {bien.disponible ? "Disponible" : "Indisponible"}
              </span>
            </div>
          ))}
          {biens.length === 0 && <p className="text-sm text-slate-500 col-span-3">Aucun bien pour le moment.</p>}
        </div>
      </div>
    </div>
  );
};

