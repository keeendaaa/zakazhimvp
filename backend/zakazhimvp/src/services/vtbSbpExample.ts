/**
 * Пример использования VTB SBP Service
 * 
 * ВАЖНО: Этот код должен выполняться на backend!
 * Никогда не храните userName и password на клиенте.
 */

import {
  VtbSbpService,
  createVtbSbpSandboxService,
} from './vtbSbpService';

/**
 * Пример 1: Простое создание платежа
 */
export async function exampleCreatePayment() {
  // Инициализация сервиса (на backend!)
  const sbpService = createVtbSbpSandboxService(
    'your_username', // получить в личном кабинете VTB
    'your_password'  // получить в личном кабинете VTB
  );

  try {
    // Создание платежа
    const payment = await sbpService.createPayment(
      10000, // 100 рублей в копейках
      'ORDER-12345', // уникальный номер заказа
      'https://your-site.com/payment/return', // URL возврата
      'Оплата заказа в ресторане' // описание
    );

    console.log('Order ID:', payment.orderId);
    console.log('QR ID:', payment.qrId);
    console.log('QR Image (Base64):', payment.qrImage);
    console.log('QR URL:', payment.qrUrl);

    // Отправка данных на клиент для отображения QR-кода
    return payment;
  } catch (error) {
    console.error('Ошибка создания платежа:', error);
    throw error;
  }
}

/**
 * Пример 2: Создание платежа и отслеживание статуса
 */
export async function exampleCreatePaymentWithPolling() {
  const sbpService = createVtbSbpSandboxService(
    'your_username',
    'your_password'
  );

  try {
    // Создание платежа
    const payment = await sbpService.createPayment(
      10000,
      'ORDER-12345',
      'https://your-site.com/payment/return',
      'Оплата заказа в ресторане'
    );

    // Отправка QR-кода клиенту
    // ... отправка payment.qrImage на клиент ...

    // Отслеживание статуса платежа
    const status = await sbpService.pollPaymentStatus(
      payment.orderId,
      payment.qrId,
      {
        interval: 5000, // проверка каждые 5 секунд
        timeout: 30 * 60 * 1000, // таймаут 30 минут
        onStatusUpdate: (status) => {
          console.log('Статус обновлен:', status.status);
          // Можно отправить обновление статуса на клиент через WebSocket или SSE
        },
      }
    );

    // Платеж успешно оплачен
    console.log('Платеж успешно оплачен!', status);
    return status;
  } catch (error) {
    console.error('Ошибка:', error);
    throw error;
  }
}

/**
 * Пример 3: Ручная проверка статуса
 */
export async function exampleManualStatusCheck() {
  const sbpService = createVtbSbpSandboxService(
    'your_username',
    'your_password'
  );

  const orderId = 'your_order_id';
  const qrId = 'your_qr_id';

  try {
    const status = await sbpService.getQrStatus(orderId, qrId);
    console.log('Статус платежа:', status.status);

    switch (status.status) {
      case 'PAID':
        console.log('Платеж оплачен!');
        // Обновить статус заказа в БД
        break;
      case 'REJECTED_BY_USER':
        console.log('Платеж отклонен пользователем');
        // Обработать отклонение
        break;
      case 'EXPIRED':
        console.log('QR-код истек');
        // Создать новый QR-код или отменить заказ
        break;
      case 'NEW':
        console.log('Ожидается оплата');
        // Продолжить ожидание
        break;
      default:
        console.log('Неизвестный статус:', status.status);
    }

    return status;
  } catch (error) {
    console.error('Ошибка проверки статуса:', error);
    throw error;
  }
}

/**
 * Пример 4: Отклонение платежа
 */
export async function exampleRejectPayment() {
  const sbpService = createVtbSbpSandboxService(
    'your_username',
    'your_password'
  );

  const orderId = 'your_order_id';
  const qrId = 'your_qr_id';

  try {
    const result = await sbpService.rejectQr({
      mdOrder: orderId,
      qrId: qrId,
    });

    if (result.rejected) {
      console.log('Платеж успешно отклонен');
    } else {
      console.log('Не удалось отклонить платеж:', result.errorMessage);
    }

    return result;
  } catch (error) {
    console.error('Ошибка отклонения платежа:', error);
    throw error;
  }
}

/**
 * Пример 5: Backend API endpoint (Express.js)
 * 
 * Этот пример показывает, как создать API endpoint на backend
 * для безопасной работы с VTB SBP API
 */
/*
import express from 'express';
import { createVtbSbpSandboxService } from './vtbSbpService';

const app = express();
app.use(express.json());

// Endpoint для создания платежа
app.post('/api/payment/create', async (req, res) => {
  try {
    const { amount, orderNumber, description } = req.body;

    const sbpService = createVtbSbpSandboxService(
      process.env.VTB_USERNAME!,
      process.env.VTB_PASSWORD!
    );

    const payment = await sbpService.createPayment(
      amount,
      orderNumber,
      `${req.protocol}://${req.get('host')}/payment/return`,
      description
    );

    res.json({
      success: true,
      data: payment,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Endpoint для проверки статуса
app.post('/api/payment/status', async (req, res) => {
  try {
    const { orderId, qrId } = req.body;

    const sbpService = createVtbSbpSandboxService(
      process.env.VTB_USERNAME!,
      process.env.VTB_PASSWORD!
    );

    const status = await sbpService.getQrStatus(orderId, qrId);

    res.json({
      success: true,
      data: status,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Webhook для получения уведомлений от VTB (если поддерживается)
app.post('/api/payment/webhook', async (req, res) => {
  try {
    // Обработка webhook от VTB
    // Проверить подпись запроса
    // Обновить статус заказа в БД
    // Отправить уведомление клиенту

    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});
*/





