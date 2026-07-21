'use client';

import * as React from 'react';
import {
  Popover,
  Box,
  Typography,
  Divider,
  MenuList,
  MenuItem,
  ListItemIcon,
} from '@mui/material';

export interface PopoverItem {
  label: string;
  icon?: React.ReactNode;
  href?: string;
  onClick?: () => void;
}

export interface CustomPopoverProps {
  anchorEl: Element | null;
  open: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  items: PopoverItem[];
  width?: number;
}

export function CustomPopover({
  anchorEl,
  open,
  onClose,
  title,
  subtitle,
  items,
  width = 240,
}: CustomPopoverProps): React.JSX.Element {
  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
      open={open}
      onClose={onClose}
      slotProps={{ paper: { sx: { width } } }}
    >
      

      <MenuList disablePadding sx={{ p: 1, '& .MuiMenuItem-root': { borderRadius: 1 } }}>
        {items.map((item, index) => (
          <MenuItem
            key={index}
            component={item.href ? 'a' : 'button'}
            href={item.href}
            onClick={() => {
              if (item.onClick) item.onClick();
              onClose();
            }}
            sx={{ textDecoration: 'none' }}
          >
            {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
            {item.label}
          </MenuItem>
        ))}
      </MenuList>
    </Popover>
  );
}