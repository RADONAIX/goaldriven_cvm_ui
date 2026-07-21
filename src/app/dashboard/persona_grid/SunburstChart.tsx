'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Box } from '@mui/material';

import getSegmentDataForSunburst from '@/hooks/server-actions/persona-grid';
import InsightBox from '@/components/chartTitle';

// Dynamically import ECharts with no SSR
const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });

interface SunburstChartProps {
  handleInsightClick: (insight: any) => void;
}

const SunburstChart: React.FC<SunburstChartProps> = ({ handleInsightClick }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    getSegmentDataForSunburst()
      .then((fetchedData: any) => setData(fetchedData))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const option = {
    title: {
      // text: 'Usage Segmentation',
      left: 'center',
      top: 'top',
      textStyle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
      },
    },
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
        radius: [0, '80%'],
        label: {
          rotate: 'radial',
        },
        emphasis: {
          focus: 'ancestor',
        },
        itemStyle: {
          borderRadius: 7,
          borderWidth: 2,
        },
      },
    ],
  };

  return (
    <Box mt={2} mb={2} >
       <InsightBox
            title="Usage Segmentation"
            desc="This chart provides a detailed view of customer usage patterns across different segments in sunburst chart."
            data={data}
            onClick={handleInsightClick}
          />
      <ReactECharts option={option} style={{ height: 400 }} />
    </Box>
  );
};

export default SunburstChart;
