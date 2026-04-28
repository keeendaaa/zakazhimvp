import { routes } from 'wasp/client/router';
import { TelegramUrl } from '../../../shared/common';
import type { NavigationItem } from './NavBar';

const staticNavigationItems: NavigationItem[] = [
  { name: 'Telegram', to: TelegramUrl },
];

export const marketingNavigationItems: NavigationItem[] = [
  { name: 'О нас', to: '/#features' },
  ...staticNavigationItems,
] as const;

export const demoNavigationitems: NavigationItem[] = [
  { name: 'AI Scheduler', to: routes.DemoAppRoute.to },
  { name: 'File Upload', to: routes.FileUploadRoute.to },
  { name: 'Pricing', to: routes.PricingPageRoute.to },
  ...staticNavigationItems,
] as const;
