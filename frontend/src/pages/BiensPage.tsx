import { useEffect, useState } from "react";
import { useApiClient } from "../api/client";
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';

type Bien = {
  id: number;
  titre: string;
  description: string;
  ville: string;
  prix: number;
  typeBien: string;
  disponible: boolean;
};

type BienFormData = {
  titre: string;
  description: string;
  ville: string;
  prix: number | string;
  typeBien: string;
  disponible: boolean;
};

export const BiensPage = () => {
  const api = useApiClient();
  const [biens, setBiens] = useState<Bien[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBien, setEditingBien] = useState<Bien | null>(null);
  const [formData, setFormData] = useState<BienFormData>({
    titre: '',
    description: '',
    ville: '',
    prix: '',
    typeBien: 'APPARTEMENT',
    disponible: true,
  });

  useEffect(() => {
    fetchBiens();
  }, []);

  const fetchBiens = () => {
    setLoading(true);
    api
      .get<Bien[]>("/catalogue/biens")
      .then((r) => {
        setBiens(r.data);
        setLoading(false);
      })
      .catch(() => {
        setBiens([]);
        setLoading(false);
      });
  };

  const handleCreate = () => {
    setEditingBien(null);
    setFormData({
      titre: '',
      description: '',
      ville: '',
      prix: '',
      typeBien: 'APPARTEMENT',
      disponible: true,
    });
    setShowModal(true);
  };

  const handleEdit = (bien: Bien) => {
    setEditingBien(bien);
    setFormData({
      titre: bien.titre,
      description: bien.description,
      ville: bien.ville,
      prix: bien.prix,
      typeBien: bien.typeBien,
      disponible: bien.disponible,
    });
    setShowModal(true);
  };

  const handleDelete = (bien: Bien) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer le bien "${bien.titre}" ?`)) {
      return;
    }

    api
      .delete(`/biens/${bien.id}`)
      .then(() => {
        fetchBiens();
        alert('Bien supprimé avec succès');
      })
      .catch((err) => {
        console.error('Erreur lors de la suppression:', err);
        alert('Erreur lors de la suppression du bien');
      });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...formData,
      prix: Number(formData.prix),
    };

    const request = editingBien
      ? api.put(`/biens/${editingBien.id}`, payload)
      : api.post('/biens', payload);

    request
      .then(() => {
        fetchBiens();
        setShowModal(false);
        alert(editingBien ? 'Bien modifié avec succès' : 'Bien créé avec succès');
      })
      .catch((err) => {
        console.error('Erreur lors de la sauvegarde:', err);
        alert('Erreur lors de la sauvegarde du bien');
      });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Biens Immobiliers</h1>
          <p className="text-sm text-slate-500">Catalogue exposé via Gateway.</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <PlusIcon className="h-5 w-5" />
          Nouveau Bien
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-500">Chargement des biens...</div>
      ) : (
        <>
          <div className="grid md:grid-cols-3 gap-4">
            {biens.map((b) => (
              <div key={b.id} className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-500">{b.ville}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${b.disponible ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                    {b.disponible ? "Disponible" : "Indispo"}
                  </span>
                </div>
                <p className="text-lg font-semibold text-slate-900">{b.titre}</p>
                <p className="text-sm text-slate-600 line-clamp-2">{b.description}</p>
                <div className="flex items-center justify-between text-sm text-slate-600">
                  <span className="text-xs bg-slate-100 px-2 py-1 rounded">{b.typeBien}</span>
                  <span className="font-semibold text-slate-900">{b.prix.toLocaleString("fr-FR")} €</span>
                </div>
                <div className="flex gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => handleEdit(b)}
                    className="flex-1 flex items-center justify-center gap-1 text-sm text-blue-600 hover:bg-blue-50 py-2 rounded-lg transition-colors"
                  >
                    <PencilIcon className="h-4 w-4" />
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(b)}
                    className="flex-1 flex items-center justify-center gap-1 text-sm text-red-600 hover:bg-red-50 py-2 rounded-lg transition-colors"
                  >
                    <TrashIcon className="h-4 w-4" />
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
          {biens.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              Aucun bien pour le moment. Créez-en un pour commencer.
            </div>
          )}
        </>
      )}

      {/* Modal de création/édition */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
              {editingBien ? 'Modifier le bien' : 'Nouveau bien'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Titre
                  </label>
                  <input
                    type="text"
                    value={formData.titre}
                    onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: Appartement centre-ville"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Description détaillée du bien"
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Ville
                  </label>
                  <input
                    type="text"
                    value={formData.ville}
                    onChange={(e) => setFormData({ ...formData, ville: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: Paris"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Prix (€)
                  </label>
                  <input
                    type="number"
                    value={formData.prix}
                    onChange={(e) => setFormData({ ...formData, prix: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: 500000"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Type de bien
                  </label>
                  <select
                    value={formData.typeBien}
                    onChange={(e) => setFormData({ ...formData, typeBien: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="APPARTEMENT">Appartement</option>
                    <option value="MAISON">Maison</option>
                    <option value="STUDIO">Studio</option>
                    <option value="VILLA">Villa</option>
                    <option value="LOFT">Loft</option>
                    <option value="TERRAIN">Terrain</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Disponibilité
                  </label>
                  <select
                    value={formData.disponible ? 'true' : 'false'}
                    onChange={(e) => setFormData({ ...formData, disponible: e.target.value === 'true' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="true">Disponible</option>
                    <option value="false">Indisponible</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingBien ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
