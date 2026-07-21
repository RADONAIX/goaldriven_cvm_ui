import React from 'react';
import { Grid, Typography } from '@mui/material';
import { EChartsOption } from 'echarts';
import ReactECharts from 'echarts-for-react';
import { withDefaults } from '@/hooks/defaultChartOption';

// Define the prop types for the data, series names, and axis labels
interface LineChartProps {
  data: { [key: string]: { months: string[]; revenue: number[] } }; // Communication channel data
  xLabel: string; // X-axis label (e.g., "Month")
  yLabel: string; // Y-axis label (e.g., "Revenue (USD)")
}

const MultiLineChart: React.FC<LineChartProps> = ({ data, xLabel, yLabel }) => {
  if (!data || Object.keys(data).length === 0) {
    return <Typography>No data available</Typography>; // Handle case when no data is provided
  }

  const seriesNames = Object.keys(data);

  const xAxisLabels = data[seriesNames[0]].months;

  const colors = [
    '#1976d2', // Blue
    '#ef5350', // Red
    '#ff9800', // Orange
    '#43a047', // Green
    '#f44336', // Dark Red
    '#3f51b5', // Indigo
  ];

  const series = seriesNames.map((channel, index) => ({
    name: channel,
    type: 'line' as const, // Explicitly cast type as 'line'
    data: data[channel]?.revenue || [], // Get the revenue data for each channel
    smooth: true,
    lineStyle: {
      color: colors[index % colors.length], // Cycle through the colors array
    },
  }));

  const option: EChartsOption = {
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: seriesNames, // Communication channels as legends
      orient: 'horizontal',  // Set legend to horizontal
      left: 'center',
    },
    xAxis: {
      type: 'category',
      name: xLabel,
      data: xAxisLabels, // X-axis labels (months)
    },
    yAxis: {
      type: 'value',
      name: yLabel,
      nameGap : 22,
      nameLocation : 'end'
    },
    series: series as EChartsOption['series'],
  };

  return (
    <Grid item xs={12} sm={12} md={12}>
      <ReactECharts option={withDefaults(option)} style={{ height: 400 }} />
    </Grid>
  );
};

export default MultiLineChart;
