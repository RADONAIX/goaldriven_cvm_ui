import React from 'react';
import { Box, Card, CardContent, Grid, Typography } from '@mui/material';
import { EChartsOption } from 'echarts'; // ✅ Correct import
import ReactECharts from 'echarts-for-react';
import { withDefaults } from '@/hooks/defaultChartOption';

interface ScoreData {
  [key: string]: number; // Key-value pair where key is score type and value is subscriber count
}

interface LineChartProps {
  data: {
    [key: string]: ScoreData[]; // Dynamic property names for different score types (e.g., 'promotion_score', 'stickness_score')
  };
  seriesNames: string[]; // Array of series names to display in the legend
  xLabel: string; // Label for x-axis
  yLabel: string; // Label for y-axis
}

const DoubleLineChart: React.FC<LineChartProps> = ({ data, seriesNames, xLabel, yLabel }) => {

  const xAxisLabels = [
    ...Array.from(
      new Set(
        seriesNames.flatMap((name) => data[name]?.map((d) => d[name])) // Collects all unique labels from all series
      )
    ),
  ]
    .filter((label): label is number => label !== undefined) // Filter out undefined values
    .sort((a, b) => a - b); // Sort labels in ascending order

  // Generate data for each series
  const seriesData = seriesNames.map((name) => {
    const series = data[name] || [];
    return xAxisLabels.map((x) => {
      const found = series.find((d) => d[name] === x);
      return found ? found.subscriber : 0; // Return subscriber count for matching label
    });
  });

  // Create series for each score type dynamically
  const series = seriesNames.map((name, index) => ({
    name,
    type: 'line' as const, // Explicitly cast type as 'line'
    data: seriesData[index],
    smooth: true,
    lineStyle: {
      color: index % 2 === 0 ? '#1976d2' : '#ef5350', // Alternating colors for each series
    },
  })) as EChartsOption['series'];

  const option: EChartsOption = {
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: seriesNames,
    },
    xAxis: {
      type: 'category',
      name: xLabel,
      data: xAxisLabels,

    },
    yAxis: {
      type: 'value',
      name: yLabel,

    },
    series,
  };

  return (
    <Grid item xs={12} sm={12} md={12}>
      <ReactECharts option={withDefaults(option)} style={{ height: 400 }} />
    </Grid>
  );
};

export default DoubleLineChart;
