'use client';

import React, { useEffect, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import GroupIcon from '@mui/icons-material/Group';
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';

import { personaGridGetInsight } from '@/hooks/server-actions/ml-apis';

type Props = {
  open: boolean;
  onClose: () => void;
};

const sampleData = {
  overview:
    'The customer base exhibits a wide range of behaviors and characteristics, with ARPU values spanning from $7.02 to $6,246.44 and retention rates between 0.04 and 1.00. The average customer is around 50 years old, has been with the service for approximately 913 days, and uses around 25.56 GB of data, 277.68 minutes of voice, and sends 120 SMS per month. The customer segmentation reveals various patterns, including differences in data, voice, and SMS usage, as well as distinct lifecycle stages and churn rates.',
  key_insights:
    "Key observations include the fact that postpaid customers tend to have higher ARPU values than prepaid customers, with 94 postpaid customers in the low ARPU category and 11 in the high ARPU category. The churn analysis by age and gender reveals that medium-aged males have the highest churn rate, with 7 cases of high churn. The lifecycle analysis shows that customers in the 'established' stage have the highest ARPU, at $536.13, while those in the 'new' stage have the lowest, at $286.97. The graph summaries also highlight the skewed distribution of data, voice, and SMS usage, with average values far below the maximum values.",
  strategic_takeaway:
    "To improve customer retention and increase ARPU, the company should focus on tailoring promotions and services to specific customer segments, such as postpaid customers and those in the 'established' lifecycle stage. Additionally, targeted marketing efforts should be directed towards medium-aged males to reduce churn rates. The company should also consider offering personalized data, voice, and SMS plans to cater to the diverse usage patterns of its customers, and explore opportunities to upsell or cross-sell services to high-usage customers.",
};

const PersonaGridInsightsDialog: React.FC<Props> = ({ open, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{
    overview?: string;
    key_insights?: string;
    strategic_takeaway?: string;
  }>(null);

  useEffect(() => {
    if (open) {
      setLoading(true);
      personaGridGetInsight()
        .then((res) => {
          setData(res?.data ?? {});
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching insights:', error);
          setData(sampleData); // Fallback to sample data
          setLoading(false);
        });
    }
  }, []);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={1} alignItems="center">
            <GroupIcon color="primary" />
            <Typography variant="h6">Persona Grid Strategic Insights</Typography>
          </Stack>
          <Tooltip title="Close">
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        {loading ? (
          <Stack spacing={2}>
            {[...Array(3)].map((_, idx) => (
              <Box key={idx}>
                <Skeleton variant="text" height={28} width="70%" />
                <Skeleton variant="text" height={20} width="95%" />
                <Skeleton variant="text" height={20} width="90%" />
                <Skeleton variant="text" height={20} width="85%" />
                <Skeleton variant="text" height={20} width="80%" />
                <Divider sx={{ my: 2 }} />
              </Box>
            ))}
          </Stack>
        ) : (
          <Stack spacing={3}>
            {data.overview && (
              <Box>
                <Typography variant="subtitle1" fontWeight={600}>
                  🧠 Overview
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {data.overview}
                </Typography>
              </Box>
            )}

            {data.key_insights && (
              <Box>
                <Typography variant="subtitle1" fontWeight={600}>
                  📌 Key Insights
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {data.key_insights}
                </Typography>
              </Box>
            )}

            {data.strategic_takeaway && (
              <Box>
                <Typography variant="subtitle1" fontWeight={600}>
                  🚀 Strategic Takeaway
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {data.strategic_takeaway}
                </Typography>
              </Box>
            )}
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PersonaGridInsightsDialog;
