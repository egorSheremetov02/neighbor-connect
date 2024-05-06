import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const setToken = (newToken) => {
    sessionStorage.setItem('token', JSON.stringify(newToken))
  };

  const getToken = () => {
    const tokenString = sessionStorage.getItem('token')
    const userToken = JSON.parse(tokenString)
    return userToken?.token
  }

  const logout = () => {
    localStorage.removeItem("token");
  }

  return (
    <AuthContext.Provider value={{ setToken, getToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to access authentication context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
