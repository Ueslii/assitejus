
# 👤 Frontend - Portal do Cidadão

## 📦 Estrutura do Projeto

```
frontend-cidadao/
├── src/
│   ├── components/
│   │   ├── FormularioSubmissao.jsx
│   │   ├── ConsultaStatus.jsx
│   │   └── ui/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env
├── package.json
└── vite.config.js
```

## 📝 package.json

```json
{
  "name": "def-sul-bahia-cidadao",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-helmet": "^6.1.0",
    "framer-motion": "^10.16.4",
    "lucide-react": "^0.285.0",
    "@radix-ui/react-toast": "^1.1.5",
    "tailwindcss": "^3.3.3"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.0.3",
    "vite": "^4.4.5"
  }
}
```

## 🎨 Componente Principal - FormularioSubmissao.jsx

```javascript
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, Mic, Send } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

export const FormularioSubmissao = () => {
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    email: '',
    telefone: '',
    relato: ''
  });
  const [audioFile, setAudioFile] = useState(null);
  const [documentFiles, setDocumentFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chaveAcesso, setChaveAcesso] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      formDataToSend.append(key, formData[key]);
    });
    
    if (audioFile) {
      formDataToSend.append('audio', audioFile);
    }
    
    documentFiles.forEach(file => {
      formDataToSend.append('documentos', file);
    });

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/casos/novo`, {
        method: 'POST',
        body: formDataToSend
      });

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
        variant: "destructive"
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
```

## 🔍 Componente - ConsultaStatus.jsx

```javascript
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

export const ConsultaStatus = () => {
  const [cpf, setCpf] = useState('');
  const [chave, setChave] = useState('');
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
        variant: "destructive"
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
```

---

**Execute com:** `npm install && npm run dev`
  