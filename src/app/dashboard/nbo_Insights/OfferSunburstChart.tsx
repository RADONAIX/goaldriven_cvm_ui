import React from 'react';
import dynamic from 'next/dynamic';
import { Box } from '@mui/material';

const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });

type OfferData = {
  subscriber_type: string;
  total_offers_given: string;
  total_offers_accepted: string;
};

type Props = {
  data: OfferData[];
};

const OfferSunburstChart = ({ data }: Props) => {
  if (!data || data.length === 0) {
    return <div>No data available</div>;
  }

  const sunburstData = [
    {
      name: 'Offers',
      children: data.map((item) => {
        const isPostpaid = item.subscriber_type.toLowerCase() === 'postpaid';
        const totalGiven = parseInt(item.total_offers_given, 10);
        const totalAccepted = parseInt(item.total_offers_accepted, 10);

        return {
          name: item.subscriber_type,
          value: totalGiven,
          itemStyle: {
            color: isPostpaid ? '#4A90E2' : '#7ED321', // Blue for Postpaid, Green for Prepaid
          },
          children: [
            {
              name: 'Accepted',
              value: totalAccepted,
              itemStyle: {
                color: '#50E3C2', // Teal for Accepted
              },
            },
            {
              name: 'Not Accepted',
              value: totalGiven - totalAccepted,
              itemStyle: {
                color: '#F5A623', // Orange for Not Accepted
              },
            },
          ],
        };
      }),
    },
  ];

  const option = {
    tooltip: {
      trigger: 'item',
      formatter: function (params: any) {
        return `
          <b>${params.name}</b><br/>
          Usage: ${params.value}
        `;
      },
    },
    series: [
      {
        type: 'sunburst',
        data: sunburstData,
        radius: [0, '80%'],
        itemStyle: {
          borderRadius: 7,
          borderWidth: 2,
        },
        label: {
          rotate: 'radial',
        },
        emphasis: {
          focus: 'ancestor',
        },
      },
    ],
  };

  return (
    <Box mt={3}>
      <ReactECharts option={option} style={{ height: 400, width: '100%' }} />
    </Box>
  );
};

export default OfferSunburstChart;