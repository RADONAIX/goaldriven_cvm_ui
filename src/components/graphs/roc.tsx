import React from 'react';
import dynamic from 'next/dynamic';
import InsightBox from '../chartTitle';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

interface RocCurveProps {
  handleInsightClick: (params: { title: string; desc: string; data: any }) => void;
}

export const RocCurve: React.FC<RocCurveProps> = ({handleInsightClick}) => {
  // Sample data
  const fpr = [0.0, 0.1, 0.2, 0.4, 1.0];
  const tpr = [0.0, 0.65, 0.75, 0.9, 1.0];
  const baseline = [0.0, 1.0];

  const data = {
    fpr,
    tpr,
    baseline,
  };

  return (
    <>
    <InsightBox
            title="ROC Curve"
            desc="This chart shows the ROC curve for the model."
            data={data}
            onClick={handleInsightClick}
          />
    <Plot
      data={[
        {
          x: fpr,
          y: tpr,
          type: 'scatter',
          mode: 'lines+markers',
          name: 'ROC Curve',
          line: { color: 'blue' },
        },
        {
          x: [0, 1],
          y: baseline,
          type: 'scatter',
          mode: 'lines',
          name: 'Baseline',
          line: { dash: 'dash', color: 'red' },
        },
      ]}
      layout={{
        xaxis: {
          title: 'False Positive Rate',
          range: [0, 1],
        },
        yaxis: {
          title: 'True Positive Rate',
          range: [0, 1],
        },
        margin: { l: 60, r: 30, t: 50, b: 50 },
        legend: {
          orientation: 'h',
          x: 0,
          y: 1.15,
          xanchor: 'left',
        },
      }}
      useResizeHandler={true}
      style={{ width: '100%', height: '100%' }}
      config={{ responsive: true, displayModeBar: false }}
    />
    </>
  );
};

export default RocCurve;
