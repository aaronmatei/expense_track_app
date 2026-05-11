import { useQueryClient } from "@tanstack/react-query";
import { createContext, useContext, useState, type ReactNode } from "react";

import { getAccessToken, removeAccessToken, setAccessToken } from "./token";



interface AuthContextValue {
  token: string | null;
  signIn: (token: string) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => getAccessToken());
  const queryClient = useQueryClient();

  const signIn = (token: string) => {
    setAccessToken(token);
    setToken(token);
  };

  const signOut = () => {
    removeAccessToken();
    setToken(null);
    queryClient.clear(); //wipe all cached data on logout to prevent unauthorized access to sensitive information
  };

  return (
    <AuthContext.Provider value={{ token, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};