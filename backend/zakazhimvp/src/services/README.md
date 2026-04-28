# VTB SBP Integration

Интеграция с VTB API для работы с Системой Быстрых Платежей (СБП).

## Быстрый старт

### 1. Получение учетных данных

1. Зарегистрируйтесь в [VTB Sandbox](https://sandbox.vtb.ru/)
2. Получите `userName` и `password` в личном кабинете
3. Для production используйте учетные данные из договора с VTB

### 2. Установка и настройка

```typescript
import { createVtbSbpSandboxService } from './services/vtbSbpService';

// Инициализация сервиса (только на backend!)
const sbpService = createVtbSbpSandboxService(
  process.env.VTB_USERNAME!,
  process.env.VTB_PASSWORD!
);
```

### 3. Создание платежа

```typescript
const payment = await sbpService.createPayment(
  10000, // 100 рублей в копейках
  'ORDER-12345', // уникальный номер заказа
  'https://your-site.com/payment/return', // URL возврата
  'Оплата заказа в ресторане' // описание
);

// payment.qrImage содержит Base64 изображение QR-кода
// Отправьте его на клиент для отображения
```

### 4. Отслеживание статуса

```typescript
const status = await sbpService.pollPaymentStatus(
  payment.orderId,
  payment.qrId,
  {
    interval: 5000, // проверка каждые 5 секунд
    onStatusUpdate: (status) => {
      console.log('Статус:', status.status);
    },
  }
);
```

## Структура файлов

- `vtb-sbp-api.md` - Полная документация по API
- `vtbSbpService.ts` - Основной сервис для работы с API
- `vtbSbpExample.ts` - Примеры использования

## Важные замечания

⚠️ **Безопасность**: 
- Никогда не используйте сервис напрямую на клиенте
- Все API-вызовы должны проходить через ваш backend
- Храните учетные данные в переменных окружения

⚠️ **Ограничения**:
- QR-коды действительны 30 минут
- СБП не поддерживает двухстадийные платежи
- Рекомендуется проверять статус каждые 5-10 секунд

## Пример интеграции с React

```typescript
// Backend API endpoint
app.post('/api/payment/create', async (req, res) => {
  const sbpService = createVtbSbpSandboxService(
    process.env.VTB_USERNAME!,
    process.env.VTB_PASSWORD!
  );
  
  const payment = await sbpService.createPayment(
    req.body.amount,
    req.body.orderNumber,
    req.body.returnUrl,
    req.body.description
  );
  
  res.json(payment);
});

// Frontend компонент
function PaymentQR({ orderId, amount }) {
  const [qrImage, setQrImage] = useState(null);
  
  useEffect(() => {
    fetch('/api/payment/create', {
      method: 'POST',
      body: JSON.stringify({ orderId, amount }),
    })
      .then(res => res.json())
      .then(data => setQrImage(data.qrImage));
  }, []);
  
  return qrImage ? (
    <img src={`data:image/png;base64,${qrImage}`} alt="QR Code" />
  ) : <div>Загрузка...</div>;
}
```

## Документация

Полная документация доступна в файле `vtb-sbp-api.md` и на официальном сайте:
https://sandbox.vtb.ru/sandbox/ru/integration/api/rest.html





