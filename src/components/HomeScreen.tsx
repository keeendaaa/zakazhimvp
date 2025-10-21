import { useState } from 'react';
import { MenuItem } from '../types';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Plus } from 'lucide-react';
import ItemDetailSheet from './ItemDetailSheet';

interface HomeScreenProps {
  menuItems: MenuItem[];
  onAddToCart: (item: MenuItem) => void;
}

export default function HomeScreen({ menuItems, onAddToCart }: HomeScreenProps) {
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [activeTab, setActiveTab] = useState('мой дринкит');

  const favorites = menuItems.filter(item => item.isFavorite);
  const tryNew = menuItems.filter(item => item.tags.includes('new'));

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Tabs */}
      <div className="sticky top-0 z-40 bg-gray-50 pt-6 px-4">
        <div className="flex gap-6 mb-6">
          <button
            onClick={() => setActiveTab('мой дринкит')}
            className={`pb-2 transition-colors ${
              activeTab === 'мой дринкит'
                ? 'text-gray-900 border-b-2 border-gray-900'
                : 'text-gray-400'
            }`}
          >
            мой дринкит
          </button>
          <button
            onClick={() => setActiveTab('сливочная нежность')}
            className={`pb-2 transition-colors ${
              activeTab === 'сливочная нежность'
                ? 'text-gray-900 border-b-2 border-gray-900'
                : 'text-gray-400'
            }`}
          >
            сливочная нежность
          </button>
        </div>
      </div>

      <div className="px-4">
        {/* Section: мне как всегда */}
        <section className="mb-10">
          <h2 className="mb-4">мне как всегда</h2>
          
          <div className="grid grid-cols-3 gap-3">
            {favorites.map(item => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedItem(item)}
              >
                <div className="aspect-square mb-3 relative">
                  <ImageWithFallback
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
                <h3 className="text-sm mb-3 line-clamp-2 min-h-[2.5rem]">
                  {item.name}
                </h3>
                <div className="flex items-center justify-between">
                  <span>{item.price} ₽</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToCart(item);
                    }}
                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section: попробуй */}
        <section className="mb-10">
          <h2 className="mb-4">попробуй</h2>
          
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
            {tryNew.slice(0, 3).map(item => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-4 shadow-sm flex-shrink-0 w-[160px] cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedItem(item)}
              >
                <div className="w-24 h-24 mb-3 mx-auto">
                  <ImageWithFallback
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
                <h3 className="text-sm mb-2 line-clamp-2 min-h-[2.5rem]">
                  {item.name}
                </h3>
                <span className="text-sm">{item.price} ₽</span>
              </div>
            ))}
          </div>
        </section>

        {/* Section: еще не пробовал */}
        <section className="mb-6">
          <h2 className="mb-4">еще не пробовал</h2>
          
          <div
            className="relative rounded-3xl overflow-hidden h-80 cursor-pointer group"
            onClick={() => selectedItem || setSelectedItem(tryNew[tryNew.length - 1])}
          >
            <ImageWithFallback
              src={tryNew[tryNew.length - 1]?.image || menuItems[0].image}
              alt="Попробуй что-то новое"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
          </div>
        </section>
      </div>

      {/* Item Detail Sheet */}
      {selectedItem && (
        <ItemDetailSheet
          item={selectedItem}
          menuItems={menuItems}
          onClose={() => setSelectedItem(null)}
          onAddToCart={onAddToCart}
          onItemSelect={setSelectedItem}
        />
      )}
    </div>
  );
}
