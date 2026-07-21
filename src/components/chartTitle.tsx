import React from 'react';
import { Box, Typography } from '@mui/material';
import { SxProps, Theme } from '@mui/material/styles';

interface InsightBoxProps {
  title?: string;
  onClick?: (payload: { title: string; desc: string; data: any }) => void;
  desc?: string;
  data?: any;
  size?: 'sm' | 'lg' | null;
  sx?: SxProps<Theme> | null;
  insight?: boolean;
}


const InsightBox: React.FC<InsightBoxProps> = ({ title, onClick, desc, data, size,   insight = true , sx }) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      pl={3}
      sx={{
        width: '100%',
        pointerEvents: 'auto',
        mb : 2,
        ...sx,
      }}
    >
      <Typography variant={size === 'lg' ? 'h5' : 'h6'} sx={{ fontWeight: 'bold' , color : 'rgb(6, 81, 128)'}}>
        {title}
      </Typography>

      { insight && <Box
        component="img"
        src="/assets/light-bulb.gif"
        alt="insight-bulb"
        sx={{
          height: 30,
          marginLeft: 2,
          cursor: 'pointer',
          borderRadius: '50%',
          '&:hover': {
            boxShadow: '0 0 8px 2px rgba(255, 223, 0, 0.6)',
          },
        }}
        onClick={() => onClick({ title, desc, data })}
      />}
    </Box>
  );
};

export default InsightBox;
