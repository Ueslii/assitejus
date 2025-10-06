
# 🔧 Guia Completo de Configuração do Backend

## 📦 Estrutura Completa de Arquivos

Crie a seguinte estrutura de pastas e arquivos:

```
backend/
├── src/
│   ├── config/
│   │   ├── supabase.js
│   │   └── jwt.js
│   ├── controllers/
│   │   ├── casosController.js
│   │   ├── defensoresController.js
│   │   └── statusController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── upload.js
│   ├── routes/
│   │   ├── casos.js
│   │   ├── defensores.js
│   │   └── status.js
│   ├── services/
│   │   ├── audioService.js
│   │   ├── documentService.js
│   │   ├── geminiService.js
│   │   └── securityService.js
│   └── utils/
│       └── helpers.js
├── templates/
│   └── template.docx
├── uploads/ (criado automaticamente)
├── .env
├── .gitignore
├── package.json
└── server.js
```

## 📝 Arquivo package.json

```json
{
  "name": "def-sul-bahia-backend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "nodemon server.js",
    "start": "node server.js"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.39.0",
    "bcrypt": "^5.1.1",
    "cors": "^2.8.5",
    "docxtemplater": "^3.42.0",
    "dotenv": "^16.3.1",
    "express": "^4.18.2",
    "jsonwebtoken": "^9.0.2",
    "multer": "^1.4.5-lts.1",
    "openai": "^4.20.1",
    "pizzip": "^3.1.6",
    "tesseract.js": "^5.0.3",
    "@google/generative-ai": "^0.1.3"
  },
  "devDependencies": {
    "nodemon": "^3.0.2"
  }
}
```

## 🔐 Arquivo .env (Exemplo)

```env
# Supabase Configuration
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_ANON_KEY=sua_chave_anonima_aqui
SUPABASE_SERVICE_KEY=sua_chave_de_servico_aqui

# JWT Configuration
JWT_SECRET=def_sul_bahia_secret_key_2024_muito_segura_e_longa

# External APIs
OPENAI_API_KEY=sk-sua_chave_openai_aqui
GEMINI_API_KEY=sua_chave_gemini_aqui

# Server Configuration
PORT=3001
NODE_ENV=development
```

## 📄 Código Completo dos Arquivos

### server.js

```javascript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import casosRoutes from './src/routes/casos.js';
import defensoresRoutes from './src/routes/defensores.js';
import statusRoutes from './src/routes/status.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/casos', casosRoutes);
app.use('/api/defensores', defensoresRoutes);
app.use('/api/status', statusRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Def. Sul Bahia API is running' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo deu errado no servidor!' });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
```

### src/config/supabase.js

```javascript
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
```

### src/config/jwt.js

```javascript
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' });
};

export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
```

### src/services/securityService.js

```javascript
import crypto from 'crypto';
import bcrypt from 'bcrypt';

export const generateAccessKey = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let key = 'DEF-';
  for (let i = 0; i < 8; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return key;
};

export const hashKeyWithSalt = (key) => {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.createHash('sha256').update(key + salt).digest('hex');
  return `${salt}:${hash}`;
};

export const verifyKey = (key, storedHash) => {
  const [salt, hash] = storedHash.split(':');
  const computedHash = crypto.createHash('sha256').update(key + salt).digest('hex');
  return hash === computedHash;
};

export const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

export const verifyPassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};
```

### src/services/audioService.js

```javascript
import OpenAI from 'openai';
import fs from 'fs';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const transcribeAudio = async (audioPath) => {
  try {
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(audioPath),
      model: 'whisper-1',
      language: 'pt'
    });
    return transcription.text;
  } catch (error) {
    console.error('Erro na transcrição:', error);
    throw new Error('Falha ao transcrever áudio');
  }
};
```

### src/services/documentService.js

```javascript
import Tesseract from 'tesseract.js';

export const extractTextFromImage = async (imagePath) => {
  try {
    const { data: { text } } = await Tesseract.recognize(
      imagePath,
      'por',
      {
        logger: m => console.log(m)
      }
    );
    return text;
  } catch (error) {
    console.error('Erro no OCR:', error);
    throw new Error('Falha ao extrair texto do documento');
  }
};
```

### src/services/geminiService.js

```javascript
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const analyzeCase = async (fullText) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `Você é um assistente jurídico especializado. Analise o seguinte caso e forneça um resumo objetivo para um defensor público, destacando:

1. Problema Central
2. Partes Envolvidas
3. Pedido Principal do Cidadão
4. Urgência do Caso
5. Área do Direito

Caso: ${fullText}

Forneça o resumo em formato de tópicos claros e objetivos.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Erro na análise com Gemini:', error);
    throw new Error('Falha ao analisar caso com IA');
  }
};
```

## 🎯 Próximos Passos

1. Crie todos os arquivos listados acima
2. Execute `npm install` no diretório backend
3. Configure o arquivo .env com suas credenciais
4. Execute o SQL no Supabase para criar as tabelas
5. Crie os buckets no Supabase Storage
6. Execute `npm run dev` para iniciar o servidor

## ⚠️ Observações Importantes

- O template.docx deve ser criado manualmente com placeholders
- Os uploads são salvos temporariamente antes de ir para o Supabase
- Certifique-se de que todas as API keys estão válidas
- O servidor deve rodar em uma porta diferente dos frontends

---

**Este backend NÃO pode ser executado no Hostinger Horizons. Você precisa de um servidor Node.js dedicado.**
  