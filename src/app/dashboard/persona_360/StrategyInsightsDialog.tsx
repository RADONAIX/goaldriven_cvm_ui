'use client';

import React, { useEffect, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import InsightsIcon from '@mui/icons-material/Insights';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Paper,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';

import { persona360GetInsight } from '@/hooks/server-actions/persona-360';

type Props = {
  open: boolean;
  onClose: () => void;
};

const sampleData = {
  overview:
    'The Persona-360 dashboard provides insights into the subscriber base, usage patterns, revenue, customer satisfaction, and promotion trends. With 220 total subscribers, the average revenue per user (ARPU) is $439.99, and the average customer satisfaction (CSAT) score is 6.58. The data reveals a mix of postpaid and prepaid subscribers, with varying usage patterns across SMS, voice, and data services.',
  key_insights: [
    'The subscriber base is evenly split between postpaid (120) and prepaid (100) plans, with a diverse age distribution ranging from 18 to 80 years old.',
    'Average monthly usage includes 120.41 SMS, 277.68 hours of voice, and 25.56 GB of data, indicating a moderate to high level of engagement.',
    'Revenue has been steadily increasing, with a notable spike in November 2024, and is primarily generated through email and app notification channels.',
    'Customer satisfaction is relatively high, with an average CSAT score of 6.58, and a significant portion of subscribers (60) reporting a perfect score of 10.',
    'Promotion trends show a correlation between promotion scores and stickiness, with an average promotion score of 0.5 and an average stickiness score of 1.0.',
  ],
  strategic_takeaway:
    'To further improve customer satisfaction and revenue, it is recommended to focus on targeted promotions and personalized engagement strategies, particularly through email and app notification channels, to capitalize on the existing high level of engagement and loyalty among subscribers.',
};

const StrategyInsightsDialog: React.FC<Props> = ({ open, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (open) {
      setLoading(true);
      persona360GetInsight()
        .then((res) => {
          setData(res.data ?? sampleData);
        })
        .catch(() => {
          setData(sampleData);
        })
        .finally(() => setLoading(false));
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={1} alignItems="center">
            <InsightsIcon color="primary" />
            <Typography variant="h6" fontWeight={600}>
              AI Strategy Insights
            </Typography>
          </Stack>
          <Tooltip title="Close">
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </DialogTitle>

      <DialogContent dividers sx={{ backgroundColor: '#fafafa', py: 3 }}>
        {loading ? (
          <Stack spacing={2}>
            {[...Array(4)].map((_, i) => (
              <Box key={i}>
                <Skeleton variant="rectangular" height={20} width="60%" />
                <Skeleton variant="text" width="95%" />
                <Skeleton variant="text" width="90%" />
                <Divider sx={{ my: 2 }} />
              </Box>
            ))}
          </Stack>
        ) : (
          <Stack spacing={4}>
            {/* Overview */}
            <Paper
              variant="outlined"
              sx={{
                p: 3,
                borderRadius: 2,
                background: '#e3f2fd',
              }}
            >
              <Typography variant="subtitle1" fontWeight={600} sx={{ display: 'flex', alignItems: 'center' }}>
                <LightbulbIcon sx={{ mr: 1, color: '#0288d1' }} />
                Persona Overview
              </Typography>
              <Typography variant="body2" color="text.secondary" mt={1}>
                {data?.overview}
              </Typography>
            </Paper>

            {/* Key Insights */}
            <Paper
              variant="outlined"
              sx={{
                p: 3,
                borderRadius: 2,
                background: '#fff3e0',
              }}
            >
              <Typography variant="subtitle1" fontWeight={600} sx={{ display: 'flex', alignItems: 'center' }}>
                <LightbulbIcon sx={{ mr: 1, color: '#f57c00' }} />
                Key Insights
              </Typography>

              <Stack spacing={2} mt={2}>
                {data?.key_insights?.map((insight: string, idx: number) => (
                  <Box key={idx} sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <Typography variant="body2" color="text.secondary">
                      * {insight}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Paper>

            {/* Strategic Takeaway */}
            <Paper
              variant="outlined"
              sx={{
                p: 3,
                borderRadius: 2,
                background: '#ede7f6',
              }}
            >
              <Typography variant="subtitle1" fontWeight={600} sx={{ display: 'flex', alignItems: 'center' }}>
                <LightbulbIcon sx={{ mr: 1, color: '#7e57c2' }} />
                Strategic Takeaway
              </Typography>
              <Typography variant="body2" color="text.secondary" mt={1}>
                {data?.strategic_takeaway}
              </Typography>
            </Paper>
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default StrategyInsightsDialog;
