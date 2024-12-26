"use client";

import { createContext, useContext, useState } from "react";
import { SupabaseClient } from "@supabase/supabase-js";
import { createBrowserClient } from "@supabase/ssr";

// Define the SupabaseContext type
interface SupabaseContextType {
  supabase: SupabaseClient;
}

// Create the context
export const SupabaseContext = createContext<SupabaseContextType | undefined>(
  undefined,
);

// Custom hook to access Supabase
export const useSupabase = (): SupabaseContextType => {
  const context = useContext(SupabaseContext);

  if (context === undefined) {
    throw new Error("useSupabase must be used within SupabaseProvider");
  }

  return context;
};

// Supabase Provider
export const SupabaseProvider = ({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement => {
  // Initialize Supabase client
  const [supabase] = useState(() =>
    createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
    ),
  );

  return (
    <SupabaseContext.Provider value={{ supabase }}>
      {children}
    </SupabaseContext.Provider>
  );
};
