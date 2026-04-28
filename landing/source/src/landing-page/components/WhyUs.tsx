export default function WhyUs() {
  const features = [
    {
      icon: '/mockup.png',
      title: 'Персонализация для ресторана',
      description:
        'Настраиваем решение под ваш ресторан: добавляем ваши блюда, настраиваем меню, добавляем ваши цвета и логотип',
      position: 'left-top', // слева сверху
    },
    {
      icon: '/zero-rub.png',
      title: 'Бесплатное подключение',
      description: 'Подключаем ваш ресторан бесплатно, без скрытых платежей и комиссий',
      position: 'center-top', // по центру сверху
    },
    {
      icon: '/phones.png',
      title: 'Система уведомлений и ai - официант',
      description:
        'ИИ помогает гостю выбрать блюдо, а система уведомлений сообщает о статусе заказа',
      position: 'right-top', // справа сверху
    },
    {
      icon: '/analitics.png',
      title: 'Аналитика по заведению',
      description: 'Смотрите статистику по заведению, экспортируйте данные и анализируйте работу',
      position: 'center-bottom', // по центру снизу
    },
  ];

  return (
    <div className='mt-20 mb-10 px-4'>
      <h2 className='text-3xl md:text-4xl font-bold text-center text-foreground'>
        Почему мы?
      </h2>
      <div className='w-full'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 items-center'>
          {/* Слева - по центру по высоте */}
          {features
            .filter((f) => f.position === 'left-top')
            .map((feature, index) => (
              <div
                key={index}
                className='p-6 flex flex-col md:col-start-1 md:row-span-2 md:justify-center'
              >
                <div className='flex justify-center w-full'>
                  <img
                    src={feature.icon}
                    alt={feature.title}
                    className='w-full h-64 md:h-80 lg:h-96 xl:h-[28rem] object-contain'
                  />
                </div>
                <h3 className='text-xl md:text-2xl font-semibold text-foreground mb-3 text-center flex-shrink-0 mt-0'>
                  {feature.title}
                </h3>
                <p className='text-muted-foreground text-sm md:text-base leading-relaxed text-center flex-grow'>
                  {feature.description}
                </p>
              </div>
            ))}
          {/* По центру сверху */}
          {features
            .filter((f) => f.position === 'center-top')
            .map((feature, index) => (
              <div
                key={index}
                className='p-6 flex flex-col md:col-start-2'
              >
                <div className='flex justify-center w-full'>
                  <img
                    src={feature.icon}
                    alt={feature.title}
                    className='w-full h-64 md:h-80 lg:h-96 xl:h-[28rem] object-contain'
                  />
                </div>
                <h3 className='text-xl md:text-2xl font-semibold text-foreground mb-3 text-center flex-shrink-0 mt-0'>
                  {feature.title}
                </h3>
                <p className='text-muted-foreground text-sm md:text-base leading-relaxed text-center flex-grow'>
                  {feature.description}
                </p>
              </div>
            ))}
          {/* Справа - по центру по высоте */}
          {features
            .filter((f) => f.position === 'right-top')
            .map((feature, index) => (
              <div
                key={index}
                className='p-6 flex flex-col md:col-start-3 md:row-span-2 md:justify-center'
              >
                <div className='flex justify-center w-full'>
                  <img
                    src={feature.icon}
                    alt={feature.title}
                    className='w-full h-64 md:h-80 lg:h-96 xl:h-[28rem] object-contain'
                  />
                </div>
                <h3 className='text-xl md:text-2xl font-semibold text-foreground mb-3 text-center flex-shrink-0 mt-0'>
                  {feature.title}
                </h3>
                <p className='text-muted-foreground text-sm md:text-base leading-relaxed text-center flex-grow'>
                  {feature.description}
                </p>
              </div>
            ))}
          {/* По центру снизу */}
          {features
            .filter((f) => f.position === 'center-bottom')
            .map((feature, index) => (
              <div
                key={index}
                className='p-6 flex flex-col md:col-start-2'
              >
                <div className='flex justify-center w-full'>
                  <img
                    src={feature.icon}
                    alt={feature.title}
                    className='w-full h-64 md:h-80 lg:h-96 xl:h-[28rem] object-contain'
                  />
                </div>
                <h3 className='text-xl md:text-2xl font-semibold text-foreground mb-3 text-center flex-shrink-0 mt-0'>
                  {feature.title}
                </h3>
                <p className='text-muted-foreground text-sm md:text-base leading-relaxed text-center flex-grow'>
                  {feature.description}
                </p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

