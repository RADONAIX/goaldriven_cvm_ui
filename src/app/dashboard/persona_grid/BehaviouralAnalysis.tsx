'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, Grid, Typography } from '@mui/material';
import { fontWeight } from '@mui/system';
import ReactECharts from 'echarts-for-react';

import { getBehaviourAnalysisCharts } from '@/hooks/server-actions/ml-apis';
import InsightBox from '@/components/chartTitle';

interface Segment {
  segment_id: number;
  segment_name: string;
  promotion_score: number;
  stickiness_score: number;
  arpu: number;
  customer_count: number;
}

const segmentData: Segment[] = [
  {
    segment_id: 0,
    segment_name: '💫 Hyper-Loyal Champions',
    promotion_score: 1,
    stickiness_score: 0.99,
    arpu: 352.57,
    customer_count: 36,
  },
  {
    segment_id: 1,
    segment_name: '💎 Hyper-Premium Devotees',
    promotion_score: 0,
    stickiness_score: 0.99,
    arpu: 390.4,
    customer_count: 52,
  },
  {
    segment_id: 3,
    segment_name: '💎 Valued Guardians',
    promotion_score: 0.23,
    stickiness_score: 0.75,
    arpu: 344.02,
    customer_count: 20,
  },
  {
    segment_id: 5,
    segment_name: '💫 Hyper-Engaged Patrons',
    promotion_score: 0.5,
    stickiness_score: 0.92,
    arpu: 3667.74,
    customer_count: 5,
  },
  {
    segment_id: 2,
    segment_name: '💎 Hyper-Engaged Connoisseurs',
    promotion_score: 0.62,
    stickiness_score: 0.96,
    arpu: 333.56,
    customer_count: 21,
  },
  {
    segment_id: 4,
    segment_name: '💕 Hyper-Engaged Connoisseurs',
    promotion_score: 0.5,
    stickiness_score: 0.99,
    arpu: 367.21,
    customer_count: 86,
  },
];
const BehavioralAnalysis: React.FC = () => {
  const [chartsData, setChartsData] = useState<any[]>(segmentData);
  const fetchData = () => {
    getBehaviourAnalysisCharts()
      .then((res) => {
        setChartsData(res?.data);
      })
      .catch((err) => {
        console.log('err', err);
      });
  };
  useEffect(() => {
    fetchData();
  }, []);

  const chartOptions = (segment: Segment): any => ({
    tooltip: {
      trigger: 'axis',
    },
    grid: {
      top: 20,
      bottom: 40,
      left: 30,
      right: 20,
      containLabel: true,
    },

    xAxis: {
      type: 'category',
      data: ['Promotion Score', 'Stickiness Score', 'ARPU'],
      name: 'Metric',
      nameLocation: 'middle',
      nameGap: 30,
      nameTextStyle: {
        fontSize: 14,
        color: '#333',
        fontWeight: 'bold',
      },
      axisLabel: {
        show: true,
        rotate: 0, // optional: add rotation if cramped
        fontSize: 12,
        color: '#333',
      },
    },
    yAxis: {
      type: 'value',
      name: 'Value',
      nameLocation: 'middle',
      nameGap: 38,
      nameTextStyle: {
        fontSize: 14,
        color: '#333',
        fontWeight: 'bold',
      },

      axisLabel: {
        fontSize: 12,
        color: '#333',
      },
    },
    series: [
      {
        name: segment.segment_name,
        type: 'bar',
        data: [
          (segment.promotion_score * 100).toFixed(2),
          (segment.stickiness_score * 100).toFixed(2),
          segment.arpu.toFixed(2),
        ],
        itemStyle: {
          color: function (params: { dataIndex: number }) {
            const colors = ['#E01F54', '#001852', '#6B769F', '#CAE7DA'];
            return colors[params.dataIndex];
          },
        },
      },
    ],
  });

  return (
    <Grid container spacing={2} mb={3} justifyContent="center">
      {chartsData.map((segment) => (
        <Grid item xs={12} sm={6} md={4} key={segment.segment_id}>
          <Card sx={{ padding: 2, paddingBottom: 0 }}>
            <Typography
              variant="subtitle1"
              fontWeight={600}
              gutterBottom
              sx={{ textAlign: 'center', mb: 1, color: 'text.primary' }}
            >
              {segment.segment_name}
            </Typography>

            <ReactECharts option={chartOptions(segment)} style={{ height: 300 }} />
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default BehavioralAnalysis;
