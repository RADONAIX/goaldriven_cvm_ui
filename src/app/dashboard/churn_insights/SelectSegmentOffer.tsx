'use client';

import * as React from 'react';
import { Alert, Autocomplete, Box, Button, Chip, Snackbar, TextField, Typography } from '@mui/material';

type Segment = {
  title: string;
  customers: number;
  recommended_offer: string;
};

interface SelectSegmentOfferProps {
  segments: Segment[];
}

export default function SelectSegmentOffer({ segments }: SelectSegmentOfferProps): React.JSX.Element {
  const [selectedSegments, setSelectedSegments] = React.useState<Segment[]>([]);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);

  const handleActivateOffers = () => {
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };

  return (
    <Box p={3} sx={{ width: '100%' }}>
      <Typography variant="h6" fontWeight="bold" gutterBottom mb={3} color="error">
        Select Segment Offers
      </Typography>

      <Autocomplete
        multiple
        disableCloseOnSelect
        options={segments}
        value={selectedSegments}
        getOptionLabel={(option: Segment) => option.title}
        isOptionEqualToValue={(option, value) => option.title === value.title}
        onChange={(event, newValue) => {
          const uniqueSegments = Array.from(new Map(newValue.map((item) => [item.title, item])).values());
          setSelectedSegments(uniqueSegments);
        }}
        renderTags={(value: Segment[], getTagProps) =>
          value.map((option, index) => (
            <Chip key={index} variant="outlined" color="primary" label={option.title} {...getTagProps({ index })} />
          ))
        }
        renderInput={(params) => (
          <TextField {...params} variant="outlined" label="Choose Segments" placeholder="Select segments..." />
        )}
        sx={{ width: '100%', mb: 3 }}
      />

      {selectedSegments.length > 0 && (
        <Box>
          <Typography variant="h6" fontWeight="bold" color="primary" sx={{ mb: 2 }}>
            🔖 Tagged Offers for Selected Segments
          </Typography>

          {selectedSegments.map((segment) => (
            <Box
              key={segment.title}
              sx={{
                backgroundColor: '#f0f4ff',
                borderRadius: 2,
                p: 2,
                mb: 2,
                borderLeft: '5px solid #1976d2',
              }}
            >
              <Typography variant="subtitle1" fontWeight="bold">
                {segment.title}
              </Typography>
              <Typography variant="body2">
                <strong>Customers:</strong> {segment.customers}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                <strong>Recommended Offer:</strong>{' '}
                <span style={{ color: '#1565c0', fontWeight: 500 }}>{segment.recommended_offer}</span>
              </Typography>
            </Box>
          ))}

          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleActivateOffers}
            sx={{ mt: 2, borderRadius: 2, textTransform: 'none', fontWeight: 'bold', py: 1.2 }}
          >
            Activate Selected Offers
          </Button>
        </Box>
      )}

      {/* Snackbar for success notification */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          🎉 Offers successfully activated!
        </Alert>
      </Snackbar>
    </Box>
  );
}
