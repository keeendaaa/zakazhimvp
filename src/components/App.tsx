import { useState, useEffect } from 'react';
import { MenuItem, CartItem } from './types';
import { restaurantMenu } from './data/restaurant-menu';
import CollectionsScreenNew from './components/CollectionsScreenNew';
import MenuScreenNew from './components/MenuScreenNew';
import AIAssistantNew from './components/AIAssistantNew';
import CartScreenNew from './components/CartScreenNew';
import OrderConfirmationNew from './components/OrderConfirmationNew';
import PaymentScreen from './components/PaymentScreen';
import CheckoutConfirmation from './components/CheckoutConfirmation';
import BottomNavRestaurant from './components/BottomNavRestaurant';
import CallWaiterButton from './components/CallWaiterButton';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner@2.0.3';

export default function App() {
  const [activeView, setActiveView] = useState<string>('collections');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [showCheckoutConfirmation, setShowCheckoutConfirmation] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [restaurantId, setRestaurantId] = useState<string>('');
  const [lastOrder, setLastOrder] = useState<{ items: CartItem[]; time: string; orderNumber: string; isPaid?: boolean } | null>(null);

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

  const handleCheckout = () => {
    // Показываем промежуточное окно подтверждения
    setShowCheckoutConfirmation(true);
  };

  const handleConfirmCheckout = () => {
    // Пользователь подтвердил - оформляем заказ
    const randomOrderNumber = Math.floor(1000 + Math.random() * 9000).toString();
    const orderTime = new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    const orderDate = new Date().toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const totalAmount = cart.reduce((sum, item) => sum + item.item.price * item.quantity, 0);
    
    // Сохраняем заказ перед очисткой корзины
    setLastOrder({
      items: [...cart],
      time: orderTime,
      orderNumber: randomOrderNumber
    });
    
    setOrderNumber(randomOrderNumber);
    setShowCheckoutConfirmation(false);
    setOrderPlaced(true);
    setCart([]);
    toast.success('Заказ успешно оформлен!');
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

  // Если оплата завершена, показываем экран оплаты
  if (paymentCompleted) {
    return (
      <>
        <PaymentScreen
          orderNumber={orderNumber}
          onBackToMenu={handleBackToMenu}
        />
        <Toaster position="top-center" richColors />
      </>
    );
  }

  // Если заказ оформлен, показываем только экран подтверждения
  if (orderPlaced) {
    return (
      <>
        <OrderConfirmationNew
          orderNumber={orderNumber}
          onBackToMenu={handleBackToMenu}
          onPayment={handlePayment}
        />
        <Toaster position="top-center" richColors />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {activeView === 'collections' && (
        <CollectionsScreenNew menuItems={restaurantMenu} onAddToCart={handleAddToCart} />
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

      <BottomNavRestaurant
        activeView={activeView}
        onViewChange={setActiveView}
        cartItemsCount={cartItemsCount}
      />

      <CallWaiterButton onCall={handleCallWaiter} />

      {showCheckoutConfirmation && (
        <CheckoutConfirmation
          totalAmount={totalAmount}
          menuItems={restaurantMenu}
          cartItems={cart}
          onConfirm={handleConfirmCheckout}
          onCancel={handleCancelCheckout}
          onAddToCart={handleAddToCart}
          onUpdateQuantity={handleUpdateQuantity}
        />
      )}

      <Toaster position="top-center" richColors />
    </div>
  );
}
