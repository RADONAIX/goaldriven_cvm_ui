'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Box } from '@mui/material';

import { getRevenueOnPlanTypeRet } from '@/hooks/server-actions/persona-grid-ret';
import InsightBox from '@/components/chartTitle';

const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });

interface FunnelChartProps {
  handleInsightClickRetention: (payload: any) => void;
}

interface FunnelDataItem {
  name: string;
  value: number;
  [key: string]: any;
}

interface FunnelData {
  churnedData: FunnelDataItem[];
  notChurnedData: FunnelDataItem[];
}

const FunnelChart: React.FC<FunnelChartProps> = ({ handleInsightClickRetention }) => {
  const [funnelData, setFunnelData] = useState<FunnelData>({
    churnedData: [],
    notChurnedData: [],
  });
  useEffect(() => {
    getRevenueOnPlanTypeRet()
      .then((data) => {
        setFunnelData(data);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const { churnedData, notChurnedData } = funnelData;

  if (!churnedData?.length && !notChurnedData?.length) {
    return <div>Loading...</div>;
  }
  const funnelColors = [
    ['#4F81BD', '#6BAED6'], // Blue gradient (Top)
    ['#9BBB59', '#A1D99B'], // Green gradient
    ['#FCD116', '#FECB52'], // Yellow gradient
    ['#ED7D31', '#F4A261'], // Orange gradient
    ['#C0504D', '#E76F51'], // Red gradient (Bottom)
  ];

  // Create gradient from top to bottom
  const createGradient = (color1, color2) => ({
    type: 'linear',
    x: 0,
    y: 0,
    x2: 0,
    y2: 1,
    colorStops: [
      { offset: 0, color: color1 },
      { offset: 1, color: color2 },
    ],
  });

  const option = {
    title: [
      { text: 'Not Churned Revenue', left: '5%' },
      { text: 'Churned Revenue', left: '55%',  },
    ],
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} USD',
    },
    series: [
      {
        name: 'Not Churned - Funnel',
        type: 'funnel',
        left: '5%',
        top: '10%',
        width: '40%',
        height: '100%',
        sort: 'descending',
        label: { position: 'inside', color: '#fff' },
        itemStyle: { borderColor: '#fff', borderWidth: 1 },
        data: notChurnedData.map((item, index) => ({
          ...item,
          itemStyle: {
            color: createGradient(
              funnelColors[index % funnelColors.length][0],
              funnelColors[index % funnelColors.length][1]
            ),
          },
        })),
      },
      {
        name: 'Churned',
        type: 'funnel',
        left: '55%',
        top: '10%',
        width: '40%',
        height: '100%',
        sort: 'descending',
        label: { position: 'inside', color: '#fff' },
        itemStyle: { borderColor: '#fff', borderWidth: 1 },
        data: churnedData.map((item, index) => ({
          ...item,
          itemStyle: {
            color: createGradient(
              funnelColors[index % funnelColors.length][0],
              funnelColors[index % funnelColors.length][1]
            ),
          },
        })),
      },
    ],
  };

  return (
    <Box mt={3}>
      <InsightBox
        title="Revenue per Plan Type"
        desc="This chart shows the revenue generated from different plan types, segmented by churned and not churned customers using funnel visualization."
        data={funnelData}
        onClick={handleInsightClickRetention}
      />
      <ReactECharts option={option} style={{ height: 400 }} />
    </Box>
  );
};

export default FunnelChart;
