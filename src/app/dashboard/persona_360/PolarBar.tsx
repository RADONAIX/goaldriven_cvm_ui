'use client';

import React from 'react';
import { Box, Grid } from '@mui/material';
import { EChartsOption } from 'echarts';
import ReactECharts from 'echarts-for-react';

interface UsageChartProps {
  title: string;
  yLabel?: string;
  axisLabel: (string | number)[];
  axisData: (number | string)[];
}

const PolarBar: React.FC<UsageChartProps> = ({ title, axisLabel, axisData }) => {
  const option: EChartsOption = {
    title: [
      {
        text: title,
        left: 'center',
        textStyle: {
          fontSize: 18,
          fontWeight: 'bold',
        },
      },
    ],
    polar: {
      radius: [30, '80%'],
    },
    angleAxis: {
      max: 1,
      startAngle: 75,
    },
    radiusAxis: {
      type: 'category',
      data: axisLabel,
      axisLabel: {
        show: false, // ⛔ hides the text around the chart
      },
      axisLine: {
        show: true,
      },
      axisTick: {
        show: true,
      },
    },
    tooltip: {},
    series: {
      type: 'bar',
      data: axisData,
      coordinateSystem: 'polar',
    },
  };

  return (
    <Grid item xs={12} sm={6} md={7}>
      <Box>
        <ReactECharts option={option} style={{ height: 400 }} />
      </Box>
    </Grid>
  );
};

export default PolarBar;
