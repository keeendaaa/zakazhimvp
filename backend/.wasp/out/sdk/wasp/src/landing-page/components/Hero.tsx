import openSaasBannerDark from '../../client/static/open-saas-banner-dark.png';
import openSaasBannerLight from '../../client/static/open-saas-banner-light.png';
import { Button } from '../../components/ui/button';

export default function Hero() {
  return (
    <div className='relative pt-14 w-full'>
      <TopGradient />
      <BottomGradient />
      <div className='md:p-24'>
        <div className='mx-auto max-w-8xl px-6 lg:px-8'>
          <div className='lg:mb-18 mx-auto max-w-3xl text-center'>
            <h1 className='text-5xl font-bold text-foreground sm:text-6xl'>
              Часы пик без хаоса{' '}
              <span className='text-gradient-primary'>QR-заказы, которые летят на кухню</span>
            </h1>
            <p className='mt-6 mx-auto max-w-2xl text-lg leading-8 text-muted-foreground'>
              Уникальное фиджитал решение для вашего ресторанного бизнеса!
            </p>
            <div className='mt-10 flex items-center justify-center gap-x-6'>
              <Button size='lg' variant='outline' asChild>
                <a href='/presentation.pdf' download target='_blank' rel='noopener noreferrer'>
                  Узнать больше
                </a>
              </Button>
              <Button size='lg' variant='default' asChild>
                <a href='https://zakazhi.org' target='_blank' rel='noopener noreferrer'>
                  Начать <span aria-hidden='true'>→</span>
                </a>
              </Button>
            </div>
          </div>
          <div className='mt-14 flow-root sm:mt-14'>
            <div className='hidden md:flex m-2 justify-center rounded-xl lg:-m-4 lg:rounded-2xl lg:p-4'>
              <img
                src={openSaasBannerLight}
                alt='App screenshot'
                width={1000}
                height={530}
                loading='lazy'
                className='rounded-md shadow-2xl ring-1 ring-gray-900/10 dark:hidden'
              />
              <img
                src={openSaasBannerDark}
                alt='App screenshot'
                width={1000}
                height={530}
                loading='lazy'
                className='rounded-md shadow-2xl ring-1 ring-gray-900/10 hidden dark:block'
              />
            </div>
          </div>
          <ProductFeatures />
        </div>
      </div>
    </div>
  );
}

function ProductFeatures() {
  const features = [
    {
      icon: '/gear-3d.png',
      title: 'Оптимизация работы персонала',
      description: 'Экономия времени официанту за счёт автоматизации выбора и заказа блюд',
    },
    {
      icon: '/rocket-3d.png',
      title: 'Рост среднего чека',
      description: 'Готовые подборки стимулируют импульсивные покупки',
    },
    {
      icon: '/clock-3d.png',
      title: 'Увеличение оборачиваемости столов',
      description: 'Автоматизация приема заказа сокращает время обслуживания гостя',
    },
    {
      icon: '/lightbulb-3d.png',
      title: 'Экономия для ресторана на эквайринге',
      description: 'Побуждает платить через СБП → ресторан экономит на комиссии от эквайринга',
    },
  ];

  return (
    <div className='mt-20 mb-10'>
      <h2 className='text-3xl md:text-4xl font-bold text-center text-foreground mb-24 md:mb-32'>
        Наш продукт это:
      </h2>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-4 items-stretch'>
        {features.map((feature, index) => (
          <div
            key={index}
            className='bg-card rounded-2xl pt-6 pb-8 px-6 md:pt-44 lg:pt-48 shadow-lg hover:shadow-xl transition-shadow duration-300 relative overflow-visible flex flex-col'
          >
            <div className='flex justify-center mb-6 md:absolute md:-top-32 md:left-1/2 md:transform md:-translate-x-1/2 md:w-full'>
              <img
                src={feature.icon}
                alt={feature.title}
                className='w-48 h-48 md:w-72 md:h-72 lg:w-80 lg:h-80 object-contain'
              />
            </div>
            <h3 className='text-xl md:text-2xl font-semibold text-foreground mb-4 text-center flex-shrink-0'>
              {feature.title}
            </h3>
            <p className='text-muted-foreground text-sm md:text-base leading-relaxed text-center flex-grow'>
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function TopGradient() {
  return (
    <div
      className='absolute top-0 right-0 -z-10 transform-gpu overflow-hidden w-full blur-3xl sm:top-0'
      aria-hidden='true'
    >
      <div
        className='absolute aspect-[1020/880] w-[70rem] flex-none right-1/4 translate-x-1/2 dark:hidden opacity-20'
        style={{
          background: 'linear-gradient(to top right, #0C84FE, #2BAAFE, #00C0E8)',
          clipPath: 'polygon(80% 20%, 90% 55%, 50% 100%, 70% 30%, 20% 50%, 50% 0)',
        }}
      />
    </div>
  );
}

function BottomGradient() {
  return (
    <div
      className='absolute inset-x-0 top-[calc(100%-40rem)] sm:top-[calc(100%-65rem)] -z-10 transform-gpu overflow-hidden blur-3xl'
      aria-hidden='true'
    >
      <div
        className='relative aspect-[1020/880] sm:-left-3/4 sm:translate-x-1/4 dark:hidden opacity-10 w-[90rem]'
        style={{
          background: 'linear-gradient(to bottom right, #0C84FE, #2BAAFE, #00C0E8)',
          clipPath: 'ellipse(80% 30% at 80% 50%)',
        }}
      />
    </div>
  );
}
