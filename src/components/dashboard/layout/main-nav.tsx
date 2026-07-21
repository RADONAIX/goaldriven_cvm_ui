'use client';

import * as React from 'react';
import { Typography } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import { GearSix as GearSixIcon, User as UserIcon } from '@phosphor-icons/react/dist/ssr';
import { Bell as BellIcon } from '@phosphor-icons/react/dist/ssr/Bell';
import { List as ListIcon } from '@phosphor-icons/react/dist/ssr/List';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import { Users as UsersIcon } from '@phosphor-icons/react/dist/ssr/Users';

import { usePopover } from '@/hooks/use-popover';

import { CustomPopover } from './CustomPopover';
import { MobileNav } from './mobile-nav';
import { UserPopover } from './user-popover';

const adminItems = [
  { label: 'Manage Users', icon: <UserIcon />, href: '/dashboard/user' },
  { label: 'Manage Roles', icon: <UsersIcon />, href: '/dashboard/userrole' },
  { label: 'Admin Settings', icon: <GearSixIcon />, href: '/dashboard/settings' },
];

export function MainNav({ setOpenNav }: any): React.JSX.Element {
  const userPopover = usePopover<HTMLDivElement>();
  const adminPopover = usePopover<HTMLButtonElement>();

  return (
    <React.Fragment>
      <Box
        component="header"
        sx={{
          borderBottom: '1px solid var(--mui-palette-divider)',
          backgroundColor: 'var(--mui-palette-background-paper)',
          position: 'sticky',
          top: 0,
          zIndex: 'var(--mui-zIndex-appBar)',
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          sx={{ alignItems: 'center', justifyContent: 'space-between', minHeight: '64px', px: 2 }}
        >
          <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
            <IconButton
              onClick={(): void => {
                setOpenNav((val: boolean) => !val);
              }}
            >
              <ListIcon />
            </IconButton>
          </Stack>
          <Typography variant="h4" fontWeight="bold" sx={{ color: '#121621' }}>
            Engage CVM
          </Typography>
          <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
            <Tooltip title="Admin">
              <IconButton ref={adminPopover.anchorRef} onClick={adminPopover.handleOpen}>
                <UsersIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Notifications">
              <Badge badgeContent={4} color="success" variant="dot">
                <IconButton>
                  <BellIcon />
                </IconButton>
              </Badge>
            </Tooltip>
            <Avatar
              onClick={userPopover.handleOpen}
              ref={userPopover.anchorRef}
              src="/assets/avatar.png"
              sx={{ cursor: 'pointer' }}
            />
          </Stack>
        </Stack>
      </Box>
      <CustomPopover
        anchorEl={adminPopover.anchorRef.current}
        open={adminPopover.open}
        onClose={adminPopover.handleClose}
        title="Admin Panel"
        subtitle={`Role: 'Super Admin'}`}
        items={adminItems}
      />
      <UserPopover anchorEl={userPopover.anchorRef.current} onClose={userPopover.handleClose} open={userPopover.open} />
    </React.Fragment>
  );
}
