"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient";

type AuthContextType = {
  user: any | null;
};

const AuthContext = createContext<AuthContextType>({ user: null });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Load current user
    supabase.auth.getUser().then((res) => {
      setUser(res.data.user);
    });

    // Listen for login/logout changes
    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
