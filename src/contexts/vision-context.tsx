'use client';

import React, { createContext, ReactNode, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { getVision } from '@/hooks/server-actions/persona-vision';

export interface VisionContextType {
  vision: any | null;
  setVision: (vision: string | null) => void;
}

export const VisionContext = createContext<VisionContextType | undefined>(undefined);

export const VisionProvider = ({ children }: { children: ReactNode }) => {
  const [vision, setVisionState] = useState<any | null>(null); // Keep vision as object
  const { data: session, status } = useSession(); // <-- this is reactive

  useEffect(() => {
    const fetchVision = async () => {
      if (status === 'authenticated' && session?.user?.id) {
        try {
          const res = await getVision(session.user.id);
          if (res) setVisionState(res);
        } catch (error) {
          console.error('Error fetching vision:', error);
        }
      }
    };

    fetchVision();
  }, [session?.user?.id, status]); // Re-run when session is ready

  const setVision = (newVision: any | null) => {
    setVisionState(newVision);
    if (newVision) {
      sessionStorage.setItem('vision', JSON.stringify(newVision));
    } else {
      sessionStorage.removeItem('vision');
    }
  };

  return (
    <VisionContext.Provider value={{ vision, setVision }}>
      {children}
    </VisionContext.Provider>
  );
};
