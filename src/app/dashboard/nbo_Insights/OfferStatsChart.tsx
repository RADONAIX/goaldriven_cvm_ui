'use client';

import React, { useEffect, useRef } from 'react';
import { EChartsOption } from 'echarts';
import ReactECharts from 'echarts-for-react';
import { withDefaults } from '@/hooks/defaultChartOption';

type Props = {
  data: any;
};

export const OfferStatsChart: React.FC<Props> = ({ data }) => {
  if (!data || data.length === 0) {
    return <div>No data available</div>;
  }

  interface OfferStatsData {
    age_group: string;
    offer_accepted: number;
    offer_rejected: number;
  }

  const lineOption: EChartsOption = {
    tooltip: { trigger: 'axis' },
    legend: { data: ['Offer accepted', 'Offer rejected'], top: 30 },
    xAxis: { type: 'category', name: 'Age', data: data.map((res: OfferStatsData) => res.age_group),  },
    yAxis: { type: 'value', name: 'Count',  },
    series: [
      {
        name: 'Offer accepted',
        type: 'line',
        data: data.map((res: OfferStatsData) => res.offer_accepted),
        smooth: false,
        color: '#e74c3c',
      },
      {
        name: 'Offer rejected',
        type: 'line',
        data: data.map((res: OfferStatsData) => res.offer_rejected),
        smooth: false,
        color: '#27ae60',
      },
    ],
  };

  return <ReactECharts option={withDefaults(lineOption)} style={{ height: 400 }} />;
};
