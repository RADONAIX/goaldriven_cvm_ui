'use client';

import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

interface Column {
  field: string;
  label: string;
}

interface SimpleTableModalProps {
  title: string;
  open: boolean;
  onClose: () => void;
  loading: boolean;
  columns: Column[];
  rows: Record<string, any>[];
}

const SimpleTableModal: React.FC<SimpleTableModalProps> = ({ title, open, onClose, loading, columns, rows }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="lg"
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: 6,
          p: 0,
        },
      }}
    >
      <Box display="flex" alignItems="center" justifyContent="space-between" px={3} pt={2}>
        <DialogTitle
          sx={{
            fontWeight: 700,
            fontSize: '1.3rem',
            color: 'text.primary',
            flexGrow: 1,
            p: 0,
          }}
        >
          {title}
        </DialogTitle>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent sx={{ pt: 2, pb: 3 }}>
        {loading ? (
          <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height={300}>
            <CircularProgress />
            <Typography variant="body2" color="text.secondary" mt={2}>
              Loading data...
            </Typography>
          </Box>
        ) : rows.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No records found.
          </Typography>
        ) : (
          <Paper
            elevation={0}
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              overflow: 'hidden',
            }}
          >
            <Box sx={{ maxHeight: 500, overflowY: 'auto' }}>
              <Table size="small">
                <TableHead
                  sx={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 1,
                    bgcolor: 'grey.100',
                    boxShadow: 'inset 0px -1px 0px rgba(224, 224, 224, 1)',
                  }}
                >
                  <TableRow>
                    {columns.map((col) => (
                      <TableCell
                        key={col.field}
                        sx={{
                          fontWeight: 600,
                          color: 'text.secondary',
                          fontSize: '0.875rem',
                          py: 1,
                        }}
                      >
                        {col.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row, idx) => (
                    <TableRow
                      key={idx}
                      hover
                      sx={{
                        '&:nth-of-type(odd)': {
                          backgroundColor: 'grey.50',
                        },
                      }}
                    >
                      {columns.map((col) => (
                        <TableCell key={col.field} sx={{ py: 1 }}>
                          {(() => {
                            const value = row[col.field];
                            if (value instanceof Date) return value.toLocaleString();
                            if (value === null || value === undefined) return '-';
                            return String(value);
                          })()}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Paper>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SimpleTableModal;
