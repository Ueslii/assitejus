import React from "react";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { AlertCircle, FileText, Shield } from "lucide-react";

function App() {
  return (
    <>
      <Helmet>
        <title>Def. Sul Bahia - Sistema Indisponível</title>
        <meta
          name="description"
          content="Sistema de Assistência Jurídica Automatizada da Defensoria Pública"
        />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl w-full"
        >
          <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-700/50 overflow-hidden">
            <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-6">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">
                    Def. Sul Bahia
                  </h1>
                  <p className="text-amber-100">
                    Assistente Jurídico Automatizado
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8 space-y-6">
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                  <div>
                    <h2 className="text-xl font-semibold text-red-400 mb-2">
                      Sistema Requer Backend Dedicado
                    </h2>
                    <p className="text-slate-300 leading-relaxed">
                      Este projeto <strong>NÃO PODE</strong> ser executado no
                      ambiente Hostinger Horizons, pois requer um servidor
                      backend Node.js completo com processamento de arquivos,
                      integração com múltiplas APIs externas e banco de dados
                      PostgreSQL.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/30 rounded-xl p-6"
                >
                  <FileText className="w-8 h-8 text-blue-400 mb-3" />
                  <h3 className="text-lg font-semibold text-blue-400 mb-2">
                    Documentação Completa
                  </h3>
                  <p className="text-slate-300 text-sm">
                    Consulte o arquivo{" "}
                    <code className="bg-slate-700 px-2 py-1 rounded">
                      README.md
                    </code>{" "}
                    para instruções detalhadas de configuração e instalação.
                  </p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/30 rounded-xl p-6"
                >
                  <Shield className="w-8 h-8 text-purple-400 mb-3" />
                  <h3 className="text-lg font-semibold text-purple-400 mb-2">
                    Guia de Backend
                  </h3>
                  <p className="text-slate-300 text-sm">
                    Veja{" "}
                    <code className="bg-slate-700 px-2 py-1 rounded">
                      BACKEND_SETUP.md
                    </code>{" "}
                    para configuração completa do servidor Node.js.
                  </p>
                </motion.div>
              </div>

              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
                <h3 className="text-lg font-semibold text-white mb-4">
                  🚀 Recursos do Sistema
                </h3>
                <ul className="space-y-3 text-slate-300">
                  <li className="flex items-start gap-3">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>Autenticação JWT para defensores públicos</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>Sistema de chaves SHA256 para cidadãos</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>Transcrição automática de áudio com Whisper</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>OCR de documentos com Tesseract.js</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>Análise jurídica com IA Gemini</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>Geração automática de petições em .docx</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>
                      Dois frontends React separados (Cidadão + Defensor)
                    </span>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-amber-400 mb-3">
                  📋 Próximos Passos
                </h3>
                <ol className="space-y-2 text-slate-300 list-decimal list-inside">
                  <li>
                    Exporte este projeto clicando em "Hostinger Horizons" →
                    "Export Project"
                  </li>
                  <li>Configure um servidor Node.js (local ou em nuvem)</li>
                  <li>Siga as instruções do README.md e BACKEND_SETUP.md</li>
                  <li>Configure o Supabase e as API keys necessárias</li>
                  <li>
                    Execute os três componentes separadamente (backend + 2
                    frontends)
                  </li>
                </ol>
              </div>

              <div className="text-center pt-4">
                <p className="text-slate-400 text-sm">
                  Sistema desenvolvido para a Defensoria Pública do Sul da Bahia
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}

export default App;
