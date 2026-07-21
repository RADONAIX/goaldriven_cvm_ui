import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  { key: 'home', title: 'Home', href: paths.dashboard.overview, icon: 'house-line', type: 'item' },
  { key: 'vision', title: 'Persona Vision', href: paths.dashboard.persona_vision, icon: 'target', type: 'item' },
  { key: 'Persona 360', title: 'Persona 360', href: paths.dashboard.persona_360, icon: 'users', type: 'item' },
  {
    key: 'grid',
    title: 'Persona Grid',
    href: paths.dashboard.persona_grid,
    icon: 'grid',
    type: 'item',
  },
  {
    key: 'settings',
    title: 'Persona Retain',
    icon: 'gear-six',
    type: 'group',
    children: [
      { key: 'churnInsights', title: 'Churn Insights', href: paths.dashboard.churnInsights, type: 'item' },
      { key: 'churnScore', title: 'Churn Score Reports', href: paths.dashboard.churnScore, type: 'item' },
      // { key: 'churnWhatIf', title: 'Churn What if', href: paths.dashboard.churnWhatIf, type: 'item' },
    ],
  },
  {
    key: 'account',
    title: 'Persona Lift',
    href: paths.dashboard.account,
    icon: 'lift',
    type: 'group',
    children: [
      { key: 'nboInsights', title: 'NBO Insights', href: paths.dashboard.nboInsights, type: 'item' },
      { key: 'smartOfferX', title: 'Smart Offer X', href: paths.dashboard.smartOfferX, type: 'item' },
    ],
  },
] satisfies NavItemConfig[];
