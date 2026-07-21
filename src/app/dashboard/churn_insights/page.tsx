'use client';

import * as React from 'react';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { EChartsOption } from 'echarts';
import ReactECharts from 'echarts-for-react';

import { getChurnData } from '@/hooks/server-actions/churn-insights';
import { useInsightHandler } from '@/hooks/useInsightHandler';
import AIInsightModal from '@/components/aiInsight';
import InsightBox from '@/components/chartTitle';
import NavHeaders from '@/components/navHeaders';

import SimplePieChart from '../persona_360/SimplePieChart';
import UsageChart from '../persona_360/UsageChart';
import GeoMapChart from './GeoMapChart';
import MetricCard from './MetricCard';
import SegmentInsightDialog from './SegmentInsightDialog';
import SelectSegmentOffer from './SelectSegmentOffer';
import StackedBarChart from './StackedBarChart';
import { withDefaults } from '@/hooks/defaultChartOption';

// --- Define types ---
interface CurveData {
  months: string[];
  churn: number[];
  retention: number[];
}

interface MetricData {
  [key: string]: string | number;
}

interface Segment {
  title: string;
  customers: number;
  action: string;
  color: string;
  recommended_offer: string;
}

interface ChurnDataResponse {
  metrics: MetricData;
  churnRisk: any[];
  mapData: any[];
  arpuSegments: any[];
  curveData: { months: string; churn_rate: number; retention_rate: number }[];
  churnSubLifespan: any[];
  churnType: any[];
  churnPercentage: { xData: string[]; yData: number[] };
}

interface SegmentInsight {
  explanation: string;
  recommendation: string;
  table: { label: string; value: string | number }[];
}

