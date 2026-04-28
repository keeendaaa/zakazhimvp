interface NavigationItem {
  name: string;
  href: string;
};

export default function Footer({ footerNavigation }: {
  footerNavigation: {
    app: NavigationItem[]
    company: NavigationItem[]
  }
}) {
  return (
    <div className='mx-auto mt-6 max-w-7xl px-6 lg:px-8 dark:bg-boxdark-2'>
      <footer
        aria-labelledby='footer-heading'
        className='relative border-t border-gray-900/10 dark:border-gray-200/10 py-24 sm:mt-32'
      >
        <h2 id='footer-heading' className='sr-only'>
          Footer
        </h2>
        <div className='flex items-start justify-end mt-10 gap-20'>
          <a
            href='/sber-zakazhi.pdf'
            download
            className='flex items-center justify-between bg-white dark:bg-card rounded-lg px-6 py-4 shadow-sm hover:shadow-md transition-shadow duration-200 max-w-md'
          >
            <div className='flex flex-col'>
              <span className='text-base font-semibold text-gray-900 dark:text-white'>
                О платформе Закажи
              </span>
              <span className='text-sm text-gray-600 dark:text-gray-400'>
                Презентация (.pdf)
              </span>
            </div>
            <svg
              className='w-6 h-6 text-gray-900 dark:text-white flex-shrink-0 ml-4'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4'
              />
            </svg>
          </a>
          <div>
            <h3 className='text-sm font-semibold leading-6 text-gray-900 dark:text-white'>App</h3>
            <ul role='list' className='mt-6 space-y-4'>
              {footerNavigation.app.map((item) => (
                <li key={item.name}>
                  <a href={item.href} className='text-sm leading-6 text-gray-600 hover:text-gray-900 dark:text-white'>
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className='text-sm font-semibold leading-6 text-gray-900 dark:text-white'>Company</h3>
            <ul role='list' className='mt-6 space-y-4'>
              {footerNavigation.company.map((item) => (
                <li key={item.name}>
                  <a href={item.href} className='text-sm leading-6 text-gray-600 hover:text-gray-900 dark:text-white'>
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className='text-sm font-semibold leading-6 text-gray-900 dark:text-white'>Контакты</h3>
            <ul role='list' className='mt-6 space-y-4'>
              <li>
                <a href='https://t.me/skkAteAndDestTtroy' target='_blank' rel='noopener noreferrer' className='text-sm leading-6 text-gray-600 hover:text-gray-900 dark:text-white'>
                  Telegram: skkAteAndDestTtroy
                </a>
              </li>
              <li>
                <a href='mailto:business@zakazhi.online' className='text-sm leading-6 text-gray-600 hover:text-gray-900 dark:text-white'>
                  Email: business@zakazhi.online
                </a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  )
}
