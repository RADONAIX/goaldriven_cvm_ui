import { Box } from '@mui/material';
import { EChartsOption } from 'echarts'; // ✅ Correct import
import ReactECharts from 'echarts-for-react';

interface Props {
  data: { name: string; value: number }[];
}
const TreeMap: React.FC<Props> = ({ data }) => {
  const treemapOption: EChartsOption = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} subscribers',
    },
    series: [
      {
        type: 'treemap',
        roam: false,
        breadcrumb: { show: false },
        data: data.map((item: { name: string; value: number }) => ({
          name: item.name,
          value: item.value,
          itemStyle: {
            borderColor: '#fff',
            borderWidth: 2,
            gapWidth: 1,
          },
        })),
        emphasis: {
          itemStyle: {
            borderWidth: 3,
            borderColor: '#f1c40f',
          },
        },
      },
    ],
  };

  return (
    <Box >
      <ReactECharts option={treemapOption} style={{ height: 400 }} />
    </Box>
  );
};

export default TreeMap;
