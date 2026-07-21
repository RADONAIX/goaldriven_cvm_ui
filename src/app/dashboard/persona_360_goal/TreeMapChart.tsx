// components/TreeChart.tsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import ReactECharts from 'echarts-for-react';

const TreeMapChart = ({ treeData }: { treeData: any[] }) => {
  const isLeafNode = (node: any) => {
    return !node?.children || node?.children?.length === 0;
  };

  const treeMapOption = {
    tooltip: {
      trigger: 'item',
      formatter: function (params: { name: string; value: number; data: any[] }) {
        if (isLeafNode(params.data)) {
          return `${params.name}: ${params.value} $`;
        }
        return `${params.name}`;
      },
    },
    series: [
      {
        type: 'tree',
        data: treeData,
        top: '-10%',
        left: '10%',
        bottom: '-10%',
        right: '10%',
        symbolSize: 20,
        label: {
          position: 'right',
          formatter: function (params: any) {
            if (isLeafNode(params.data)) {
              return `${params.data.value} $`;
            } else {
              return params.data.name;
            }
          },
        },
        itemStyle: {
          normal: {
            borderColor: '#fff',
            borderWidth: 2,
            gapWidth: 1,
            color: '#87CEEB',
          },
        },
        emphasis: {
          itemStyle: {
            borderWidth: 3,
            borderColor: '#FFD700',
          },
        },
        lineStyle: {
          color: '#ccc',
          width: 1,
          type: 'solid',
        },
        initialTreeDepth: 2,
        children: true,
      },
    ],
  };

  return <ReactECharts option={treeMapOption} style={{ height: 500 }} />;
};

export default TreeMapChart;
