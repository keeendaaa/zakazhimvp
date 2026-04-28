import { Menu } from 'lucide-react';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet';
import { cn } from '../../lib/utils';
import { throttleWithTrailingInvocation } from '../../shared/utils';
const logo = '/logo.png';
import DarkModeSwitcher from '../DarkModeSwitcher';
import { Announcement } from './Announcement';

export interface NavigationItem {
  name: string;
  to: string;
}

export default function NavBar({ navigationItems }: { navigationItems: NavigationItem[] }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const isLandingPage = window.location.pathname === '/';

  useEffect(() => {
    const throttledHandler = throttleWithTrailingInvocation(() => {
      setIsScrolled(window.scrollY > 0);
    }, 50);

    window.addEventListener('scroll', throttledHandler);

    return () => {
      window.removeEventListener('scroll', throttledHandler);
      throttledHandler.cancel();
    };
  }, []);

  return (
    <>
      {isLandingPage && <Announcement />}
      <header className={cn('sticky top-0 z-50 transition-all duration-300', isScrolled && 'top-4')}>
        <div
          className={cn('transition-all duration-300', {
            'mx-4 md:mx-20 pr-2 lg:pr-0 rounded-full shadow-lg bg-background/90 backdrop-blur-lg border border-border':
              isScrolled,
            'mx-0 bg-background/80 backdrop-blur-lg border-b border-border': !isScrolled,
          })}
        >
          <nav
            className={cn('flex items-center justify-between transition-all duration-300', {
              'p-3 lg:px-6': isScrolled,
              'p-6 lg:px-8': !isScrolled,
            })}
            aria-label='Global'
          >
            <div className='flex items-center gap-6'>
              <Link
                to='/'
                className='flex items-center text-foreground duration-300 ease-in-out hover:text-primary transition-colors'
              >
                <NavLogo isScrolled={isScrolled} />
                <span
                  className={cn('font-semibold leading-6 text-foreground transition-all duration-300', {
                    'ml-2 text-sm': !isScrolled,
                    'ml-2 text-xs': isScrolled,
                  })}
                >
                  Закажи
                </span>
              </Link>

              <ul className='hidden lg:flex items-center gap-6 ml-4'>
                {renderNavigationItems(navigationItems)}
              </ul>
            </div>
            <NavBarMobileMenu isScrolled={isScrolled} navigationItems={navigationItems} />
            <NavBarDesktopActions />
          </nav>
        </div>
      </header>
    </>
  );
}

function NavBarDesktopActions() {
  return (
    <div className='hidden lg:flex lg:flex-1 gap-3 justify-end items-center'>
      <ul className='flex justify-center items-center gap-2 sm:gap-4'>
        <DarkModeSwitcher />
      </ul>
    </div>
  );
}

function NavBarMobileMenu({
  isScrolled,
  navigationItems,
}: {
  isScrolled: boolean;
  navigationItems: NavigationItem[];
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className='flex lg:hidden'>
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetTrigger asChild>
          <button
            type='button'
            className={cn(
              'inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-muted hover:bg-accent transition-colors'
            )}
          >
            <span className='sr-only'>Open main menu</span>
            <Menu
              className={cn('transition-all duration-300', {
                'size-8 p-1': !isScrolled,
                'size-6 p-0.5': isScrolled,
              })}
              aria-hidden='true'
            />
          </button>
        </SheetTrigger>
        <SheetContent side='right' className='w-[300px] sm:w-[400px]'>
          <SheetHeader>
            <SheetTitle className='flex items-center'>
              <Link to='/'>
                <span className='sr-only'>Закажи</span>
                <NavLogo isScrolled={false} />
              </Link>
            </SheetTitle>
          </SheetHeader>
          <div className='mt-6 flow-root'>
            <div className='-my-6 divide-y divide-border'>
              <ul className='space-y-2 py-6'>{renderNavigationItems(navigationItems, setMobileMenuOpen)}</ul>
              <div className='py-6'>
                <DarkModeSwitcher />
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function renderNavigationItems(
  navigationItems: NavigationItem[],
  setMobileMenuOpen?: Dispatch<SetStateAction<boolean>>
) {
  const menuStyles = cn({
    'block rounded-lg px-3 py-2 text-sm font-medium leading-7 text-foreground hover:bg-accent hover:text-accent-foreground transition-colors':
      !!setMobileMenuOpen,
    'text-sm font-normal leading-6 text-foreground duration-300 ease-in-out hover:text-primary transition-colors':
      !setMobileMenuOpen,
  });

  return navigationItems.map((item) => {
    return (
      <li key={item.name}>
        <Link
          to={item.to}
          className={menuStyles}
          onClick={setMobileMenuOpen && (() => setMobileMenuOpen(false))}
          target={item.to.startsWith('http') ? '_blank' : undefined}
        >
          {item.name}
        </Link>
      </li>
    );
  });
}

const NavLogo = ({ isScrolled }: { isScrolled: boolean }) => (
  <img
    className={cn('transition-all duration-500 object-contain', {
      'h-8 w-auto': !isScrolled,
      'h-7 w-auto': isScrolled,
    })}
    src={logo}
    alt='Закажи'
  />
);

