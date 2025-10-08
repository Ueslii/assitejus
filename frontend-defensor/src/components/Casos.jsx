// Arquivo: frontend-defensor/src/components/Casos.jsx

import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import { Eye } from "lucide-react";

export const Casos = () => {
  const [casos, setCasos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchCasos = async () => {
      try {
        // A rota do backend é a mesma que usamos no Dashboard
        const response = await fetch(`${import.meta.env.VITE_API_URL}/casos`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Falha ao buscar os casos.");
        }
        const data = await response.json();
        setCasos(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchCasos();
    }
  }, [token]);

  if (loading) return <p className="text-center p-8">Carregando casos...</p>;
  if (error) return <p className="text-center p-8 text-red-400">{error}</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl text-green-500 font-bold">
        Todos os Casos Recebidos
      </h1>

      <div className="bg-slate-800/50 rounded-xl border border-green-500 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50/70">
            <tr className="text-green-500">
              <th className="p-4 font-semibold">Protocolo</th>
              <th className="p-4 font-semibold">Nome do Cidadão</th>
              <th className="p-4 font-semibold">Data de Abertura</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold">Ações</th>
            </tr>
          </thead>
          <tbody>
            {casos.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center p-8 text-slate-400">
                  Nenhum caso encontrado.
                </td>
              </tr>
            ) : (
              casos.map((caso) => (
                <tr
                  key={caso.id}
                  className="border-t border-slate-800 hover:bg-slate-600/50"
                >
                  <td className="p-4 font-mono text-sm">{caso.protocolo}</td>
                  <td className="p-4">{caso.nome_assistido}</td>
                  <td className="p-4 text-slate-900">
                    {new Date(caso.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 text-xs font-semibold bg-blue-900 text-blue-300 rounded-full capitalize">
                      {caso.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="p-4">
                    <Link
                      to={`/casos/${caso.id}`}
                      className="flex items-center gap-2 text-blue-900 hover:text-blue-300"
                      title="Ver Detalhes"
                    >
                      <Eye size={18} />
                      Ver Detalhes
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
