'use client';

import * as React from 'react';
import { Box, Grid, Stack } from '@mui/material';

import { getNBOInsights } from '@/hooks/server-actions/nbo-insights';
import { useInsightHandler } from '@/hooks/useInsightHandler';
import AIInsightModal from '@/components/aiInsight';
import InsightBox from '@/components/chartTitle';
import NavHeaders from '@/components/navHeaders';

import MetricCard from '../persona_360/MetricCard';
import MostAcceptedOffers from './MostAcceptedOffers';
import { OfferStatsChart } from './OfferStatsChart';
import OfferSunburstChart from './OfferSunburstChart';
import OfferTrendChart from './OfferTrendChart';
import PlanConversionFunnel from './PlanConversionFunnel';
import SegmentationHitRateChart from './SegmentationHitRate';

export default function Page(): React.JSX.Element {
  const [metricData, setMetrics] = React.useState<any>(null);
  const [offerbyAge, setOfferbyAge] = React.useState<any>(null);
  const [acceptedOffers, setAcceptedOffers] = React.useState<any>(null);
  const [planConversion, setPlanConversion] = React.useState<any>(null);
  const [offerSunburst, setOfferSunburst] = React.useState<any>(null);
  const [segmentationData, setSegmentationData] = React.useState<any>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getNBOInsights();
        setOfferbyAge(data.offerbyAge);
        setMetrics(data.metrics);
        setAcceptedOffers(data.mostAcceptOffers);
        setPlanConversion(data.planConversion);
        setOfferSunburst(data.offerSunburst);
        setSegmentationData(data.segHitRate);
      } catch (error) {
        console.error('Error fetching NBO insights:', error);
      }
    };
    fetchData();
  }, []);

  const { openInsightModal, loading, aiInsightData, handleInsightClick, handleCloseInsightModal } = useInsightHandler();

  return (
    <>
      {openInsightModal && (
        <AIInsightModal
          open={openInsightModal}
          onClose={handleCloseInsightModal}
          data={aiInsightData}
          loading={loading}
        />
      )}

      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <NavHeaders text="NBO Insights" />
        <Box textAlign="center">
          <marquee style={{ fontStyle: 'italic', fontSize: '14px', color: '#607D8B' }}>
            *The dashboard below presents the data for January*
          </marquee>
        </Box>
      </Stack>

      <Grid container spacing={2}>
        {Object.entries(metricData || {}).map(([label, value], index) => (
          <MetricCard key={index} label={label} value={String(value)} style={{ xs: 12, sm: 6, md: 4, lg: 4 }} />
        ))}
      </Grid>
      <Grid container spacing={2} mt={3}>
        <Grid item xs={12} sm={6} md={6}>
          <OfferTrendChart handleInsightClick={handleInsightClick} />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <InsightBox
            title="Offer Status by Age Group"
            desc="This chart provides a detailed view of offer acceptance rates across different age groups."
            data={offerbyAge}
            onClick={handleInsightClick}
          />
          <OfferStatsChart data={offerbyAge} />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <InsightBox
            title="Most Accepted Offers"
            desc="This chart shows the most accepted offers, helping to identify popular offers among customers."
            data={acceptedOffers}
            onClick={handleInsightClick}
          />
          <MostAcceptedOffers data={acceptedOffers} />
        </Grid>

        <Grid item xs={12} sm={6} md={6}>
          <InsightBox
            title="Plan Conversion"
            desc="This chart visualizes the conversion rates of different plans, helping to identify successful offerings."
            data={planConversion}
            onClick={handleInsightClick}
          />
          <PlanConversionFunnel data={planConversion} />
        </Grid>

        <Grid item xs={12} sm={6} md={6}>
          <InsightBox
            title="Total Offers Given and Accepted"
            desc="This chart provides a detailed view of total offers given and accepted."
            data={offerSunburst}
            onClick={handleInsightClick}
          />
          <OfferSunburstChart data={offerSunburst} />
        </Grid>

        <Grid item xs={12} sm={6} md={6}>
          <InsightBox
            title="Segmentation Hit Rate"
            desc="This chart shows the segmentation hit rate, helping to understand the effectiveness of customer segmentation strategies."
            data={segmentationData}
            onClick={handleInsightClick}
          />
          <SegmentationHitRateChart data={segmentationData} />
        </Grid>
      </Grid>
    </>
  );
}
