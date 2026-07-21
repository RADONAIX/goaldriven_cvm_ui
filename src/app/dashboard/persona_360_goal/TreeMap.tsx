'use client';

import { Box } from '@mui/material';
import { EChartsOption } from 'echarts';
import ReactECharts from 'echarts-for-react';

interface RawData {
  channel: string;
  status: 'Churners' | 'Non-Churners';
  value: number;
}

interface TreeMapData {
  name: string;
  itemStyle?: { color: string };
  children: {
    name: string;
    value: number;
    itemStyle: { color: string };
  }[];
}

interface Props {
  data: RawData[];
}

const TreeMap: React.FC<Props> = ({ data }) => {
  // 1. Define color map
  const baseColorMap: Record<string, { churner: string; nonChurner: string; total: string }> = {
    Email: {
      churner: '#c0392b',
      nonChurner: '#f1948a',
      total: '#e74c3c',
    },
    SMS: {
      churner: '#8e44ad',
      nonChurner: '#d2b4de',
      total: '#9b59b6',
    },
    Call: {
      churner: '#00264d',
      nonChurner: '#66b3ff',
      total: '#80bfff',
    },
    'App Notification': {
      churner: '#16a085',
      nonChurner: '#a3e4d7',
      total: '#1abc9c',
    },
  };

  // 2. Build nested data with styled children
  const map = new Map<string, TreeMapData>();

  data.forEach(({ channel, status, value }) => {
    const colors = baseColorMap[channel] || {
      churner: '#f1f2f3',
      nonChurner: '#f0f3f4',
      total: '#f0f3f4',
    };

    if (!map.has(channel)) {
      map.set(channel, {
        name: channel,
        itemStyle: { color: colors.total },
        children: [],
      });
    }

    map.get(channel)!.children.push({
      name: status,
      value,
      itemStyle: {
        color: status === 'Churners' ? colors.churner : colors.nonChurner,
      },
    });
  });

  // 3. Append totals in labels
  const nestedData: TreeMapData[] = Array.from(map.entries()).map(([channel, group]) => {
    const total = group.children.reduce((sum, item) => sum + Number(item.value), 0);
    return {
      ...group,
      value: total,
    };
  });

  // 4. Chart config
  const treemapOption: EChartsOption = {
    tooltip: {
      trigger: 'item',
      formatter: (info: any) => {
        const isLeaf = info.treePathInfo.length > 1;
        return isLeaf ? `${info.name}: <b>${info.value}</b> users` : `${info.name}`;
      },
    },
    series: [
      {
        type: 'treemap',
        roam: false,
        breadcrumb: { show: false },
        label: {
          show: true,
          formatter: '{b}',
          fontSize: 14,
        },
        upperLabel: {
          show: true,
          height: 24,
        },
        itemStyle: {
          borderWidth: 0,
        },
        emphasis: {
          itemStyle: {
            borderColor: '#f2f2f2',
            borderWidth: 2,
          },
        },
        data: nestedData,
      },
    ],
  };

  return (
    <Box>
      <ReactECharts option={treemapOption} style={{ height: 420 }} />
    </Box>
  );
};

export default TreeMap;
