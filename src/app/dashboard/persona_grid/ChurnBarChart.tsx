'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Box } from '@mui/material';

import { getChurnRiskOnAgeGroup } from '@/hooks/server-actions/persona-grid';
import InsightBox from '@/components/chartTitle';
import { withDefaults } from '@/hooks/defaultChartOption';

const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });

type ChurnDataItem = {
  age_group: string;
  subscriber_type: string;
  churn_count: number;
};

interface Props {
  handleInsightClick: (insight: any) => void;
}

const ChurnBarChart = ({ handleInsightClick }: Props) => {
  const [churnData, setChurnData] = useState<ChurnDataItem[]>([]);

  useEffect(() => {
    getChurnRiskOnAgeGroup()
      .then((data: any) => setChurnData(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const ageGroups = ['Youth', 'Adult', 'Senior'];

  const getDataForBar = (ageGroup: any, planType: any) => {
    const filteredData = churnData.filter((item) => item.age_group == ageGroup && item.subscriber_type == planType);
    return filteredData.length > 0 ? filteredData[0].churn_count : 0;
  };

  const option = {
    title: {
      left: 'center',
      textStyle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2c3e50',
      },
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      formatter: (params: any) => {
        return `${params[0].name}<br/>
          Prepaid: ${params[0].value} churned<br/>
          Postpaid: ${params[1].value} churned`;
      },
    },
    legend: {
      data: ['Prepaid', 'Postpaid'],
      left: 'center',
    },
    xAxis: {
      type: 'value',
      name: 'Churn Count',
      axisLabel: {
        formatter: '{value}',
      },
    },
    yAxis: {
      type: 'category',
      data: ageGroups,
      name: 'Age Group',
    },
    series: [
      {
        name: 'Prepaid',
        type: 'bar',
        stack: 'total',
        data: [
          getDataForBar('Youth', 'Prepaid'),
          getDataForBar('Adult', 'Prepaid'),
          getDataForBar('Senior', 'Prepaid'),
        ],
        itemStyle: {
          color: '#f39c12',
        },
      },
      {
        name: 'Postpaid',
        type: 'bar',
        stack: 'total',
        data: [
          getDataForBar('Youth', 'Postpaid'),
          getDataForBar('Adult', 'Postpaid'),
          getDataForBar('Senior', 'Postpaid'),
        ],
        itemStyle: {
          color: '#2ecc71',
        },
      },
    ],
  };

  return (
    <Box mt={3}>
      <InsightBox
        title="Churn Count by Age Group and Plan Type"
        desc="This chart shows the churn count segmented by age group and plan type (Prepaid/Postpaid). It helps identify which age groups are more likely to churn based on their plan type."
        data={churnData}
        onClick={handleInsightClick}
      />
      <ReactECharts option={withDefaults(option)} style={{ height: 400 }} />
    </Box>
  );
};

export default ChurnBarChart;
