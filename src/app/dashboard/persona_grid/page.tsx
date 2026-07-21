'use client';

import * as React from 'react';
import { Box, Button, Stack, Tab, Tabs, TextField, Typography, useMediaQuery, useTheme } from '@mui/material';

import { useVision } from '@/hooks/use-vision';
import NavHeaders from '@/components/navHeaders';

import GridRetention from '../persona_grid_goal/page';
import GridGlobal from './GridGlobal';
import PersonaGridInsightsDialog from './PersonaGridInsightsDialog';
import SearchMSISDNDialog from './SearchMSISDNDialog';

export default function Page(): React.JSX.Element {
  const { vision } = useVision();
  const [view, setView] = React.useState<string>('');
  const [openInsights, setOpenInsights] = React.useState(false);
  const [showSegment, setShowSegment] = React.useState(false);
  const [msisdn, setMsisdn] = React.useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleSearch = () => {
    if (msisdn.trim()) setShowSegment(true);
  };

  React.useEffect(() => {
    setView(vision?.vision || 'global');
  }, [vision]);

  return (
    <Box>
      {/* Top Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <NavHeaders text="Persona Grid" insight onClick={() => setOpenInsights(true)} />
        <Box textAlign="center">
          <marquee style={{ fontStyle: 'italic', fontSize: '14px', color: '#607D8B' }}>
            *The dashboard below presents the data for January*
          </marquee>
        </Box>
      </Stack>

      {/* Filters Section */}
      <Stack
        direction={isMobile ? 'column' : 'row'}
        justifyContent="space-between"
        alignItems={isMobile ? 'stretch' : 'center'}
        spacing={4}
        mb={1}
      >
        {/* View Tabs */}
        <Tabs
          value={view}
          onChange={(_, newValue) => setView(newValue)}
          textColor="primary"
          indicatorColor="primary"
          sx={{
            width: isMobile ? '100%' : 250,
            minHeight: 40,
          }}
        >
          <Tab
            value="global"
            label="🌐 Global"
            sx={{
              textTransform: 'none',
              fontWeight: 500,
              minWidth: 100,
              px: 2,
              flexShrink: 0,
            }}
          />
         { vision?.vision == 'retention' &&  <Tab
            value="retention"
            label="🎯 Retention"
            sx={{
              textTransform: 'none',
              fontWeight: 500,
              minWidth: 120,
              px: 2,
              flexShrink: 0,
              bgcolor: view === 'retention' ? 'rgba(33,150,243,0.06)' : 'transparent',
              borderRadius: 1,
            }}
          />}
        </Tabs>

        {/* MSISDN Search */}
        <Stack direction="row" spacing={1} alignItems="center">
          <TextField size="small" label="Search MSISDN" value={msisdn} onChange={(e) => setMsisdn(e.target.value)} />
          <Button variant="contained" onClick={handleSearch}>
            Search
          </Button>
        </Stack>
      </Stack>

      {/* Info */}

      {/* Main Content */}
      <Box>{view === 'global' ? <GridGlobal /> : <GridRetention />}</Box>

      {/* Dialogs */}
      {openInsights && <PersonaGridInsightsDialog open={openInsights} onClose={() => setOpenInsights(false)} />}
      {showSegment && <SearchMSISDNDialog msisdn={msisdn} open={showSegment} onClose={() => setShowSegment(false)} />}
    </Box>
  );
}
