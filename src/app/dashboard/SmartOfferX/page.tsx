'use client';

import React, { useState } from 'react';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Skeleton,
  Slide,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';
import ReactECharts from 'echarts-for-react';

import { fetchSmartOfferXData } from '@/hooks/server-actions/SmartOfferX'; // Adjust path

const offers = [
  {
    title: 'Unlimited Data Upgrade',
    reason:
      "The customer's current data plan usage is 32.62GB out of 10GB, indicating a high data usage pattern. Upgrading to an unlimited data plan would cater to their needs and reduce the likelihood of exceeding their current limit.",
    agent_pitch:
      "Hi Sara, I see you're using a significant amount of data. I can offer you an upgrade to our Unlimited Data plan for just $69, which includes 50GB of high-speed data and unlimited talk and text.",
    acceptance_rate: '60%',
    arpu_increase: '15%',
    limited_time: 'Valid until March 31, 2025',
  },
  {
    title: 'Add-On Data Booster',
    reason:
      "The customer's high data usage and frequent location changes suggest they may benefit from additional data. Offering a data booster add-on would provide them with more flexibility and convenience.",
    agent_pitch:
      'Hi Sara, I can offer you our $30 Data Booster add-on, which gives you an extra 50GB of data for 100 days. This would be perfect for your frequent trips to Montana and ensure you stay connected.',
    acceptance_rate: '55%',
    arpu_increase: '10%',
    limited_time: 'One-time offer, valid for the next 48 hours',
  },
  {
    title: 'Premium Plan with Extra Benefits',
    reason:
      'As a high-revenue customer with a high customer satisfaction rating, offering a premium plan with extra benefits would enhance their overall experience and increase loyalty.',
    agent_pitch:
      "Hi Sara, I'd like to offer you our Premium Plan, which includes unlimited data, talk, and text, as well as exclusive benefits like priority customer support and free roaming. This plan is tailored to your high usage patterns and would provide you with the best possible experience.",
    acceptance_rate: '65%',
    arpu_increase: '20%',
    limited_time: 'Valid until the end of the current billing cycle',
  },
];

