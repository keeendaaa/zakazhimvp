import { useState, useEffect } from 'react';
import { MenuItem, CartItem } from './types';
import { restaurantMenu } from './data/restaurant-menu';
import CollectionsScreenNew from './components/CollectionsScreenNew';
import MenuScreenNew from './components/MenuScreenNew';
import AIAssistantNew from './components/AIAssistantNew';
import CartScreenNew from './components/CartScreenNew';
import OrderConfirmationNew from './components/OrderConfirmationNew';
import BottomNavRestaurant from './components/BottomNavRestaurant';
import CallWaiterButton from './components/CallWaiterButton';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner@2.0.3';

export default function App() {
  const [activeView, setActiveView] = useState<string>('collections');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [restaurantId, setRestaurantId] = useState<string>('');

  // Получаем ID ресторана из URL
  useEffect(() => {
    const path = window.location.pathname;
    const match = path.match(/\/restaurant\/(\d+)/);
    if (match) {
      setRestaurantId(match[1]);
    }
  }, []);

  const handleAddToCart = (item: MenuItem) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.item.id === item.id);

      if (existingItem) {
        toast.success(`${item.name} добавлен в корзину`, {
          duration: 2000,
        });
        return prevCart.map(cartItem =>
          cartItem.item.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }

      toast.success(`${item.name} добавлен в корзину`, {
        duration: 2000,
      });
      return [...prevCart, { item, quantity: 1 }];
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
    const randomOrderNumber = Math.floor(1000 + Math.random() * 9000).toString();
    setOrderNumber(randomOrderNumber);
    setOrderPlaced(true);
    setCart([]);
    toast.success('Заказ успешно оформлен!');
  };

  const handleBackToMenu = () => {
    setOrderPlaced(false);
    setActiveView('collections');
  };

  const handleCallWaiter = () => {
    toast.success('Официант вызван! Скоро подойдёт к вашему столику', {
      duration: 3000,
    });
  };

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (orderPlaced) {
    return (
      <OrderConfirmationNew
        orderNumber={orderNumber}
        onBackToMenu={handleBackToMenu}
      />
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
        />
      )}

      <BottomNavRestaurant
        activeView={activeView}
        onViewChange={setActiveView}
        cartItemsCount={cartItemsCount}
      />

      <CallWaiterButton onCall={handleCallWaiter} />

      <Toaster position="top-center" richColors />
    </div>
  );
}
