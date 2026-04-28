import React, { useState, useEffect } from 'react';
import { CartItem, MenuItem } from '../types';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Button } from './ui/button';
import { Minus, Plus, Trash2, ShoppingBag, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import ItemDetailSheet from './ItemDetailSheet';

interface LastOrder {
  items: CartItem[];
  time: string;
  orderNumber: string;
  isPaid?: boolean;
}

interface CartScreenNewProps {
  cartItems: CartItem[];
  onUpdateQuantity: (itemId: string, newQuantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onCheckout: () => void;
  onPayment?: () => void;
  lastOrder?: LastOrder | null;
  menuItems?: MenuItem[];
  onAddToCart?: (item: MenuItem, removedIngredients?: string[]) => void;
}

export default function CartScreenNew({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  onPayment,
  lastOrder = null,
  menuItems = [],
  onAddToCart,
}: CartScreenNewProps) {
  const [randomDishes, setRandomDishes] = useState<MenuItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.item.price * item.quantity,
    0
  );

  const lastOrderTotal = lastOrder
    ? lastOrder.items.reduce((sum, item) => sum + item.item.price * item.quantity, 0)
    : 0;

  // Получаем общее количество каждого блюда из корзины
  const getItemQuantity = (itemId: string) => {
    return cartItems
      .filter(ci => ci.item.id === itemId)
      .reduce((sum, ci) => sum + ci.quantity, 0);
  };

  const handleQuantityChange = (dish: MenuItem, delta: number) => {
    if (!onAddToCart || !onUpdateQuantity) return;
    
    const currentQuantity = getItemQuantity(dish.id);
    const newQuantity = Math.max(0, currentQuantity + delta);
    
    if (newQuantity === 0) {
      onUpdateQuantity(dish.id, 0);
      return;
    }
    
    if (delta > 0) {
      onAddToCart(dish);
    } else if (delta < 0) {
      const cartItem = cartItems.find(ci => ci.item.id === dish.id);
      if (cartItem) {
        onUpdateQuantity(dish.id, cartItem.quantity - 1);
      }
    }
  };

  useEffect(() => {
    if (menuItems.length > 0) {
      const shuffled = [...menuItems].sort(() => 0.5 - Math.random());
      setRandomDishes(shuffled.slice(0, 3));
    }
  }, [menuItems]);

  // Если корзина пуста, показываем пустое состояние с блоком "добавить что то еще?"
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pb-24 flex flex-col">
        {/* Последний заказ (если есть) */}
        {lastOrder && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="px-4 pt-8 mb-4"
          >
            <div className={`bg-white rounded-2xl p-4 shadow-sm ${!lastOrder.isPaid ? 'border-2 border-blue-200' : ''}`}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-medium mb-1">Последний заказ</h3>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>{lastOrder.time}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{lastOrderTotal} ₽</p>
                </div>
              </div>

              <div className="space-y-2 border-t border-gray-100 pt-3 mb-4">
                {lastOrder.items.map((item, index) => (
                  <div key={`${item.item.id}-${index}`} className="flex items-center gap-3 py-1">
                    <ImageWithFallback
                      src={item.item.image}
                      alt={item.item.name}
                      className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0 flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs line-clamp-1">{item.item.name}</p>
                        {item.removedIngredients && item.removedIngredients.length > 0 && (
                          <p className="text-xs text-gray-500 mt-0.5">
                            Без: {item.removedIngredients.join(', ')}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-3 ml-2 flex-shrink-0">
                        <span className="text-xs text-gray-500">x{item.quantity}</span>
                        <span className="text-xs font-medium">{item.item.price * item.quantity} ₽</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {!lastOrder.isPaid && onPayment && (
                <Button
                  onClick={onPayment}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 rounded-full"
                >
                  Оплатить {lastOrderTotal} ₽
                </Button>
              )}
            </div>
          </motion.div>
        )}

        {/* Центрированный контент */}
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          {/* Пустое состояние корзины */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: lastOrder ? 0.2 : 0 }}
            className="flex flex-col items-center justify-center mb-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.4, delay: lastOrder ? 0.3 : 0.1, type: "spring", stiffness: 200 }}
              className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center"
            >
            <ShoppingBag className="w-10 h-10 text-gray-400" />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: lastOrder ? 0.4 : 0.2 }}
              className="mb-2 text-xl"
            >
              Корзина пустая 👀
            </motion.h2>
          </motion.div>

          {/* Блок "добавить что то еще?" */}
          {menuItems.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: lastOrder ? 0.3 : 0.2 }}
              className="w-full flex justify-center"
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.4, delay: lastOrder ? 0.4 : 0.3 }}
                className="bg-white rounded-3xl p-6 shadow-sm max-w-md w-full"
              >
                <div className="text-center mb-6">
                  <motion.h2
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: lastOrder ? 0.5 : 0.4 }}
                    className="text-xl font-semibold mb-4"
                  >
                    Добавить что то еще?
                  </motion.h2>
                  
                  {/* Рандомные блюда в ряд */}
                  <div className="grid grid-cols-3 gap-2 mb-6 items-stretch">
                    {randomDishes.map((dish, dishIndex) => {
                      const quantity = getItemQuantity(dish.id);
                      return (
                        <motion.div
                          key={dish.id}
                          initial={{ opacity: 0, scale: 0.8, y: 20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          transition={{
                            duration: 0.4,
                            delay: (lastOrder ? 0.6 : 0.5) + dishIndex * 0.1,
                            type: "spring",
                            stiffness: 200
                          }}
                          whileHover={{ scale: 1.05, y: -5 }}
                          whileTap={{ scale: 0.95 }}
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
                      </motion.div>
                    );
                  })}
                </div>
          </div>
              </motion.div>
            </motion.div>
          )}
        </div>

        {selectedItem && onAddToCart && (
          <ItemDetailSheet
            item={selectedItem}
            menuItems={menuItems}
            onClose={() => setSelectedItem(null)}
            onAddToCart={(item, removedIngredients) => {
              onAddToCart(item, removedIngredients);
              setSelectedItem(null);
            }}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* Header */}
      <div className="bg-gray-50 px-4 pt-8 pb-4">
        <div className="flex items-center justify-between mb-2">
          <h1>Мой заказ</h1>
        </div>
        {cartItems.length > 0 && (
        <p className="text-gray-500">
          {cartItems.length} {cartItems.length === 1 ? 'позиция' : 'позиций'}
        </p>
        )}
      </div>

      {/* Последний заказ */}
      {lastOrder && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="px-4 mb-4"
        >
          <motion.div
            initial={{ scale: 0.98 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
            className={`bg-white rounded-2xl p-4 shadow-sm ${!lastOrder.isPaid ? 'border-2 border-blue-200' : ''}`}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-medium mb-1">Последний заказ</h3>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span>{lastOrder.time}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{lastOrderTotal} ₽</p>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="space-y-2 border-t border-gray-100 pt-3 mb-4"
            >
              {lastOrder.items.map((item, index) => (
                <motion.div
                  key={`${item.item.id}-${index}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center gap-3 py-1"
                >
                  <ImageWithFallback
                    src={item.item.image}
                    alt={item.item.name}
                    className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0 flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs line-clamp-1">{item.item.name}</p>
                      {item.removedIngredients && item.removedIngredients.length > 0 && (
                        <p className="text-xs text-gray-500 mt-0.5">
                          Без: {item.removedIngredients.join(', ')}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-3 ml-2 flex-shrink-0">
                      <span className="text-xs text-gray-500">x{item.quantity}</span>
                      <span className="text-xs font-medium">{item.item.price * item.quantity} ₽</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {!lastOrder.isPaid && onPayment && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <Button
                  onClick={onPayment}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 rounded-full"
                >
                  Оплатить {lastOrderTotal} ₽
                </Button>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}

      {/* Текущая корзина */}
      {cartItems.length > 0 && (
        <>
      {/* Cart Items */}
      <div className="px-4 space-y-3">
            {cartItems.map((item, index) => (
          <div
                key={`${item.item.id}-${index}`}
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

                    {/* Убранные ингредиенты */}
                    {item.removedIngredients && item.removedIngredients.length > 0 && (
                      <div className="mb-2">
                        <p className="text-xs text-gray-500 mb-1">Без: {item.removedIngredients.join(', ')}</p>
                      </div>
                    )}

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
              заказать {totalAmount} ₽
        </Button>
      </div>
        </>
      )}
    </div>
  );
}