const SmartOfferDashboard = () => {
  const [msisdn, setMsisdn] = useState('');
  const [error, setError] = useState('');
  const [customer, setCustomer] = useState<any | null>(null);
  const [open, setOpen] = useState(false);
  const [offerData, setOfferData] = useState<any | null>([]);
  const [loading, setLoading] = useState(false);
  const [expandedIndex, setExpandedIndex] = React.useState<number | null>(null);

  const handleClose = (_: unknown, reason?: string) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };
  const handleSearch = async () => {
    if (!msisdn || !/^\d{10,15}$/.test(msisdn)) {
      setError('Enter a valid MSISDN (10-15 digits)');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await fetchSmartOfferXData(Number(msisdn));
      setOfferData(res?.smartOffer || offers); // Use default offers if none returned
      if (res && res?.data.length > 0) {
        setCustomer(res.data[0]);
      } else {
        setCustomer(null);
        setError('No customer data found');
      }
    } catch (e) {
      // setError('Failed to fetch data');
      console.error('Error fetching customer data:', e);
    } finally {
      setLoading(false);
    }
  };

  const getEChartOption = () => {
    if (!customer) return {};
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return {
      tooltip: { trigger: 'axis' },
      legend: { data: ['Voice', 'SMS', 'Data'] },
      xAxis: {
        type: 'category',
        name: 'Months',
        nameLocation: 'middle',
        nameGap: 30,
        nameTextStyle: { fontSize: 14, fontWeight: 'bold', color: '#555' },
        data: months,
      },
      yAxis: {
        type: 'category',
        name: 'Usage',
        nameLocation: 'middle',
        nameGap: 60,
        nameTextStyle: { fontSize: 14, fontWeight: 'bold', color: '#555' },
        data: ['low', 'medium', 'high'],
      },
      series: [
        { name: 'Voice', type: 'line', data: customer.mom_voice_usage },
        { name: 'SMS', type: 'line', data: customer.mom_sms_usage },
        { name: 'Data', type: 'line', data: customer.mom_data_usage },
      ],
    };
  };

  return (
    <Box sx={{ py: 4 }}>
      <Typography variant="h4" mb={2}>
        Smart Offer X
      </Typography>

      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        TransitionComponent={(props) => <Slide {...props} direction="left" />}
      >
        <Alert
          icon={<CheckCircleOutlineIcon fontSize="inherit" />}
          severity="success"
          sx={{ fontSize: '0.9rem', borderRadius: 1 }}
          onClose={handleClose}
        >
          Offer activated successfully!
        </Alert>
      </Snackbar>

      <Card sx={{ mb: 4, p: 2 }}>
        <Typography variant="h6" mb={2}>
          Search Customer Details
        </Typography>
        <Grid container spacing={2} alignItems="flex-start">
          <Grid item xs={12} sm={10}>
            <TextField
              label="Enter MSISDN"
              variant="outlined"
              size="small"
              fullWidth
              value={msisdn}
              onChange={(e) => {
                const value = e.target.value;
                setMsisdn(value);
                if (/^\d{10,15}$/.test(value)) {
                  setError('');
                }
              }}
              error={!!error}
              helperText={error || ' '}
              InputProps={{
                sx: {
                  fontSize: '14px',
                  minHeight: '38px',
                },
              }}
              InputLabelProps={{
                sx: {
                  fontSize: '14px',
                },
              }}
              FormHelperTextProps={{
                sx: {
                  minHeight: '20px', // Reserve space even without error
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={2} display="flex" alignItems="center" justifyContent="center">
            <Button
              variant="contained"
              fullWidth
              sx={{
                minHeight: '38px',
                fontSize: '14px',
              }}
              onClick={handleSearch}
            >
              Search
            </Button>
          </Grid>
        </Grid>
      </Card>

      {loading ? (
        <Grid container spacing={2}>
          {[...Array(2)].map((_, i) => (
            <Grid item xs={12} key={i}>
              <Skeleton variant="rounded" height={140} />
            </Grid>
          ))}
          <Grid item xs={12}>
            <Skeleton variant="rounded" height={300} />
          </Grid>
          {[...Array(3)].map((_, i) => (
            <Grid item xs={12} md={4} key={i}>
              <Skeleton variant="rectangular" height={210} />
            </Grid>
          ))}
        </Grid>
      ) : (
        customer && (
          <>
            <Card sx={{ mb: 4, p: 2, boxShadow: 3, borderRadius: 2 }}>
              <Typography variant="h6" mb={2} fontWeight={600}>
                Customer Information
              </Typography>
              <Grid container spacing={2}>
                {[
                  { label: 'MSISDN', value: customer.msisdn },
                  { label: 'Customer Name', value: customer.full_name },
                  { label: 'Last Recharge', value: `$${customer.last_top_up_amount}` },
                  { label: 'Plan', value: customer.pack_name },
                  { label: 'Validity', value: `${customer.current_plan_validity} Days` },
                  {
                    label: 'Churn Score',
                    value: (
                      <Chip
                        label={`${customer.churn_probability} - ${customer.churn_risk}`}
                        color="success"
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    ),
                  },
                  {
                    label: 'Offer Response History',
                    value: `Accepted ${customer.total_offer_sent} times`,
                  },
                ].map(({ label, value }) => (
                  <Grid item xs={12} sm={3} key={label}>
                    <Typography
                      variant="caption"
                      sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}
                    >
                      {label}
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500, color: 'text.primary', mt: 0.5 }}>
                      {value}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            </Card>

            <Card sx={{ mb: 4 }}>
              <Typography variant="h6" m={2} fontWeight={600}>
                Customer Usage Trends
              </Typography>
              <ReactECharts option={getEChartOption()} style={{ height: 300, width: '100%' }} />
            </Card>
            <Typography variant="h6" gutterBottom>
              AI-Powered Offers
            </Typography>
            <Grid container spacing={2}>
              {offerData?.map((offer, index) => {
                const maxCardHeight = 400;
                const isExpanded = expandedIndex === index;
                const toggleExpanded = () => {
                  setExpandedIndex(isExpanded ? null : index);
                };

                return (
                  <Grid item xs={12} md={4} key={index}>
                    <Card
                      sx={{
                        height: `${maxCardHeight}px`,
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      <CardContent
                        sx={{
                          overflowY: 'auto',
                          flex: 1,
                        }}
                      >
                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                          {offer.title}
                        </Typography>

                        <Typography variant="body2" gutterBottom color="text.secondary">
                          {offer.reason}
                        </Typography>

                        <Typography variant="body2" sx={{ mt: 1 }}>
                          💬 <strong>Agent Pitch:</strong>{' '}
                          {isExpanded ? offer.agent_pitch : `${offer.agent_pitch.slice(0, 60)}...`}
                          {offer.agent_pitch.length > 60 && (
                            <Button onClick={toggleExpanded} size="small" sx={{ textTransform: 'none', ml: 1 }}>
                              {isExpanded ? 'See less' : 'See more'}
                            </Button>
                          )}
                        </Typography>

                        <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
                          📊 Acceptance Rate: {offer.acceptance_rate}
                        </Typography>

                        <Typography variant="body2" color="primary" sx={{ mt: 0.5 }}>
                          📈 ARPU Increase: {offer.arpu_increase}
                        </Typography>

                        <Typography variant="body2" sx={{ mt: 0.5 }} color="text.secondary">
                          ⏳ {offer.limited_time}
                        </Typography>
                      </CardContent>

                      <Box sx={{ p: 2, pt: 0 }}>
                        <Button
                          variant="contained"
                          fullWidth
                          onClick={() => setOpen(true)} // Replace with actual action
                        >
                          Activate Offer
                        </Button>
                      </Box>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </>
        )
      )}
    </Box>
  );
};

export default SmartOfferDashboard;
