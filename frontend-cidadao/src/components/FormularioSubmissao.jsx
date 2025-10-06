import React, { useState } from "react";
import { motion } from "framer-motion";
import { Upload, FileText, Mic, Send } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

export const FormularioSubmissao = () => {
  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    email: "",
    telefone: "",
    relato: "",
  });
  const [audioFile, setAudioFile] = useState(null);
  const [documentFiles, setDocumentFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chaveAcesso, setChaveAcesso] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });

    if (audioFile) {
      formDataToSend.append("audio", audioFile);
    }

    documentFiles.forEach((file) => {
      formDataToSend.append("documentos", file);
    });

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/casos/novo`,
        {
          method: "POST",
          body: formDataToSend,
        }
      );

      const data = await response.json();

      if (response.ok) {
        setChaveAcesso(data.chaveAcesso);
        toast({
          title: "Caso submetido com sucesso!",
          description: `Sua chave de acesso: ${data.chaveAcesso}`,
        });
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast({
        title: "Erro ao submeter caso",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onSubmit={handleSubmit}
      className="space-y-6 bg-slate-800/50 p-8 rounded-2xl border border-slate-700"
    >
      {/* Campos do formulário aqui */}
    </motion.form>
  );
};
