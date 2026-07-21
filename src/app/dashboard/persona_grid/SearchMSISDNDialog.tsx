'use client';

import React, { useEffect, useState } from 'react';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CloseIcon from '@mui/icons-material/Close';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';

import { getMSISDNInisghtGrid } from '@/hooks/server-actions/persona-grid';

type SegmentInfoDialogProps = {
  open: boolean;
  onClose: () => void;
  msisdn: string;
};

const InfoBlock = ({
  label,
  value,
  color = '#F4F6F8',
  loading = false,
}: {
  label: string;
  value: string | number;
  color?: string;
  loading?: boolean;
}) => (
  <Box
    sx={{
      backgroundColor: color,
      px: 2,
      py: 1.5,
      borderRadius: 2,
      minHeight: 80,
      textAlign: 'center',
      border: '1px solid #E0E0E0',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    }}
  >
    <Typography variant="caption" color="text.secondary">
      {label}
    </Typography>
    {loading ? (
      <Skeleton width="60%" sx={{ mx: 'auto' }} />
    ) : (
      <Typography fontWeight={600} fontSize={15}>
        {value}
      </Typography>
    )}
  </Box>
);

const SearchMSISDNDialog: React.FC<SegmentInfoDialogProps> = ({ open, onClose, msisdn }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open) {
      setLoading(true);
      getMSISDNInisghtGrid(msisdn)
        .then((res) => setData(res))
        .catch(() => setData(null))
        .finally(() => setLoading(false));
    }
  }, []);

  const display = (key: string, defaultVal = 'N/A') => data?.[key] ?? defaultVal;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between " alignItems="center">
          <Typography variant="h6" fontWeight="bold">
            Segment Details
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent dividers sx={{ backgroundColor: '#FAFAFA', pb: 4 }}>
        <Stack spacing={4}>
          {/* Name + Summary */}
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Paper
                elevation={3}
                sx={{
                  height: '100%',
                  p: 2,
                  borderRadius: 3,
                  background: 'linear-gradient(to bottom right, #E3F2FD, #EDE7F6)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                <Typography variant="h6" fontWeight={700} sx={{ color: '#3F51B5' }}>
                  {loading ? <Skeleton width="80%" /> : display('full_name')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  MSISDN: {loading ? <Skeleton width="60%" /> : display('msisdn')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Age: {loading ? <Skeleton width="40%" /> : display('age')}
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} md={8}>
              <Paper
                sx={{
                  p: 2,
                  bgcolor: '#FFFFFF',
                  borderLeft: '4px solid #FF7043',
                  borderRadius: 2,
                  maxHeight: 200,
                  overflowY: 'auto',
                }}
                elevation={1}
              >
                <Typography variant="body2" mb={1}>
                  {loading ? <Skeleton height={60} /> : display('short_story')}
                </Typography>

                <Paper
                  sx={{
                    backgroundColor: '#FFF3E0',
                    p: 1,
                    borderRadius: 1,
                    mt: 1,
                    display: 'inline-block',
                  }}
                  elevation={0}
                >
                  <Typography fontWeight="bold" fontSize="14px">
                    Key Insight:
                  </Typography>
                  <Typography variant="body2">{loading ? <Skeleton width={300} /> : display('highlight')}</Typography>
                </Paper>
              </Paper>
            </Grid>
          </Grid>

        {/* Attributes */}
<Grid container spacing={2}>
  {[
    { key: 'gender', label: 'Gender' },
    { key: 'subscriber_type', label: 'Subscriber Type' },
    { key: 'tenure_type', label: 'Customer Tenure' },
  ].map(({ key, label }, idx) => (
    <Grid item xs={12} sm={4} key={idx}>
      <Typography variant="body2">
        <strong>{label}:</strong> {loading ? <Skeleton width={80} /> : display(key)}
      </Typography>
    </Grid>
  ))}
</Grid>


          <Divider />

          {/* Usage */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <InfoBlock label="📞 Voice Usage" value={display('voice_usage')} loading={loading} color="#E8F5E9" />
            </Grid>
            <Grid item xs={12} sm={4}>
              <InfoBlock label="💬 SMS Usage" value={display('sms_usage')} loading={loading} color="#F3E5F5" />
            </Grid>
            <Grid item xs={12} sm={4}>
              <InfoBlock label="🌐 Data Usage" value={display('data_usage')} loading={loading} color="#E3F2FD" />
            </Grid>
          </Grid>

          {/* Value Segment */}
          <Box>
            <Typography
              variant="subtitle2"
              fontWeight="bold"
              sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}
            >
              <EmojiObjectsIcon fontSize="small" /> Behavioral Value Segment
            </Typography>
            <Grid container spacing={2}>
              {[
                ['Segment Name', 'segment_name', '#E0F2F1'],
                ['Retention Score', 'retention_score', '#E8F5E9'],
                ['Stickiness Score', 'stickness_score', '#FFFDE7'],
                ['ARPU', 'arpu', '#F3E5F5'],
                ['Promotion Score', 'promotion_score', '#E1F5FE'],
              ].map(([label, key, color], idx) => (
                <Grid item xs={12} sm={6} md={3} key={idx}>
                  <InfoBlock
                    label={label as string}
                    value={display(key as string)}
                    loading={loading}
                    color={color as string}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Migration Matrix */}
          <Box>
            <Typography
              variant="subtitle2"
              fontWeight="bold"
              sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}
            >
              <CalendarMonthIcon fontSize="small" /> Migration Matrix
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <InfoBlock
                  label="📅 January Decile"
                  value={display('jan_decile')}
                  loading={loading}
                  color="#FFF3E0"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InfoBlock
                  label="📅 February Decile"
                  value={display('feb_decile')}
                  loading={loading}
                  color="#E1F5FE"
                />
              </Grid>
            </Grid>
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default SearchMSISDNDialog;
