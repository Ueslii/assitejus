import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

export const ConsultaStatus = () => {
  const [cpf, setCpf] = useState("");
  const [chave, setChave] = useState("");
  const [status, setStatus] = useState(null);

  const handleConsulta = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/status?cpf=${cpf}&chave=${chave}`
      );

      const data = await response.json();

      if (response.ok) {
        setStatus(data.status);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast({
        title: "Erro na consulta",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700"
    >
      <form onSubmit={handleConsulta} className="space-y-4">
        <input
          type="text"
          placeholder="CPF"
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
          className="w-full px-4 py-3 bg-slate-700 rounded-lg"
        />
        <input
          type="text"
          placeholder="Chave de Acesso"
          value={chave}
          onChange={(e) => setChave(e.target.value)}
          className="w-full px-4 py-3 bg-slate-700 rounded-lg"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg"
        >
          <Search className="inline mr-2" />
          Consultar Status
        </button>
      </form>

      {status && (
        <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
          <p className="text-green-400">Status: {status}</p>
        </div>
      )}
    </motion.div>
  );
};
