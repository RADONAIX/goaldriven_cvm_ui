'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Box } from '@mui/material';

import { getRevenueOnPlanType } from '@/hooks/server-actions/persona-grid';
import InsightBox from '@/components/chartTitle';

const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });

interface Props {
  handleInsightClick: (insight: any) => void;
}

const FunnelChart: React.FC<Props> = ({ handleInsightClick }) => {
  const [funnelData, setFunnelData] = useState([]);

  useEffect(() => {
    getRevenueOnPlanType()
      .then((data: any) => setFunnelData(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} USD',
    },
    legend: {
      orient: 'horizontal',
      data: funnelData.map((item: any) => item.name),
    },
    series: [
      {
        type: 'funnel',
        left: '10%',
        width: '80%',
        height: '80%',
        data: funnelData,
        label: {
          show: true,
          position: 'inside',
          formatter: '{b}: {c} USD',
          color: '#fff',
        },
        itemStyle: {
          borderColor: '#fff',
          borderWidth: 2,
        },
        emphasis: {
          label: {
            fontSize: 20,
            fontWeight: 'bold',
            color: '#f39c12',
          },
          itemStyle: {
            borderColor: '#f39c12',
            borderWidth: 4,
            color: '#f39c12',
          },
        },
      },
    ],
  };

  return (
    <Box mt={3}>
      <InsightBox
        title="Revenue per Plan Type"
        desc="This chart provides a detailed view of revenue distribution across different plan types using funnel chart."
        data={funnelData}
        onClick={handleInsightClick}
      />
      <ReactECharts option={option} style={{ height: 400 }} />
    </Box>
  );
};

export default FunnelChart;
