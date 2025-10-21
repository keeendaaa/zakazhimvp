import { CartItem } from '../types';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Minus, Plus, Trash2, ShoppingBag, CreditCard } from 'lucide-react';

interface CartScreenProps {
  cartItems: CartItem[];
  onUpdateQuantity: (dishId: string, newQuantity: number) => void;
  onRemoveItem: (dishId: string) => void;
  onCheckout: () => void;
}

export default function CartScreen({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}: CartScreenProps) {
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.dish.price * item.quantity,
    0
  );

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
            <ShoppingBag className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="mb-2">Корзина пуста</h2>
          <p className="text-gray-600">Добавьте блюда из меню</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-6">
        <h1>Корзина</h1>
        <p className="text-gray-600 mt-1">{cartItems.length} {cartItems.length === 1 ? 'блюдо' : 'блюд'}</p>
      </div>

      {/* Cart Items */}
      <div className="px-4 py-4">
        <div className="space-y-4">
          {cartItems.map((item) => (
            <Card key={item.dish.id} className="overflow-hidden">
              <div className="flex gap-4 p-4">
                <ImageWithFallback
                  src={item.dish.image}
                  alt={item.dish.name}
                  className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="line-clamp-1">{item.dish.name}</h3>
                    <button
                      onClick={() => onRemoveItem(item.dish.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                    {item.dish.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-blue-600">
                      {item.dish.price * item.quantity} ₽
                    </span>

                    <div className="flex items-center gap-3 bg-gray-100 rounded-full px-3 py-1">
                      <button
                        onClick={() => onUpdateQuantity(item.dish.id, item.quantity - 1)}
                        className="text-gray-600 hover:text-blue-600 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.dish.id, item.quantity + 1)}
                        className="text-gray-600 hover:text-blue-600 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Checkout Footer */}
      <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-gray-200 px-4 py-4 shadow-lg">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Сумма заказа:</span>
            <span>{totalAmount} ₽</span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Сервисный сбор:</span>
            <span>0 ₽</span>
          </div>
          <div className="border-t border-gray-200 pt-2 mt-2">
            <div className="flex items-center justify-between">
              <span>Итого:</span>
              <span className="text-blue-600">{totalAmount} ₽</span>
            </div>
          </div>
        </div>

        <Button
          onClick={onCheckout}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 rounded-full"
        >
          <CreditCard className="w-5 h-5 mr-2" />
          Оплатить {totalAmount} ₽
        </Button>

        <div className="flex items-center justify-center gap-4 mt-3">
          <span className="text-sm text-gray-500">Принимаем:</span>
          <div className="flex items-center gap-2">
            <div className="px-3 py-1 bg-gray-100 rounded text-sm">Apple Pay</div>
            <div className="px-3 py-1 bg-gray-100 rounded text-sm">Google Pay</div>
          </div>
        </div>
      </div>
    </div>
  );
}
