
# Def. Sul Bahia - Assistente Jurídico Automatizado

Sistema completo de triagem e preparação de casos jurídicos para a Defensoria Pública.

## ⚠️ IMPORTANTE - Ambiente de Execução

Este projeto **NÃO PODE** ser executado diretamente no Hostinger Horizons, pois requer:
- Backend Node.js/Express customizado
- Processamento de arquivos no servidor
- Integração com múltiplas APIs externas
- Banco de dados PostgreSQL (Supabase)

## 🏗️ Arquitetura do Sistema

### Backend (Node.js + Express)
- API RESTful completa
- Autenticação JWT para defensores
- Sistema de chaves SHA256 para cidadãos
- Upload e processamento de arquivos
- Integração com Whisper (transcrição de áudio)
- Integração com Gemini (análise jurídica)
- OCR com Tesseract.js
- Geração de documentos .docx

### Frontend 1 - Portal do Cidadão
- Interface simples para submissão de casos
- Upload de áudio e documentos
- Consulta de status por CPF e chave

### Frontend 2 - Painel do Defensor
- Dashboard com lista de casos
- Visualização detalhada de cada caso
- Download de documentos e petições
- Atualização de status

## 📋 Pré-requisitos

1. **Node.js** (v18 ou superior)
2. **Conta Supabase** configurada
3. **API Keys**:
   - OpenAI (Whisper)
   - Google Gemini
4. **PostgreSQL** (via Supabase)

## 🗄️ Estrutura do Banco de Dados (Supabase)

Execute os seguintes comandos SQL no Supabase SQL Editor:

```sql
-- Tabela de Assistidos
CREATE TABLE assistidos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(255) NOT NULL,
  cpf VARCHAR(11) UNIQUE NOT NULL,
  chave_hash TEXT NOT NULL,
  email VARCHAR(255),
  telefone VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de Relatos
CREATE TABLE relatos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assistido_id UUID REFERENCES assistidos(id) ON DELETE CASCADE,
  texto_completo TEXT,
  audio_link TEXT,
  resumo_ia TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de Documentos
CREATE TABLE documentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assistido_id UUID REFERENCES assistidos(id) ON DELETE CASCADE,
  nome_arquivo VARCHAR(255),
  tipo_documento VARCHAR(100),
  link_storage TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de Petições
CREATE TABLE peticoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assistido_id UUID REFERENCES assistidos(id) ON DELETE CASCADE,
  link_rascunho_docx TEXT,
  status VARCHAR(50) DEFAULT 'aguardando_revisao',
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de Processos
CREATE TABLE processos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  peticao_id UUID REFERENCES peticoes(id) ON DELETE CASCADE,
  numero_processo VARCHAR(100),
  movimentacoes TEXT,
  notificacoes TEXT
);

-- Tabela de Defensores
CREATE TABLE defensores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  senha_hash TEXT NOT NULL
);

-- Tabela de Logs
CREATE TABLE logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  data TIMESTAMP DEFAULT NOW(),
  acao VARCHAR(255),
  detalhes TEXT,
  defensor_id UUID REFERENCES defensores(id)
);

-- Criar buckets no Supabase Storage
-- Execute no painel do Supabase Storage:
-- 1. Criar bucket "audios" (público)
-- 2. Criar bucket "documentos" (público)
-- 3. Criar bucket "peticoes" (privado)
```

## ⚙️ Configuração

### 1. Backend

Crie o arquivo `backend/.env`:

```env
# Supabase
SUPABASE_URL=sua_url_do_supabase
SUPABASE_ANON_KEY=sua_chave_anonima
SUPABASE_SERVICE_KEY=sua_chave_de_servico

# JWT
JWT_SECRET=sua_chave_secreta_jwt_muito_segura

# APIs Externas
OPENAI_API_KEY=sua_chave_openai
GEMINI_API_KEY=sua_chave_gemini

# Servidor
PORT=3001
```

### 2. Frontend - Portal do Cidadão

Crie o arquivo `frontend-cidadao/.env`:

```env
VITE_API_URL=http://localhost:3001/api
```

### 3. Frontend - Painel do Defensor

Crie o arquivo `frontend-defensor/.env`:

```env
VITE_API_URL=http://localhost:3001/api
```

## 🚀 Instalação e Execução

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend - Portal do Cidadão

```bash
cd frontend-cidadao
npm install
npm run dev
```

### Frontend - Painel do Defensor

```bash
cd frontend-defensor
npm install
npm run dev
```

## 📁 Estrutura de Pastas

```
def-sul-bahia/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   ├── templates/
│   │   └── template.docx
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend-cidadao/
│   ├── src/
│   ├── .env
│   └── package.json
└── frontend-defensor/
    ├── src/
    ├── .env
    └── package.json
```

## 🔐 Segurança

- **Defensores**: Autenticação via JWT (validade 8h)
- **Cidadãos**: Sistema de chaves SHA256 com salt
- **Arquivos**: Storage seguro no Supabase
- **Senhas**: Hash bcrypt com salt rounds = 10

## 📝 Endpoints da API

### Públicos
- `POST /api/casos/novo` - Submeter novo caso
- `GET /api/status` - Consultar status (requer CPF + chave)

### Protegidos (JWT)
- `POST /api/defensores/login` - Login de defensor
- `GET /api/casos` - Listar casos pendentes
- `GET /api/casos/:id` - Detalhes de um caso
- `PATCH /api/peticoes/:id/status` - Atualizar status

## 🎯 Fluxo de Trabalho

1. **Cidadão** submete caso com áudio e documentos
2. **Sistema** processa áudio (Whisper) e documentos (OCR)
3. **IA Gemini** analisa e gera resumo jurídico
4. **Sistema** gera rascunho de petição (.docx)
5. **Defensor** revisa caso no painel
6. **Defensor** atualiza status
7. **Cidadão** consulta status com sua chave

## 📞 Suporte

Para dúvidas sobre implementação, consulte a documentação das APIs:
- [Supabase Docs](https://supabase.com/docs)
- [OpenAI Whisper](https://platform.openai.com/docs/guides/speech-to-text)
- [Google Gemini](https://ai.google.dev/docs)

---

**Nota**: Este é um sistema completo que requer configuração de servidor backend. Não é possível executá-lo apenas no ambiente frontend do Hostinger Horizons.
  