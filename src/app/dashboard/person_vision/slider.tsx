import React, { useState } from 'react';
import { Box, Menu, MenuItem, Typography } from '@mui/material';
import { EChartsOption } from 'echarts';
import ReactECharts from 'echarts-for-react';

import ParameterDetailsDialog from './parameterDialogue';

type Parameter = {
  label: string;
  min: number;
  max: number;
  current: number;
  expected: number;
  unit?: string;
};

type RetentionParameterSliderProps = {
  expected: number;
  parameters: Parameter[];
};

const normalize = (value: number, min: number, max: number): number =>
  max === min ? 0 : ((value - min) / (max - min)) * 100;

const RetentionParameterSlider: React.FC<RetentionParameterSliderProps> = ({ expected, parameters }) => {
  const [contextMenu, setContextMenu] = useState<{ mouseX: number; mouseY: number; dataIndex: number } | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedParam, setSelectedParam] = useState<Parameter | null>(null);

  const categories = parameters.map((p) => `${p.label} (min: ${p.min}${p.unit || ''}, max: ${p.max}${p.unit || ''})`);

  const handleContextMenu = (params: any) => {
    params.event.event.preventDefault();
    setContextMenu({
      mouseX: params.event.event.clientX,
      mouseY: params.event.event.clientY,
      dataIndex: params.dataIndex,
    });
  };

  const handleMenuClose = () => setContextMenu(null);

  const handleDialogOpen = () => {
    if (contextMenu) {
      setSelectedParam(parameters[contextMenu.dataIndex]);
      setDialogOpen(true);
    }
    handleMenuClose();
  };

  const handleDialogClose = () => setDialogOpen(false);

  const option: EChartsOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      formatter: (params: any) => {
        const i = params?.[0]?.dataIndex;
        const p = parameters[i];
        return `
          <strong>${p.label}</strong><br/>
          Current: ${p.current}${p.unit || ''}<br/>
          Expected: ${p.expected}${p.unit || ''}
        `;
      },
    },
    legend: {
      data: ['Current', 'Expected (Increase)', 'Expected (Decrease)', 'Expected (Same)'],
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '10%',
      containLabel: true,
    },
    xAxis: {
      type: 'value',
      min: -100,
      max: 100,
      axisLabel: {
        formatter: (val) => `${Math.abs(val)}%`,
      },
      splitLine: {
        lineStyle: { type: 'dashed', color: '#ccc' },
      },
    },
    yAxis: {
      type: 'category',
      inverse: true,
      data: categories,
      axisLabel: {
        fontWeight: 'bold',
        fontSize: 12,
        align: 'right',
        margin: 12,
      },
    },
    series: [
      {
        name: 'Current',
        type: 'bar',
        barWidth: 20,

        stack: 'total',
        label: {
          show: true,
          position: 'insideLeft',
          formatter: (params) => `${parameters[params.dataIndex].current}${parameters[params.dataIndex].unit || ''}`,
        },
        data: parameters.map((p) => -normalize(p.current, p.min, p.max)),
      },
      {
        name: 'Expected (Increase)',
        type: 'bar',
        stack: 'total',
        barWidth: 20,
        itemStyle: {
          color: '#4caf50',
        },
        label: {
          show: true,
          position: 'insideRight',
          formatter: (params) => `${parameters[params.dataIndex].expected}${parameters[params.dataIndex].unit || ''}`,
        },
        data: parameters.map((p) => (p.expected > p.current ? normalize(p.expected, p.min, p.max) : null)),
      },
      {
        name: 'Expected (Decrease)',
        type: 'bar',
        stack: 'total',
        barWidth: 20,
        itemStyle: {
          color: '#f44336',
        },
        label: {
          show: true,
          position: 'insideRight',
          formatter: (params) => `${parameters[params.dataIndex].expected}${parameters[params.dataIndex].unit || ''}`,
        },
        data: parameters.map((p) => (p.expected < p.current ? normalize(p.expected, p.min, p.max) : null)),
      },
      {
        name: 'Expected (Same)',
        type: 'bar',
        stack: 'total',
        barWidth: 20,
        itemStyle: {
          color: '#635bff',
        },
        label: {
          show: true,
          position: 'insideRight',
          formatter: (params) => `${parameters[params.dataIndex].expected}${parameters[params.dataIndex].unit || ''}`,
        },
        data: parameters.map((p) => (p.expected === p.current ? normalize(p.expected, p.min, p.max) : null)),
      },
    ],
  };

  return (
    <Box sx={{ padding: 3, border: '1px dashed #ccc' }}>
      <Typography variant="h6" gutterBottom>
        🎯 Target Retention Probability: <strong>{expected}%</strong>
      </Typography>

      <Typography variant="body2" sx={{ mt: 1, mb: 2 }}>
        Tornado view of current vs expected values (normalized to 100%, labeled with actuals).
      </Typography>

      <ReactECharts
        option={option}
        style={{ height: parameters.length * 60 + 100, width: '100%' }}
        onEvents={{ contextmenu: handleContextMenu }}
      />

      <Menu
        open={!!contextMenu}
        onClose={handleMenuClose}
        anchorEl={null}
        anchorReference="anchorPosition"
        anchorPosition={contextMenu ? { top: contextMenu.mouseY, left: contextMenu.mouseX } : undefined}
        sx={{ minWidth: 140, '& .MuiPaper-root': { maxHeight: 150 } }}
      >
        <MenuItem onClick={handleDialogOpen} sx={{ fontSize: '0.85rem', py: 0.5 }}>
          View Users
        </MenuItem>
      </Menu>
      <ParameterDetailsDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        parameterLabel={selectedParam?.label || ''}
      />
    </Box>
  );
};

export default RetentionParameterSlider;
