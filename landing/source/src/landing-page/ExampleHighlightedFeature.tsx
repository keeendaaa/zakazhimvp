import HighlightedFeature from './components/HighlightedFeature';

const aiReadyDark = '/assets/aiready-dark.png';
const aiReady = '/assets/aiready.png';

export default function AIReady() {
  return (
    <HighlightedFeature
      name='Закажи по QR — без ожидания'
      description='В часы пик гость сканирует QR, сразу видит меню и задаёт вопросы AI про состав и аллергены. Заказывает и оплачивает в телефоне — тикет мгновенно уходит на кухню. В итоге меньше ожидания и очередей, больше оборота столов без роста штата.'
      highlightedComponent={<AIReadyExample />}
      direction='row-reverse'
    />
  );
}

const AIReadyExample = () => {
  return (
    <div className='w-full'>
      <img src={aiReady} alt='AI Ready' className='dark:hidden' />
      <img src={aiReadyDark} alt='AI Ready' className='hidden dark:block' />
    </div>
  );
};
