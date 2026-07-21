import * as React from 'react';
import RouterLink from 'next/link';
import AlarmIcon from '@mui/icons-material/Alarm';
import DashboardIcon from '@mui/icons-material/Dashboard';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import GridOnIcon from '@mui/icons-material/GridOn';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { Divider } from '@mui/material';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { paths } from '@/paths';
import { DynamicLogo } from '@/components/core/logo';

import ParticlesBackground from './particles';

export interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps): React.JSX.Element {
  return (
    <Box sx={{ display: 'flex', flex: '1 1 auto', flexDirection: 'row', height: '100vh' }}>
      <Box
        sx={{
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'rgba(247, 247, 247, 0.6)',
          zIndex: 1,
          borderRight: '1px solid #e0e0e0',
        }}
        width="25%"
      >
        {/* <Box component={RouterLink} href={paths.home} sx={{ display: 'inline-block', fontSize: 0 }}>
          <DynamicLogo colorDark="light" colorLight="dark" height={32} width={122} />
        </Box> */}
        <Typography
          variant="h4"
          fontWeight={800}
          sx={{
            color: '#121621',
            textTransform: 'uppercase',
            letterSpacing: 1.5,
            mb: 3,
            textAlign: 'center',
          }}
        >
          Engage CVM
        </Typography>

        <Divider />

        <Stack spacing={2} style={{ height: '100%', justifyContent: 'center' }}>
          <Typography variant="h6" sx={{ color: 'blue', fontWeight: 'bold' }}>
            The Future of Agentic AI-Driven CVM
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <DashboardIcon sx={{ color: 'purple' }}  />
            <Typography>
              <span style={{ color: 'purple', fontWeight: 'bold' }}>PERSONA Vision</span> - Strategy driven goal selection for smarter decisions
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <EmojiPeopleIcon style={{ color: 'green' }} />
            <Typography>
              <span style={{ color: 'green', fontWeight: 'bold' }}>PERSONA 360</span> - Complete customer intelligence
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <GridOnIcon style={{ color: 'red' }} />
            <Typography>
              <span style={{ color: 'red', fontWeight: 'bold' }}>PERSONA Grid</span> - AI-powered audience segmentation
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <AlarmIcon style={{ color: 'orange' }} />
            <Typography>
              <span style={{ color: 'orange', fontWeight: 'bold' }}>PERSONA Retain</span> - Predict and prevent churn
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <TrendingUpIcon style={{ color: '#536dfe' }} />
            <Typography>
              <span style={{ color: '#536dfe', fontWeight: 'bold' }}>PERSONA Lift</span> - Smart offers, higher
              conversions
            </Typography>
          </Stack>
        </Stack>
      </Box>
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          flex: '1 1 auto',
          justifyContent: 'center',
          width: '70%',
          pl: 3,
        }}
      >
        <ParticlesBackground />
        <Box sx={{ maxWidth: '450px', width: '100%', zIndex: 2 }}>{children}</Box>
      </Box>
    </Box>
  );
}
