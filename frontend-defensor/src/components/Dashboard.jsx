import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import { FileText, Clock } from "lucide-react";
import { jwtDecode } from "jwt-decode";

export const Dashboard = () => {
  const [casos, setCasos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token, logout } = useAuth();
  const [defensor, setDefensor] = useState(null);
  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      setDefensor(decoded);
    }
  }, [token]);
  useEffect(() => {
    const fetchCasos = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/casos`, {
          headers: {
            Authorization: `Bearer ${token}`, // Envia o token para autorização
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
    <div className="p-8">
      <div className="p-8">
        <div className="flex justify-between items-center mb-5">
          <div>
            {defensor && (
              <h1 className="text-3xl font-bold">
                Olá, Dr(a). {defensor.nome}
              </h1>
            )}
          </div>
          <button
            onClick={logout}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-semibold"
          >
            Sair
          </button>
        </div>

        {/* ... (o resto do seu dashboard com a lista de casos) ... */}
      </div>
      <div className="grid gap-4">
        {casos.length === 0 ? (
          <p className="text-slate-900">Nenhum caso pendente no momento.</p>
        ) : (
          casos.map((caso) => (
            // Futuramente, este Link levará para a página de detalhes do caso
            <Link to={`/casos/${caso.id}`} key={caso.id}>
              <div
                key={caso.id}
                className="bg-slate-500/50 p-6 rounded-xl border border-green-500 hover:border-amber-500/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <FileText className="w-6 h-6 text-amber-500" />
                    <div>
                      <h3 className="font-semibold">{caso.nome_assistido}</h3>
                      <p className="text-sm text-slate-900">
                        Protocolo: {caso.protocolo}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-slate-900 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>
                      {new Date(caso.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};
