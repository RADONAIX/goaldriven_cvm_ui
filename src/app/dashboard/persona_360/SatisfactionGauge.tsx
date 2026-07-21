import React from 'react';
import { Box, Card, CardContent, Grid, Typography } from '@mui/material';
import { EChartsOption } from 'echarts'; // ✅ Correct import
import ReactECharts from 'echarts-for-react';

interface SatisfactionGaugeProps {
  value: number;
}

const SatisfactionGauge: React.FC<SatisfactionGaugeProps> = ({ value }) => {
  const option: EChartsOption = {
    tooltip: {
      formatter: '{a} <br/>{b}: {c}',
    },
    series: [
      {
        name: '',
        type: 'gauge',
        min: 0,
        max: 10,
        splitNumber: 10,
        axisLine: {
          lineStyle: {
            width: 10,
            color: [
              [0.3, '#EF5350'],
              [0.7, '#FFCA28'],
              [1, '#66BB6A'],
            ],
          },
        },
        pointer: {
          width: 5,
        },
        axisTick: {
          length: 10,
        },
        splitLine: {
          length: 15,
          lineStyle: {
            color: '#aaa',
          },
        },
        axisLabel: {
          formatter: '{value}',
        },
        title: {
          fontSize: 16,
        },
        detail: {
          fontSize: 24,
          formatter: '{value}',
        },
        data: [
          {
            value: value ?? 0,
            name: 'Avg Satisfaction',
          },
        ],
      },
    ],
  };

  return (
    <Grid item xs={12}>
      <Box>
        <ReactECharts option={option} style={{ height: 400, width: '100%' }} />
      </Box>
    </Grid>
  );
};

export default SatisfactionGauge;
