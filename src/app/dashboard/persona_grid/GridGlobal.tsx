'use client';

import * as React from 'react';
import { Box, Divider, Grid, Typography } from '@mui/material';

import { getCustomersDrillBy } from '@/hooks/server-actions/persona-360';
import { getGenderDist } from '@/hooks/server-actions/persona-grid';
import { useInsightHandler } from '@/hooks/useInsightHandler';
import AIInsightModal from '@/components/aiInsight';
import InsightBox from '@/components/chartTitle';

import SimpleTableModal from '../persona_360/GenderReportModal';
import SimplePieChart from '../persona_360/SimplePieChart';
import BehavioralAnalysis from './BehaviouralAnalysis';
import BehaviourAnalysisInsight from './BehaviourAnalysisInsight';
import ChurnBarChart from './ChurnBarChart';
import FunnelChart from './FunnelChart';
import SubscriberMigrationHeatmap from './SubscriberMigration';
import SunburstChart from './SunburstChart';

export default function GridGlobal(): React.JSX.Element {
  const [genderPie, setGenderPie] = React.useState([]);

  const [open, setOpen] = React.useState(false);
  const [rows, setRows] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [gender, setGender] = React.useState<string | null>(null);
  const [openBehaviouralAnalysis, setOpenBehaviouralAnalysis] = React.useState(false);

  React.useEffect(() => {
    getGenderDist()
      .then((fetchedData: any) => setGenderPie(fetchedData))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const handleChartClick = async (params: any) => {
    const selectedGender = params.name;
    setOpen(true);
    setLoading(true);

    try {
      const res = await getCustomersDrillBy(selectedGender);
      setRows(res || []);
      setLoading(false);
      setGender(selectedGender);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { field: 'msisdn', label: 'MSISDN' },
    { field: 'full_name', label: 'Full Name' },
    { field: 'gender', label: 'Gender' },
    { field: 'date_of_birth', label: 'DOB' },
    { field: 'age', label: 'Age' },
  ];

  const {
    openInsightModal,
    loading: insightLoading,
    aiInsightData,
    handleInsightClick,
    handleCloseInsightModal,
  } = useInsightHandler();

  return (
    <Box>
      {openInsightModal && (
        <AIInsightModal
          open={openInsightModal}
          onClose={handleCloseInsightModal}
          data={aiInsightData}
          loading={insightLoading}
        />
      )}

      {openBehaviouralAnalysis && (
        <BehaviourAnalysisInsight open={openBehaviouralAnalysis} onClose={() => setOpenBehaviouralAnalysis(false)} />
      )}

      <InsightBox title="Behavioural Analysis" onClick={() => {setOpenBehaviouralAnalysis(true)}} size={'lg'} sx={{ marginBottom: 2 }} />

      <BehavioralAnalysis />

      <Divider />
      <Divider />
      <Grid container spacing={2} mt={3}>
        <Grid item xs={12} sm={6} md={6}>
          <SunburstChart handleInsightClick={handleInsightClick} />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <FunnelChart handleInsightClick={handleInsightClick} />
        </Grid>
      </Grid>

      <Divider />
      <Divider />

      <SubscriberMigrationHeatmap handleInsightClick={handleInsightClick} />

      <Divider />
      <Divider />

      <Grid container spacing={2} mt={3}>
        <Grid item xs={12} sm={6} md={8}>
          <ChurnBarChart handleInsightClick={handleInsightClick} />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <InsightBox
            title="Gender Distribution"
            desc="This chart shows the distribution of customers by gender in Pie chart format."
            data={genderPie}
            onClick={handleInsightClick}
          />
          <SimplePieChart data={genderPie} seriesName="Gender" onEventsFunc={handleChartClick} />
        </Grid>
      </Grid>

      <SimpleTableModal
        title={`${gender} Customers`}
        open={open}
        onClose={() => setOpen(false)}
        loading={loading}
        columns={columns}
        rows={rows}
      />
    </Box>
  );
}
