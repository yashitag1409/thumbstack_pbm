"use client";

import React, { createContext, useContext, useState } from "react";

// 1. Initialize the Context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Define the actions
  const openAuthModal = () => setIsAuthOpen(true);
  const closeAuthModal = () => setIsAuthOpen(false);
  const toggleAuthModal = () => setIsAuthOpen((prev) => !prev);

  // 2. Wrap children in the Provider and pass the state/functions
  return (
    <AuthContext.Provider
      value={{
        isAuthOpen,
        openAuthModal,
        closeAuthModal,
        toggleAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// 3. Create a custom hook for easy access in other components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
