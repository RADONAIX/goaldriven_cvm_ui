'use client';

import InsightBox from '@/components/chartTitle';
import { Box, Grid, Typography } from '@mui/material';

interface trafficCardtProps {
  title: string;
  value: string | number;
  subtext1: string;
  subvalue1: string | number;
  color: string;
  onClick?: any ;
}

const TrafficCard: React.FC<trafficCardtProps> = ({ title, value, subtext1, subvalue1, color , onClick}) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <Typography variant="h6" fontWeight="bold" color="textSecondary" sx={{ marginBottom: 1 }}>
      {/* {title} */}
      <InsightBox title={title} onClick={onClick} />
    </Typography>
    <Typography variant="h4" fontWeight="bold" color={color} sx={{ marginBottom: 2 }}>
      {value}
    </Typography>
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="body2" color="textSecondary">
          {subtext1}
        </Typography>
        <Typography variant="body1" color={color} fontWeight="bold">
          {subvalue1}
        </Typography>
      </Box>
    </Box>
  </Box>
);

export default TrafficCard;
