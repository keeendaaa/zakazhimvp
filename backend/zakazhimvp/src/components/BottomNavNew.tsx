import { Home, Coffee, UtensilsCrossed, ShoppingCart } from 'lucide-react';
import { Badge } from './ui/badge';

interface BottomNavNewProps {
  activeView: string;
  onViewChange: (view: string) => void;
  cartItemsCount: number;
}

export default function BottomNavNew({
  activeView,
  onViewChange,
  cartItemsCount,
}: BottomNavNewProps) {
  const tabs = [
    { id: 'home', label: 'главная', icon: Home },
    { id: 'drinks', label: 'напитки', icon: Coffee },
    { id: 'breakfast', label: 'еда', icon: UtensilsCrossed },
    { id: 'cart', label: 'корзина', icon: ShoppingCart },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50 safe-area-bottom">
      <div className="flex items-center justify-around px-2 py-2">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeView === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onViewChange(tab.id)}
              className={`flex flex-col items-center justify-center gap-1 px-2 py-2 rounded-lg transition-colors relative ${
                isActive ? 'text-gray-900' : 'text-gray-400'
              }`}
            >
              <div className="relative">
                <Icon className="w-6 h-6" />
                {tab.id === 'cart' && cartItemsCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-4 min-w-4 flex items-center justify-center p-0 px-1 bg-blue-600 text-white text-xs">
                    {cartItemsCount}
                  </Badge>
                )}
              </div>
              <span className="text-xs">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
