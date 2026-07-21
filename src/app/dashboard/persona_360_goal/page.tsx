'use client';

import * as React from 'react';
import { Box, Divider, Grid, MenuItem, Select, Stack, Typography } from '@mui/material';

import {
  getCSATAnalysis,
  getCustomersDrillBy,
  getRevenueAnaysis,
  getSubscriberAnalysis,
  getUsageAnalysis,
} from '@/hooks/server-actions/persona-360-ret';
import { useVision } from '@/hooks/use-vision';
import { useInsightHandler } from '@/hooks/useInsightHandler';
import AIInsightModalRetention from '@/components/aiInsightRetention';
import InsightBox from '@/components/chartTitle';

import BarChart from './barChart';
import DoubleLineChart from './DoubleLineChart';
import SimpleTableModal from './GenderReportModal';
import MetricCard from './MetricCard';
import MultiLineChart from './PrefCommRev';
import SatisfactionGauge from './SatisfactionGauge';
import SimplePieChart from './SimplePieChart';
import TrafficCard from './TrafficCard';
import TreeMap from './TreeMap';
import TreeMapChart from './TreeMapChart';
import UsageChart from './UsageChart';

export default function Retention360(): React.JSX.Element {
  const { vision } = useVision();
  const [metricData, setMetricData] = React.useState<any>(null);
  const [ageDistChart, setAgeDistChart] = React.useState<any>({});
  const [tenureDist, setTenureDist] = React.useState<any>({});
  const [MOMSub, setMOMSub] = React.useState<any>({});
  const [subType_goal, setSubType_goal] = React.useState<any>([]);
  const [channelData, setChannelData] = React.useState<any[]>([]);
  const [subTypeData, setSubTypeData] = React.useState<any>(null);

  const [usageMetrics, setUsageMetrics] = React.useState<any>(null);
  const [SMSUsage, setSMSUsage] = React.useState<any>(null);
  const [voiceUsage, setVoiceUsage] = React.useState<any>(null);
  const [dataUsage, setDataUsage] = React.useState<any>(null);

  const [polarData, setPolarData] = React.useState<any>([]);
  const [doubleLineData, setDoubleLineData] = React.useState<any>({});
  const [gaugeValue, setGaugeValue] = React.useState<any>(null);
  const [satisfactionRating, setSatisfactionRating] = React.useState<any>(null);

  const [open, setOpen] = React.useState(false);
  const [rows, setRows] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [gender, setGender] = React.useState<string | null>(null);

  const [revenuBarData, setRevenuBarData] = React.useState<any>(null);
  const [revenueTreeData, setRevenueTreeData] = React.useState<any[]>([]);

  const [preferCommRev, setPreferCommRev] = React.useState<any>(null);
  const [view, setView] = React.useState('');

  React.useEffect(() => {
    setView(vision || '');
  }, [vision]);

  React.useEffect(() => {
    getSubscriberAnalysis()
      .then((data) => {
        setMetricData(data.metrics);
        setAgeDistChart(data.ageDist);
        setTenureDist(data.tenureDist);
        setMOMSub(data.momSub);
        setSubType_goal(data.subscriber_Type_Retention_data);
        setChannelData(data.communicationChannels);
        setSubTypeData(data.planType);
      })
      .catch((err) => console.error(err));

    getUsageAnalysis()
      .then((data) => {
        setUsageMetrics(data.metrics);
        setSMSUsage(data.smsUsage);
        setVoiceUsage(data.voiceUsage);
        setDataUsage(data.dataUsage);
      })
      .catch((err) => console.error(err));

    getCSATAnalysis()
      .then((data) => {
        setPolarData(data.polarData);
        setDoubleLineData(data.doubleLineChart);
        setGaugeValue(data.gaugeValue);
        setSatisfactionRating(data.custSatisData);
      })
      .catch((err) => console.error(err));

    getRevenueAnaysis()
      .then((data) => {
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

  const {
    openInsightModal,
    loading: insightLoading,
    aiInsightData,
    handleInsightClickRetention,
    handleCloseInsightModal,
  } = useInsightHandler();

  return (
    <Box>
      {openInsightModal && (
        <AIInsightModalRetention
          open={openInsightModal}
          onClose={handleCloseInsightModal}
          data={aiInsightData}
          loading={insightLoading}
        />
      )}

      <Box mt={3}>
        <Typography variant="h5" color="primary" mb={3} ml={2}>
          Subscriber Analysis
        </Typography>
        <Grid container spacing={2}>
          {metricData && (
            <>
              <Grid item xs={12} sm={6} md={4}>
                <MetricCard
                  label1="Total Subscribers"
                  label2="Churners / Non Churners"
                  value1={String(metricData[0]['Total Subscribers'])}
                  value2={String(metricData[1]['Total Subscribers'])}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <MetricCard
                  label1="Average ARPU"
                  label2="Churners / Non Churners"
                  value1={String(metricData[0]['Average ARPU'])}
                  value2={String(metricData[1]['Average ARPU'])}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <MetricCard
                  label1="Average CSAT"
                  label2="Churners / Non Churners"
                  value1={String(metricData[0]['Average CSAT'])}
                  value2={String(metricData[1]['Average CSAT'])}
                />
              </Grid>
            </>
          )}
        </Grid>

        <Grid container spacing={2} mt={3}>
          <Grid item xs={12} sm={6} md={4}>
            <InsightBox
              title="Subscriber Type Distribution"
              desc="This chart shows the distribution of subscribers by type, helping to identify the proportion of churners and non-churners."
              data={subType_goal}
              onClick={handleInsightClickRetention}
            />
            <SimplePieChart data={subType_goal} seriesName="Gender" />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <InsightBox
              title="Preferred Communication Channels"
              desc="This chart shows the distribution of subscribers across different communication channels."
              data={channelData}
              onClick={handleInsightClickRetention}
            />
            <TreeMap data={channelData} />
          </Grid>
          <Grid item xs={12} md={4}>
            {subTypeData && (
              <>
                <InsightBox
                  title="Plan Type Distribution"
                  desc="This chart shows the distribution of subscribers by plan type, helping to identify the most popular plans."
                  data={subTypeData}
                  onClick={handleInsightClickRetention}
                />
                <BarChart xLabel="Subscriber Type" data={subTypeData} type="bar" />
              </>
            )}
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
            {usageMetrics && (
              <>
                <InsightBox
                  title="Avg Voice Usage (Hrs) Churners / Non Churners"
                  desc="This chart shows the average voice usage in hours for churners and non-churners using line chart."
                  data={voiceUsage}
                  onClick={handleInsightClickRetention}
                />
                <TrafficCard
                  subtext1="Avg Traffic By Voice Churners / Non Churners"
                  subvalue1={`${usageMetrics[0]['Avg Monthly Voice Usage (Hrs)']}`}
                  subvalue2={`${usageMetrics[1]['Avg Monthly Voice Usage (Hrs)']}`}
                  value={`${usageMetrics[0]['Avg Voice Usage (Hrs)']}`}
                  value2={`${usageMetrics[1]['Avg Voice Usage (Hrs)']}`}
                  color="#43a047"
                />
              </>
            )}

            {voiceUsage && <BarChart title="" xLabel="Voice Usage(Hrs)" data={voiceUsage} type="line" />}
          </Grid>

          <Grid item xs={12} md={4} sx={{ borderRadius: 2, backgroundColor: '#fff', boxShadow: 3 }}>
            {usageMetrics && (
              <>
                <InsightBox
                  title="Avg SMS Sent Churners / Non Churners"
                  desc="This chart shows the average SMS sent for churners and non-churners using line chart."
                  data={SMSUsage}
                  onClick={handleInsightClickRetention}
                />
                <TrafficCard
                  value={`${usageMetrics[0]['Avg SMS Sent']}`}
                  value2={`${usageMetrics[1]['Avg SMS Sent']}`}
                  subtext1="Avg Traffic By SMS Churners / Non Churners"
                  subvalue1={`${usageMetrics[0]['Avg Monthly SMS Sent']}`}
                  subvalue2={`${usageMetrics[1]['Avg Monthly SMS Sent']}`}
                  color="#e57373"
                />
              </>
            )}
            {SMSUsage && <BarChart title="" xLabel="SMS Sent" data={SMSUsage} type="line" />}
          </Grid>

          <Grid item xs={12} md={4} sx={{ borderRadius: 2, backgroundColor: '#fff', boxShadow: 3 }}>
            {usageMetrics && (
              <>
                <InsightBox
                  title="Avg Data Usage Churners / Non Churners"
                  desc="This chart shows the average data usage in GB for churners and non-churners using line chart."
                  data={dataUsage}
                  onClick={handleInsightClickRetention}
                />

                <TrafficCard
                  subtext1="Avg Traffic By Data Usage (GB) Churners / Non Churners"
                  subvalue1={`${usageMetrics[0]['Avg Monthly Data Usage (GB)']}`}
                  subvalue2={`${usageMetrics[1]['Avg Monthly Data Usage (GB)']}`}
                  value={`${usageMetrics[0]['Avg Data Usage (GB)']}`}
                  value2={`${usageMetrics[1]['Avg Data Usage (GB)']}`}
                  color="#ffa726"
                />
              </>
            )}

            {dataUsage && <BarChart title="" xLabel="Data in GB" data={dataUsage} type="line" />}
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
              title="Monthly Revenue by Channel"
              desc="This chart shows the monthly revenue distribution by channel, using multi-line chart."
              data={preferCommRev}
              onClick={handleInsightClickRetention}
            />
            <MultiLineChart data={preferCommRev} xLabel="Months" yLabel="Revenue ($)" />
          </Grid>
          <Grid item xs={12} md={6}>
            {revenuBarData && (
              <>
                <InsightBox
                  title="Monthly Revenue Distribution"
                  desc="This chart shows the monthly revenue distribution by channel, using bar chart."
                  data={revenuBarData}
                  onClick={handleInsightClickRetention}
                />
                <BarChart xLabel="Months" data={revenuBarData} type="bar" />
              </>
            )}
          </Grid>

          <Grid item xs={12} md={12}>
            <InsightBox
              title="Revenue Distribution by Subscriber Type, Gender, Plan Type, and Nationality"
              desc="This chart shows the revenue distribution by churners and non-churners, segmented by subscriber using tree map."
              data={revenueTreeData}
              onClick={handleInsightClickRetention}
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
          <Grid item xs={12} md={8}>
            <InsightBox
              title="Score Distribution by Churn Status"
              desc="This chart shows the subscriber count for promotion score & stickiness score for based on churners and non churners"
              data={doubleLineData}
              onClick={handleInsightClickRetention}
            />
            <DoubleLineChart data={doubleLineData} xLabel="Score" yLabel="Subscriber Count" />
          </Grid>
          <Grid item xs={12} md={3}>
            <InsightBox
              title="Avg Customer Satisfaction"
              desc="This polar chart shows the average customer satisfaction score by churners and non-churners."
              data={gaugeValue}
              onClick={handleInsightClickRetention}
            />
            {gaugeValue && (
              <SatisfactionGauge
                churnerValue={Number(gaugeValue[0].value)}
                nonChurnerValue={Number(gaugeValue[1].value)}
              />
            )}
          </Grid>
        </Grid>

        <Grid container mt={3}>
          <Grid item xs={12} md={12}>
            {satisfactionRating && (
              <>
                <InsightBox
                  title="Customer Satisfaction Rating Distribution"
                  desc="This chart shows the customer satisfaction rating distribution by churners and non-churners."
                  data={satisfactionRating}
                  onClick={handleInsightClickRetention}
                />
                <BarChart xLabel="Satisfaction Rating" data={satisfactionRating} type="bar" />
              </>
            )}
          </Grid>
        </Grid>
      </Box>

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
