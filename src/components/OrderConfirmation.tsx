import { useState, useEffect } from 'react';
import { OrderStatus } from '../types';
import { Button } from './ui/button';
import { CheckCircle2, ChefHat, Flame, UtensilsCrossed, Clock } from 'lucide-react';

interface OrderConfirmationProps {
  orderNumber: string;
  onBackToMenu: () => void;
}

export default function OrderConfirmation({ orderNumber, onBackToMenu }: OrderConfirmationProps) {
  const [status, setStatus] = useState<OrderStatus>('preparing');
  const [estimatedTime, setEstimatedTime] = useState(25);

  useEffect(() => {
    // Simulate order status updates
    const timer1 = setTimeout(() => setStatus('cooking'), 3000);
    const timer2 = setTimeout(() => setStatus('ready'), 8000);
    const timer3 = setTimeout(() => setStatus('delivering'), 12000);

    const timeInterval = setInterval(() => {
      setEstimatedTime(prev => Math.max(0, prev - 1));
    }, 60000); // Update every minute

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearInterval(timeInterval);
    };
  }, []);

  const stages = [
    { id: 'preparing', label: 'На кухне', icon: ChefHat },
    { id: 'cooking', label: 'Готовится', icon: Flame },
    { id: 'ready', label: 'Готово', icon: UtensilsCrossed },
    { id: 'delivering', label: 'Несут', icon: Clock },
  ];

  const currentStageIndex = stages.findIndex(s => s.id === status);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Success Header */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white px-4 py-12 text-center">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <h1 className="mb-2">Заказ принят!</h1>
        <p className="text-blue-100">Номер заказа: #{orderNumber}</p>
      </div>

      {/* Status */}
      <div className="px-4 py-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="text-center mb-8">
            <p className="text-gray-600 mb-2">Примерное время готовности</p>
            <div className="text-blue-600">
              ~{estimatedTime} минут
            </div>
          </div>

          {/* Progress Steps */}
          <div className="relative">
            {/* Progress Line */}
            <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200 -z-10">
              <div
                className="h-full bg-blue-600 transition-all duration-500"
                style={{ width: `${(currentStageIndex / (stages.length - 1)) * 100}%` }}
              />
            </div>

            <div className="flex justify-between">
              {stages.map((stage, index) => {
                const Icon = stage.icon;
                const isActive = index <= currentStageIndex;
                const isCurrent = index === currentStageIndex;

                return (
                  <div key={stage.id} className="flex flex-col items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                          : 'bg-gray-200 text-gray-400'
                      } ${isCurrent ? 'scale-110' : ''}`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span
                      className={`text-xs text-center ${
                        isActive ? 'text-blue-600' : 'text-gray-500'
                      }`}
                    >
                      {stage.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="px-4 pb-4">
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
          <h3 className="mb-2 text-blue-900">📱 Следите за заказом</h3>
          <p className="text-sm text-blue-800">
            Ваш заказ готовится на кухне. Официант принесёт его к вашему столу, как только всё будет готово.
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 space-y-3">
        <Button
          onClick={onBackToMenu}
          variant="outline"
          className="w-full h-12 rounded-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
        >
          Вернуться в меню
        </Button>
      </div>

      {/* Customer Service */}
      <div className="px-4 mt-8 text-center">
        <p className="text-sm text-gray-500">
          Нужна помощь?{' '}
          <button className="text-blue-600 hover:underline">
            Позвать официанта
          </button>
        </p>
      </div>
    </div>
  );
}
