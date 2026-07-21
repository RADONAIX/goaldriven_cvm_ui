'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  Paper,
  Radio,
  RadioGroup,
  Slider,
  Typography,
} from '@mui/material';
import NavHeaders from '@/components/navHeaders';

interface CustomerParams {
  satisfaction: number;
  supportTickets: number;
  voiceUsage: number;
  dataUsage: number;
  smsUsage: number;
  avgSpending: number;
  lifetimeValue: number;
}

const getDefaults = (segmentation: 'churn' | 'active'): CustomerParams =>
  segmentation === 'churn'
    ? {
        satisfaction: 2.0,
        supportTickets: 8.0,
        voiceUsage: 86.0,
        dataUsage: 24.66,
        smsUsage: 45.0,
        avgSpending: 28.5,
        lifetimeValue: 796.35,
      }
    : {
        satisfaction: 8.0,
        supportTickets: 1.0,
        voiceUsage: 208.0,
        dataUsage: 32.62,
        smsUsage: 167.0,
        avgSpending: 150.0,       // scaled down for formula balance
        lifetimeValue: 5000.0,    // scaled down for formula balance
      };

const calculateChurnForChurnSegment = (p: CustomerParams) => {
  const base = 20;
  const adjustment =
    (10 - p.satisfaction) * 5 +
    p.supportTickets * 2 -
    p.voiceUsage * 0.1 -
    p.avgSpending / 200 -
    p.dataUsage * 0.05 -
    p.smsUsage * 0.02 -
    p.lifetimeValue / 500;

  return Math.min(Math.max(base + adjustment, 0), 100);
};

const calculateChurnForActiveSegment = (p: CustomerParams) => {
  const base = 5; // Active customers start with low churn risk

  const adjustment =
    (10 - p.satisfaction) * 6 +                  // satisfaction matters more
    p.supportTickets * 2 -                       // bad support experience
    p.voiceUsage * 0.08 -                        // usage lowers churn
    p.avgSpending / 180 -                        // more spending = lower churn
    p.dataUsage * 0.05 -                         // data helps
    p.smsUsage * 0.02 -                          // sms helps
    p.lifetimeValue / 400;                       // higher loyalty = lower churn

  return Math.min(Math.max(base + adjustment, 0), 100);
};


export default function Page(): React.JSX.Element {
  const [state, setState] = useState<'churn' | 'active'>('churn');
  const [params, setParams] = useState<CustomerParams>(getDefaults('churn'));
  const [churnProbability, setChurnProbability] = useState(
    calculateChurnForChurnSegment(getDefaults('churn'))
  );
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const prob =
      state === 'churn'
        ? calculateChurnForChurnSegment(params)
        : calculateChurnForActiveSegment(params);
    setChurnProbability(prob);
  }, [params, state]);

  const handleSliderChange =
    (name: keyof CustomerParams) => (_: Event, value: number | number[]) => {
      setParams((prev) => ({
        ...prev,
        [name]: value as number,
      }));
    };

  const handleStateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newState = event.target.value as 'churn' | 'active';
    const defaults = getDefaults(newState);
    setState(newState);
    setParams(defaults);
    const prob =
      newState === 'churn'
        ? calculateChurnForChurnSegment(defaults)
        : calculateChurnForActiveSegment(defaults);
    setChurnProbability(prob);
  };

  const handleClickOpen = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  return (
    <Paper sx={{ p: 3 }}>
      <NavHeaders text="Churn Simulation & What If Analysis" />

      <RadioGroup row value={state} onChange={handleStateChange} sx={{ my: 2 }}>
        <FormControlLabel value="churn" control={<Radio size="small" />} label="Churn" />
        <FormControlLabel value="active" control={<Radio size="small" />} label="Active" />
      </RadioGroup>

      <Grid container spacing={2}>
        {[
          { label: 'Customer Satisfaction (1–10)', field: 'satisfaction', min: 1, max: 10, step: 1 },
          { label: 'Number of Support Tickets (0–10)', field: 'supportTickets', min: 0, max: 10, step: 1 },
          { label: 'Voice Monthly Usage (0–300 min)', field: 'voiceUsage', min: 0, max: 300, step: 10 },
          { label: 'Data Monthly Usage (0–50 GB)', field: 'dataUsage', min: 0, max: 50, step: 1 },
          { label: 'SMS Monthly Usage (0–500 msgs)', field: 'smsUsage', min: 0, max: 500, step: 10 },
          { label: 'Avg Monthly Spending ($0–500)', field: 'avgSpending', min: 0, max: 500, step: 10 },
          { label: 'Customer Lifetime Value ($0–10000)', field: 'lifetimeValue', min: 0, max: 10000, step: 100 },
        ].map(({ label, field, min, max, step }) => (
          <Grid item xs={12} sm={6} key={field}>
            <Typography variant="subtitle1" gutterBottom>
              {label}
            </Typography>
            <Slider
              size="small"
              value={params[field as keyof CustomerParams]}
              onChange={handleSliderChange(field as keyof CustomerParams)}
              min={min}
              max={max}
              step={step}
              valueLabelDisplay="auto"
              sx={{ width: '100%' }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
              <Typography>{min}</Typography>
              <Typography>{max}</Typography>
            </Box>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="subtitle1" gutterBottom>
          Predicted Churn Probability:{' '}
          <strong>{churnProbability.toFixed(2)}%</strong>
        </Typography>
        <Button variant="contained" onClick={handleClickOpen}>
          Save This Scenario
        </Button>
      </Box>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Scenario Saved</DialogTitle>
        <DialogContent>
          <Typography variant="body1">The simulation has been saved successfully!</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
