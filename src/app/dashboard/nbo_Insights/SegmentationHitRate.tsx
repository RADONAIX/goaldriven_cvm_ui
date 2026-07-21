// components/SegmentationHitRateChart.tsx
'use client';

import React, { useEffect, useState } from 'react';
import * as echarts from 'echarts';
import ReactECharts from 'echarts-for-react';
import { withDefaults } from '@/hooks/defaultChartOption';

const SegmentationHitRateChart = ({ data }: { data: { segment: string; hitRate: number }[] }) => {
  if (!data || data.length === 0) {
    return <div>No data available</div>;
  }
  const options = {
    tooltip: {
      trigger: 'axis',
      formatter: '{b}: {c}%',
    },
    xAxis: {
      type: 'category',
      name : 'Segments',
      nameLocation: 'middle',
      data: data.map((d) => d.segment),
      axisLabel: {
        rotate: 45,
        interval: 0,
      },
    },
    yAxis: {
      type: 'value',
      name: 'Hit Rate (%)',
    },
    series: [
      {
        type: 'bar',
        data: data.map((d) => d.hitRate),
        itemStyle: {
          color: '#5470C6',
        },
      },
    ],
  };

  return <ReactECharts option={withDefaults(options)} style={{ height: '400px', width: '100%' }} />;
};

export default SegmentationHitRateChart;
