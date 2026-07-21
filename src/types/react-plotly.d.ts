// src/types/react-plotly.d.ts
declare module 'react-plotly.js' {
    import * as React from 'react';
    import { PlotParams } from 'plotly.js';
  
    const Plot: React.ComponentClass<Partial<PlotParams>>;
    export default Plot;
  }
  