'use client';

import React, { useMemo } from 'react';
import { Box } from '@mui/material';
import { EChartsOption } from 'echarts';
import ReactECharts from 'echarts-for-react';
import { withDefaults } from '@/hooks/defaultChartOption';

interface FlatRow {
  channel: string;
  status: 'Churners' | 'Non-Churners';
  value: number | string;
}

interface UsageChartProps {
  title?: string;
  xLabel: string;
  yLabel?: string;
  data: FlatRow[];
  color?: {
    churners: string;
    nonChurners: string;
  };
  type: 'bar' | 'line';
}

const UsageChart: React.FC<UsageChartProps> = ({
  title='',
  xLabel,
  yLabel,
  data,
  color = {
    churners: '#e74c3c',
    nonChurners: '#2ecc71',
  },
  type,
}) => {
  const { xData, yData } = useMemo(() => {
    const xSet = new Set<string>();
    const churnMap = new Map<string, number>();
    const nonChurnMap = new Map<string, number>();

    data?.forEach(({ channel, status, value }) => {
      const numVal = typeof value === 'string' ? parseFloat(value) : value;
      xSet.add(channel);
      if (status === 'Churners') churnMap.set(channel, numVal);
      else nonChurnMap.set(channel, numVal);
    });

    const xLabels = Array.from(xSet);
    const churners: number[] = [];
    const nonChurners: number[] = [];

    xLabels.forEach((label) => {
      churners.push(churnMap.get(label) ?? 0);
      nonChurners.push(nonChurnMap.get(label) ?? 0);
    });

    return {
      xData: xLabels,
      yData: { churners, nonChurners },
    };
  }, [data]);

  const option: EChartsOption = {
    title: {
      text: title,
      left: 'center',
      textStyle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2c3e50',
      },
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
    },
    legend: {
      data: ['Churners', 'Non-Churners'],
      
    },
    xAxis: {
      type: 'category',
      data: xData,
      name: xLabel,
      nameLocation: 'middle',
      nameGap: 30,
    },
    yAxis: {
      type: 'value',
      name: yLabel ?? 'Count',
      nameGap: 20,
    },
    series: [
      {
        name: 'Churners',
        type,
        stack: 'total',
        data: yData.churners,
        itemStyle: { color: color.churners },
      },
      {
        name: 'Non-Churners',
        type,
        stack: 'total',
        data: yData.nonChurners,
        itemStyle: { color: color.nonChurners },
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
