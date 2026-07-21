'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import { usePathname } from 'next/navigation';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { Collapse } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ArrowSquareUpRight as ArrowSquareUpRightIcon } from '@phosphor-icons/react/dist/ssr/ArrowSquareUpRight';

import type { NavItemConfig } from '@/types/nav';
import { isNavItemActive } from '@/lib/is-nav-item-active';

import { navItems } from './config';
import { navIcons } from './nav-icons';

export function SideNav({ openNav }: { openNav: boolean }): React.JSX.Element {
  const pathname = usePathname();

  return (
    <Box
      sx={{
        '--SideNav-background': 'var(--mui-palette-neutral-950)',
        '--SideNav-color': 'var(--mui-palette-common-white)',
        '--NavItem-color': 'var(--mui-palette-neutral-300)',
        '--NavItem-hover-background': 'rgba(255, 255, 255, 0.04)',
        '--NavItem-active-background': 'var(--mui-palette-primary-main)',
        '--NavItem-active-color': 'var(--mui-palette-primary-contrastText)',
        '--NavItem-disabled-color': 'var(--mui-palette-neutral-500)',
        '--NavItem-icon-color': 'var(--mui-palette-neutral-400)',
        '--NavItem-icon-active-color': 'var(--mui-palette-primary-contrastText)',
        '--NavItem-icon-disabled-color': 'var(--mui-palette-neutral-600)',
        bgcolor: 'var(--SideNav-background)',
        color: 'var(--SideNav-color)',
        display: { xs: 'none', lg: 'flex' },
        flexDirection: 'column',
        height: '100%',
        left: 0,
        maxWidth: '100%',
        position: 'fixed',
        scrollbarWidth: 'none',
        top: 0,
        width: openNav ? '70px' : 'var(--SideNav-width)',
        zIndex: 'var(--SideNav-zIndex)',
        transition: 'width 0.3s ease', // Smooth transition effect
        '&::-webkit-scrollbar': { display: 'none' },
      }}
    >
      {/* Spacer preserving the removed logo's footprint so the nav starts lower. */}
      <Stack spacing={0} sx={{ p: 0.5 }}>
        <Box sx={{ height: 55 }} />
      </Stack>
      <Divider sx={{ borderColor: 'var(--mui-palette-neutral-700)' }} />
      <Box component="nav" sx={{ flex: '1 1 auto', p: '12px' }}>
        {renderNavItems({ pathname, items: navItems, openNav })}
      </Box>
      <Divider sx={{ borderColor: 'var(--mui-palette-neutral-700)' }} />
      <Stack spacing={2} sx={{ p: '12px', display: openNav ? 'none' : 'block' }}>
        <div>
          <Typography color="var(--mui-palette-neutral-100)" variant="subtitle2" textAlign="center">
            Need Help?
          </Typography>
          <Typography color="var(--mui-palette-neutral-400)" variant="body2" textAlign="center">
            Contact Support
          </Typography>
        </div>
        <Button
          component="a"
          endIcon={<ArrowSquareUpRightIcon fontSize="var(--icon-fontSize-md)" />}
          fullWidth
          href="#"
          sx={{ mt: 2 }}
          target="_blank"
          variant="contained"
        >
          FAQ
        </Button>
      </Stack>
    </Box>
  );
}

function renderNavItems({
  items = [],
  pathname,
  openNav,
}: {
  items?: NavItemConfig[];
  pathname: string;
  openNav: boolean;
}): React.JSX.Element {
  const [openKey, setOpenKey] = React.useState<string | null>(null);
  const children = items.reduce((acc: React.ReactNode[], curr: NavItemConfig): React.ReactNode[] => {
    const { key, ...item } = curr;

    acc.push(
      <NavItem
        key={key}
        itemKey={key}
        pathname={pathname}
        {...item}
        openNav={openNav}
        openKey={openKey}
        setOpenKey={setOpenKey}
      />
    );

    return acc;
  }, []);

  return (
    <Stack component="ul" spacing={1} sx={{ listStyle: 'none', m: 0, p: 0 }}>
      {children}
    </Stack>
  );
}

interface NavItemProps extends Omit<NavItemConfig, 'items'> {
  pathname: string;
  openNav: boolean;
}

