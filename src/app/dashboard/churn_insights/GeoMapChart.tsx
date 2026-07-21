// components/GeoMapChart.tsx
import React, { useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import { MapChart } from 'echarts/charts';
import { TooltipComponent, VisualMapComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';

import usaJson from '../../../../public/geo/world.json'; // Make sure this path resolves

echarts.use([MapChart, TooltipComponent, VisualMapComponent, CanvasRenderer]);

// Register the map
echarts.registerMap('USA', usaJson as any);

type Props = {
  data: any;
};

const GeoMapChart: React.FC<Props> = ({ data }) => {
  const option = {
    // title: { text: 'Geographical Distribution of Churners' },
    tooltip: {
      trigger: 'item',
      formatter: '{b}<br/>Churn Rate: {c}%',
    },
    visualMap: {
      min: 0,
      max: 50,
      left: 'right',
      top: 'bottom',
      text: ['High', 'Low'],
      calculable: true,
      inRange: {
        color:["#ffe6cc", "#ffcc99", "#ff9966", "#ff6633", "#cc3300"]
      },
    },
    series: [
      {
        name: 'Churn Rate',
        type: 'map',
        map: 'USA',
        roam: true,
        emphasis: {
          label: {
            show: true,
          },
        },
        data: data,
      },
    ],
  };

  return (
    <>
      <ReactECharts option={option} style={{ height: 400, width: '100%' }} />
    </>
  );
};

export default GeoMapChart;
