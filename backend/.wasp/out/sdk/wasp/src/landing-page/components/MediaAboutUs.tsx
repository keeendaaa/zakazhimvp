export default function MediaAboutUs() {
  const mediaItems = [
    {
      name: 'Название СМИ 1',
      logo: '📰',
      quote: 'Закажи — революционное решение для ресторанного бизнеса',
      link: '#',
    },
    {
      name: 'Название СМИ 2',
      logo: '📺',
      quote: 'Инновационный подход к обслуживанию гостей',
      link: '#',
    },
    {
      name: 'Название СМИ 3',
      logo: '📻',
      quote: 'QR-меню меняет правила игры в ресторанной индустрии',
      link: '#',
    },
  ];

  return (
    <div className='mt-20 mb-10 px-4'>
      <div className='max-w-7xl mx-auto'>
        <h2 className='text-3xl md:text-4xl font-bold text-center text-foreground mb-12'>
          СМИ о нас
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {mediaItems.map((item, index) => (
            <a
              key={index}
              href={item.link}
              target='_blank'
              rel='noopener noreferrer'
              className='group bg-card rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-border hover:border-primary/50'
            >
              <div className='flex items-center mb-4'>
                <div className='text-4xl mr-4'>{item.logo}</div>
                <h3 className='text-lg font-semibold text-foreground group-hover:text-primary transition-colors'>
                  {item.name}
                </h3>
              </div>
              <p className='text-muted-foreground leading-relaxed italic'>
                "{item.quote}"
              </p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

