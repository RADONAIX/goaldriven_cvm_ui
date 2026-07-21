import React from 'react';
import dynamic from 'next/dynamic';

import InsightBox from '../chartTitle';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

interface FeatureImportanceChartProps {
  handleInsightClick: (params: { title: string; desc: string; data: any }) => void;
}

export const FeatureImportanceChart: React.FC<FeatureImportanceChartProps> = ({ handleInsightClick }) => {
  const features: string[] = ['Price', 'Engagement', 'Service', 'Support', 'Quality'];
  const importance: number[] = [0.1, 0.3, 0.5, 0.7, 0.9];

  const data = [
    {
      type: 'bar',
      orientation: 'h',
      x: importance,
      y: features,
      marker: {
        color: importance,
        colorscale: 'Turbo', // You can also try 'Jet', 'Portland', 'Turbo', etc.
        colorbar: {
          title: 'Importance',
          thickness: 15,
        },
      },
    },
  ];

  return (
    <>
      <InsightBox
        title="Feature Importance"
        desc="This chart shows the feature importance for the model."
        data={data}
        onClick={handleInsightClick}
      />
      <Plot
        data={data}
        layout={{
          title: 'Feature Importance',
          xaxis: { title: 'Importance Score' },
          yaxis: { title: 'Feature' },
          margin: { l: 100, r: 80, t: 50, b: 50 },
          showlegend: false,
        }}
        useResizeHandler={true}
        style={{ width: '100%', height: '100%' }}
        config={{ responsive: true, displayModeBar: false }}
      />
    </>
  );
};

export default FeatureImportanceChart;
