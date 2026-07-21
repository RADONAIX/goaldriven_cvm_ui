'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts'; // ✅ Import the type

import InsightBox from '../chartTitle';

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

interface Props {
  handleInsightClick: (params: { title: string; desc: string; data: any }) => void;
}

export const AccuracyChart: React.FC<Props> = ({ handleInsightClick }) => {
  const [chartReady, setChartReady] = React.useState(false);

  React.useEffect(() => {
    setChartReady(true);
  }, []);

  const options: ApexOptions = {
    chart: {
      height: 350,
      type: 'line', // ✅ Allowed string value
      //   dropShadow: {
      //     enabled: true,
      //     color: '#000',
      //     top: 18,
      //     left: 7,
      //     blur: 10,
      //     opacity: 0.5,
      //   },
      zoom: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
    },
    colors: ['#77B6EA', '#545454'],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'straight',
    },
    // grid: {
    //   borderColor: '#e7e7e7',
    //   row: {
    //     colors: ['#f3f3f3', 'transparent'],
    //     opacity: 0.5,
    //   },
    // },
    markers: {
      size: 0,
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      title: {
        text: 'Month',
      },
    },
    yaxis: {
      title: {
        text: 'Accuracy',
      },
      min: 5,
      max: 40,
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      floating: true,
      offsetY: -25,
      offsetX: -5,
    },
  };

  const series = [
    {
      name: 'Champion',
      data: [28, 29, 33, 36, 32, 32, 33],
    },
    {
      name: 'Challenger',
      data: [12, 11, 14, 18, 17, 13, 13],
    },
  ];

  return (
    <div>
      <InsightBox
        title="Models Monthly Accuracy Trend"
        desc="This chart shows the monthly accuracy trend of different models."
        data={series}
        onClick={handleInsightClick}
      />

      {chartReady && <ReactApexChart options={options} series={series} type="line" height={350} width="100%" />}
    </div>
  );
};
