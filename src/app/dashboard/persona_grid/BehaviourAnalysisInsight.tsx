'use client';

import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  IconButton,
  Box,
  Paper,
  Skeleton,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface Props {
  open: boolean;
  onClose: () => void;
}

const BehaviourAnalysisInsight: React.FC<Props> = ({ open, onClose }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open) {
      setLoading(true);
      const timer = setTimeout(() => setLoading(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const description = `This heatmap visualizes customer segmentation based on ML clustering using retention score, stickiness score, ARPU, and churn probability. Each of the six segments displays average stickiness, promoter score, ARPU, and retention score (inverse of churn probability) with background gradient intensity indicating customer distribution.`;

  const insights = [
    "The 'Hyper-Loyal Customers' segment has the highest retention score, indicating strong loyalty.",
    "The 'Loyal High-Value Customers' segment has the highest stickiness score, suggesting frequent engagement.",
    "The 'Loyal Revenue Drivers' segment has the highest ARPU, contributing significantly to revenue.",
    "The 'Elite Patrons' segment has a high promotion score, indicating responsiveness to promotions.",
    "The 'Hyper-Loyal Patrons' segment is the largest, with 9755 customers, offering a significant target for retention strategies."
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography fontWeight="bold">Explainable AI</Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ background: '#fdfdfd' }}>
        {/* About Section */}
        <Paper
          elevation={0}
          sx={{
            border: '1px solid #e0e0e0',
            borderRadius: 2,
            p: 2,
            backgroundColor: '#f4f6fa',
            mb: 3,
          }}
        >
          <Typography fontWeight="bold" sx={{ mb: 1 }}>
            Know more about Behavioural Analysis
          </Typography>
          {loading ? (
            <Skeleton variant="rectangular" height={80} />
          ) : (
            <Typography variant="body2" color="text.secondary">
              {description}
            </Typography>
          )}
        </Paper>

        {/* AI Insights Section */}
        <Paper
          elevation={0}
          sx={{
            border: '1px solid #e0e0e0',
            borderRadius: 2,
            p: 2,
            backgroundColor: '#f9f9ff',
            maxHeight: 280,
            overflowY: 'auto',
          }}
        >
          <Typography fontWeight="bold" sx={{ mb: 1 }}>
            AI Insights
          </Typography>
          {loading ? (
            <Box>
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} height={20} width={`${90 - i * 5}%`} sx={{ mb: 1 }} />
              ))}
            </Box>
          ) : (
            <List dense disablePadding>
              {insights.map((text, index) => (
                <ListItem key={index} sx={{ pl: 2.5 }}>
                  <ListItemText
                    primary={<Typography variant="body2">* {text}</Typography>}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Paper>
      </DialogContent>
    </Dialog>
  );
};

export default BehaviourAnalysisInsight;
