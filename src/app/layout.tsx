import * as React from 'react';
import type { Viewport } from 'next';

import '@/styles/global.css';

import { UserProvider } from '@/contexts/user-context';
import { VisionProvider } from '@/contexts/vision-context';
import { LocalizationProvider } from '@/components/core/localization-provider';
import { ThemeProvider } from '@/components/core/theme-provider/theme-provider';

import { Providers } from './dashboard/provider';
import { SnackbarProvider } from './snack';

export const viewport = { width: 'device-width', initialScale: 1 } satisfies Viewport;

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps): React.JSX.Element {
  return (
    <html lang="en">
      <body>
        <Providers>
          <LocalizationProvider>
            <UserProvider>
              <VisionProvider>
                <SnackbarProvider>
                  <ThemeProvider>{children}</ThemeProvider>
                </SnackbarProvider>
              </VisionProvider>
            </UserProvider>
          </LocalizationProvider>
        </Providers>
      </body>
    </html>
  );
}
