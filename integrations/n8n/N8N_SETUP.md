# Настройка n8n для отправки заказов в Telegram

Это руководство поможет настроить автоматическую отправку заказов в Telegram бота через n8n.

## Шаг 1: Создание Telegram бота

1. Откройте Telegram и найдите бота [@BotFather](https://t.me/BotFather)
2. Отправьте команду `/newbot`
3. Следуйте инструкциям для создания бота
4. Сохраните **Bot Token**, который выдаст BotFather (например: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)

## Шаг 2: Получение Chat ID

1. Найдите бота [@userinfobot](https://t.me/userinfobot) в Telegram
2. Начните диалог с ботом и отправьте команду `/start`
3. Бот вернет ваш **Chat ID** (например: `123456789`)
4. Сохраните этот ID

## Шаг 3: Настройка n8n Workflow

### 3.1 Создание нового Workflow

1. Войдите в n8n: `https://n8n.zakazhi.online`
2. Нажмите на кнопку **"New Workflow"**
3. Дайте название workflow (например: "Restaurant Orders to Telegram")

### 3.2 Добавление Webhook узла

1. Нажмите **"+"** для добавления узла
2. Найдите и выберите **"Webhook"**
3. Настройте Webhook:
   - **HTTP Method**: `POST`
   - **Path**: `order` (это создаст URL: `https://n8n.zakazhi.online/webhook/order`)
   - **Response Mode**: `Last Node`
   - **Response Data**: `All Entries`
4. Нажмите **"Listen for Test Event"** и скопируйте URL вебхука
5. Нажмите **"Save"** на узле

### 3.3 Добавление узла для форматирования данных

1. Добавьте узел **"Code"** или **"Set"**
2. Настройте его для форматирования данных заказа:

**Если используете узел "Code" (JavaScript):**
```javascript
// Получаем данные из вебхука
const orderData = $input.item.json;

// Форматируем сообщение
const orderNumber = orderData.orderNumber;
const totalAmount = orderData.totalAmount;
const time = orderData.time;
const date = orderData.date;

// Форматируем список блюд
let itemsText = '';
orderData.items.forEach((item, index) => {
  const itemName = item.item.name;
  const quantity = item.quantity;
  const price = item.item.price;
  const itemTotal = price * quantity;
  
  // Добавляем информацию об убранных ингредиентах
  let removedInfo = '';
  if (item.removedIngredients && item.removedIngredients.length > 0) {
    removedInfo = `\n   Без: ${item.removedIngredients.join(', ')}`;
  }
  
  itemsText += `${index + 1}. ${itemName} x${quantity} - ${itemTotal} ₽${removedInfo}\n`;
});

// Формируем итоговое сообщение
const message = `🍽️ *Новый заказ #${orderNumber}*

📅 Дата: ${date}
🕐 Время: ${time}

📋 *Состав заказа:*
${itemsText}

💰 *Итого: ${totalAmount} ₽*

${orderData.restaurantId ? `🏢 ID ресторана: ${orderData.restaurantId}` : ''}`;

return {
  json: {
    message: message,
    orderNumber: orderNumber,
    totalAmount: totalAmount
  }
};
```

**Если используете узел "Set":**
- Добавьте поле `message` с формулой для форматирования текста

### 3.4 Добавление Telegram узла

1. Добавьте узел **"Telegram"**
2. Настройте подключение:
   - Нажмите **"Create New Credential"**
   - Введите **Bot Token** (полученный от BotFather)
   - Нажмите **"Save"**
3. Настройте узел:
   - **Operation**: `Send Message`
   - **Chat ID**: Введите ваш Chat ID (полученный от @userinfobot)
   - **Text**: Выберите `{{ $json.message }}` (или поле с сообщением из предыдущего узла)
   - **Parse Mode**: `Markdown` (для форматирования текста)

### 3.5 Добавление Response узла (опционально)

1. Добавьте узел **"Respond to Webhook"**
2. Настройте ответ:
   - **Response Code**: `200`
   - **Response Body**: `{{ { "success": true, "orderNumber": $json.orderNumber } }}`

### 3.6 Активация Workflow

1. Нажмите кнопку **"Active"** в правом верхнем углу
2. Workflow теперь активен и готов принимать заказы

## Шаг 4: Тестирование

1. Создайте тестовый заказ в приложении
2. Проверьте, что сообщение пришло в Telegram
3. Проверьте логи в n8n на наличие ошибок

## Структура данных заказа

Приложение отправляет следующий JSON на вебхук:

```json
{
  "orderNumber": "1234",
  "items": [
    {
      "item": {
        "id": "viva_1",
        "name": "Маргарита",
        "price": 560,
        "description": "...",
        "category": "pizza"
      },
      "quantity": 2,
      "removedIngredients": ["лук", "перец"]
    }
  ],
  "totalAmount": 1120,
  "time": "14:30",
  "date": "23.11.2024",
  "restaurantId": "123"
}
```

## Дополнительные настройки

### Отправка в группу Telegram

Если нужно отправлять заказы в группу:
1. Добавьте бота в группу
2. Получите Chat ID группы:
   - Добавьте бота [@getidsbot](https://t.me/getidsbot) в группу
   - Отправьте команду `/start`
   - Бот вернет Chat ID группы (будет отрицательным числом, например: `-1001234567890`)
3. Используйте этот Chat ID в узле Telegram

### Уведомления о разных типах заказов

Можно настроить разные workflow для:
- Новых заказов
- Оплаченных заказов
- Отмененных заказов

Для этого создайте отдельные вебхуки с разными путями.

### Интеграция с базой данных

Можно добавить узел для сохранения заказов в базу данных перед отправкой в Telegram.

## Устранение неполадок

### Заказы не приходят в Telegram

1. Проверьте, что workflow активирован
2. Проверьте правильность Bot Token
3. Проверьте правильность Chat ID
4. Проверьте логи в n8n на наличие ошибок

### Ошибка "Unauthorized" в Telegram

- Проверьте правильность Bot Token
- Убедитесь, что бот не был удален

### Ошибка "Chat not found" в Telegram

- Проверьте правильность Chat ID
- Убедитесь, что бот добавлен в группу (если используете группу)
- Начните диалог с ботом лично (если используете личный чат)

## Пример готового Workflow

```
Webhook (POST /webhook/order)
  ↓
Code (Форматирование сообщения)
  ↓
Telegram (Send Message)
  ↓
Respond to Webhook (200 OK)
```

## Полезные ссылки

- [Документация n8n](https://docs.n8n.io/)
- [Документация Telegram Bot API](https://core.telegram.org/bots/api)
- [BotFather](https://t.me/BotFather)

