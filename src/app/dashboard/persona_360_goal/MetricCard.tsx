import { Box, Card, CardContent, Grid, Typography } from '@mui/material';

interface MetricCardProps {
  label1: string;
  label2: string;
  value1: string;
  value2: string;
}
const MetricCard: React.FC<MetricCardProps> = ({ label1, label2, value1, value2 }) => {
  return (
    <Box>
      <Card elevation={3} sx={{ bgcolor: '#f4f6f8', textAlign: 'center', height: '100%' }}>
        <CardContent sx={{ paddingBottom: '14px !important', padding: 2, height: '100%' }}>
          <Typography variant="h6" color="textSecondary" mb={1}>
            {label1}
          </Typography>
          <Typography variant="body2" color="textSecondary" mb={1}>
            {label2}
          </Typography>
          <Typography variant="h5" fontWeight="bold">
            {value1}/{value2}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default MetricCard;
