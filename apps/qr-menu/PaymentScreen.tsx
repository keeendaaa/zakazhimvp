import { useState } from 'react';
import { Button } from './ui/button';
import { CheckCircle2, Star } from 'lucide-react';
import { motion } from 'motion/react';

interface PaymentScreenProps {
  orderNumber: string;
  onBackToMenu: () => void;
}

export default function PaymentScreen({
  orderNumber,
  onBackToMenu,
}: PaymentScreenProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const handleRatingClick = (value: number) => {
    setRating(value);
    setShowFeedback(true);
  };

  const handleSubmitFeedback = async () => {
    try {
      const feedbackData = {
        orderNumber,
        rating,
        feedback: feedback.trim() || null,
        timestamp: new Date().toISOString(),
      };

      console.log('[Feedback] Отправка отзыва:', feedbackData);

      // Определяем URL в зависимости от окружения
      const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      const webhookUrl = isDevelopment
        ? '/api/n8n/webhook/8137396c-eeb6-4df3-b35b-9eb775d8147d'
        : 'https://n8n.zakazhi.online/webhook/8137396c-eeb6-4df3-b35b-9eb775d8147d';
      console.log('[Feedback] Webhook URL:', webhookUrl);

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedbackData),
      });

      console.log('[Feedback] Response status:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[Feedback] Error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Попробуем получить JSON ответ, но если не получится - тоже OK
      let result;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        try {
          result = await response.json();
          console.log('[Feedback] Отзыв успешно отправлен:', result);
        } catch (e) {
          console.log('[Feedback] Ответ не JSON, но статус OK');
          result = { message: 'Success' };
        }
      } else {
        const text = await response.text();
        console.log('[Feedback] Ответ (текст):', text);
        result = { message: text || 'Success' };
      }
      
      setFeedbackSubmitted(true);
    } catch (error) {
      console.error('[Feedback] Ошибка при отправке отзыва:', error);
      // Все равно показываем сообщение об успехе, даже если отправка не удалась
      setFeedbackSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24 flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Success icon */}
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle2 className="w-12 h-12 text-green-600" />
        </div>

        <h1 className="text-center mb-2">заказ оплачен</h1>
        <p className="text-center text-gray-500 mb-8">
          номер заказа #{orderNumber}
        </p>

        {/* Info */}
        <div className="bg-blue-50 rounded-xl p-4 mb-6">
          <p className="text-sm text-gray-700 text-center">
            официант принесёт ваш заказ к столу
          </p>
        </div>

        {/* Service Rating Section */}
        {!feedbackSubmitted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-sm mb-6"
          >
            <h3 className="text-center mb-4">Оцените посещение</h3>
            
            {/* Star Rating */}
            <div className="flex justify-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => {
                const isActive = star <= (hoveredRating || rating);
                return (
                  <motion.button
                    key={star}
                    type="button"
                    onClick={() => handleRatingClick(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="focus:outline-none"
                    whileTap={{ scale: 0.9 }}
                  >
                    <svg
                      className="w-8 h-8 transition-all duration-200"
                      fill={isActive ? '#facc15' : 'none'}
                      stroke={isActive ? '#facc15' : '#d1d5db'}
                      strokeWidth={isActive ? 0 : 2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      viewBox="0 0 24 24"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  </motion.button>
                );
              })}
            </div>

            {/* Feedback Text */}
            {showFeedback && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
                className="space-y-3"
              >
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Поделитесь вашими впечатлениями (необязательно)"
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none resize-none"
                  rows={3}
                />
                <Button
                  onClick={handleSubmitFeedback}
                  className="w-full h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
                >
                  Отправить отзыв
                </Button>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Thank you message */}
        {feedbackSubmitted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-green-50 rounded-xl p-4 mb-6 text-center"
          >
            <p className="text-green-700 font-medium">Спасибо за ваш отзыв!</p>
          </motion.div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          <Button
            onClick={onBackToMenu}
            variant="outline"
            className="w-full h-12 rounded-full border-2 border-gray-200 hover:bg-gray-50"
          >
            вернуться в меню
          </Button>
        </div>
      </div>
    </div>
  );
}

