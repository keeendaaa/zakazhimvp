import React, { useState, useEffect, Suspense, lazy } from 'react';
import { MenuItem, CartItem } from './types';
import { restaurantMenu } from './data/restaurant-menu';
import BottomNavRestaurant from './components/BottomNavRestaurant';
import CallWaiterButton from './components/CallWaiterButton';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';

// Lazy load large components for code splitting
const CollectionsScreenNew = lazy(() => import('./components/CollectionsScreenNew'));
const MenuScreenNew = lazy(() => import('./components/MenuScreenNew'));
const AIAssistantNew = lazy(() => import('./components/AIAssistantNew'));
const CartScreenNew = lazy(() => import('./components/CartScreenNew'));
const OrderConfirmationNew = lazy(() => import('./components/OrderConfirmationNew'));
const PaymentScreen = lazy(() => import('./components/PaymentScreen'));
const CheckoutConfirmation = lazy(() => import('./components/CheckoutConfirmation'));
const OnboardingScreen = lazy(() => import('./components/OnboardingScreen'));

// Loading component
const LoadingScreen = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-600">Загрузка...</p>
    </div>
  </div>
);

export default function App() {
  const [activeView, setActiveView] = useState<string>('collections');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [showCheckoutConfirmation, setShowCheckoutConfirmation] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [restaurantId, setRestaurantId] = useState<string>('');
  const [lastOrder, setLastOrder] = useState<{ items: CartItem[]; time: string; orderNumber: string; isPaid?: boolean } | null>(null);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(() => {
    // Проверяем, прошел ли пользователь онбординг
    return !localStorage.getItem('hasCompletedOnboarding');
  });
  const [showRecommendations, setShowRecommendations] = useState(false);

  // Получаем ID ресторана из URL
  useEffect(() => {
    const path = window.location.pathname;
    const match = path.match(/\/restaurant\/(\d+)/);
    if (match) {
      setRestaurantId(match[1]);
    }
  }, []);

  const handleAddToCart = (item: MenuItem, removedIngredients?: string[]) => {
    setCart(prevCart => {
      // Проверяем, есть ли уже такой же товар с теми же убранными ингредиентами
      const existingItem = prevCart.find(cartItem => 
        cartItem.item.id === item.id &&
        JSON.stringify(cartItem.removedIngredients?.sort()) === JSON.stringify(removedIngredients?.sort())
      );

      if (existingItem) {
        toast.success(`${item.name} добавлен в корзину`, {
          duration: 2000,
        });
        return prevCart.map(cartItem =>
          cartItem.item.id === item.id &&
          JSON.stringify(cartItem.removedIngredients?.sort()) === JSON.stringify(removedIngredients?.sort())
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }

      toast.success(`${item.name} добавлен в корзину`, {
        duration: 2000,
      });
      return [...prevCart, { 
        item, 
        quantity: 1,
        removedIngredients: removedIngredients && removedIngredients.length > 0 ? removedIngredients : undefined
      }];
    });
  };

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(itemId);
      return;
    }

    setCart(prevCart =>
      prevCart.map(cartItem =>
        cartItem.item.id === itemId
          ? { ...cartItem, quantity: newQuantity }
          : cartItem
      )
    );
  };

  const handleRemoveItem = (itemId: string) => {
    const item = cart.find(cartItem => cartItem.item.id === itemId);
    if (item) {
      toast.error(`${item.item.name} удалён из корзины`);
    }
    setCart(prevCart => prevCart.filter(cartItem => cartItem.item.id !== itemId));
  };

  const handleCheckout = (tipAmount: number = 0) => {
    // Сохраняем сумму чаевых для использования в заказе
    // Показываем промежуточное окно подтверждения
    setShowCheckoutConfirmation(true);
    // TODO: Сохранить tipAmount для использования в заказе
  };

  const sendOrderToWebhook = async (orderData: {
    orderNumber: string;
    items: CartItem[];
    totalAmount: number;
    time: string;
    date: string;
    restaurantId?: string;
  }) => {
    try {
      const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      const webhookUrl = isDevelopment
        ? 'https://n8n.zakazhi.online/webhook/order'
        : 'https://n8n.zakazhi.online/webhook/order';
      
      console.log('[Order] Отправка заказа на вебхук:', webhookUrl, orderData);

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      console.log('[Order] Response status:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[Order] Error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json().catch(() => ({ message: 'Success' }));
      console.log('[Order] Заказ успешно отправлен:', result);
    } catch (error) {
      console.error('[Order] Ошибка при отправке заказа:', error);
      // Не показываем ошибку пользователю, чтобы не нарушать UX
    }
  };

  const handleConfirmCheckout = async () => {
    // Пользователь подтвердил - оформляем заказ
    const randomOrderNumber = Math.floor(1000 + Math.random() * 9000).toString();
    const orderTime = new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    const orderDate = new Date().toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const totalAmount = cart.reduce((sum, item) => sum + item.item.price * item.quantity, 0);
    
    // Сохраняем заказ перед очисткой корзины
    const orderData = {
      items: [...cart],
      time: orderTime,
      orderNumber: randomOrderNumber
    };
    
    setLastOrder(orderData);
    setOrderNumber(randomOrderNumber);
    setShowCheckoutConfirmation(false);
    setOrderPlaced(true);
    setCart([]);
    toast.success('Заказ успешно оформлен!');

    // Отправляем заказ на вебхук n8n
    await sendOrderToWebhook({
      orderNumber: randomOrderNumber,
      items: orderData.items,
      totalAmount,
      time: orderTime,
      date: orderDate,
      restaurantId: restaurantId || undefined,
    });
  };

  const handleCancelCheckout = () => {
    // Пользователь отменил - просто закрываем окно
    setShowCheckoutConfirmation(false);
  };

  const handlePayment = () => {
    // При нажатии "Оплатить" помечаем заказ как оплаченный и показываем экран оплаты
    if (lastOrder) {
      setLastOrder({
        ...lastOrder,
        isPaid: true
      });
    }
    setPaymentCompleted(true);
  };

  const handleBackToMenu = () => {
    // Если есть неоплаченный заказ, переходим в корзину
    // Если заказ оплачен, возвращаемся в меню
    setOrderPlaced(false);
    setPaymentCompleted(false);
    if (lastOrder) {
      // Переходим в корзину, где будет показан неоплаченный заказ
      setActiveView('cart');
    } else {
      // Возвращаемся в меню
      setActiveView('collections');
    }
  };

  const handleCallWaiter = () => {
    toast.success('Официант вызван! Скоро подойдёт к вашему столику', {
      duration: 3000,
    });
  };

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = cart.reduce((sum, item) => sum + item.item.price * item.quantity, 0);

  // Если нужно показать онбординг - показываем его первым
  if (showOnboarding) {
    return (
      <Suspense fallback={null}>
        <OnboardingScreen onComplete={() => setShowOnboarding(false)} />
      </Suspense>
    );
  }

  // Если оплата завершена, показываем экран оплаты
  if (paymentCompleted) {
    return (
      <>
        <Suspense fallback={<LoadingScreen />}>
          <PaymentScreen
            orderNumber={orderNumber}
            onBackToMenu={handleBackToMenu}
          />
        </Suspense>
        <Toaster position="top-center" richColors />
      </>
    );
  }

  // Если заказ оформлен, показываем только экран подтверждения
  if (orderPlaced) {
    return (
      <>
        <Suspense fallback={<LoadingScreen />}>
          <OrderConfirmationNew
            orderNumber={orderNumber}
            onBackToMenu={handleBackToMenu}
            onPayment={handlePayment}
          />
        </Suspense>
        <Toaster position="top-center" richColors />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={<LoadingScreen />}>
      {activeView === 'collections' && (
        <CollectionsScreenNew 
          menuItems={restaurantMenu} 
          onAddToCart={handleAddToCart}
          onRecommendationsChange={setShowRecommendations}
        />
      )}

        {activeView === 'menu' && (
          <MenuScreenNew
            menuItems={restaurantMenu}
            onAddToCart={handleAddToCart}
          />
        )}

        {activeView === 'assistant' && (
          <AIAssistantNew
            menuItems={restaurantMenu}
            onAddToCart={handleAddToCart}
          />
        )}

        {activeView === 'cart' && (
          <CartScreenNew
            cartItems={cart}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onCheckout={handleCheckout}
            onPayment={handlePayment}
            lastOrder={lastOrder}
            menuItems={restaurantMenu}
            onAddToCart={handleAddToCart}
          />
        )}
      </Suspense>

      <BottomNavRestaurant
        activeView={activeView}
        onViewChange={setActiveView}
        cartItemsCount={cartItemsCount}
      />

      <CallWaiterButton onCall={handleCallWaiter} hide={showRecommendations} />

      {showCheckoutConfirmation && (
        <Suspense fallback={<LoadingScreen />}>
          <CheckoutConfirmation
            totalAmount={totalAmount}
            menuItems={restaurantMenu}
            cartItems={cart}
            onConfirm={handleConfirmCheckout}
            onCancel={handleCancelCheckout}
            onAddToCart={handleAddToCart}
            onUpdateQuantity={handleUpdateQuantity}
          />
        </Suspense>
      )}

      <Toaster position="top-center" richColors />
    </div>
  );
}
