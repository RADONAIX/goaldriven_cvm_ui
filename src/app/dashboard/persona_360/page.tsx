'use client';

import * as React from 'react';
import { Box, Button, Stack, Tab, Tabs, TextField, Typography, useMediaQuery, useTheme } from '@mui/material';

import { useVision } from '@/hooks/use-vision';
import NavHeaders from '@/components/navHeaders';

import Retention360 from '../persona_360_goal/page';
import Global from './Global';
import SearchMSISDN from './SearchMSISDNDialogue';
import StrategyInsightsDialog from './StrategyInsightsDialog';

export default function Page(): React.JSX.Element {
  const { vision } = useVision();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [view, setView] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [msisdn, setMsisdn] = React.useState('');

  React.useEffect(() => {
    setView(vision?.vision || 'global');
  }, [vision]);

  const handleSearch = () => {
    if (msisdn.trim()) {
      setOpenDialog(true);
    }
  };

  return (
    <Box>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <NavHeaders text="Persona 360" insight={true} onClick={() => setOpen(true)} />
        <Box textAlign="center">
          <marquee style={{ fontStyle: 'italic', fontSize: '14px', color: '#607D8B' }}>
            *The dashboard below presents the data for January*
          </marquee>
        </Box>
      </Stack>

      {/* Tabs + Search */}
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
          sx={{ width: isMobile ? '100%' : 250 }}
        >
          <Tab
            value="global"
            label="🌐 Global"
            sx={{
              textTransform: 'none',
              fontWeight: 500,
              minWidth: 100,
              px: 2,
            }}
          />
          {vision?.vision == 'retention' && (
            <Tab
              value="retention"
              label="🎯 Retention"
              sx={{
                textTransform: 'none',
                fontWeight: 500,
                minWidth: 120,
                px: 2,
                borderRadius: 1,
                bgcolor: view === 'retention' ? 'rgba(33,150,243,0.06)' : 'transparent',
              }}
            />
          )}
        </Tabs>

        {/* MSISDN Search */}
        <Stack direction="row" spacing={1} alignItems="center">
          <TextField size="small" label="Search MSISDN" value={msisdn} onChange={(e) => setMsisdn(e.target.value)} />
          <Button variant="contained" onClick={handleSearch}>
            Search
          </Button>
        </Stack>
      </Stack>

      {/* View Panels */}
      <Box mt={2}>{view === 'global' ? <Global /> : <Retention360 />}</Box>

      {/* Dialogs */}
      {open && <StrategyInsightsDialog open={open} onClose={() => setOpen(false)} />}
      {openDialog && <SearchMSISDN open={openDialog} onClose={() => setOpenDialog(false)} msisdn={msisdn} />}
    </Box>
  );
}
