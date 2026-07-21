'use client';

import React from 'react';
import { Box } from '@mui/material';
import { EChartsOption } from 'echarts';
import ReactECharts from 'echarts-for-react';
import { withDefaults } from '@/hooks/defaultChartOption';

interface UsageChartProps {
  xLabel: string;
  yLabel?: string;
  xData: (string | number)[];
  yData: number[];
  color: string;
  type: 'line' | 'bar';
}

const UsageChart: React.FC<UsageChartProps> = ({ title, xLabel, yLabel, xData, yData, color, type }) => {
  const option: EChartsOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
      },
    },
    xAxis: {
      type: 'category',
      data: xData,
      nameLocation: 'middle',
      name: xLabel,
      nameGap: 30,
    },
    yAxis: {
      type: 'value',
      name: yLabel ?? 'Count',
      nameLocation: 'end',
      min: 'dataMin',
      nameGap: 20,
    },
    series: [
      {
        data: yData,
        type: type ?? 'line',
        itemStyle: {
          color: color,
        },
        smooth: false,
        lineStyle: {
          width: 3,
        },
      },
    ],
  };
  return (
    <Box>
      <ReactECharts option={withDefaults(option)} style={{ height: 400, width: '100%' }} />
    </Box>
  );
};

export default UsageChart;
