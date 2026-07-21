'use client';

import React, { useEffect, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Paper,
  Stack,
  Typography,
  Skeleton
} from '@mui/material';

import { getMSISDNInisght } from '@/hooks/server-actions/persona-360';

type Props = {
  open: boolean;
  onClose: () => void;
  msisdn: string;
};

const MetricBlock = ({ label, value }: { label: string; value: string }) => (
  <Paper
    elevation={1}
    sx={{
      p: 1.5,
      borderRadius: 2,
      textAlign: 'center',
      backgroundColor: '#f7faff',
      height: '100%',
    }}
  >
    <Typography variant="caption" fontWeight={500} color="textSecondary">
      {label}
    </Typography>
    <Typography variant="subtitle2" fontWeight={600}>
      {value}
    </Typography>
  </Paper>
);

const formatK = (value: string | number) => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return `$${(num / 1000).toFixed(2)}K`;
};

const SearchMSISDN: React.FC<Props> = ({ open, onClose, msisdn }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, seterrorMsg] = useState(null);

  useEffect(() => {
    if (open) {
      setLoading(true);
      getMSISDNInisght(msisdn)
        .then((res) => {
          setData(res);
          console.log('res', res);
        })
        .catch((err) => {
          console.error('err', err?.message ?? err);
          setData(null);
          seterrorMsg(err?.message);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, []);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle sx={{ pb: 0 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight="bold">
            Persona 360 Overview
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent dividers sx={{ background: '#fafafa', minHeight: 300 }}>
        {loading ? (
          <Box sx={{ p: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Paper
                  elevation={2}
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                  }}
                >
                  <Skeleton variant="circular" width={64} height={64} />
                  <Skeleton width="60%" height={24} sx={{ mt: 2 }} />
                  <Skeleton width="80%" height={18} />
                </Paper>
              </Grid>

              <Grid item xs={12} md={8}>
                <Paper
                  sx={{
                    p: 2,
                    bgcolor: '#fff8f8',
                    borderLeft: '4px solid #ef5350',
                    borderRadius: 2,
                  }}
                  elevation={0}
                >
                  <Skeleton height={60} width="100%" />
                  <Skeleton height={40} width="80%" sx={{ mt: 2 }} />
                </Paper>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
              Customer Details
            </Typography>

            <Grid container spacing={2}>
              {Array.from({ length: 12 }).map((_, idx) => (
                <Grid key={idx} item xs={12} sm={6} md={3}>
                  <Skeleton variant="rounded" height={70} />
                </Grid>
              ))}
            </Grid>
          </Box>
        ) : data ? (
          <>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Paper
                  elevation={2}
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    background: 'linear-gradient(to bottom right, #e3f2fd, #ede7f6)',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                  }}
                >
                  <Typography variant="h6" fontWeight={700} sx={{ color: '#7e57c2' }}>
                    {data.full_name || 'N/A'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    MSISDN: {data.msisdn}
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} md={8}>
                <Paper
                  sx={{
                    p: 2,
                    bgcolor: '#fff8f8',
                    borderLeft: '4px solid #ef5350',
                    borderRadius: 2,
                    maxHeight: 180,
                    overflowY: 'auto',
                  }}
                  elevation={0}
                >
                  <Typography variant="body2">{data.customer_story}</Typography>
                  <Paper
                    sx={{
                      backgroundColor: '#fffde7',
                      p: 1,
                      mt: 1.5,
                      borderRadius: 1,
                      display: 'inline-block',
                    }}
                    elevation={0}
                  >
                    <Typography fontWeight="bold" fontSize="14px">
                      Key Insight:
                    </Typography>
                    <Typography variant="body2">{data.key_insight}</Typography>
                  </Paper>
                </Paper>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
              Customer Details
            </Typography>

            <Grid container spacing={2}>
              {[
                ['Age', data.age],
                ['Gender', data.gender],
                ['Days Active', `${data.days_active} Days`],
                ['Customer Type', data.subscriber_type],
                ['Social Media Engagement', data.social_media_engagement],
                ['Monthly Data Usage', `${data.data_usage} GB`],
                ['Monthly SMS Sent', `${data.sms_usage}`],
                ['Monthly Voice Usage', `${data.voice_usage} Hrs`],
                ['Revenue', formatK(data.total_revenue_generated_2)],
                ['ARPU', formatK(data.arpu)],
                ['CLV', formatK(data.customer_lifetime_value)],
                ['Promotion Score', parseFloat(data.promotion_score).toFixed(2)],
                ['Stickiness Score', parseFloat(data.stickness_score).toFixed(2)],
                ['Customer Satisfaction Rating', data.customer_satisfaction_rating],
              ].map(([label, value], idx) => (
                <Grid key={idx} item xs={12} sm={6} md={3}>
                  <MetricBlock label={label} value={String(value)} />
                </Grid>
              ))}
            </Grid>
          </>
        ) : (
          <Typography color="error">{errorMsg ?? 'Something went wrong. Failed to load customer data'}</Typography>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SearchMSISDN;
