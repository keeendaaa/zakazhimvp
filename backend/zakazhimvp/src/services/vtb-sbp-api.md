# VTB API для работы с СБП (Система Быстрых Платежей)

## Общая информация

VTB предоставляет REST API для интеграции с Системой Быстрых Платежей (СБП). Документация доступна по адресу:
https://sandbox.vtb.ru/sandbox/ru/integration/api/rest.html

## Базовые настройки

### URL для API-вызовов
- **Sandbox (тестовое окружение)**: `https://vtb.rbsuat.com/payment/rest/`
- **Production (боевое окружение)**: `https://securepayments.sberbank.ru/payment/rest/`

### Аутентификация
API использует базовую аутентификацию через параметры:
- `userName` - имя пользователя
- `password` - пароль

Эти параметры передаются в каждом запросе.

## Основные методы API для СБП

### 1. Регистрация заказа (register.do)
Создает новый заказ для оплаты через СБП.

**Endpoint**: `register.do`

**Параметры**:
- `amount` (обязательно) - сумма платежа в копейках
- `returnUrl` (обязательно) - URL для возврата после оплаты
- `orderNumber` (обязательно) - номер заказа (уникальный)
- `description` (необязательно) - описание заказа
- `language` (необязательно) - язык ответа (ru, en)

**Ответ**:
```json
{
  "orderId": "string",
  "formUrl": "string",
  "errorCode": "string",
  "errorMessage": "string"
}
```

### 2. Создание динамического QR-кода для СБП (sbp/c2b/qr/dynamic/create.do)
Создает динамический QR-код для оплаты через СБП.

**Endpoint**: `sbp/c2b/qr/dynamic/create.do`

**Параметры**:
- `mdOrder` (обязательно) - идентификатор заказа (orderId из register.do)
- `amount` (обязательно) - сумма в копейках
- `currency` (необязательно) - валюта (по умолчанию 643 - RUB)
- `orderDescription` (необязательно) - описание заказа
- `language` (необязательно) - язык (ru, en)

**Ответ**:
```json
{
  "qrId": "string",
  "qrUrl": "string",
  "qrImage": "string", // Base64 изображение QR-кода
  "errorCode": "string",
  "errorMessage": "string"
}
```

### 3. Получение статуса СБП-платежа (sbp/c2b/qr/dynamic/status.do)
Проверяет статус платежа по QR-коду.

**Endpoint**: `sbp/c2b/qr/dynamic/status.do`

**Параметры**:
- `mdOrder` (обязательно) - идентификатор заказа
- `qrId` (обязательно) - идентификатор QR-кода

**Ответ**:
```json
{
  "status": "string", // NEW, PAID, REJECTED_BY_USER, EXPIRED, etc.
  "amount": "number",
  "currency": "number",
  "orderNumber": "string",
  "errorCode": "string",
  "errorMessage": "string"
}
```

**Статусы платежа**:
- `NEW` - QR-код создан, ожидается оплата
- `PAID` - платеж успешно выполнен
- `REJECTED_BY_USER` - платеж отклонен пользователем
- `EXPIRED` - QR-код истек
- `CANCELLED` - платеж отменен

### 4. Отклонение СБП-платежа (sbp/c2b/qr/dynamic/reject.do)
Отклоняет платеж по QR-коду.

**Endpoint**: `sbp/c2b/qr/dynamic/reject.do`

**Параметры**:
- `mdOrder` (обязательно) - идентификатор заказа
- `qrId` (обязательно) - идентификатор QR-кода

**Ответ**:
```json
{
  "rejected": "boolean",
  "errorCode": "string",
  "errorMessage": "string"
}
```

### 5. Получение статуса заказа (getOrderStatus.do)
Получает статус заказа по orderId.

**Endpoint**: `getOrderStatus.do`

**Параметры**:
- `orderId` (обязательно) - идентификатор заказа

**Ответ**:
```json
{
  "OrderStatus": "number", // 0 - заказ зарегистрирован, 2 - оплачен, 6 - отменен
  "ErrorCode": "string",
  "ErrorMessage": "string"
}
```

## Процесс оплаты через СБП

1. **Регистрация заказа**: Вызвать `register.do` для создания заказа
2. **Создание QR-кода**: Вызвать `sbp/c2b/qr/dynamic/create.do` с `mdOrder` из шага 1
3. **Отображение QR-кода**: Показать пользователю QR-код из ответа (`qrImage` или `qrUrl`)
4. **Проверка статуса**: Периодически вызывать `sbp/c2b/qr/dynamic/status.do` для проверки статуса
5. **Обработка результата**: При статусе `PAID` - заказ оплачен, при `REJECTED_BY_USER` или `EXPIRED` - обработать соответственно

## Обработка ошибок

Все методы API могут возвращать ошибки в формате:
```json
{
  "errorCode": "string",
  "errorMessage": "string"
}
```

Основные коды ошибок:
- `1` - Ошибка обработки запроса
- `2` - Неверный формат запроса
- `5` - Доступ запрещен
- `7` - Системная ошибка

## Важные замечания

1. **СБП не поддерживает двухстадийные платежи** - платеж сразу завершается со статусом `DEPOSITED`
2. **QR-коды имеют срок действия** - обычно 30 минут, после чего статус меняется на `EXPIRED`
3. **Проверка статуса** - рекомендуется проверять статус каждые 5-10 секунд
4. **Безопасность** - никогда не передавайте учетные данные на клиентской стороне, используйте backend для всех API-вызовов





