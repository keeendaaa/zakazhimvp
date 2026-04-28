import { CartItem } from '../types';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Button } from './ui/button';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';

interface CartScreenNewProps {
  cartItems: CartItem[];
  onUpdateQuantity: (itemId: string, newQuantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onCheckout: () => void;
}

export default function CartScreenNew({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}: CartScreenNewProps) {
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.item.price * item.quantity,
    0
  );

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pb-24 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <ShoppingBag className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="mb-2">корзина пуста</h2>
          <p className="text-gray-500">добавьте что-нибудь вкусное</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* Header */}
      <div className="bg-gray-50 px-4 pt-8 pb-4">
        <h1 className="mb-2">корзина</h1>
        <p className="text-gray-500">
          {cartItems.length} {cartItems.length === 1 ? 'позиция' : 'позиций'}
        </p>
      </div>

      {/* Cart Items */}
      <div className="px-4 space-y-3">
        {cartItems.map(item => (
          <div
            key={item.item.id}
            className="bg-white rounded-2xl p-4 shadow-sm"
          >
            <div className="flex gap-4">
              <ImageWithFallback
                src={item.item.image}
                alt={item.item.name}
                className="w-20 h-20 object-cover rounded-xl flex-shrink-0"
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-sm line-clamp-2 pr-2">{item.item.name}</h3>
                  <button
                    onClick={() => onRemoveItem(item.item.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">
                    {item.item.price * item.quantity} ₽
                  </span>

                  <div className="flex items-center gap-3 bg-gray-50 rounded-full px-3 py-1.5">
                    <button
                      onClick={() => onUpdateQuantity(item.item.id, item.quantity - 1)}
                      className="text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-sm w-4 text-center">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(item.item.id, item.quantity + 1)}
                      className="text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Checkout Footer */}
      <div className="fixed bottom-20 left-0 right-0 bg-white border-t border-gray-100 px-4 py-4 shadow-lg">
        <div className="mb-4 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">сумма</span>
            <span>{totalAmount} ₽</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">сервисный сбор</span>
            <span>0 ₽</span>
          </div>
        </div>

        <Button
          onClick={onCheckout}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 rounded-full"
        >
          оплатить {totalAmount} ₽
        </Button>
      </div>
    </div>
  );
}
