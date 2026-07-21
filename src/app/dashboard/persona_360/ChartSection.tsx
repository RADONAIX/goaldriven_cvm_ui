'use client';

import * as React from 'react';
import { Box, Grid, Typography } from '@mui/material';

import UsageChart from './UsageChart';

interface Chart {
  title: string;
  xLabel: string;
  yLabel: string;
  xData: number[] | string[];
  yData: number[];
  color: string;
  type: 'line' | 'bar';
}

interface sectionProps {
  charts: Chart[];
}
const ChartSection: React.FC<sectionProps> = ({ charts }) => {
  return (
    <Box mt={3} mb={3}>
      <Grid container spacing={2} mt={3}>
        {charts.map((chart, index) => (
          <UsageChart
            key={index}
            title={chart.title}
            xLabel={chart.xLabel}
            yLabel={chart.yLabel}
            xData={chart.xData}
            yData={chart.yData}
            color={chart.color}
            type={chart.type}
          />
        ))}
      </Grid>
    </Box>
  );
};

export default ChartSection;
