import { formatNumber } from '@/hooks/numberFormatter';
import { Box, Card, CardContent, Grid, Typography } from '@mui/material';

interface MetricCardProps {
  label: string;
  value: string;
  formatted: boolean;
}
const MetricCard: React.FC<MetricCardProps> = ({ label, value , formatted}) => {
  console.log('MetricCard value:', value);
  return (
    <Grid item xs={12} sm={6} md={4}>
      <Box>
        <Card elevation={3} sx={{ bgcolor: '#f4f6f8', textAlign: 'center', height: '100%' }}>
          <CardContent sx={{ paddingBottom: '14px !important', padding: 2, height: '100%' }}>
            <Typography variant="h6" color="textSecondary" mb={2}>
              {/* <IconButton size="small" onClick={() => handleOpenInsight(kpiCard?.api)}>
              <LightbulbOutlinedIcon sx={{ color: '#2196f3' }} />
            </IconButton> */}
              { label}
            </Typography>

            <Typography variant="h5" fontWeight="bold" color={'#121621s'} >
            { formatted ? formatNumber(parseInt(value)) : value}
            {/* {value} */}
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Grid>
  );
};

export default MetricCard;
