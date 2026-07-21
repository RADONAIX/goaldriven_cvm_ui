'use client';

import * as React from 'react';
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  OutlinedInput,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { ResponsiveHeatMap } from '@nivo/heatmap';

import { useInsightHandler } from '@/hooks/useInsightHandler';
import AIInsightModal from '@/components/aiInsight';
import InsightBox from '@/components/chartTitle';
import { AccuracyChart } from '@/components/graphs/accuracyTrend';
import EvaluationMetrics from '@/components/graphs/EvaluationMetrix';
import FeatureImportanceChart from '@/components/graphs/featureImportance';
import LlmPerformanceChart from '@/components/graphs/llmPerformance';
import RocCurve from '@/components/graphs/roc';
import NavHeaders from '@/components/navHeaders';

export default function Page(): React.JSX.Element {
  const data = [
    {
      id: 'No Churn',
      data: [
        { x: 'No Churn', y: 800 },
        { x: 'Churn', y: 200 },
      ],
    },
    {
      id: 'Churn',
      data: [
        { x: 'No Churn', y: 150 },
        { x: 'Churn', y: 850 },
      ],
    },
  ];

  const metrics = [
    { label: 'Perplexity Score', value: '35.2' },
    { label: 'Avg. Response Time (ms)', value: '120' },
    { label: 'Token Usage per Query', value: '450' },
    { label: 'Confidence Score', value: '92%' },
  ];

  const { openInsightModal, loading, aiInsightData, handleInsightClick, handleCloseInsightModal } = useInsightHandler();
  return (
    <Box p={2}>
      {openInsightModal && (
        <AIInsightModal
          open={openInsightModal}
          onClose={handleCloseInsightModal}
          data={aiInsightData}
          loading={loading}
        />
      )}

      <Grid container spacing={4}>
        <Grid item>
          <NavHeaders text="Retention Model Insights" />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h5" fontWeight={700} textAlign="center" color="primary" gutterBottom>
            Evaluation Metrics
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <EvaluationMetrics />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h5" fontWeight={700} textAlign="center" color="primary" gutterBottom>
            Model Performance and Confusion Matrix
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Card elevation={4} style={{ height: 400 }}>
                <CardContent>
                  <AccuracyChart handleInsightClick={handleInsightClick} />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6}>
              <Card sx={{ padding: 2 }}>
                <div
                  style={{
                    height: 350,
                    width: '100%',
                    maxWidth: 600,
                    margin: '0 auto',
                  }}
                >
                  <InsightBox
                    title="Confusion Matrix"
                    desc="This confusion matrix visualizes the model's performance in predicting customer churn. It shows the number of true positives, true negatives, false positives, and false negatives."
                    data={data}
                    onClick={handleInsightClick}
                  />
                  {/* <h2
                    style={{
                      fontSize: 20,
                      fontWeight: 600,
                      marginBottom: 10,
                      textAlign: 'left',
                    }}
                  >
                    
                  </h2> */}
                  <ResponsiveHeatMap
                    data={data}
                    keys={['No Churn', 'Churn']}
                    indexBy="id"
                    margin={{ top: 60, right: 50, bottom: 60, left: 90 }}
                    valueFormat={(value) => `${value}`}
                    axisTop={{
                      tickSize: 5,
                      tickPadding: 5,
                      tickRotation: 0,
                      legend: 'Predicted',
                      legendOffset: -40,
                      legendPosition: 'middle',
                    }}
                    axisLeft={{
                      tickSize: 5,
                      tickPadding: 5,
                      tickRotation: 0,
                      legend: 'Actual',
                      legendOffset: -72,
                      legendPosition: 'middle',
                    }}
                    colors={{
                      type: 'sequential',
                      scheme: 'blues', // Blue background for heatmap
                    }}
                    cellOpacity={1}
                    cellBorderColor={{ from: 'color', modifiers: [['darker', 0.4]] }}
                    labelTextColor={{
                      from: 'color',
                      modifiers: [['darker', 2.5]], // Dynamically adjusts based on cell color
                    }}
                    theme={{
                      labels: {
                        text: {
                          fontSize: 14, // 👈 Adjust label font size here
                          fontWeight: 700,
                          fill: '#fff', // 👈 White text for inner labels
                        },
                      },
                      axis: {
                        legend: {
                          text: {
                            fontSize: 16,
                            fontWeight: 700,
                            fill: '#000', // Axis legend text stays black
                          },
                        },
                        ticks: {
                          text: {
                            fill: '#000', // Axis ticks stay black
                            fontSize: 12,
                          },
                        },
                      },
                    }}
                    animate={true}
                    motionConfig="wobbly"
                    hoverTarget="cell"
                    cellHoverOthersOpacity={0.25}
                  />
                </div>
              </Card>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6" fontWeight="medium" align="center" color="primary">
            Feature Importance & ROC/AUC
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Card
                elevation={2}
                sx={{
                  height: 500,
                  borderRadius: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  {/* <Typography variant="h6" fontWeight={600} gutterBottom>
                    Feature Importance
                  </Typography> */}

                  <Box sx={{ width: '100%', height: '100%' }}>
                    <FeatureImportanceChart handleInsightClick={handleInsightClick} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card
                elevation={2}
                sx={{
                  height: 500,
                  borderRadius: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ width: '100%', height: '100%' }}>
                    <RocCurve handleInsightClick={handleInsightClick} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6" fontWeight="medium" align="center" color="primary">
            LLM Insights
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TableContainer component={Paper} elevation={2}>
                <Table>
                  <TableBody>
                    {metrics.map((metric) => (
                      <TableRow key={metric.label}>
                        <TableCell
                          sx={{
                            fontWeight: 600,
                            background: 'linear-gradient(to right, #3f51b5, #9c27b0)',
                            color: '#fff',
                            width: '50%',
                          }}
                        >
                          {metric.label}
                        </TableCell>
                        <TableCell>{metric.value}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ borderColor: '#90caf9' }}>
                <CardContent>
                  <Typography component="ul" sx={{ pl: 2 }}>
                    <li>
                      <Typography component="span" fontWeight={600}>
                        Perplexity
                      </Typography>{' '}
                      measures how well the model predicts sample text — a lower value is better.
                    </li>
                    <li>
                      <Typography component="span" fontWeight={600}>
                        Response Time
                      </Typography>{' '}
                      indicates the average time (in milliseconds) taken for model responses.
                    </li>
                    <li>
                      <Typography component="span" fontWeight={600}>
                        Token Usage
                      </Typography>{' '}
                      reflects the number of tokens processed per query, which is important for{' '}
                      <strong>cost management</strong>.
                    </li>
                    <li>
                      <Typography component="span" fontWeight={600}>
                        Confidence Score
                      </Typography>{' '}
                      represents the model&apos;s certainty in its predictions.
                    </li>
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <LlmPerformanceChart />
        </Grid>
      </Grid>
    </Box>
  );
}
