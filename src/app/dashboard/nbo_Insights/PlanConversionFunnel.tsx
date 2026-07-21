'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Box } from '@mui/material';

const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });

type Props = {
  data: {
    'subscribers': string;
    'converted_with_nbo': string;
    'accepted': string;
  };
};

const PlanConversionFunnel = ({ data }: Props) => {
  if (!data) return <div>No data available</div>;
  const { subscribers, converted_with_nbo, accepted } = data;

  const option = {
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => `
        <strong>${params.name}</strong><br/>
        Value: ${params.value}<br/>
        Percent of first: ${params.percent}%
      `,
    },
    series: [
      {
        name: 'Conversion Funnel',
        type: 'funnel',
        left: 'center',
        top: 40,
        bottom: 20,
        width: '80%',
        min: 0,
        minSize: '20%',
        maxSize: '100%',
        sort: 'descending',
        gap: 20,
        label: {
          show: true,
          position: 'inside',
          fontSize: 14,
          fontWeight: 'bold',
          color: '#000',
          formatter: (params: any) => {
            return `${params.name}: ${params.value}`;
          },
        },
        labelLine: {
          show: false,
        },
        itemStyle: {
          borderColor: '#fff',
          borderWidth: 1,
        },
        data: [
          {
            name: 'Subscribers',
            value: subscribers,
            itemStyle: { color: '#d4ede9' },
          },
          {
            name: 'Target Customers Accepted',
            value: accepted,
            itemStyle: { color: '#a6dbc9' },
          },
          {
            name: 'Converted With NBO',
            value: converted_with_nbo,
            itemStyle: { color: '#5fb98b' },
          },
        ],
      },
    ],
  };

  return (
    <Box mt={3}>
      <ReactECharts option={option} style={{ height: 400, width: '100%' }} />
    </Box>
  );
};

export default PlanConversionFunnel;
