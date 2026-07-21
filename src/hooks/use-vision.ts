import * as React from 'react';

import { VisionContext, VisionContextType } from '@/contexts/vision-context';

export const 
useVision = (): VisionContextType => {
  const context = React.useContext(VisionContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
