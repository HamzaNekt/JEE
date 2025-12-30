import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useApiClient } from "../api/client";

type Reservation = {
  id: number;
  clientId: number;
  bienId: number;
  dateDebut: string;
  dateFin: string;
  statut: string;
};

export const ReservationsPage = () => {
  const api = useApiClient();
  const [clientId, setClientId] = useState<number>(1);
  const [bienId, setBienId] = useState<number>(1);
  const [dateDebut, setDateDebut] = useState<string>("");
  const [dateFin, setDateFin] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);

  const load = () => {
    if (!clientId) return;
    api
      .get<Reservation[]>(`/catalogue/clients/${clientId}/reservations`)
      .then((r) => setReservations(r.data))
      .catch(() => setReservations([]));
  };

  useEffect(() => {
    load();
  }, [clientId]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);
    try {
      await api.post("/catalogue/reservations", {
        clientId,
        bienId,
        dateDebut,
        dateFin,
      });
      setMessage("Réservation créée");
      setDateDebut("");
      setDateFin("");
      load();
    } catch (err: any) {
      setMessage(err?.response?.data?.message || "Erreur lors de la création");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Réservations</h1>
        <p className="text-sm text-slate-500">Création et consultation via l’API d’agrégation.</p>
      </div>

      <form onSubmit={submit} className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5 grid md:grid-cols-4 gap-4 items-end">
        <div className="space-y-2">
          <label className="text-sm text-slate-600">Client ID</label>
          <input
            type="number"
            value={clientId}
            onChange={(e) => setClientId(Number(e.target.value))}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-slate-600">Bien ID</label>
          <input
            type="number"
            value={bienId}
            onChange={(e) => setBienId(Number(e.target.value))}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-slate-600">Début</label>
          <input
            type="date"
            value={dateDebut}
            onChange={(e) => setDateDebut(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-slate-600">Fin</label>
          <input
            type="date"
            value={dateFin}
            onChange={(e) => setDateFin(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <button
          type="submit"
          className="md:col-span-4 rounded-lg bg-primary text-white font-medium py-2 shadow hover:bg-primary-dark transition"
        >
          Créer la réservation
        </button>
        {message && <p className="md:col-span-4 text-sm text-slate-600">{message}</p>}
      </form>

      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">Client ID : {clientId}</p>
            <h2 className="text-lg font-semibold text-slate-900">Réservations</h2>
          </div>
          <button
            onClick={load}
            className="text-sm px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50"
          >
            Rafraîchir
          </button>
        </div>
        <div className="mt-4 grid md:grid-cols-2 gap-3">
          {reservations.map((r) => (
            <div key={r.id} className="border border-slate-100 rounded-xl p-4 bg-slate-50">
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Bien #{r.bienId}</span>
                <span className="text-xs px-2 py-1 rounded-full bg-indigo-50 text-indigo-700">{r.statut}</span>
              </div>
              <p className="text-sm text-slate-600 mt-2">
                Du {r.dateDebut} au {r.dateFin}
              </p>
            </div>
          ))}
          {reservations.length === 0 && <p className="text-sm text-slate-500">Aucune réservation pour ce client.</p>}
        </div>
      </div>
    </div>
  );
};

