'use client';

import React from 'react';
import { Box, Typography, TypographyProps } from '@mui/material';

type AnimatedGradientHeadingProps = {
  text: string;
  colors?: string[];
  speed?: string;
  variant?: TypographyProps['variant'];
  fontWeight?: TypographyProps['fontWeight'];
  insight?: boolean;
  onClick?: any;
};

const NavHeaders: React.FC<AnimatedGradientHeadingProps> = ({
  text,
  colors = ['#2b86c5', '#784ba0'],
  speed = '6s',
  variant = 'h4',
  fontWeight = 'bold',
  insight = false,
  onClick,
}) => {
  const gradient = `linear-gradient(90deg, ${colors.join(', ')})`;

  return (
    <Box>
      <Typography
        variant={variant}
        fontWeight={fontWeight}
        gutterBottom
        sx={{
          background: gradient,
          // backgroundSize: '600% 600%',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          display: 'inline-block',
          // animation: `moveGradient ${speed} ease infinite`,
          // '@keyframes moveGradient': {
          //   '0%': {
          //     backgroundPosition: '0% 50%',
          //   },
          //   '50%': {
          //     backgroundPosition: '100% 50%',
          //   },
          //   '100%': {
          //     backgroundPosition: '0% 50%',
          //   },
          // },
        }}
      >
        {text}
      </Typography>

     { insight &&  <Box
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
        onClick={onClick}
      />}
    </Box>
  );
};

export default NavHeaders;
