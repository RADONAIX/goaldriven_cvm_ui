'use client';

import React from 'react';
import ReactECharts from 'echarts-for-react';
import { EChartsOption } from 'echarts';

interface SimplePieChartProps {
  data: { value: number; name: string }[];
  seriesName?: string;
  onEventsFunc?: any;
}

const SimplePieChart: React.FC<SimplePieChartProps> = ({
  data,
  seriesName = 'Value',
  onEventsFunc,
}) => {
  const option: EChartsOption = {
   
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)',
    },
    legend: {
      orient: 'horizontal',
      data: data?.map(item => item.name),
    },
    series: [
      {
        name: seriesName,
        type: 'pie',
        radius: '60%',
        data: data,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
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
