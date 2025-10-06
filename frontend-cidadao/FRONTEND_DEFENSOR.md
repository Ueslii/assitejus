
# 🛡️ Frontend - Painel do Defensor

## 📦 Estrutura do Projeto

```
frontend-defensor/
├── src/
│   ├── components/
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── DetalhesCaso.jsx
│   │   └── ui/
│   ├── contexts/
│   │   └── AuthContext.jsx
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
  "name": "def-sul-bahia-defensor",
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
    "react-router-dom": "^6.16.0",
    "react-helmet": "^6.1.0",
    "framer-motion": "^10.16.4",
    "lucide-react": "^0.285.0",
    "@radix-ui/react-toast": "^1.1.5",
    "@radix-ui/react-dropdown-menu": "^2.0.5",
    "tailwindcss": "^3.3.3"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.0.3",
    "vite": "^4.4.5"
  }
}
```

## 🔐 AuthContext.jsx

```javascript
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [defensor, setDefensor] = useState(null);

  const login = async (email, senha) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/defensores/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha })
    });

    const data = await response.json();
    
    if (response.ok) {
      setToken(data.token);
      setDefensor(data.defensor);
      localStorage.setItem('token', data.token);
      return true;
    }
    
    throw new Error(data.error);
  };

  const logout = () => {
    setToken(null);
    setDefensor(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ token, defensor, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
```

## 🔑 Login.jsx

```javascript
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, LogIn } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await login(email, senha);
      navigate('/');
      toast({
        title: "Login realizado com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro no login",
        description: error.message,
        variant: "destructive"
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
```

## 📊 Dashboard.jsx

```javascript
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';

export const Dashboard = () => {
  const [casos, setCasos] = useState([]);
  const { token } = useAuth();

  useEffect(() => {
    const fetchCasos = async () => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/casos`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
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
        {casos.map(caso => (
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
                    <p className="text-sm text-slate-400">Protocolo: {caso.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{new Date(caso.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
};
```

---

**Execute com:** `npm install && npm run dev`
  