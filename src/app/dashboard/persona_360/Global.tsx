'use client';

import * as React from 'react';
import { ArrowForward } from '@mui/icons-material';
import { Box, Divider, Grid, MenuItem, Select, Stack, Typography } from '@mui/material';

import { getChartInsights } from '@/hooks/server-actions/ml-apis';
import {
  getCSATAnalysis,
  getCustomersDrillBy,
  getRevenueAnaysis,
  getSubscriberAnalysis,
  getUsageAnalysis,
} from '@/hooks/server-actions/persona-360';
import { useVision } from '@/hooks/use-vision';
import AIInsightModal from '@/components/aiInsight';
import InsightBox from '@/components/chartTitle';

import DoubleLineChart from './DoubleLineChart';
import GenderReportModal from './GenderReportModal';
import LanguageDrillChart from './LanguageDrillChart';
import MetricCard from './MetricCard';
import PolarBar from './PolarBar';
import RevenueAnalysis from './PrefCommRev';
import SatisfactionGauge from './SatisfactionGauge';
import SimplePieChart from './SimplePieChart';
import TrafficCard from './TrafficCard';
import TreeMap from './TreeMap';
import TreeMapChart from './TreeMapChart';
import UsageChart from './UsageChart';

export default function Global(): React.JSX.Element {
  const { vision } = useVision();
  const [metricData, setMetricData] = React.useState<any>({});
  const [ageDistChart, setAgeDistChart] = React.useState<any>({});
  const [tenureDist, setTenureDist] = React.useState<any>({});
  const [MOMSub, setMOMSub] = React.useState<any>({});
  const [genderPie, setGenderPie] = React.useState<any>([]);
  const [channelData, setChannelData] = React.useState<any[]>([]);
  const [subTypeData, setSubTypeData] = React.useState<any>({});

  const [usageMetrics, setUsageMetrics] = React.useState<any>({});
  const [SMSUsage, setSMSUsage] = React.useState<any>({});
  const [voiceUsage, setVoiceUsage] = React.useState<any>({});
  const [dataUsage, setDataUsage] = React.useState<any>({});

  const [polarData, setPolarData] = React.useState<any>([]);
  const [doubleLineData, setDoubleLineData] = React.useState<any>({});
  const [gaugeValue, setGaugeValue] = React.useState<string>('');
  const [satisfactionRating, setSatisfactionRating] = React.useState<any>({});

  const [open, setOpen] = React.useState(false);
  const [rows, setRows] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [gender, setGender] = React.useState<string | null>(null);

  const [revenuBarData, setRevenuBarData] = React.useState<any>({});
  const [revenueTreeData, setRevenueTreeData] = React.useState<any[]>([]);

  const [preferCommRev, setPreferCommRev] = React.useState<any>(null);
  const [view, setView] = React.useState('');

  const [aiInsightData, setAiInsightData] = React.useState<any>(null);
  const [openInsightModal, setOpenInsightModal] = React.useState<boolean>(false);

  React.useEffect(() => {
    setView(vision || '');
  }, [vision]);

  React.useEffect(() => {
    getSubscriberAnalysis()
      .then((data) => {
        console.log('Subscriber Analysis Data:', data);
        setMetricData(data.metrics);
        setAgeDistChart(data.ageDist);
        setTenureDist(data.tenureDist);
        setMOMSub(data.momSub);
        setGenderPie(data.genderPieData);
        setChannelData(data.communicationChannels);
        setSubTypeData(data.planType);
      })
      .catch((err) => console.error(err));

    getUsageAnalysis()
      .then((data) => {
        console.log('Usage Analysis Data:', data);
        setUsageMetrics(data.metrics);
        setSMSUsage(data.smsUsage);
        setVoiceUsage(data.voiceUsage);
        setDataUsage(data.dataUsage);
      })
      .catch((err) => console.error(err));

    getCSATAnalysis()
      .then((data) => {
        console.log('CSAT Analysis Data:', data);
        setPolarData(data.polarData);
        setDoubleLineData(data.doubleLineChart);
        setGaugeValue(data.gaugeValue);
        setSatisfactionRating(data.custSatisData);
      })
      .catch((err) => console.error(err));

    getRevenueAnaysis()
      .then((data) => {
        console.log('Revenue Analysis Data:', data);
        setRevenuBarData(data.revenueData);
        setRevenueTreeData(data.treeData);
        setPreferCommRev(data.channelsData);
      })
      .catch((err) => console.error(err));
  }, []);

  const columns = [
    { field: 'msisdn', label: 'MSISDN' },
    { field: 'full_name', label: 'Full Name' },
    { field: 'gender', label: 'Gender' },
    { field: 'date_of_birth', label: 'DOB' },
    { field: 'age', label: 'Age' },
  ];

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

  const handleInsightClick = (payload: any) => {
    setOpenInsightModal(true);
    setLoading(true);
    getChartInsights(payload)
      .then((res) => {
        console.log('res', res);
        setAiInsightData(res?.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log('err', err);
        setOpenInsightModal(false);

        setLoading(false);
      });
  };

  const handleCloseInsightModal = () => {
    setOpenInsightModal(false);
    setAiInsightData(null);
  };

  return (
    <Box>
      {/* <Stack direction="row" justifyContent="space-between">
        <Typography variant="h5" fontWeight="bold">
          Persona 360
        </Typography>
        <Stack>
          <Select
            size="small"
            labelId="goal-select-label"
            value={view}
            label="Goal"
            fullWidth
            onChange={(e) => setView(e.target.value)}
          >
            <MenuItem value="global">🌐 Global</MenuItem>
            <MenuItem value="retention">🎯 Retention</MenuItem>
          </Select>
        </Stack>
      </Stack> */}

      {openInsightModal && (
        <AIInsightModal
          open={openInsightModal}
          onClose={handleCloseInsightModal}
          data={aiInsightData}
          loading={loading}
        />
      )}

      <Box mt={3}>
        <Typography variant="h5" color="primary" mb={3} ml={2}>
          Subscriber Analysis
        </Typography>
        <Grid container spacing={2}>
          {Object.entries(metricData || {}).map(([label, value], index) => (
            <MetricCard key={index} label={label} value={String(value)} />
          ))}
        </Grid>

        <Grid container spacing={2} mt={3}>
          <Grid item xs={12} sm={6} md={4}>
            <InsightBox
              title="Subscriber Type Distribution"
              onClick={() => {
                handleInsightClick({
                  title: 'Subscriber Type Distribution',
                  desc: 'Pie chart showing the proportion of subscribers segmented into Postpaid and Prepaid categories',
                  data: genderPie,
                });
              }}
            />
            <SimplePieChart data={genderPie} seriesName="Gender" />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <InsightBox
              title="Preferred Communication Channels"
              onClick={() => {
                handleInsightClick({
                  title: 'Preferred Communication Channels',
                  desc: '',
                  data: channelData,
                });
              }}
            />
            <TreeMap data={channelData} />
          </Grid>
          <Grid item xs={12} md={4}>
            <InsightBox
              title="Plan type Distribution"
              onClick={() => {
                handleInsightClick({
                  title: 'Plan type Distribution',
                  desc: '',
                  data: subTypeData,
                });
              }}
            />
            <UsageChart
              xLabel="Subscriber Type"
              xData={subTypeData?.xData}
              yData={subTypeData?.yData}
              color="#ffa726"
              type="bar"
            />
          </Grid>
        </Grid>
      </Box>

      <Divider />
      <Divider />

      <Box mt={3} mb={3}>
        <Typography variant="h5" color="primary" mb={3} ml={2}>
          Usage Analysis
        </Typography>

        <Grid container spacing={2} gap={2} sx={{ display: 'flex', flexWrap: 'nowrap' }}>
          <Grid item xs={12} md={4} sx={{ borderRadius: 2, backgroundColor: '#fff', boxShadow: 3 }}>
            <TrafficCard
              subtext1="Avg Traffic By Voice"
              subvalue1={`${usageMetrics['Avg Monthly Voice Usage (Hrs)']}`}
              title="Avg Voice Usage (Hrs)"
              value={`${usageMetrics['Avg Voice Usage (Hrs)']}`}
              color="#43a047"
              onClick={() => {
                handleInsightClick({
                  title: 'Avg Traffic By Voice',
                  desc: '',
                  data: voiceUsage,
                });
              }}
            />
            <UsageChart
              xLabel="Voice Usage(Hrs)"
              xData={voiceUsage?.xData}
              yData={voiceUsage?.yData}
              color="#43a047"
              type="line"
            />
          </Grid>

          <Grid item xs={12} md={4} sx={{ borderRadius: 2, backgroundColor: '#fff', boxShadow: 3 }}>
            <TrafficCard
              title="Avg SMS Sent"
              value={`${usageMetrics['Avg SMS Sent']}`}
              subtext1="Avg Traffic By SMS"
              subvalue1={`${usageMetrics['Avg Monthly SMS Sent']}`}
              color="#e57373"
              onClick={() => {
                handleInsightClick({
                  title: 'Avg SMS sent',
                  desc: '',
                  data: SMSUsage,
                });
              }}
            />
            <UsageChart xLabel="SMS Sent" xData={SMSUsage?.xData} yData={SMSUsage?.yData} color="#e57373" type="line" />
          </Grid>

          <Grid item xs={12} md={4} sx={{ borderRadius: 2, backgroundColor: '#fff', boxShadow: 3 }}>
            <TrafficCard
              subtext1="Avg Traffic By Data Usage (GB)"
              subvalue1={`${usageMetrics['Avg Monthly Data Usage (GB)']}`}
              title="Avg Data Usage (GB)"
              value={`${usageMetrics['Avg Data Usage (GB)']}`}
              color="#ffa726"
              onClick={() => {
                handleInsightClick({
                  title: 'Avg data usage',
                  desc: '',
                  data: dataUsage,
                });
              }}
            />
            <UsageChart
              xLabel="Data in GB"
              xData={dataUsage?.xData}
              yData={dataUsage?.yData}
              color="#ffa726"
              type="line"
            />
          </Grid>
        </Grid>
      </Box>

      <Divider />
      <Divider />

      <Box mt={3} mb={3}>
        <Typography variant="h5" color="primary" mb={3} ml={2}>
          Revenue Analysis
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <InsightBox
              title="Monthly Revenue by Communication Channel"
              onClick={() => {
                handleInsightClick({
                  title: 'Monthly Revenue by Communication Channel',
                  desc: '',
                  data: preferCommRev,
                });
              }}
            />
            <RevenueAnalysis data={preferCommRev} xLabel="Months" yLabel="Revenue ($)" />
          </Grid>
          <Grid item xs={12} md={6}>
            <InsightBox
              title="Monthly Revenue Distribution"
              onClick={() => {
                handleInsightClick({
                  title: 'Monthly Revenue Distribution',
                  desc: '',
                  data: revenuBarData,
                });
              }}
            />
            <UsageChart
              xLabel="Months"
              xData={revenuBarData?.xData}
              yData={revenuBarData?.yData}
              color="#e57373"
              type="bar"
            />
          </Grid>

          <Grid item xs={12} md={12}>
            <InsightBox
              title="Revenue Distribution by Subscriber Type, Gender, Plan Type, and Nationality"
              onClick={() => {
                handleInsightClick({
                  title: 'Revenue Distribution by Subscriber Type, Gender, Plan Type, and Nationality',
                  desc: '',
                  data: revenueTreeData,
                });
              }}
            />
            <TreeMapChart treeData={revenueTreeData} />
          </Grid>
        </Grid>
      </Box>

      <Divider />
      <Divider />

      <Box mt={3}>
        <Typography variant="h5" color="primary" mb={3} ml={2}>
          CSAT Analysis
        </Typography>
        <Grid container>
          {/* <PolarBar
            title="Promoter & Stickness Insights"
            axisLabel={['Avg Net Promoter Score', 'Avg Stickiness Score']}
            axisData={polarData}
          /> */}
          <Grid item xs={12} md={8}>
              <InsightBox
              title="Score Distribution Across Subscribers"
              desc="This double line chart shows the promotion score and stickiness score for subscriber count"
              data={doubleLineData}
              onClick={handleInsightClick}
            />
            <DoubleLineChart
              data={doubleLineData}
              seriesNames={['promotion_score', 'stickness_score']}
              xLabel="Score"
              yLabel="Subscriber Count"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <InsightBox
              title="Avg Customer Satisfaction"
              desc="This polar chart shows the average customer satisfaction score by churners and non-churners."
              data={gaugeValue}
              insight={false}
            />
            {gaugeValue && <SatisfactionGauge value={Number(gaugeValue)} />}

          </Grid>
        </Grid>

        <Grid container mt={3}>
          <Grid item xs={12} md={12}>
            <InsightBox
              title="Customer Satisfaction Rating Distribution"
              onClick={() => {
                handleInsightClick({
                  title: 'Customer Satisfaction Rating Distribution',
                  desc: '',
                  data: satisfactionRating,
                });
              }}
            />
            <UsageChart
              xLabel="Satisfaction Rating"
              xData={satisfactionRating?.xData}
              yData={satisfactionRating?.yData}
              color="#EA5851"
              type="bar"
            />
          </Grid>
        </Grid>
      </Box>
      <GenderReportModal
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
