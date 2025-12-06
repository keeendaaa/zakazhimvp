import { Home, UtensilsCrossed, MessageCircle, ShoppingCart } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  cartItemsCount: number;
}

export default function BottomNav({ activeTab, onTabChange, cartItemsCount }: BottomNavProps) {
  const tabs = [
    { id: 'collections', label: 'Подборки', icon: Home },
    { id: 'menu', label: 'Меню', icon: UtensilsCrossed },
    { id: 'ai', label: 'AI официант', icon: MessageCircle },
    { id: 'cart', label: 'Корзина', icon: ShoppingCart },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-bottom">
      <div className="flex items-center justify-around px-2 py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors relative ${
                isActive
                  ? 'text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="relative">
                <Icon className="w-6 h-6" />
              </div>
              <span className="text-xs">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
