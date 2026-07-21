'use client';

import React from 'react';
import { Grid, Typography } from '@mui/material';
import { EChartsOption } from 'echarts';
import ReactECharts from 'echarts-for-react';
import { withDefaults } from '@/hooks/defaultChartOption';

interface MultiLineChartProps {
  data: {
    [key: string]: {
      months: string[];
      revenue: (number | string)[];
    };
  };
  xLabel: string;
  yLabel: string;
}

const MultiLineChart: React.FC<MultiLineChartProps> = ({ data, xLabel, yLabel }) => {
  if (!data || Object.keys(data).length === 0) {
    return <Typography>No data available</Typography>;
  }

  const seriesNames = Object.keys(data);
  const xAxisLabels = data[seriesNames[0]].months;

  const colors = [
    '#1976d2',
    '#ff9800',
    '#43a047',
    '#f44336',
    '#3f51b5',
    '#9c27b0',
    '#00acc1',
    '#ff7043',
    '#66bb6a',
    '#ef5350',
  ];

  const series = seriesNames.map((name, index) => ({
    name,
    type: 'line' as const,
    data: data[name].revenue.map((v) => (typeof v === 'string' ? parseFloat(v) : v)),
    smooth: true,
    lineStyle: { color: colors[index % colors.length] },
    itemStyle: { color: colors[index % colors.length] }, // ✅ add this
  }));

  const option: EChartsOption = {
   
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: seriesNames,
      orient: 'horizontal',
      left: 'center',
    },
    xAxis: {
      type: 'category',
      name: xLabel,
      data: xAxisLabels,
    },
    yAxis: {
      type: 'value',
      name: yLabel,
      nameLocation:'end',
      nameGap: 22,
    },
    series,
  };

  return (
    <Grid item xs={12}>
      <ReactECharts option={withDefaults(option)} style={{ height: 400 }} />
    </Grid>
  );
};

export default MultiLineChart;
