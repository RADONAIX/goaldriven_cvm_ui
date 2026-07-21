'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import CloseIcon from '@mui/icons-material/Close';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';

interface AIInsightModalProps {
  open: boolean;
  onClose: () => void;
  data: {
    title: string;
    key_points: string[];
    recommended_actions: string[];
  } | null;
  loading?: boolean;
}

const AIInsightModalRetention: React.FC<AIInsightModalProps> = ({ open, onClose, data, loading = false }) => {
  const router = useRouter();

  const handleCreateCase = (data: any) => {
    const insightsText = data.key_insights.join('\n• ');
    const actionsText = data.recommended_actions.join('\n• ');
    const fullDescription = `Problems :\n• ${insightsText}\n\nRecommended Actions:\n• ${actionsText}`;

    localStorage.setItem(
      'draft_case',
      JSON.stringify({
        title: data.title,
        description: fullDescription,
        priority: 'high',
        dueDate: '',
        assignee: '',
        department: '',
      })
    );

    router.push('/dashboard/casemanagement');
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 3,
          pt: 2,
        }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <LightbulbOutlinedIcon sx={{ color: '#2196f3' }} />
          <Typography
            variant="h6"
            sx={{
              background: 'linear-gradient(to right, #1976d2, #64b5f6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 600,
            }}
          >
            AI Insight
          </Typography>
        </Box>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Content */}
      <DialogContent dividers sx={{ minHeight: 200 }}>
        {loading || !data ? (
          <Box display="flex" flexDirection="column" alignItems="center" mt={4} gap={2}>
            <CircularProgress color="primary" />
            <Typography variant="body2" fontStyle="italic" color="textSecondary">
              Generating insights with AI...
            </Typography>
          </Box>
        ) : (
          <>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              🔍 Key Insights
            </Typography>

            <ul>
              {data.key_points?.map((insight, idx) => (
                <li key={`insight-${idx}`}>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    {insight}
                  </Typography>
                </li>
              ))}
            </ul>

            <Typography variant="subtitle1" fontWeight="bold" gutterBottom mt={2}>
              🛠️ Recommended Actions
            </Typography>
            <ul>
              {data.recommended_actions.map((action, idx) => (
                <li key={`action-${idx}`}>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    {action}
                  </Typography>
                </li>
              ))}
            </ul>
          </>
        )}
      </DialogContent>

      {/* Footer */}
      {!loading && data && (
        <Box display="flex" justifyContent="space-between" alignItems="center" px={3} py={2}>
          <Typography variant="caption" color="textSecondary">
            Powered by Agentic AI
          </Typography>
          {/* 
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" color="primary" onClick={() => alert('Email alert triggered')}>
              ✉️ Email Alert
            </Button>
            <Button variant="outlined" color="secondary" onClick={() => alert('SMS alert triggered')}>
              📱 SMS Alert
            </Button>
            <Button variant="outlined" color="secondary" onClick={() => handleCreateCase(data)} >
              🗂️ Create Case
            </Button>
          </Stack> */}
        </Box>
      )}
    </Dialog>
  );
};

export default AIInsightModalRetention;