function NavItem({
  disabled,
  external,
  href,
  icon,
  matcher,
  pathname,
  title,
  children,
  type,
  openNav,
  openKey, // <-- New prop for tracking open state
  setOpenKey, // <-- Function to update open state
  itemKey, // <-- Unique key for each nav item
}: NavItemProps & {
  openKey: string | null;
  setOpenKey: (key: string | null) => void;
  itemKey: string;
}): React.JSX.Element {
  const active = isNavItemActive({ disabled, external, href, matcher, pathname });
  const Icon = icon ? navIcons[icon] : null;

  // Collapse should open only if the current item is openKey
  const open = openKey === itemKey;

  const handleToggle = () => {
    setOpenKey(open ? null : itemKey); // Toggle collapse state
  };

  const hasActiveChild =
    type === 'group' &&
    Array.isArray(children) &&
    children.some((child) => isNavItemActive({ disabled, external, href: child.href, matcher, pathname }));

  return (
    <>
      {type === 'item' && (
        <li>
          <Box
            {...(href
              ? {
                component: external ? 'a' : RouterLink,
                href,
                target: external ? '_blank' : undefined,
                rel: external ? 'noreferrer' : undefined,
              }
              : { role: 'button' })}
            sx={{
              alignItems: 'center',
              borderRadius: 1,
              color: 'var(--NavItem-color)',
              cursor: 'pointer',
              display: 'flex',
              flex: '0 0 auto',
              gap: 1,
              p: openNav ? '6px 13px' : '6px 16px',
              position: 'relative',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              ...(disabled && {
                bgcolor: 'var(--NavItem-disabled-background)',
                color: 'var(--NavItem-disabled-color)',
                cursor: 'not-allowed',
              }),
              ...(active && { bgcolor: 'var(--NavItem-active-background)', color: 'var(--NavItem-active-color)' }),
            }}
          >
            {Icon ? (
              <Icon
                fill={active ? 'var(--NavItem-icon-active-color)' : 'var(--NavItem-icon-color)'}
                fontSize="var(--icon-fontSize-md)"
                weight={active ? 'fill' : undefined}
              />
            ) : null}
            <Typography sx={{ flex: '1 1 auto', display: openNav ? 'none' : 'block' }}>{title}</Typography>
          </Box>
        </li>
      )}

      {type === 'group' && (
        <li>
          <Box
            onClick={handleToggle}
            sx={{
              alignItems: 'center',
              borderRadius: 1,
              color: 'var(--NavItem-color)',
              cursor: 'pointer',
              display: 'flex',
              gap: 1,
              p: openNav ? '6px 13px' : '6px 16px',
              ...(disabled && {
                bgcolor: 'var(--NavItem-disabled-background)',
                color: 'var(--NavItem-disabled-color)',
              }),
              ...((active || (openNav && hasActiveChild)) && {
                bgcolor: 'var(--NavItem-active-background)',
                color: 'var(--NavItem-active-color)',
              }),
            }}
          >
            {Icon && (
              <Icon
                fill={open ? 'var(--NavItem-icon-active-color)' : 'var(--NavItem-icon-color)'}
                fontSize="var(--icon-fontSize-md)"
                weight={open ? 'fill' : undefined}
              />
            )}
            <Typography
              sx={{
                flex: '1 1 auto',
                display: openNav ? 'none' : 'block',
                fontWeight: 500,
              }}
            >
              {title}
            </Typography>
            {!openNav && (open ? <ExpandLess sx={{ color: 'inherit' }} /> : <ExpandMore sx={{ color: 'inherit' }} />)}
          </Box>

          <Collapse in={open && !openNav} timeout="auto" unmountOnExit>
            <Box
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.02)', // Background for the entire child module list area
                borderRadius: 1,
                mt: 0.5,
                mb: 1,
                py: 0.5,
                mx: 1.5,
              }}
            >
              {children?.map(({ href, title, key }) => {
                const childActive = isNavItemActive({ disabled, external, href, matcher, pathname });
                return (
                  <Box
                    m={0}
                    p={0}
                    key={key}
                    {...(href
                      ? {
                        component: external ? 'a' : RouterLink,
                        href,
                        target: external ? '_blank' : undefined,
                        rel: external ? 'noreferrer' : undefined,
                      }
                      : { role: 'button' })}
                    sx={{
                      alignItems: 'center',
                      borderRadius: 1,
                      color: childActive ? 'var(--NavItem-active-color)' : 'var(--NavItem-color)',
                      display: 'flex',
                      gap: 1,
                      px: 3,
                      py: 0.75,
                      mx: 1,
                      my: 0.25,
                      fontSize: '0.875rem',
                      fontWeight: 400,
                      textDecoration: 'none',
                      backgroundColor: childActive ? 'var(--NavItem-active-background)' : 'transparent',
                      '&:hover': {
                        backgroundColor: childActive ? 'var(--NavItem-active-background)' : 'rgba(255, 255, 255, 0.06)',
                      },
                    }}
                  >
                    <Typography sx={{ flex: 1 }}>{title}</Typography>
                  </Box>
                );
              })}
            </Box>
          </Collapse>
        </li>
      )}
    </>
  );
}
