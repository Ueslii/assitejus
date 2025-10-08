import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { ChevronLeft, Download, FileText, Mic } from "lucide-react";

export const DetalhesCaso = () => {
  const { id } = useParams(); // Pega o ID da URL
  const { token } = useAuth();
  const [caso, setCaso] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetalhes = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/casos/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!response.ok) throw new Error("Falha ao carregar o caso.");
        const data = await response.json();
        setCaso(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetalhes();
  }, [id, token]);

  // Lógica para atualizar o status (a ser implementada)
  const handleStatusChange = (e) => {
    const novoStatus = e.target.value;
    console.log(`Status do caso ${id} alterado para: ${novoStatus}`);
    // Aqui virá a chamada fetch para a API para atualizar o status no banco
  };

  if (loading)
    return <p className="text-center p-8">Carregando detalhes do caso...</p>;
  if (!caso) return <p className="text-center p-8">Caso não encontrado.</p>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <Link
        to="/"
        className="flex items-center gap-2 text-slate-900 hover:text-slate-900 mb-6"
      >
        <ChevronLeft size={20} /> Voltar para o Dashboard
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Coluna Principal */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-800/30 p-6 rounded-xl border border-green-500">
            <h2 className="text-2xl font-bold mb-4 text-[#e3ddff]">
              Detalhes do Assistido
            </h2>
            <p className="text-[#e3ddff]">
              <strong className="text-[#000000]">Nome:</strong>{" "}
              {caso.nome_assistido}
            </p>
            <p className="text-[#e3ddff]">
              <strong className="text-[#000000]">CPF:</strong>{" "}
              {caso.cpf_assistido}
            </p>
            <p className="text-[#e3ddff]">
              <strong className="text-[#000000]">Telefone:</strong>{" "}
              {caso.telefone_assistido}
            </p>
            <p className="text-[#e3ddff]">
              <strong className="text-[#000000]">Tipo de Ação:</strong>{" "}
              {caso.tipo_acao}
            </p>
          </div>
          <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
            <h2 className="text-2xl font-bold mb-4">Relato do Caso</h2>
            <p className="whitespace-pre-wrap text-[#e3ddff]">
              {caso.relato_texto || "Nenhum relato textual fornecido."}
            </p>
          </div>
        </div>

        {/* Coluna Lateral */}
        <div className="space-y-6">
          <div className="bg-slate-900/50 p-6 rounded-xl border border-blue-700">
            <h2 className="text-xl font-bold text-[#983d00] mb-2">
              Resumo da IA
            </h2>
            <p className="text-[#d15600]">
              {caso.resumo_ia || "Resumo não disponível."}
            </p>
          </div>
          <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
            <h2 className="text-xl font-bold mb-4">Status do Caso</h2>
            <select
              onChange={handleStatusChange}
              defaultValue={caso.status}
              className="w-full p-2 bg-slate-600 rounded-lg"
            >
              <option value="recebido">Recebido</option>
              <option value="em_analise">Em Análise</option>
              <option value="aguardando_docs">Aguardando Documentos</option>
              <option value="finalizado">Finalizado</option>
            </select>
          </div>
          <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
            <h2 className="text-xl font-bold mb-4">Documentos e Anexos</h2>
            <div className="space-y-3">
              {caso.url_documento_gerado && (
                <a
                  href={caso.url_documento_gerado}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-amber-600/80 hover:bg-amber-600 rounded-lg font-semibold"
                >
                  <Download size={20} /> Baixar Petição Gerada
                </a>
              )}
              {caso.url_audio && (
                <a
                  href={caso.url_audio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-slate-700 hover:bg-slate-600 rounded-lg"
                >
                  <Mic size={20} /> Ouvir Áudio
                </a>
              )}
              {caso.urls_documentos?.map((url, index) => (
                <a
                  key={index}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-slate-700 hover:bg-slate-600 rounded-lg"
                >
                  <FileText size={20} /> Ver Documento {index + 1}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
