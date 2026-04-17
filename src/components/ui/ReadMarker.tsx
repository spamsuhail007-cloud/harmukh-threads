'use client';

import { useEffect } from 'react';

export function ReadMarker({ action }: { action: () => Promise<void> }) {
  useEffect(() => {
    action().catch(console.error);
  }, [action]);
  
  return null;
}
