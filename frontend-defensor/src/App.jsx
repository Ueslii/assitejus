import React from "react";
import { Routes, Route } from "react-router-dom";
import { Login } from "./components/Login";
import { Dashboard } from "./components/Dashboard";
import ProtectedRoute from "./components/ProtectedRouter";
import { Cadastro } from "./components/Cadastro";
import { DetalhesCaso } from "./components/DetalhesCaso";
import { Layout } from "./components/layout/Layout";
import { Casos } from "./components/Casos";

function App() {
  return (
    <div>
      <Routes>
        {/* Rotas Públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />

        {/* Rotas Protegidas */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            {/* Estas rotas serão renderizadas dentro do <Outlet /> do Layout */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/casos/:id" element={<DetalhesCaso />} />
            <Route path="/casos" element={<Casos />} />
            {/* Adicione outras rotas protegidas aqui, como /casos, etc. */}
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
