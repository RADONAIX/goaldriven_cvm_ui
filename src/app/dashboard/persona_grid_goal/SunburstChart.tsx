'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Box } from '@mui/material';

import getSegmentDataForSunburstRet from '@/hooks/server-actions/persona-grid-ret';
import InsightBox from '@/components/chartTitle';

// Dynamically import ECharts with no SSR
const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });

interface SunburstChartProps {
  handleInsightClickRetention: (payload : any) => void;
}

const SunburstChart: React.FC<SunburstChartProps> = ({ handleInsightClickRetention }) => {
  const [data, setData] = useState<any>(null);
  console.log('data', data);
  useEffect(() => {
    getSegmentDataForSunburstRet()
      .then((fetchedData: any) => {
        console.log( 'usage seg' , fetchedData)
        setData(fetchedData);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const option = {
    tooltip: {
      trigger: 'item',
      formatter: function (params: any) {
        return `
            <b>${params.name}</b><br/>
            Usage: ${params.value}<br/>
          `;
      },
    },

    series: [
      {
        type: 'sunburst',
        data: data,
        radius: [0, '85%'],
        nodeClick: 'rootToNode',
        label: {
          rotate: 'radial',
          overflow: 'truncate', // NEW: truncate labels
          ellipsis: '…',
          minAngle: 10, // NEW: hide label if slice angle is too small
          color: '#444',
          fontSize: 12,
          formatter: function (params: any) {
            // Only show if value is not too small
            if (params.value < 10 || params.name.length > 10) return ''; // You can tweak these thresholds
            return `${params.name}\n${params.value}`;
          },
        },

       emphasis: {
          focus: 'ancestor',
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0,0,0,0.3)',
          },
        },
        itemStyle: {
          borderRadius: 8,
          borderWidth: 2,
          borderColor: '#fff',
        },
        levels: [
          {
            // Root node (center)
            r0: '0%',
            r: '10%',
            label: {
              show: false,
            },
          },
          {
            // Churned / Not churned
            r0: '10%', // ✅ Starts *after* the root node
            r: '40%',
            label: {
              rotate: 0,
              fontSize: 14,
              color: '#000',
            },
            itemStyle: {
              borderWidth: 3,
            },
          },
         
        ],
      },
    ],
  };
  if (!data) {
    return <div>Loading...</div>; // or a loading spinner
  }

  return (
    <Box mt={2} mb={2}>
      <InsightBox
              title="Usage Segmentation"
              desc="This chart visualizes the distribution of subscribers based on their usage patterns, segmented by churn status using sunburst visualization."
              data={data}
              onClick={handleInsightClickRetention}
            />
      <ReactECharts option={option} style={{ height: 400 }} />
    </Box>
  );
};

export default SunburstChart;
