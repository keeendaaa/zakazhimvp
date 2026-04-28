# VTB SBP Payment Integration - n8n Workflows

Документация по использованию n8n workflows для работы с VTB SBP API.

## Установка и настройка

### 1. Переменные окружения в n8n

В настройках n8n добавьте следующие переменные окружения:

```bash
VTB_BASE_URL=https://vtb.rbsuat.com/payment/rest/
VTB_USERNAME=your_username
VTB_PASSWORD=your_password
```

Для production:
```bash
VTB_BASE_URL=https://securepayments.sberbank.ru/payment/rest/
VTB_USERNAME=your_production_username
VTB_PASSWORD=your_production_password
```

### 2. Импорт workflows

1. Откройте n8n
2. Перейдите в раздел Workflows
3. Нажмите "Import from File"
4. Импортируйте файлы:
   - `VTB SBP Payment QR Code.json` - основной workflow для создания QR-кодов
   - `VTB SBP Test Payment Simulator.json` - симулятор платежей для тестирования

## Workflows

### 1. VTB SBP Payment QR Code

**Webhook URL**: `https://n8n.zakazhi.online/webhook-test/0dc3f33a-c461-483f-9849-08a504686f9c`

**Назначение**: Создание QR-кода для оплаты через СБП

**Процесс**:
1. Принимает POST запрос с данными платежа
2. Регистрирует заказ в VTB API (`register.do`)
3. Создает динамический QR-код СБП (`sbp/c2b/qr/dynamic/create.do`)
4. Возвращает QR-код в формате Base64

**Формат запроса**:
```json
{
  "amount": 10000,           // сумма в копейках (100 рублей)
  "orderNumber": "ORDER-123", // уникальный номер заказа
  "description": "Оплата заказа в ресторане",
  "returnUrl": "https://zakazhi.org/payment/return",
  "testMode": true            // опционально, по умолчанию true
}
```

**Формат ответа (успех)**:
```json
{
  "success": true,
  "message": "QR-код успешно создан",
  "orderId": "04888d6f-7920-7531-8332-8de901efddd0",
  "orderNumber": "ORDER-123",
  "amount": 10000,
  "amountRubles": "100.00",
  "description": "Оплата заказа в ресторане",
  "qrId": "3946c0c02d1042f7b7e63cc0f1b52a95",
  "qrUrl": "https://...",
  "qrImage": "iVBORw0KGgoAAAANSUhEUgAA...", // Base64 изображение
  "qrImageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
  "testMode": true,
  "timestamp": "2024-01-01T12:00:00.000Z",
  "expiresAt": "2024-01-01T12:30:00.000Z"
}
```

**Формат ответа (ошибка)**:
```json
{
  "success": false,
  "error": "❌ Ошибка: не указана сумма платежа",
  "errorCode": "INVALID_AMOUNT"
}
```

### 2. VTB SBP Test Payment Simulator

**Webhook URL**: `https://n8n.zakazhi.online/webhook/test-payment-simulate`

**Назначение**: Симуляция платежа для тестирования (без реальной оплаты)

**Процесс**:
1. Принимает POST запрос с данными для симуляции
2. Формирует webhook payload как от VTB
3. Отправляет на основной webhook обработки платежей
4. Возвращает результат симуляции

**Формат запроса**:
```json
{
  "orderId": "04888d6f-7920-7531-8332-8de901efddd0",
  "qrId": "3946c0c02d1042f7b7e63cc0f1b52a95",
  "status": "PAID",              // PAID, REJECTED_BY_USER, EXPIRED
  "amount": 10000,
  "orderNumber": "ORDER-123"
}
```

**Примеры использования**:

1. **Симуляция успешной оплаты**:
```bash
curl -X POST https://n8n.zakazhi.online/webhook/test-payment-simulate \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "04888d6f-7920-7531-8332-8de901efddd0",
    "qrId": "3946c0c02d1042f7b7e63cc0f1b52a95",
    "status": "PAID",
    "amount": 10000,
    "orderNumber": "ORDER-123"
  }'
```

2. **Симуляция отклонения платежа**:
```bash
curl -X POST https://n8n.zakazhi.online/webhook/test-payment-simulate \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "04888d6f-7920-7531-8332-8de901efddd0",
    "qrId": "3946c0c02d1042f7b7e63cc0f1b52a95",
    "status": "REJECTED_BY_USER",
    "amount": 10000,
    "orderNumber": "ORDER-123"
  }'
```

## Интеграция в приложение

### Пример использования в React

```typescript
// Создание платежа и получение QR-кода
async function createPayment(orderData: any) {
  const response = await fetch(
    'https://n8n.zakazhi.online/webhook-test/0dc3f33a-c461-483f-9849-08a504686f9c',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: orderData.totalAmount * 100, // конвертируем в копейки
        orderNumber: orderData.orderNumber,
        description: `Оплата заказа #${orderData.orderNumber}`,
        returnUrl: `${window.location.origin}/payment/return`,
        testMode: true,
      }),
    }
  );

  const result = await response.json();

  if (result.success && result.qrImage) {
    // Отобразить QR-код
    return result.qrImageUrl; // data:image/png;base64,...
  } else {
    throw new Error(result.error || 'Ошибка создания платежа');
  }
}

// Симуляция оплаты (для тестирования)
async function simulatePayment(orderId: string, qrId: string) {
  const response = await fetch(
    'https://n8n.zakazhi.online/webhook/test-payment-simulate',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderId,
        qrId,
        status: 'PAID',
        amount: 10000,
      }),
    }
  );

  return await response.json();
}
```

## Тестирование

### 1. Создание тестового платежа

```bash
curl -X POST https://n8n.zakazhi.online/webhook-test/0dc3f33a-c461-483f-9849-08a504686f9c \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 10000,
    "orderNumber": "TEST-001",
    "description": "Тестовый платеж",
    "testMode": true
  }'
```

### 2. Симуляция оплаты

После получения QR-кода, используйте симулятор для тестирования:

```bash
curl -X POST https://n8n.zakazhi.online/webhook/test-payment-simulate \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "полученный_orderId",
    "qrId": "полученный_qrId",
    "status": "PAID",
    "amount": 10000,
    "orderNumber": "TEST-001"
  }'
```

## Обработка ошибок

Workflow обрабатывает следующие ошибки:

- `MISSING_DATA` - отсутствуют данные в запросе
- `INVALID_AMOUNT` - не указана или неверная сумма
- `NO_ORDER_ID` - не получен orderId от VTB
- `NO_QR_CODE` - не получен QR-код от VTB
- Ошибки от VTB API (errorCode из ответа VTB)

## Мониторинг

Все workflow логируют информацию в консоль n8n. Для отладки:

1. Откройте выполнение workflow в n8n
2. Проверьте логи каждого узла
3. Проверьте данные, передаваемые между узлами

## Безопасность

⚠️ **Важно**:
- Никогда не храните учетные данные VTB в коде
- Используйте переменные окружения n8n
- В production используйте HTTPS для всех webhook'ов
- Валидируйте все входящие данные
- Ограничьте доступ к webhook'ам симулятора только для тестирования

## Поддержка

При возникновении проблем:
1. Проверьте логи выполнения workflow в n8n
2. Убедитесь, что переменные окружения настроены правильно
3. Проверьте доступность VTB API
4. Проверьте формат отправляемых данных





