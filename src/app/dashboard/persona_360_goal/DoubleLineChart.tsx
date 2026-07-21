'use client';

import React from 'react';
import { Grid, Typography } from '@mui/material';
import { EChartsOption } from 'echarts';
import ReactECharts from 'echarts-for-react';
import { withDefaults } from '@/hooks/defaultChartOption';

interface ScoreEntry {
  score: number;
  subscriber: number;
}

interface ScoreDataByChurn {
  Churners: ScoreEntry[];
  NonChurners: ScoreEntry[];
}

interface MultiScoreLineChartProps {
  data: {
    [scoreType: string]: ScoreDataByChurn;
  };
  xLabel: string;
  yLabel: string;
}

const MultiScoreLineChart: React.FC<MultiScoreLineChartProps> = ({ data, xLabel, yLabel }) => {
  if (!data || Object.keys(data).length === 0) {
    return <Typography>No data available</Typography>;
  }

  // Collect all unique x-axis values across all score types
  const xAxisLabels = Array.from(
    new Set(
      Object.values(data).flatMap((scoreGroup) =>
        [...(scoreGroup.Churners || []), ...(scoreGroup.NonChurners || [])].map((d) => d.score)
      )
    )
  ).sort((a, b) => a - b);

  const colors = ['#8c0f0d', '#f27573', '#000066', '#9999ff'];

  // Create 4 series (2 per scoreType)
  const series: EChartsOption['series'] = [];

  let colorIndex = 0;
  for (const scoreType of Object.keys(data)) {
    const scoreGroup = data[scoreType];

    ['Churners', 'NonChurners'].forEach((status) => {
      const raw = scoreGroup[status] || [];
      const mapped = xAxisLabels.map((score) => raw.find((d) => d.score === score)?.subscriber ?? 0);

      series.push({
        name: `${scoreType.replace('_', ' ')} - ${status}`,
        type: 'line',
        data: mapped,
        smooth: true,
        lineStyle: { color: colors[colorIndex % colors.length] },
        itemStyle: { color: colors[colorIndex % colors.length] }, // ✅ add this
      });

      colorIndex++;
    });
  }

  const option: EChartsOption = {
    tooltip: { trigger: 'axis' },
    legend: {
      data: series.map((s) => (s as any).name),
      bottom: 0,
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
    <Grid item xs={12}>
      <ReactECharts option={withDefaults(option)} style={{ height: 400 }} />
    </Grid>
  );
};

export default MultiScoreLineChart;
