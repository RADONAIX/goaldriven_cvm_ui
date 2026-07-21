// utils/withDefaults.ts
import { EChartsOption } from 'echarts';

const defaultOptions: Partial<EChartsOption> = {
  grid: { top: 60, bottom: 60, left: 60, right: 20 },
  tooltip: { trigger: 'axis' },
  legend: {
    top: 10,
    textStyle: { fontSize: 12, fontWeight: 'bold' },
  },
  xAxis: {
    nameLocation: 'middle',
    nameGap: 38,
    nameTextStyle: { fontSize: 14, fontWeight: 'bold', color: '#555' },
    axisLabel: { fontSize: 11, color: '#444' },
    axisLine: { lineStyle: { color: '#aaa' } },
  },
  yAxis: {
    nameLocation: 'middle',
    nameGap: 40,
    nameTextStyle: { fontSize: 14, fontWeight: 'bold', color: '#555' },
    axisLabel: { fontSize: 12, color: '#444' },
    axisLine: { lineStyle: { color: '#aaa' } },
    splitLine: { lineStyle: { type: 'dashed', color: '#ddd' } },
  },
};

export const withDefaults = (option: EChartsOption): EChartsOption => ({
  ...defaultOptions,
  ...option,
  xAxis: { ...defaultOptions.xAxis, ...option.xAxis },
  yAxis: { ...defaultOptions.yAxis, ...option.yAxis },
});
