import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export const LoginPage = () => {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("test123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const resp = await axios.post(`${baseURL}/auth/token`, {
        username,
        password,
      });
      login(resp.data.token);
      navigate("/");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Authentification échouée");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 space-y-6">
        <div>
          <p className="text-xs uppercase text-slate-500 tracking-wide">Immobilier</p>
          <h1 className="text-2xl font-semibold text-slate-900">Connexion</h1>
          <p className="text-sm text-slate-500 mt-1">Génère un JWT via le Gateway.</p>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-slate-600">Utilisateur</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="admin"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-slate-600">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="password"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-primary text-white font-medium py-2 shadow hover:bg-primary-dark transition disabled:opacity-60"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
};

