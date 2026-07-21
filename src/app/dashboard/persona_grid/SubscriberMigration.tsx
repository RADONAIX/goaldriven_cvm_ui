import React, { useEffect, useState } from 'react';
import { Alert, Box, CircularProgress, Paper, Typography, useTheme } from '@mui/material';
import ReactECharts from 'echarts-for-react';

import { getSubscriberMigrationAnalysis } from '@/hooks/server-actions/persona-grid';
import InsightBox from '@/components/chartTitle';

type Deciles = {
  jan_deciles: number[];
  feb_deciles: number[];
};

type ApiResponse = {
  deciles: Deciles;
  migration_matrix: number[][];
};

const colorscale = ['#FFF5F0', '#FCBBA1', '#FC926E', '#FB6A4A', '#DE2D26', '#A50F15'];

interface Props {
  handleInsightClick: (insight: any) => void;
}

export default function SubscriberMigrationHeatmap({ handleInsightClick }: Props): React.JSX.Element {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();

  useEffect(() => {
    getSubscriberMigrationAnalysis()
      .then((response) => {
        setData(response);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching data:', err);
        setError('Failed to load migration data.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box m={2}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }
  if (!data || !data.deciles || !data.migration_matrix) {
    return (
      <Box m={2}>
        <Alert severity="warning">No data available for the migration analysis.</Alert>
      </Box>
    );
  }
  const { jan_deciles, feb_deciles } = data.deciles;
  const matrix = data.migration_matrix;

  const heatmapData: [number, number, number][] = [];
  matrix.forEach((row, i) => row.forEach((val, j) => heatmapData.push([j, i, val])));
  const maxVal = Math.max(...matrix.flat());

  const option = {
    tooltip: {
      backgroundColor: '#fff',
      borderColor: '#ccc',
      borderWidth: 1,
      textStyle: {
        color: '#333',
        fontSize: 13,
      },
      formatter: (params: any) =>
        `<strong>From:</strong> Jan Decile ${jan_deciles[params.data[1]].toFixed(2)}<br/>
       <strong>To:</strong> Feb Decile ${feb_deciles[params.data[0]].toFixed(2)}<br/>
       <strong>Count:</strong> ${params.data[2]}`,
    },
    xAxis: {
      type: 'category',
      data: feb_deciles.map((d) => d.toFixed(2)),
      name: 'February Decile (Avg ARPU)',
      nameLocation: 'middle',
      nameGap: 50,
      axisLabel: {
        fontSize: 12,
      },
      nameTextStyle: {
        fontSize: 14,
        fontWeight: 'bold',
      },
    },
    yAxis: {
      type: 'category',
      data: jan_deciles.map((d) => d.toFixed(2)),
      name: 'January Decile (Avg ARPU)',
      nameLocation: 'middle',
      nameGap: 60,
      inverse: false,
      axisLabel: {
        fontSize: 12,
      },
      nameTextStyle: {
        fontSize: 14,
        fontWeight: 'bold',
      },
    },
    visualMap: {
      min: 0,
      max: maxVal,
      calculable: true,
      orient: 'vertical',
      left: 'right',
      top: 'middle',
      inRange: {
        color: colorscale,
      },
      text: ['High', 'Low'],
      textStyle: {
        fontSize: 12,
      },
    },
    series: [
      {
        name: 'Migration Matrix',
        type: 'heatmap',
        data: heatmapData,
        itemStyle: {
          borderRadius: 4,
          borderColor: '#fff',
          borderWidth: 1,
        },
        label: {
          show: true,
          fontWeight: 'bold',
          fontSize: 12,
          formatter: (params: any) => {
            const value = params.data[2];
            const threshold = maxVal * 0.5;
            const style = value >= threshold ? 'whiteText' : 'blackText';
            return `{${style}|${value}}`;
          },
          rich: {
            whiteText: {
              color: '#FFFFFF',
            },
            blackText: {
              color: '#000000',
            },
          },
        },

        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0,0,0,0.5)',
          },
        },
      },
    ],
    grid: {
      height: '80%',
      width: '75%',
      top: '0%',
      left: '10%',
    },
  };

  return (
    <Box mt={3}>
      <InsightBox title="Value Based Segmentation" desc="" data={data} onClick={handleInsightClick} />
      <ReactECharts option={option} style={{ height: 500, width: '100%' }} />
    </Box>
  );
}
