'use client';

import React from 'react';
import { EChartsOption } from 'echarts';
import ReactECharts from 'echarts-for-react';

export default function BarChart() {
  const option: EChartsOption = {
    title: {
      text: 'Weekly Sales',
    },
    tooltip: {},
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: 'Sales',
        type: 'bar',
        data: [120, 200, 150, 80, 70, 110, 130],
      },
    ],
  };

  return (
    <div>
      <ReactECharts option={option} style={{ height: '400px', width: '100%' }} />
    </div>
  );
}
