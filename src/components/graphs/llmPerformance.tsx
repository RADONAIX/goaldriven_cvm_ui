import React from 'react';
import dynamic from 'next/dynamic';

import { useInsightHandler } from '@/hooks/useInsightHandler';

import AIInsightModal from '../aiInsight';
import InsightBox from '../chartTitle';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

export const LlmPerformanceChart: React.FC = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const performance = [0.95, 0.82, 0.85, 0.83, 0.84, 0.96, 0.94, 0.86, 0.88, 0.81, 0.93, 0.86];
  const { openInsightModal, loading, aiInsightData, handleInsightClick, handleCloseInsightModal } = useInsightHandler();

  return (
    <div style={{ width: '100%', height: '100%', maxWidth: '100%' }}>
      {openInsightModal && (
        <AIInsightModal
          open={openInsightModal}
          onClose={handleCloseInsightModal}
          data={aiInsightData}
          loading={loading}
        />
      )}
      <InsightBox
        title="LLM Performance Overtime"
        desc="This chart shows the distribution of LLM performance over time using line chart"
        data={{
          months,
          performance,
        }}
        onClick={handleInsightClick}
        
      />
      <Plot
        data={[
          {
            x: months,
            y: performance,
            type: 'scatter',
            mode: 'lines+markers',
            name: 'Performance',
            line: { color: '#00897b', width: 2 },
            marker: { size: 6 },
          },
        ]}
        layout={{
          xaxis: {
            title: 'Month',
          },
          yaxis: {
            title: 'Performance Metric',
            range: [0.8, 1],
          },
          height: 350,
          margin: { l: 60, r: 30, t: 50, b: 50 },
        }}
        config={{ responsive: true, displayModeBar: false }}
        useResizeHandler={true}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};

export default LlmPerformanceChart;
