'use client';

import React, { useEffect, useState } from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import ReactECharts from 'echarts-for-react';
import { MapChart } from 'echarts/charts';
import { TooltipComponent, VisualMapComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';

import { getLanguageRegionMap, getLanguageStats } from '@/hooks/server-actions/persona-360';

import usaJson from '../../../../public/geo/world.json'; // Make sure this path resolves
import { withDefaults } from '@/hooks/defaultChartOption';

echarts.use([MapChart, TooltipComponent, VisualMapComponent, CanvasRenderer]);

// Register the map
echarts.registerMap('world', usaJson as any); // 👈 Rename it here
const LanguageDrillChart = () => {
  const [barData, setBarData] = useState<any[]>([]);
  const [mapData, setMapData] = useState<any[]>([]);
  const [currentLanguage, setCurrentLanguage] = useState<string | null>(null);

  useEffect(() => {
    getLanguageStats().then((data) => setBarData(data));
  }, []);

  const handleBarClick = async (params: any) => {
    const lang = params.name;
    setCurrentLanguage(lang);
    const data = await getLanguageRegionMap(lang);
    setMapData(data);
  };

  const barOption = {
    // title: { text: 'Language Preference Distribution', left: 'center' },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: barData.map((d) => d.language_preference) },
    yAxis: { type: 'value' },
    series: [
      {
        name: 'Users',
        type: 'bar',
        data: barData.map((d) => d.count),
        itemStyle: { color: '#4caf50' },
      },
    ],
  };

  const mapOption = {
    // title: { text: `Nationality Map for "${currentLanguage}"`, left: 'center' },
    tooltip: { trigger: 'item' },
    visualMap: {
      min: 0,
      max: Math.max(...mapData.map((m) => m.value), 10),
      left: 'left',
      top: 'bottom',
      text: ['High', 'Low'],
      inRange: {
        color: ['#313695', '#4575b4', '#74add1', '#fdae61', '#f46d43', '#d73027'],
      },
      calculable: true,
    },
    series: [
      {
        name: 'Users',
        type: 'map',
        map: 'world',
        roam: true,
        emphasis: {
          label: { show: true },
        },
        data: mapData, // [{ name: 'India', value: 120 }, ...]
      },
    ],
  };

  return (
    <Box>
        <Typography variant="h6" fontWeight={700} sx={{  display:'flex', justifyContent: 'space-around', }}>
          {currentLanguage ? `Nationality Map for "${currentLanguage}"` : 'Language Preference Distribution'}

          {currentLanguage && (
            <Button
              variant="outlined"
              onClick={() => setCurrentLanguage(null)}
              sx={{ textTransform: 'none', fontWeight: 600, height: 28, margin: 0, position: 'relative', left: 50 }}
            >
              ←
            </Button>
          )}
        </Typography>
      {!currentLanguage && (
        <ReactECharts option={withDefaults(barOption)} style={{ height: 400 }} onEvents={{ click: handleBarClick }} />
      )}
      {currentLanguage && <ReactECharts option={mapOption} style={{ height: 400, width: '100%' }} />}
    </Box>
  );
};

export default LanguageDrillChart;
