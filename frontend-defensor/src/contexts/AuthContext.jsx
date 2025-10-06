import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [defensor, setDefensor] = useState(null);

  const login = async (email, senha) => {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/defensores/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      }
    );

    const data = await response.json();

    if (response.ok) {
      setToken(data.token);
      setDefensor(data.defensor);
      localStorage.setItem("token", data.token);
      return true;
    }

    throw new Error(data.error);
  };

  const logout = () => {
    setToken(null);
    setDefensor(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ token, defensor, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
