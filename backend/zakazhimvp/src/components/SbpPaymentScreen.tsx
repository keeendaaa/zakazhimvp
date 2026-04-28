import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Loader2, QrCode, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { motion } from 'motion/react';

interface SbpPaymentScreenProps {
  orderNumber: string;
  amount: number; // сумма в рублях
  description?: string;
  onPaymentSuccess: (orderId: string, qrId: string) => void;
  onPaymentError: (error: string) => void;
  onCancel: () => void;
}

interface PaymentResponse {
  success: boolean;
  orderId?: string;
  qrId?: string;
  qrImageUrl?: string;
  qrImage?: string;
  amountRubles?: string;
  expiresAt?: string;
  error?: string;
  errorCode?: string;
}

export default function SbpPaymentScreen({
  orderNumber,
  amount,
  description,
  onPaymentSuccess,
  onPaymentError,
  onCancel,
}: SbpPaymentScreenProps) {
  const [loading, setLoading] = useState(true);
  const [qrImageUrl, setQrImageUrl] = useState<string | null>(null);
  const [paymentData, setPaymentData] = useState<PaymentResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'paid' | 'expired' | 'rejected'>('loading');

  // Webhook URL для создания платежа
  const paymentWebhookUrl = 'https://n8n.zakazhi.online/webhook-test/0dc3f33a-c461-483f-9849-08a504686f9c';
  // Webhook URL для симуляции платежа (только для тестирования)
  const simulateWebhookUrl = 'https://n8n.zakazhi.online/webhook/test-payment-simulate';

  // Создание платежа и получение QR-кода
  useEffect(() => {
    createPayment();
  }, []);

  const createPayment = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(paymentWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // конвертируем в копейки
          orderNumber: orderNumber,
          description: description || `Оплата заказа #${orderNumber}`,
          returnUrl: `${window.location.origin}/payment/return`,
          testMode: true, // тестовый режим
        }),
      });

      const data: PaymentResponse = await response.json();

      if (data.success && data.qrImageUrl) {
        setPaymentData(data);
        setQrImageUrl(data.qrImageUrl);
        setStatus('ready');
        
        // Начинаем проверку статуса
        if (data.orderId && data.qrId) {
          startStatusPolling(data.orderId, data.qrId);
        }
      } else {
        const errorMessage = data.error || 'Ошибка создания платежа';
        setError(errorMessage);
        onPaymentError(errorMessage);
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Ошибка при создании платежа';
      setError(errorMessage);
      onPaymentError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Проверка статуса платежа (polling)
  const startStatusPolling = (orderId: string, qrId: string) => {
    const interval = setInterval(async () => {
      try {
        // В реальном приложении здесь должен быть endpoint для проверки статуса
        // Для тестирования можно использовать симулятор
        // const statusResponse = await checkPaymentStatus(orderId, qrId);
        
        // Пока просто проверяем, не истек ли QR-код
        if (paymentData?.expiresAt) {
          const expiresAt = new Date(paymentData.expiresAt);
          if (new Date() > expiresAt) {
            setStatus('expired');
            clearInterval(interval);
          }
        }
      } catch (err) {
        console.error('Ошибка проверки статуса:', err);
      }
    }, 5000); // проверка каждые 5 секунд

    // Очистка через 30 минут (время жизни QR-кода)
    setTimeout(() => {
      clearInterval(interval);
      if (status === 'ready') {
        setStatus('expired');
      }
    }, 30 * 60 * 1000);
  };

  // Симуляция оплаты (только для тестирования!)
  const simulatePayment = async (paymentStatus: 'PAID' | 'REJECTED_BY_USER' | 'EXPIRED') => {
    if (!paymentData?.orderId || !paymentData?.qrId) {
      return;
    }

    try {
      const response = await fetch(simulateWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: paymentData.orderId,
          qrId: paymentData.qrId,
          status: paymentStatus,
          amount: Math.round(amount * 100),
          orderNumber: orderNumber,
        }),
      });

      const result = await response.json();

      if (result.success) {
        if (paymentStatus === 'PAID') {
          setStatus('paid');
          onPaymentSuccess(paymentData.orderId!, paymentData.qrId!);
        } else if (paymentStatus === 'REJECTED_BY_USER') {
          setStatus('rejected');
        } else if (paymentStatus === 'EXPIRED') {
          setStatus('expired');
        }
      }
    } catch (err: any) {
      console.error('Ошибка симуляции платежа:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
        <p className="text-gray-600">Создание QR-кода для оплаты...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <XCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Ошибка</h2>
        <p className="text-gray-600 mb-6 text-center">{error}</p>
        <div className="space-y-3">
          <Button
            onClick={createPayment}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Попробовать снова
          </Button>
          <Button
            onClick={onCancel}
            variant="outline"
            className="w-full"
          >
            Отмена
          </Button>
        </div>
      </div>
    );
  }

  if (status === 'paid') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.5 }}
        >
          <CheckCircle2 className="w-20 h-20 text-green-500 mb-4 mx-auto" />
        </motion.div>
        <h2 className="text-2xl font-semibold mb-2">Платеж успешно выполнен!</h2>
        <p className="text-gray-600 mb-6">Заказ #{orderNumber}</p>
      </div>
    );
  }

  if (status === 'expired') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <Clock className="w-16 h-16 text-orange-500 mb-4" />
        <h2 className="text-xl font-semibold mb-2">QR-код истек</h2>
        <p className="text-gray-600 mb-6 text-center">
          Время действия QR-кода истекло. Создайте новый платеж.
        </p>
        <div className="space-y-3">
          <Button
            onClick={createPayment}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Создать новый платеж
          </Button>
          <Button
            onClick={onCancel}
            variant="outline"
            className="w-full"
          >
            Отмена
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24 flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-6">
          <QrCode className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-2xl font-semibold mb-2">Оплата через СБП</h1>
          <p className="text-gray-600">Заказ #{orderNumber}</p>
          <p className="text-xl font-bold text-gray-900 mt-2">
            {amount.toFixed(2)} ₽
          </p>
        </div>

        {/* QR Code */}
        {qrImageUrl && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-sm mb-6 flex flex-col items-center"
          >
            <p className="text-sm text-gray-600 mb-4 text-center">
              Отсканируйте QR-код в приложении банка для оплаты
            </p>
            <img
              src={qrImageUrl}
              alt="QR Code for Payment"
              className="w-64 h-64 border-2 border-gray-200 rounded-lg"
            />
            {paymentData?.expiresAt && (
              <p className="text-xs text-gray-500 mt-4">
                Действителен до: {new Date(paymentData.expiresAt).toLocaleTimeString('ru-RU')}
              </p>
            )}
          </motion.div>
        )}

        {/* Test Mode Controls (только для разработки!) */}
        {process.env.NODE_ENV === 'development' && paymentData && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
            <p className="text-sm font-semibold text-yellow-800 mb-3">
              🧪 Тестовый режим - Симуляция платежа
            </p>
            <div className="space-y-2">
              <Button
                onClick={() => simulatePayment('PAID')}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                size="sm"
              >
                ✅ Симулировать успешную оплату
              </Button>
              <Button
                onClick={() => simulatePayment('REJECTED_BY_USER')}
                className="w-full bg-red-600 hover:bg-red-700 text-white"
                size="sm"
              >
                ❌ Симулировать отклонение
              </Button>
              <Button
                onClick={() => simulatePayment('EXPIRED')}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                size="sm"
              >
                ⏰ Симулировать истечение
              </Button>
            </div>
          </div>
        )}

        {/* Info */}
        <div className="bg-blue-50 rounded-xl p-4 mb-6">
          <p className="text-sm text-gray-700 text-center">
            Оплата через Систему Быстрых Платежей (СБП)
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button
            onClick={createPayment}
            variant="outline"
            className="w-full"
          >
            Обновить QR-код
          </Button>
          <Button
            onClick={onCancel}
            variant="outline"
            className="w-full border-red-200 text-red-600 hover:bg-red-50"
          >
            Отмена
          </Button>
        </div>
      </div>
    </div>
  );
}





