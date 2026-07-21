'use client';

import { Box, Grid, Typography } from '@mui/material';

interface trafficCardtProps {
  title?: string;
  value: string | number;
  value2: string | number;
  subtext1: string;
  subvalue1: string | number;
  subvalue2: string | number;
  color: string;
}

const TrafficCard: React.FC<trafficCardtProps> = ({ title='', value, value2, subtext1, subvalue1, subvalue2, color }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      mb: 2,
    }}
  >
    <Typography variant="h6" fontWeight="bold" color="textSecondary" sx={{ marginBottom: 1 }}>
      {title}
    </Typography>
    <Typography variant="h4" fontWeight="bold" color={color} sx={{ marginBottom: 2 }}>
      {value}/{value2}
    </Typography>
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="body2" color="textSecondary">
          {subtext1}
        </Typography>
        <Typography variant="body1" color={color} fontWeight="bold">
          {subvalue1}/{subvalue2}
        </Typography>
      </Box>
    </Box>
  </Box>
);

export default TrafficCard;
