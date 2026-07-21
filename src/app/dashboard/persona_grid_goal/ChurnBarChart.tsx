'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Box } from '@mui/material';

import { getChurnRiskOnAgeGroupRet } from '@/hooks/server-actions/persona-grid-ret';
import InsightBox from '@/components/chartTitle';
import { withDefaults } from '@/hooks/defaultChartOption';

const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });

type ChurnDataItem = {
  age_group: string;
  subscriber_type: string;
  churn_status: 'Churner' | 'Non-Churner';
  count: number;
};

interface ChurnBarChartProps {
  handleInsightClickRetention: (payload: any) => Promise<void>;
}

const ChurnBarChart: React.FC<ChurnBarChartProps> = ({ handleInsightClickRetention }) => {
  const [churnData, setChurnData] = useState<ChurnDataItem[]>([]);
  useEffect(() => {
    getChurnRiskOnAgeGroupRet()
      .then((data: any) =>{
        console.log( 'churn by age group' , data)
         setChurnData(data)})
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const ageGroups = ['Youth', 'Adult', 'Senior'];

  const getCount = (ageGroup: string, subscriberType: string, churnStatus: 'Churner' | 'Non-Churner') => {
    const found = churnData.find(
      (item) =>
        item.age_group === ageGroup && item.subscriber_type === subscriberType && item.churn_status === churnStatus
    );
    return found ? Number(found.count) : 0;
  };

  const prepaidChurners = ageGroups.map((group) => getCount(group, 'Prepaid', 'Churner'));
  const prepaidNonChurners = ageGroups.map((group) => getCount(group, 'Prepaid', 'Non-Churner'));

  const postpaidChurners = ageGroups.map((group) => getCount(group, 'Postpaid', 'Churner'));
  const postpaidNonChurners = ageGroups.map((group) => getCount(group, 'Postpaid', 'Non-Churner'));

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
    },
    legend: {
      data: ['Prepaid - Churner', 'Prepaid - Non-Churner', 'Postpaid - Churner', 'Postpaid - Non-Churner'],
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '10%',
      containLabel: true,
    },
    xAxis: {
      type: 'value',
      name: 'Subscriber Count',
    },
    yAxis: {
      type: 'category',
      data: ageGroups,
      name: 'Age Group',
    },
    series: [
      {
        name: 'Prepaid - Churner',
        type: 'bar',
        stack: 'Prepaid',
        data: prepaidChurners,
        itemStyle: { color: '#e74c3c' },
      },
      {
        name: 'Prepaid - Non-Churner',
        type: 'bar',
        stack: 'Prepaid',
        data: prepaidNonChurners,
        itemStyle: { color: '#f39c12' },
      },
      {
        name: 'Postpaid - Churner',
        type: 'bar',
        stack: 'Postpaid',
        data: postpaidChurners,
        itemStyle: { color: '#3498db' },
      },
      {
        name: 'Postpaid - Non-Churner',
        type: 'bar',
        stack: 'Postpaid',
        data: postpaidNonChurners,
        itemStyle: { color: '#2ecc71' },
      },
    ],
  };

  return (
    <Box mt={3} >
      <InsightBox
              title="Churn Count by Age Group and Plan Type"
              desc="This chart shows the churn count segmented by age group and subscriber type. It helps identify which age groups and subscriber types are more prone to churn, allowing for targeted retention strategies."
              data={churnData}
              onClick={handleInsightClickRetention}
              sx={{
                mb: 2,
              }}
            />
      <ReactECharts option={withDefaults(option)} style={{ height: 450 }} />
    </Box>
  );
};

export default ChurnBarChart;
