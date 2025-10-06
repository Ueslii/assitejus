import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FileText, Clock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

export const Dashboard = () => {
  const [casos, setCasos] = useState([]);
  const { token } = useAuth();

  useEffect(() => {
    const fetchCasos = async () => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/casos`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      setCasos(data);
    };

    fetchCasos();
  }, [token]);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Casos Pendentes</h1>

      <div className="grid gap-4">
        {casos.map((caso) => (
          <Link key={caso.id} to={`/casos/${caso.id}`}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 hover:border-amber-500/50"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <FileText className="w-6 h-6 text-amber-500" />
                  <div>
                    <h3 className="font-semibold">{caso.nome_assistido}</h3>
                    <p className="text-sm text-slate-400">
                      Protocolo: {caso.id}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">
                    {new Date(caso.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
};
