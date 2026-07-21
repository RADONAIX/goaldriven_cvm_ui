'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import GlobalStyles from '@mui/material/GlobalStyles';

import { MainNav } from '@/components/dashboard/layout/main-nav';
import { SideNav } from '@/components/dashboard/layout/side-nav';

import { Providers } from './provider';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps): React.JSX.Element {
  const [openNav, setOpenNav] = React.useState<boolean>(false);
  return (
    <>
      <GlobalStyles
        styles={{
          body: {
            '--MainNav-height': '56px',
            '--MainNav-zIndex': 1000,
            '--SideNav-width': '280px',
            '--SideNav-zIndex': 1100,
            '--MobileNav-width': '320px',
            '--MobileNav-zIndex': 1100,
          },
        }}
      />
      <Box
        sx={{
          bgcolor: 'var(--mui-palette-background-default)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          minHeight: '100%',
        }}
      >
        <Box onMouseEnter={() => setOpenNav(false)} onMouseLeave={() => setOpenNav(true)}>
          <SideNav openNav={openNav} />
        </Box>
        <Box
          sx={{
            display: 'flex',
            flex: '1 1 auto',
            flexDirection: 'column',
            pl: openNav ? '80px' : 'var(--SideNav-width)',
            transition: 'padding 0.3s ease',
          }}
        >
          <MainNav setOpenNav={setOpenNav} />
          <Box component="main" sx={{ flexGrow: 1, p: 2 }}>
            {children}
          </Box>
        </Box>
      </Box>
    </>
  );
}
