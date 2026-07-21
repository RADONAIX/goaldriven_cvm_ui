'use client';

import React from 'react';
import { Box, Grid } from '@mui/material';
import { EChartsOption } from 'echarts';
import ReactECharts from 'echarts-for-react';

interface SatisfactionGaugeProps {
  churnerValue: number;
  nonChurnerValue: number;
}

const SatisfactionGauge: React.FC<SatisfactionGaugeProps> = ({ churnerValue, nonChurnerValue }) => {
  const gaugeData = [
    {
      value: churnerValue ?? 0,
      name: 'Churners',
      itemStyle: {
        color: '#ef5350',
      },
      title: {
        offsetCenter: ['0%', '-30%'],
        color: '#ef5350',
      },
      detail: {
        valueAnimation: true,
        offsetCenter: ['0%', '-15%'],
        color: '#ef5350',
        formatter: '{value}',
      },
    },
    {
      value: nonChurnerValue ?? 0,
      name: 'Non-Churners',
      itemStyle: {
        color: '#66bb6a',
      },
      title: {
        offsetCenter: ['0%', '20%'],
        color: '#66bb6a',
      },
      detail: {
        valueAnimation: true,
        offsetCenter: ['0%', '35%'],
        color: '#66bb6a',
        formatter: '{value}',
      },
    },
  ];

  const option: EChartsOption = {
    series: [
      {
        type: 'gauge',
        min: 0,
        max: 10,
        startAngle: 90,
        endAngle: -270,
        pointer: { show: false },
        progress: {
          show: true,
          overlap: false,
          roundCap: true,
          clip: false,
          itemStyle: {
            borderWidth: 2,
            borderColor: '#fff',
          },
        },
        axisLine: {
          lineStyle: {
            width: 30,
          },
        },
        splitLine: { show: false },
        axisTick: { show: false },
        axisLabel: { show: false },
        data: gaugeData,
        title: {
          fontSize: 14,
        },
        detail: {
          width: 50,
          height: 14,
          fontSize: 14,
        },
      },
    ],
  };

  return (
    <Box>
      <ReactECharts option={option} style={{ height: 400, width: '100%' }} />
    </Box>
  );
};

export default SatisfactionGauge;
