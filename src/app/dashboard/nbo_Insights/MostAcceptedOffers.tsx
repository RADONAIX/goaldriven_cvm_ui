'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Box } from '@mui/material';
import { EChartsOption } from 'echarts-for-react';
import { withDefaults } from '@/hooks/defaultChartOption';

// Dynamically import ECharts with no SSR
const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });

type OfferData = {
  pack_name: string;
  count: number;
};

type Props = {
  data: OfferData[];
};

const MostAcceptedOffers = ({ data }: Props) => {
  if (!data || data.length === 0) {
    return <div>No data available</div>;
  }

  interface YAxis {
    type: 'category';
    data: string[];
    axisLabel: {
      interval: number;
      formatter: (value: string) => string;
    };
  }

  interface Series {
    name: string;
    type: 'bar';
    data: number[];
    itemStyle: {
      color: string;
    };
    label: {
      show: boolean;
      position: 'right';
    };
  }

  const option: EChartsOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
    },
    grid: {
      left: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'value',
      name: 'Accepted Count',
    },
    yAxis: {
      type: 'category',
      name : 'Pack Name',
      nameGap: 130,
      data: data.map((item) => item.pack_name),
      axisLabel: {
        interval: 0,
        formatter: (value: string) => (value.length > 20 ? value.slice(0, 20) + '...' : value),
      },
    } as YAxis,
    series: [
      {
        name: 'Accepted Count',
        type: 'bar',
        data: data.map((item) => item.count),
        itemStyle: {
          color: '#27ae60',
        },
        label: {
          show: true,
          position: 'right',
        },
      },
    ] as Series[],
  };

  return <ReactECharts option={withDefaults(option)} style={{ height: 400 }} />;
};

export default MostAcceptedOffers;
