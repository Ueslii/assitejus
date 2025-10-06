import React, { useState } from "react";
import { motion } from "framer-motion";
import { Shield, LogIn } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await login(email, senha);
      navigate("/");
      toast({
        title: "Login realizado com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro no login",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-8 h-8 text-amber-500" />
            <h1 className="text-2xl font-bold">Painel do Defensor</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-slate-700 rounded-lg"
              required
            />
            <input
              type="password"
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full px-4 py-3 bg-slate-700 rounded-lg"
              required
            />
            <button
              type="submit"
              className="w-full bg-amber-600 hover:bg-amber-700 px-6 py-3 rounded-lg font-semibold"
            >
              <LogIn className="inline mr-2" />
              Entrar
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};
