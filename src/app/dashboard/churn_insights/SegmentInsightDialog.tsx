'use client';

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Box,
  Button,
  Skeleton,
} from '@mui/material';

interface SegmentInsightRow {
  label: string;
  value: string | number;
}

interface SegmentInsightData {
  explanation: string;
  recommendation: string;
  table: SegmentInsightRow[];
  segmentTitle: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  data: SegmentInsightData;
  loading: boolean;
}

export default function SegmentInsightDialog({ open, onClose, data, loading }: Props) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 'bold' }}>
        {loading ? <Skeleton width="60%" /> : `${data?.segmentTitle} Details`}
      </DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <>
            <Skeleton width="40%" height={24} sx={{ mb: 2 }} />
            <Skeleton width="100%" height={60} sx={{ mb: 1 }} />
            <Skeleton width="80%" height={40} sx={{ mb: 3 }} />
            <Skeleton variant="rectangular" width="100%" height={120} sx={{ borderRadius: 1 }} />
          </>
        ) : (
          <>
            <Typography variant="subtitle2" fontWeight="bold" mb={0.5}>
              Customers: {data.table.length}
            </Typography>

            <Box sx={{ mt: 2 }}>
              <Typography variant="body1" fontWeight="bold" gutterBottom>
                Segment Explanation:
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                ✅ {data.explanation}
              </Typography>

              <Typography variant="body1" fontWeight="bold" gutterBottom>
                Advanced Recommendation (Retention Strategy):
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {data.recommendation}
              </Typography>
            </Box>

            <Box sx={{ mt: 3 }}>
              <Button variant="outlined" color="error" sx={{ mb: 1 }}>
                Download Segment Data (CSV)
              </Button>

              <Table size="small" sx={{ border: '1px solid #eee', borderRadius: 2 }}>
                <TableBody>
                  {data.table.map((row, idx) => (
                    <TableRow key={idx}>
                      <TableCell sx={{ fontWeight: 500 }}>{row.label}</TableCell>
                      <TableCell>{row.value}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
