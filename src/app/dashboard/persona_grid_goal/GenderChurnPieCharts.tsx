'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Box, CircularProgress, Paper, Typography } from '@mui/material';

import { getGenderChurnSunburst } from '@/hooks/server-actions/persona-grid-ret';
import InsightBox from '@/components/chartTitle';

// Dynamically import ECharts with no SSR
const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });

interface GenderChurnSunburstProps {
  handleInsightClickRetention: (payload: any) => void;
}

const GenderChurnSunburst: React.FC<GenderChurnSunburstProps> = ({ handleInsightClickRetention }) => {
  const [sunburstData, setSunburstData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getGenderChurnSunburst()
      .then((data: any[]) => {
        const genderMap: any = {};

        data.forEach(({ gender, churn_status, value }) => {
          if (!genderMap[gender]) {
            genderMap[gender] = {
              name: gender,
              children: [],
            };
          }
          genderMap[gender].children.push({
            name: churn_status,
            value: parseInt(value),
          });
        });

        const transformed = Object.values(genderMap);
        console.log('age distribution', transformed);

        setSunburstData(transformed);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Sunburst data error:', err);
        setLoading(false);
      });
  }, []);

  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}',
    },
    series: [
      {
        type: 'sunburst',
        radius: [0, '80%'],
        data: sunburstData,
        label: {
          rotate: 'radial',
          fontSize: 12,
          color: '#333',
        },
        itemStyle: {
          borderRadius: 8,
          borderWidth: 2,
          borderColor: '#fff',
        },
        emphasis: {
          focus: 'ancestor',
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0,0,0,0.3)',
          },
        },
      },
    ],
  };

  return (
    <Box>
      <InsightBox
        title="Gender Distribution"
        desc="This chart shows the distribution of churned and non-churned customers by gender using a sunburst visualization."
        data={sunburstData}
        onClick={handleInsightClickRetention}
      />
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}>
          <CircularProgress />
        </Box>
      ) : (
        <ReactECharts option={option} style={{ height: 400 }} />
      )}
    </Box>
  );
};

export default GenderChurnSunburst;
