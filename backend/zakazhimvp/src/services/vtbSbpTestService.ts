/**
 * Сервис для тестирования платежей через webhook
 * 
 * Этот сервис позволяет симулировать платежи через webhook для тестирования
 * без необходимости реальной оплаты через СБП
 */

export interface MockPaymentWebhookPayload {
  orderId: string;
  qrId: string;
  status: 'PAID' | 'REJECTED_BY_USER' | 'EXPIRED';
  amount?: number;
  currency?: number;
  orderNumber?: string;
  timestamp?: string;
}

export interface MockPaymentResponse {
  success: boolean;
  message: string;
  data?: any;
}

/**
 * Сервис для создания тестовых платежей через webhook
 */
export class VtbSbpTestService {
  private webhookUrl: string;

  constructor(webhookUrl: string) {
    this.webhookUrl = webhookUrl;
  }

  /**
   * Симуляция успешного платежа через webhook
   */
  async simulateSuccessfulPayment(
    orderId: string,
    qrId: string,
    amount?: number,
    orderNumber?: string
  ): Promise<MockPaymentResponse> {
    const payload: MockPaymentWebhookPayload = {
      orderId,
      qrId,
      status: 'PAID',
      amount: amount || 10000,
      currency: 643,
      orderNumber: orderNumber || `ORDER-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };

    try {
      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      return {
        success: response.ok,
        message: 'Платеж успешно симулирован',
        data: result,
      };
    } catch (error: any) {
      return {
        success: false,
        message: `Ошибка при симуляции платежа: ${error.message}`,
      };
    }
  }

  /**
   * Симуляция отклоненного платежа через webhook
   */
  async simulateRejectedPayment(
    orderId: string,
    qrId: string,
    orderNumber?: string
  ): Promise<MockPaymentResponse> {
    const payload: MockPaymentWebhookPayload = {
      orderId,
      qrId,
      status: 'REJECTED_BY_USER',
      amount: 0,
      currency: 643,
      orderNumber: orderNumber || `ORDER-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };

    try {
      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      return {
        success: response.ok,
        message: 'Отклонение платежа успешно симулировано',
        data: result,
      };
    } catch (error: any) {
      return {
        success: false,
        message: `Ошибка при симуляции отклонения: ${error.message}`,
      };
    }
  }

  /**
   * Симуляция истекшего QR-кода через webhook
   */
  async simulateExpiredPayment(
    orderId: string,
    qrId: string,
    orderNumber?: string
  ): Promise<MockPaymentResponse> {
    const payload: MockPaymentWebhookPayload = {
      orderId,
      qrId,
      status: 'EXPIRED',
      amount: 0,
      currency: 643,
      orderNumber: orderNumber || `ORDER-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };

    try {
      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      return {
        success: response.ok,
        message: 'Истечение QR-кода успешно симулировано',
        data: result,
      };
    } catch (error: any) {
      return {
        success: false,
        message: `Ошибка при симуляции истечения: ${error.message}`,
      };
    }
  }

  /**
   * Симуляция платежа с задержкой (для тестирования polling)
   */
  async simulatePaymentWithDelay(
    orderId: string,
    qrId: string,
    delayMs: number = 5000,
    amount?: number,
    orderNumber?: string
  ): Promise<MockPaymentResponse> {
    return new Promise((resolve) => {
      setTimeout(async () => {
        const result = await this.simulateSuccessfulPayment(
          orderId,
          qrId,
          amount,
          orderNumber
        );
        resolve(result);
      }, delayMs);
    });
  }
}

/**
 * Backend endpoint для обработки webhook от VTB (mock версия)
 * 
 * Пример использования в Express.js:
 */
export function createMockVtbWebhookHandler() {
  return async (req: any, res: any) => {
    try {
      const payload: MockPaymentWebhookPayload = req.body;

      console.log('[VTB Webhook] Получено уведомление:', payload);

      // Валидация payload
      if (!payload.orderId || !payload.qrId || !payload.status) {
        return res.status(400).json({
          success: false,
          error: 'Неверный формат payload',
        });
      }

      // Обновление статуса заказа в БД
      // await updateOrderStatus(payload.orderId, payload.status);

      // Отправка уведомления клиенту (через WebSocket, SSE и т.д.)
      // notifyClient(payload.orderId, payload.status);

      // Ответ VTB (должен быть 200 OK)
      res.status(200).json({
        success: true,
        message: 'Webhook обработан',
        orderId: payload.orderId,
        status: payload.status,
      });
    } catch (error: any) {
      console.error('[VTB Webhook] Ошибка обработки:', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  };
}

/**
 * Пример обработчика webhook для n8n
 * 
 * Этот код можно использовать в n8n Code node для обработки webhook от VTB
 */
export const n8nWebhookHandler = `
// Обработчик webhook для n8n - VTB SBP Payment Notification
// Используйте этот код в узле Code в n8n

console.log('=== VTB SBP Webhook Handler ===');
console.log('Input:', JSON.stringify($input, null, 2));

// Получаем данные из webhook
let webhookData = null;

if ($input.item && $input.item.json && $input.item.json.body) {
  const body = $input.item.json.body;
  webhookData = typeof body === 'string' ? JSON.parse(body) : body;
} else if ($input.item && $input.item.json) {
  webhookData = $input.item.json;
} else if ($input.body) {
  webhookData = typeof $input.body === 'string' ? JSON.parse($input.body) : $input.body;
}

if (!webhookData) {
  return {
    json: {
      success: false,
      error: 'Нет данных в webhook'
    }
  };
}

const { orderId, qrId, status, amount, orderNumber } = webhookData;

console.log('Order ID:', orderId);
console.log('QR ID:', qrId);
console.log('Status:', status);

// Обработка разных статусов
let message = '';
let shouldNotify = false;

switch (status) {
  case 'PAID':
    message = \`✅ Платеж успешно выполнен\\nЗаказ: \${orderNumber || orderId}\\nСумма: \${amount ? (amount / 100) + ' ₽' : 'N/A'}\`;
    shouldNotify = true;
    break;
  case 'REJECTED_BY_USER':
    message = \`❌ Платеж отклонен пользователем\\nЗаказ: \${orderNumber || orderId}\`;
    shouldNotify = true;
    break;
  case 'EXPIRED':
    message = \`⏰ QR-код истек\\nЗаказ: \${orderNumber || orderId}\`;
    shouldNotify = true;
    break;
  default:
    message = \`ℹ️ Статус изменен: \${status}\\nЗаказ: \${orderNumber || orderId}\`;
}

// Если нужно отправить уведомление (например, в Telegram)
if (shouldNotify) {
  // Здесь можно добавить отправку в Telegram, email и т.д.
  // См. пример в Restaurant Orders to Telegram workflow
}

return {
  json: {
    success: true,
    orderId: orderId,
    qrId: qrId,
    status: status,
    message: message,
    timestamp: new Date().toISOString()
  }
};
`;





