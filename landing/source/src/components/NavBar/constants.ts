import { TelegramUrl } from '../../shared/common';
import type { NavigationItem } from './NavBar';

const staticNavigationItems: NavigationItem[] = [
  { name: 'Telegram', to: TelegramUrl },
];

export const marketingNavigationItems: NavigationItem[] = [
  { name: 'О нас', to: '/#features' },
  ...staticNavigationItems,
] as const;