export default function Page(): React.JSX.Element {
  const [metricData, setMetricData] = React.useState<MetricData>({});
  const [pieData, setPieData] = React.useState<any[]>([]);
  const [curveData, setCurveData] = React.useState<CurveData>({ months: [], churn: [], retention: [] });
  const [churnSubLifespan, setChurnSubLifespan] = React.useState<any[]>([]);
  const [churnTypeData, setChurnTypeData] = React.useState<any[]>([]);
  const [mapData, setMapData] = React.useState<any[]>([]);
  const [arpuSegments, setARPUSegments] = React.useState<any[]>([]);
  const [churnPerc, setChurnPerc] = React.useState<{ xData?: string[]; yData?: number[] }>({});

  const [segmentLoading, setSegmentLoading] = React.useState(false);
  const [openSegmentDialog, setOpenSegmentDialog] = React.useState(false);
  const [segmentInsightData, setSegmentInsightData] = React.useState<any>(null);

  const [selectedSegments, setSelectedSegments] = React.useState<Segment[]>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const data: ChurnDataResponse = await getChurnData();
        setMetricData(data.metrics);
        setPieData(data.churnRisk);
        setMapData(data.mapData);
        setARPUSegments(data.arpuSegments);
        setCurveData({
          months: data.curveData.map((row) => row.months),
          churn: data.curveData.map((row) => row.churn_rate),
          retention: data.curveData.map((row) => row.retention_rate),
        });
        setChurnTypeData(data.churnType);
        setChurnSubLifespan(data.churnSubLifespan);
        setChurnPerc(data.churnPercentage);
      } catch (error) {
        console.error('Error fetching churn insights:', error);
      }
    };

    fetchData();
  }, []);

  const lineOption: EChartsOption = {
    tooltip: { trigger: 'axis' },
    legend: { data: ['Churn Rate', 'Retention Rate']},
    xAxis: { type: 'category', name: 'Months', data: curveData.months, },
    yAxis: { type: 'value', name: 'Rate'},
    series: [
      {
        name: 'Churn Rate',
        type: 'line',
        data: curveData.churn,
        smooth: false,
        color: '#e74c3c',
      },
      {
        name: 'Retention Rate',
        type: 'line',
        data: curveData.retention,
        smooth: false,
        color: '#27ae60',
      },
    ],
  };

  const segments: Segment[] = [
    {
      title: 'High Revenue / High Margin - LOW Risk',
      customers: 3,
      action: 'No Action Required',
      color: '#c7f9cc',
      recommended_offer: '—', // No offer listed in image
    },
    {
      title: 'High Revenue / High Margin - MEDIUM Risk',
      customers: 3,
      action: 'High Cost Incentive',
      color: '#fffacc',
      recommended_offer: 'Premium Loyalty Reward – Get 15% off on the next bill for continuing premium service.',
    },
    {
      title: 'High Revenue / High Margin - HIGH Risk',
      customers: 3,
      action: 'High Cost Incentive',
      color: '#ffc9c9',
      recommended_offer: 'Platinum Exclusive Offer – Get 500GB Annual Data + Unlimited Calls for $999.',
    },
    {
      title: 'High Revenue / Low Margin - MEDIUM Risk',
      customers: 3,
      action: 'High Margin Incentive',
      color: '#fffacc',
      recommended_offer: 'Super Saver Add-ons – Get a 50% discount on monthly add-ons (data/voice/SMS).',
    },
    {
      title: 'High Revenue / Low Margin - LOW Risk',
      customers: 3,
      action: 'High Margin Incentive',
      color: '#c7f9cc',
      recommended_offer: '5G Priority Pass – Get exclusive access to the 5G priority network.',
    },
    {
      title: 'High Revenue / Low Margin - HIGH Risk',
      customers: 3,
      action: 'High Margin Incentive',
      color: '#ffc9c9',
      recommended_offer: 'Economy Saver Pack – 30GB Data + Unlimited Calls for just $79 per month.',
    },
    {
      title: 'Low Revenue / High Margin - LOW Risk',
      customers: 3,
      action: 'No Action Required',
      color: '#c7f9cc',
      recommended_offer: 'Weekend Special Bonus – Get 25GB Weekend Data for 60 Days.',
    },
    {
      title: 'Low Revenue / High Margin - MEDIUM Risk',
      customers: 3,
      action: 'Low Cost Incentive',
      color: '#fffacc',
      recommended_offer: 'Data Boost Plus – Get 2GB bonus data every month at just $1.',
    },
    {
      title: 'Low Revenue / High Margin - HIGH Risk',
      customers: 3,
      action: 'Low Cost Incentive',
      color: '#ffc9c9',
      recommended_offer: '$100 Data Booster – 50GB (300 MB/s) Extra Data for 100 Days.',
    },
    {
      title: 'Low Revenue / Low Margin - LOW Risk',
      customers: 3,
      action: 'Re-Pricing',
      color: '#c7f9cc',
      recommended_offer: 'Super Combo Pack – 200GB Data + Unlimited Calls + 1000 SMS for 90 Days.',
    },
    {
      title: 'Low Revenue / Low Margin - MEDIUM Risk',
      customers: 3,
      action: 'Re-Pricing',
      color: '#fffacc',
      recommended_offer: 'Unlimited Talktime $120 – Unlimited Calls + 70GB Data for 100 Days.',
    },
    {
      title: 'Low Revenue / Low Margin - HIGH Risk',
      customers: 3,
      action: 'Re-Pricing',
      color: '#ffc9c9',
      recommended_offer: 'Mega Data Boost – 100GB Data + Unlimited Calls for 180 Days.',
    },
  ];

  interface SegmentInsight {
    explanation: string;
    recommendation: string;
    table: { label: string; value: string | number }[];
  }

  const segmentInsights: Record<string, SegmentInsight> = {
    'High Revenue / High Margin - LOW Risk': {
      explanation:
        '✓ Stable and Loyal: These customers consistently use premium services and exhibit strong brand loyalty.',
      recommendation: 'Maintain engagement through exclusive benefits and proactive customer care.',
      table: [
        { label: 'Revenue Contribution', value: '$120K' },
        { label: 'Churn Probability', value: '2%' },
        { label: 'ARPU', value: '$55' },
      ],
    },
    'High Revenue / High Margin - MEDIUM Risk': {
      explanation:
        '✓ Early Warning Signs: These customers may have slightly reduced usage or explored alternative options.',
      recommendation: 'Strengthen engagement with premium offers and personalized services.',
      table: [
        { label: 'Revenue Contribution', value: '$105K' },
        { label: 'Churn Probability', value: '14%' },
        { label: 'ARPU', value: '$50' },
      ],
    },
    'High Revenue / High Margin - HIGH Risk': {
      explanation:
        '⚠️ Critical Risk: These customers are showing strong churn signals, such as declining usage or multiple complaints.',
      recommendation: 'Immediate intervention is needed with VIP offers and retention incentives.',
      table: [
        { label: 'Revenue Contribution', value: '$95K' },
        { label: 'Churn Probability', value: '29%' },
        { label: 'ARPU', value: '$48' },
      ],
    },
    'High Revenue / Low Margin - LOW Risk': {
      explanation: '✓ High Engagement, Stable Costs: These customers actively use services without dissatisfaction.',
      recommendation: 'Maintain engagement without increasing operational costs.',
      table: [
        { label: 'Revenue Contribution', value: '$88K' },
        { label: 'Churn Probability', value: '6%' },
        { label: 'ARPU', value: '$40' },
      ],
    },
    'High Revenue / Low Margin - MEDIUM Risk': {
      explanation: '✓ Price Sensitivity Emerging: These customers may be reconsidering due to cost concerns.',
      recommendation: 'Reinforce value with flexible pricing models and cost-effective loyalty rewards.',
      table: [
        { label: 'Revenue Contribution', value: '$80K' },
        { label: 'Churn Probability', value: '17%' },
        { label: 'ARPU', value: '$38' },
      ],
    },
    'High Revenue / Low Margin - HIGH Risk': {
      explanation:
        '⚠️ High Churn Probability: These customers are cost-sensitive and actively seeking cheaper alternatives.',
      recommendation: 'Implement flexible plans and discounts to prevent churn.',
      table: [
        { label: 'Revenue Contribution', value: '$72K' },
        { label: 'Churn Probability', value: '32%' },
        { label: 'ARPU', value: '$35' },
      ],
    },
    'Low Revenue / High Margin - LOW Risk': {
      explanation:
        '✓ Consistent, Profitable Users: These customers maintain steady engagement with minimal service costs.',
      recommendation: 'Ensure continued satisfaction with effortless service delivery.',
      table: [
        { label: 'Revenue Contribution', value: '$45K' },
        { label: 'Churn Probability', value: '3%' },
        { label: 'ARPU', value: '$65' },
      ],
    },
    'Low Revenue / High Margin - MEDIUM Risk': {
      explanation: '✓ Slightly Disengaged: These customers may have reduced usage or minor dissatisfaction.',
      recommendation: 'Strengthen engagement with small perks and targeted communication.',
      table: [
        { label: 'Revenue Contribution', value: '$38K' },
        { label: 'Churn Probability', value: '16%' },
        { label: 'ARPU', value: '$62' },
      ],
    },

    'Low Revenue / Low Margin - MEDIUM Risk': {
      explanation: '✓ Unstable Usage Patterns: These customers exhibit inconsistent engagement.',
      recommendation: 'Offer budget-friendly incentives to encourage long-term retention.',
      table: [
        { label: 'Revenue Contribution', value: '$13K' },
        { label: 'Churn Probability', value: '20%' },
        { label: 'ARPU', value: '$22' },
      ],
    },
    'Low Revenue / High Margin - HIGH Risk': {
      explanation: '⚠️ Declining Engagement: These customers are showing signs of disengagement.',
      recommendation: 'Use exclusive offers and loyalty perks to re-engage them.',
      table: [
        { label: 'Revenue Contribution', value: '$28K' },
        { label: 'Churn Probability', value: '38%' },
        { label: 'ARPU', value: '$58' },
      ],
    },
    'Low Revenue / Low Margin - LOW Risk': {
      explanation: '✓ Steady, Low-Cost Users: These customers maintain a basic level of engagement.',
      recommendation: 'Retain them with effortless, low-maintenance engagement strategies.',
      table: [
        { label: 'Revenue Contribution', value: '$16K' },
        { label: 'Churn Probability', value: '5%' },
        { label: 'ARPU', value: '$24' },
      ],
    },
    'Low Revenue / Low Margin - HIGH Risk': {
      explanation: '⚠️ Minimal Engagement, High Exit Risk: These customers are showing strong signs of leaving.',
      recommendation: 'Focus on low-cost, scalable retention strategies.',
      table: [
        { label: 'Revenue Contribution', value: '$9K' },
        { label: 'Churn Probability', value: '45%' },
        { label: 'ARPU', value: '$19' },
      ],
    },
  };

  const handleSegmentInsightClick = (segment: Segment) => {
    setOpenSegmentDialog(true);
    setSegmentLoading(true);

    setTimeout(() => {
      setSegmentInsightData({ ...segmentInsights[segment.title], segmentTitle: segment.title });
      setSegmentLoading(false);
    }, 700);
  };

  const { openInsightModal, loading, aiInsightData, handleInsightClick, handleCloseInsightModal } = useInsightHandler();
  return (
    <Box>
      {openInsightModal && (
        <AIInsightModal
          open={openInsightModal}
          onClose={handleCloseInsightModal}
          data={aiInsightData}
          loading={loading}
        />
      )}

      {openSegmentDialog && (
        <SegmentInsightDialog
          open={openSegmentDialog}
          onClose={() => setOpenSegmentDialog(false)}
          data={segmentInsightData}
          loading={segmentLoading}
        />
      )}

      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <NavHeaders text="Churn Insights" />
        <Box textAlign="center">
          <marquee style={{ fontStyle: 'italic', fontSize: '14px', color: '#607D8B' }}>
            *The dashboard below presents the data for January*
          </marquee>
        </Box>
      </Stack>

      <Grid container spacing={2} my={2}>
        {Object.entries(metricData).map(([label, value], index) => (
          <MetricCard key={index} label={label} value={String(value)} formatted={label === 'Revenue at Risk ($)'} />
        ))}
      </Grid>

      <Divider />

      <Grid container spacing={2} mt={3}>
        <Grid item xs={12} sm={6} md={4}>
          <InsightBox
            title="Churn Risk Breakdown"
            desc="This chart shows the distribution of churn risk across different segments."
            data={pieData}
            onClick={handleInsightClick}
          />
          <SimplePieChart data={pieData} />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <InsightBox
            title="Churn vs. Retention Curve"
            desc="This chart provides a detailed view of churn & retention rate for last one year using multi line chart."
            data={curveData}
            onClick={handleInsightClick}
          />
          <ReactECharts option={withDefaults(lineOption)} style={{ height: 400 }} />
        </Grid>
        <Grid item xs={12} md={4}>
          <InsightBox
            title="Churn % Distribution"
            desc="This chart shows the churn percentage distribution across different months."
            data={churnPerc}
            onClick={handleInsightClick}
          />
          <UsageChart
            xLabel="Months"
            xData={churnPerc?.xData || []}
            yData={churnPerc?.yData || []}
            color="#ffa726"
            type="bar"
          />
        </Grid>
      </Grid>

      <Divider />

      <Grid container spacing={2} mt={3}>
        <Grid item xs={12} sm={6}>
          <InsightBox
            title="Churn Patterns Across Subscriber Lifespan"
            desc=""
            data={churnSubLifespan}
            onClick={handleInsightClick}
          />
          <StackedBarChart
            data={churnSubLifespan}
            xLabelKey="customer_lifecycle_phase"
            series={[
              { key: 'not_churn_subscribers', label: 'Predicted non Churner', color: '#2ca02c' },
              { key: 'churn_subscribers', label: 'Predicted Churners', color: '#d95f02' },
            ]}
            xLabel="Customer Lifecycle Phase"
            yLabel="Subscriber Count"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <InsightBox
            title="Churn Comparison: Postpaid vs. Prepaid Subscribers"
            desc="This chart shows the distribution of churn risk across different segments."
            data={churnTypeData}
            onClick={handleInsightClick}
          />
          <StackedBarChart
            data={churnTypeData}
            xLabelKey="subscriber_type"
            series={[
              { key: 'churners', label: 'Predicted non Churner', color: '#d95f02' },
              { key: 'non_churners', label: 'Predicted Churner', color: '#2ca02c' },
            ]}
            xLabel="Subscriber Type"
            yLabel="Subscriber Count"
          />
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <InsightBox
            title="Churn Risk Distribution Across ARPU Segments"
            desc="This chart shows the distribution of churn risk across different ARPU segments."
            data={arpuSegments}
            onClick={handleInsightClick}
          />
          <StackedBarChart
            data={arpuSegments}
            xLabelKey="name"
            series={[
              { key: 'high risk', label: 'high risk', color: '#F4A261' },
              { key: 'low risk', label: 'low risk', color: '#1E9B6A' },
              { key: 'medium risk', label: 'medium risk', color: '#E76F51' },
            ]}
            xLabel="ARPU Segment"
            yLabel="Subscriber Count"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <InsightBox
            title="Geo Analysis"
            desc="This chart shows the churn data across country"
            data={mapData}
            onClick={handleInsightClick}
          />
          <GeoMapChart data={mapData} />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6" fontWeight="bold" mt={3}>
            Churn Offer Optimization Matrix
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            {segments.map((segment, idx) => (
              <Grid item xs={12} sm={6} md={4} key={idx}>
                <Card sx={{ borderRadius: 3, boxShadow: 3, height: '100%' }}>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {segment.title}
                      </Typography>
                      {/* <EmojiObjectsIcon sx={{ fontSize: 18, color: 'primary.main' }} /> */}
                      <Box
                        component="img"
                        src="/assets/light-bulb.gif"
                        alt="insight-bulb"
                        sx={{
                          height: 30,
                          cursor: 'pointer',
                          borderRadius: '50%',
                          '&:hover': {
                            boxShadow: '0 0 8px 2px rgba(255, 223, 0, 0.6)',
                          },
                        }}
                        onClick={() => handleSegmentInsightClick(segment)}
                      />
                    </Box>
                    <Typography variant="body2">
                      <strong>Customers:</strong> {segment.customers}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Action:</strong> {segment.action}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>

        <SelectSegmentOffer segments={segments} />
      </Grid>
    </Box>
  );
}
