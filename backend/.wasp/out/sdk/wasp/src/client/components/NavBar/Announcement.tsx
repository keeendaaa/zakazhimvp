const ANNOUNCEMENT_URL = '#';
const MVP_URL = 'https://zakazhi.org';

export function Announcement() {
  return (
    <div className='relative flex justify-center items-center gap-3 p-3 w-full bg-gradient-to-r from-accent to-secondary font-semibold text-primary-foreground text-center'>
      <a
        href={ANNOUNCEMENT_URL}
        className='hidden lg:block cursor-pointer hover:opacity-90 hover:drop-shadow transition-opacity'
      >
        Пилотный запуск уже в Ресторанах Страны!
      </a>
      <div className='hidden lg:block self-stretch w-0.5 bg-primary-foreground/20'></div>
      <a
        href={MVP_URL}
        target='_blank'
        rel='noopener noreferrer'
        className='hidden lg:block cursor-pointer rounded-full bg-background/20 px-2.5 py-1 text-xs hover:bg-background/30 transition-colors tracking-wider'
      >
        Оцените наш MVP 1.0 ⭐️ →
      </a>
      <a
        href={MVP_URL}
        target='_blank'
        rel='noopener noreferrer'
        className='lg:hidden cursor-pointer rounded-full bg-background/20 px-2.5 py-1 text-xs hover:bg-background/30 transition-colors'
      >
        Пилотный запуск уже в Ресторанах Страны! Оцените наш MVP 1.0 ⭐️ →
      </a>
    </div>
  );
}
