'use client';

import React from 'react';
import { EChartsOption } from 'echarts';
import ReactECharts from 'echarts-for-react';

interface SimplePieChartProps {
  data: { outerData: { value: number; name: string }[]; innerData: { value: number; name: string }[] };
  title?: string;
  seriesName?: string;
  onEventsFunc?: any;
}

const SimplePieChart: React.FC<SimplePieChartProps> = ({ data, title = '', onEventsFunc }) => {
  const option: EChartsOption = {
    title: {
      text: title,
      left: 'center',
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)',
    },
    legend: {
      show: false,
    },
    series: [
      {
        name: 'User Type',
        type: 'pie',
        radius: [0, '35%'],
        label: {
          position: 'inner',
          fontSize: 14,
        },
        data: data?.innerData,
      },
      {
        name: 'Churn Breakdown',
        type: 'pie',
        radius: ['37%', '67%'],
        label: {
          formatter: '{b}: {c} ({d}%)',
        },
        data: data?.outerData,
      },
    ],
  };

  return (
    <ReactECharts
      option={option}
      style={{ height: 400 }}
      onEvents={onEventsFunc ? { click: onEventsFunc } : undefined}
    />
  );
};

export default SimplePieChart;
