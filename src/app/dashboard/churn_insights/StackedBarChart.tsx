import React, { useEffect, useState } from 'react';
import { EChartsOption } from 'echarts'; // ✅ Correct import
import ReactEcharts from 'echarts-for-react';
import { withDefaults } from '@/hooks/defaultChartOption';

interface props {
  data: any[];
  xLabelKey: string;
  series: any[];
  xLabel?: string;
  yLabel?: string;
}
const StackedBarChart: React.FC<props> = ({ data, xLabelKey, series , xLabel , yLabel }) => {
  const categories = data.map((item) => item[xLabelKey]);

  const chartSeries = series.map((s) => ({
    name: s.label,
    type: 'bar' as const,
    stack: 'total',
    label: { show: true },
    data: data.map((d) => d[s.key]),
    emphasis: {
      focus: 'series' as const,
    },
  }));

  const option: EChartsOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        // 'shadow' as default; can also be 'line' or 'shadow'
      },
    },
    legend: {},
    xAxis: {
      type: 'category',
      data: categories,
      name: xLabel || 'Category',
    },
    yAxis: {
      type: 'value',
      name: yLabel || 'Value',
    },
    series: chartSeries as EChartsOption['series'],
  };

  return (
    <>
      <ReactEcharts option={withDefaults(option)} style={{ height: 450 }} />
    </>
  );
};

export default StackedBarChart;
