'use client';

import React, { FC, useEffect, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import ReactMarkdown from 'react-markdown';

type Props = {
  open: boolean;
  onClose: () => void;
  XAIdata: string | null;
};

const ChurnExplanationDialog: FC<Props> = ({ open, onClose, XAIdata }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open && XAIdata) {
      setLoading(false);
    }
  }, [open, XAIdata]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ bgcolor: '#f5f5f5', pb: 1.5 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight={600}>
            XAI – Churn Prediction
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 3, backgroundColor: '#fcfcfc' }}>
        {loading ? (
          <Stack spacing={2}>
            <Skeleton height={30} width="70%" />
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} height={20} width={`${90 - i * 4}%`} />
            ))}
          </Stack>
        ) : (
          <Box sx={{ typography: 'body2' }}>
            <ReactMarkdown>{XAIdata}</ReactMarkdown>
            <Divider sx={{ my: 3 }} />
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ChurnExplanationDialog;
