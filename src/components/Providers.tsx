"use client";

import React, { ReactNode, createContext, useState } from "react";

interface MyContextType {
  user: string | null;
  setUser: (user: string | null) => void;
}

export const MyContext = createContext<MyContextType | undefined>(undefined);

export default function Providers({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<string | null>(null);

  return (
    <MyContext.Provider value={{ user, setUser }}>
      {children}
    </MyContext.Provider>
  );
}
