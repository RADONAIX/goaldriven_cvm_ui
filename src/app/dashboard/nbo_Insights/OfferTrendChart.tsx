'use client';

import React, { useEffect } from 'react';
import { EChartsOption } from 'echarts';
import ReactECharts from 'echarts-for-react';

import InsightBox from '@/components/chartTitle';
import { withDefaults } from '@/hooks/defaultChartOption';

type OfferTrendData = {
  date: string; // format: YYYY-MM-DD
  offer_accepted: number;
  offer_rejected: number;
};

// Dummy data for the last 30 days
const generateDummyData = (): OfferTrendData[] => {
  const today = new Date();
  const data: OfferTrendData[] = [];

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const isoDate = date.toISOString().split('T')[0];

    // Random dummy counts
    const accepted = Math.floor(Math.random() * 50 + 50); // 50-100
    const rejected = Math.floor(Math.random() * 30 + 20); // 20-50

    data.push({
      date: isoDate,
      offer_accepted: accepted,
      offer_rejected: rejected,
    });
  }

  return data;
};

interface Props {
  handleInsightClick: (insight: any) => void;
}
const OfferTrendChart: React.FC<Props> = ({ handleInsightClick }) => {
  const [data, setData] = React.useState<OfferTrendData[]>([]);
  useEffect(() => {
    setData(generateDummyData());
  }, []);

  const chartOptions: EChartsOption = {
    tooltip: { trigger: 'axis' },
    legend: { data: ['Offers Accepted', 'Offers Rejected'], top: 30 },
    xAxis: {
      type: 'category',
      name: 'Date',
      nameGap: 38,
      data: data.map((item) => item.date),

      nameLocation: 'middle',

      nameTextStyle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#555',
      },
      axisLabel: {
       
        fontSize: 11,
        color: '#444',
      },
      axisLine: {
        lineStyle: {
          color: '#aaa',
        },
      },
    },
    yAxis: {
      type: 'value',
      name: 'Count',
      nameGap: 40,
      nameLocation: 'middle',
      nameTextStyle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#555',
      },
      axisLabel: {
        fontSize: 12,
        color: '#444',
      },
      axisLine: {
        lineStyle: {
          color: '#aaa',
        },
      },
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: '#ddd',
        },
      },
    },
    series: [
      {
        name: 'Offers Accepted',
        type: 'line',
        data: data.map((item) => item.offer_accepted),
        color: '#2ecc71',
      },
      {
        name: 'Offers Rejected',
        type: 'line',
        data: data.map((item) => item.offer_rejected),
        color: '#e74c3c',
      },
    ],
  };

  return (
    <>
      <InsightBox title="Offer Trends (Last 30 Days)" desc="" data={data} onClick={handleInsightClick} />
      <ReactECharts option={withDefaults(chartOptions)} style={{ height: 400 }} />
    </>
  );
};

export default OfferTrendChart;
