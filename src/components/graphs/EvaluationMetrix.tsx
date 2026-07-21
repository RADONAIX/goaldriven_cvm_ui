'use client';

import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  Typography,
  useTheme,
} from '@mui/material';

export const EvaluationMetrics: React.FC = () => {
  const theme = useTheme();

  const models = [
    {
      role: 'Champion Model',
      modelName: 'SVM_Model_2',
      accuracy: '91%',
      f1Score: '0.91',
      color: 'primary',
    },
    {
      role: 'Challenger Model',
      modelName: 'Random_Forest_Model_5',
      accuracy: '86%',
      f1Score: '0.81',
      color: 'error',
    },
  ];

  return (
    <Grid container spacing={4} justifyContent="center">
      {models.map((model) => (
        <Grid item xs={12} sm={10} md={6} key={model.modelName}>
          <Card
            elevation={3}
            sx={{
              borderRadius: 4,
              background: `linear-gradient(145deg, ${theme.palette.background.paper}, ${theme.palette.grey[100]})`,
              border: `1px solid ${theme.palette.divider}`,
              boxShadow: `0 4px 12px rgba(0, 0, 0, 0.05)`,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-6px)',
                boxShadow: `0 10px 28px rgba(0, 0, 0, 0.15)`,
              },
            }}
          >
            <CardContent>
              <Box display="flex" justifyContent="center" mb={2}>
                <Chip
                  label={model.role}
                  color={model.color as 'primary' | 'secondary'}
                  variant="filled"
                  sx={{
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                    px: 2,
                    py: 1,
                  }}
                />
              </Box>

              <Typography
                variant="h5"
                align="center"
                fontWeight={700}
                gutterBottom
                sx={{
                  color: theme.palette.text.primary,
                }}
              >
                {model.modelName}
              </Typography>

              <Box
                display="flex"
                justifyContent="space-around"
                alignItems="center"
                mt={2}
              >
                <Box textAlign="center">
                  <Typography variant="subtitle1" fontWeight={500}>
                    Accuracy
                  </Typography>
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    color={theme.palette.success.main}
                  >
                    {model.accuracy}
                  </Typography>
                </Box>

                <Box textAlign="center">
                  <Typography variant="subtitle1" fontWeight={500}>
                    F1 Score
                  </Typography>
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    color={theme.palette.info.main}
                  >
                    {model.f1Score}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default EvaluationMetrics;
