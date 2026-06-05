"use client";

import { createContext, useCallback, useContext, useState } from "react";

const AnnouncerContext = createContext<(msg: string) => void>(() => {
  /* no-op par défaut, surchargé par le provider */
});

export function AnnouncerProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState("");

  const announce = useCallback((msg: string) => {
    setMessage("");
    setTimeout(() => setMessage(msg), 100);
  }, []);

  return (
    <AnnouncerContext.Provider value={announce}>
      {children}
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {message}
      </div>
    </AnnouncerContext.Provider>
  );
}

export const useAnnounce = () => useContext(AnnouncerContext);
