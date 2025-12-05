import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { CheckCircle2, Clock, ChefHat } from 'lucide-react';

interface OrderConfirmationNewProps {
  orderNumber: string;
  onBackToMenu: () => void;
  onPayment?: () => void;
}

export default function OrderConfirmationNew({
  orderNumber,
  onBackToMenu,
  onPayment,
}: OrderConfirmationNewProps) {
  const [estimatedTime, setEstimatedTime] = useState(15);

  useEffect(() => {
    const interval = setInterval(() => {
      setEstimatedTime(prev => Math.max(0, prev - 1));
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pb-24 flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Success icon */}
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle2 className="w-12 h-12 text-green-600" />
        </div>

        <h1 className="text-center mb-2">заказ принят</h1>
        <p className="text-center text-gray-500 mb-8">
          номер заказа #{orderNumber}
        </p>

        {/* Status card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <ChefHat className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="mb-1">готовим ваш заказ</h3>
              <p className="text-sm text-gray-500">уже работаем над ним</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="w-5 h-5" />
            <span>примерное время: ~{estimatedTime} минут</span>
          </div>
        </div>

        {/* Info */}
        <div className="bg-blue-50 rounded-xl p-4 mb-6">
          <p className="text-sm text-gray-700 text-center">
            официант принесёт ваш заказ к столу
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          {onPayment && (
            <Button
              onClick={onPayment}
              className="w-full h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
            >
              Оплатить
            </Button>
          )}
          
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
