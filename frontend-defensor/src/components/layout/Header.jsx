import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { jwtDecode } from "jwt-decode";

export const Header = () => {
  const { token, logout } = useAuth();
  const defensor = token ? jwtDecode(token) : null;

  return (
    <header className="flex justify-end items-center p-6 bg-stone-300 border-b border-green-500">
      <div className="flex items-center gap-4">
        <span className="font-semibold">
          Dr(a). {defensor?.nome || "Defensor"}
        </span>
        <button
          onClick={logout}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm font-semibold"
        >
          Sair
        </button>
      </div>
    </header>
  );
};
