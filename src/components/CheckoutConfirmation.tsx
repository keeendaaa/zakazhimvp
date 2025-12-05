import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { X, Plus, Minus } from 'lucide-react';
import { MenuItem } from '../types';
import { ImageWithFallback } from './figma/ImageWithFallback';
import ItemDetailSheet from './ItemDetailSheet';

interface CheckoutConfirmationProps {
  totalAmount: number;
  menuItems: MenuItem[];
  cartItems: { item: MenuItem; quantity: number }[];
  onConfirm: () => void;
  onCancel: () => void;
  onAddToCart: (item: MenuItem) => void;
  onUpdateQuantity?: (itemId: string, quantity: number) => void;
}

export default function CheckoutConfirmation({
  totalAmount,
  menuItems,
  cartItems,
  onConfirm,
  onCancel,
  onAddToCart,
  onUpdateQuantity,
}: CheckoutConfirmationProps) {
  const [randomDishes, setRandomDishes] = useState<MenuItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  
  // Получаем общее количество каждого блюда из корзины (суммируем все порции)
  const getItemQuantity = (itemId: string) => {
    return cartItems
      .filter(ci => ci.item.id === itemId)
      .reduce((sum, ci) => sum + ci.quantity, 0);
  };

  const handleQuantityChange = (dish: MenuItem, delta: number) => {
    const currentQuantity = getItemQuantity(dish.id);
    const newQuantity = Math.max(0, currentQuantity + delta);
    
    if (newQuantity === 0) {
      // Если количество стало 0, удаляем из корзины
      if (onUpdateQuantity) {
        onUpdateQuantity(dish.id, 0);
      }
      return;
    }
    
    if (delta > 0) {
      // Добавляем блюдо (onAddToCart сам разберется - добавить новое или увеличить количество)
      onAddToCart(dish);
    } else if (delta < 0 && onUpdateQuantity) {
      // Уменьшаем количество - нужно найти первую запись и уменьшить её количество
      const cartItem = cartItems.find(ci => ci.item.id === dish.id);
      if (cartItem) {
        onUpdateQuantity(dish.id, cartItem.quantity - 1);
      }
    }
  };

  useEffect(() => {
    // Выбираем 3 рандомных блюда из всех доступных
    // Не фильтруем по корзине, чтобы можно было добавить несколько раз одно блюдо
    const shuffled = [...menuItems].sort(() => 0.5 - Math.random());
    setRandomDishes(shuffled.slice(0, 3));
  }, [menuItems]);
  return (
    <div 
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-end mb-4">
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold mb-4">Добавить что то еще?</h2>
          
          {/* Рандомные блюда в ряд */}
          <div className="grid grid-cols-3 gap-2 mb-6 items-stretch">
            {randomDishes.map((dish) => {
              const quantity = getItemQuantity(dish.id);
              return (
                <div
                  key={dish.id}
                  className="flex flex-col items-center bg-gray-50 rounded-xl p-2 hover:bg-gray-100 transition-colors relative"
                  style={{ minHeight: '100%' }}
                >
                  <div
                    className="w-full cursor-pointer flex flex-col"
                    onClick={() => setSelectedItem(dish)}
                  >
                    <ImageWithFallback
                      src={dish.image}
                      alt={dish.name}
                      className="w-full aspect-square object-cover rounded-lg mb-2 flex-shrink-0"
                    />
                    <div className="flex flex-col min-h-[3.5rem] justify-between">
                      <h3 className="text-xs font-medium text-center line-clamp-2 mb-1 flex-shrink-0">
                        {dish.name}
                      </h3>
                      <p className="text-xs text-gray-600 text-center mb-2 flex-shrink-0">
                        {dish.price} ₽
                      </p>
                    </div>
                  </div>
                  
                  {/* Счетчик количества */}
                  <div className="w-full mt-auto">
                    {quantity > 0 ? (
                      <div className="flex items-center gap-2 bg-white rounded-full px-2 py-1 border border-gray-200 justify-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQuantityChange(dish, -1);
                          }}
                          className="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-medium w-4 text-center">{quantity}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQuantityChange(dish, 1);
                          }}
                          className="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQuantityChange(dish, 1);
                        }}
                        className="w-full px-2 py-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium flex items-center justify-center gap-1 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                        <span>{dish.price} ₽</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-3">
          <Button
            onClick={onCancel}
            variant="outline"
            className="w-full h-12 rounded-full border-2 border-gray-200 hover:bg-gray-50"
          >
            Продолжить выбор
          </Button>
          
          <Button
            onClick={onConfirm}
            className="w-full h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
          >
            Сделать заказ
          </Button>
        </div>
      </motion.div>

      {selectedItem && (
        <ItemDetailSheet
          item={selectedItem}
          menuItems={menuItems}
          onClose={() => setSelectedItem(null)}
          onAddToCart={(item, removedIngredients) => {
            onAddToCart(item);
            setSelectedItem(null);
          }}
        />
      )}
    </div>
  );
}

