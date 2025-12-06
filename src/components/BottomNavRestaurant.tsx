import { Sparkles, UtensilsCrossed, Bot, ShoppingCart } from 'lucide-react';

interface BottomNavRestaurantProps {
  activeView: string;
  onViewChange: (view: string) => void;
  cartItemsCount: number;
}

export default function BottomNavRestaurant({
  activeView,
  onViewChange,
  cartItemsCount,
}: BottomNavRestaurantProps) {
  const tabs = [
    { id: 'collections', label: 'подборки', icon: Sparkles },
    { id: 'menu', label: 'меню', icon: UtensilsCrossed },
    { id: 'assistant', label: 'AI официант', icon: Bot },
    { id: 'cart', label: 'корзина', icon: ShoppingCart },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-bottom shadow-lg">
      <div className="flex items-center justify-around px-1 py-1 sm:px-2 sm:py-2">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeView === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onViewChange(tab.id)}
              className={`flex flex-col items-center justify-center gap-0.5 sm:gap-1 px-1 py-1.5 sm:px-2 sm:py-2 rounded-lg transition-all relative min-w-[64px] sm:min-w-[70px] active:scale-95 ${
                isActive 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-500 hover:text-gray-700 active:bg-gray-100'
              }`}
            >
              <div className="relative">
                <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <span className="text-[10px] sm:text-xs font-medium leading-tight text-center px-1">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
