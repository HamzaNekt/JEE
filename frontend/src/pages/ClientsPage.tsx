import { useEffect, useState } from 'react';
import { useApiClient } from '../api/client';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';

interface Client {
  id: number;
  nom: string;
  email: string;
}

export default function ClientsPage() {
  const apiClient = useApiClient();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState({ nom: '', email: '' });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = () => {
    setLoading(true);
    setError(null);
    apiClient
      .get('/clients')
      .then((res) => {
        setClients(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Erreur lors de la récupération des clients:', err);
        setError('Impossible de charger les clients');
        setLoading(false);
      });
  };

  const handleCreate = () => {
    setEditingClient(null);
    setFormData({ nom: '', email: '' });
    setShowModal(true);
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setFormData({ nom: client.nom, email: client.email });
    setShowModal(true);
  };

  const handleDelete = (client: Client) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer le client "${client.nom}" ?`)) {
      return;
    }

    apiClient
      .delete(`/clients/${client.id}`)
      .then(() => {
        fetchClients();
        alert('Client supprimé avec succès');
      })
      .catch((err) => {
        console.error('Erreur lors de la suppression:', err);
        alert('Erreur lors de la suppression du client');
      });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nom || !formData.email) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    const request = editingClient
      ? apiClient.put(`/clients/${editingClient.id}`, formData)
      : apiClient.post('/clients', formData);

    request
      .then(() => {
        fetchClients();
        setShowModal(false);
        alert(editingClient ? 'Client modifié avec succès' : 'Client créé avec succès');
      })
      .catch((err) => {
        console.error('Erreur lors de la sauvegarde:', err);
        alert('Erreur lors de la sauvegarde du client');
      });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Chargement des clients...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Gestion des Clients</h1>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <PlusIcon className="h-5 w-5" />
          Nouveau Client
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nom
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {clients.map((client) => (
              <tr key={client.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {client.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {client.nom}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {client.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEdit(client)}
                    className="text-blue-600 hover:text-blue-900 mr-4 inline-flex items-center gap-1"
                  >
                    <PencilIcon className="h-4 w-4" />
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(client)}
                    className="text-red-600 hover:text-red-900 inline-flex items-center gap-1"
                  >
                    <TrashIcon className="h-4 w-4" />
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {clients.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Aucun client trouvé. Créez-en un pour commencer.
          </div>
        )}
      </div>

      {/* Modal de création/édition */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">
              {editingClient ? 'Modifier le client' : 'Nouveau client'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Nom complet
                </label>
                <input
                  type="text"
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Jean Dupont"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: jean.dupont@example.com"
                  required
                />
              </div>
              <div className="flex gap-3 justify-end">
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
                  {editingClient ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
