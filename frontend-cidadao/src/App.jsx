import { FormularioSubmissao } from "./components/FormularioSubmissao";
import { ConsultaStatus } from "./components/ConsultaStatus";

function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans p-4 sm:p-8">
      <main className="max-w-4xl mx-auto space-y-12">
        {/* Cabeçalho */}
        <header className="text-center space-y-2">
          <div className="inline-flex items-center gap-3 bg-amber-500/10 px-4 py-2 rounded-full border border-amber-500/30">
            <span className="w-3 h-3 bg-amber-400 rounded-full"></span>
            <p className="font-semibold text-amber-400">AssisteJus</p>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            Portal Cidadão
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Assistente Jurídico da 14ª Regional da DPE-BA
          </p>
        </header>

        {/* Seção para Enviar um Novo Caso */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 border-l-4 border-blue-500 pl-4">
            Enviar Novo Caso
          </h2>
          <FormularioSubmissao />
        </section>

        {/* Seção para Consultar Status */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 border-l-4 border-green-500 pl-4">
            Consultar Status do Caso
          </h2>
          <ConsultaStatus />
        </section>
      </main>
    </div>
  );
}

export default App;
