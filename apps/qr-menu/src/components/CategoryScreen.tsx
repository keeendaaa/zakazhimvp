import { useState } from 'react';
import { MenuItem } from '../types';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Plus } from 'lucide-react';
import ItemDetailSheet from './ItemDetailSheet';

interface CategoryScreenProps {
  category: 'drinks' | 'breakfast' | 'lunch' | 'desserts';
  menuItems: MenuItem[];
  onAddToCart: (item: MenuItem) => void;
}

export default function CategoryScreen({
  category,
  menuItems,
  onAddToCart,
}: CategoryScreenProps) {
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [activeSubcategory, setActiveSubcategory] = useState<string>('еда');

  const categoryItems = menuItems.filter(item => item.category === category);
  
  // Get unique subcategories
  const subcategories = Array.from(
    new Set(categoryItems.map(item => item.subcategory).filter(Boolean))
  ) as string[];

  // Add default tabs for drinks
  const tabs = category === 'drinks' 
    ? ['чёрный', 'чай', 'еда', 'матча и какао']
    : subcategories.length > 0 
    ? subcategories 
    : ['все'];

  const filteredItems = activeSubcategory === 'все' || activeSubcategory === 'еда'
    ? categoryItems
    : categoryItems.filter(item => item.subcategory === activeSubcategory);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Tabs */}
      <div className="sticky top-0 z-40 bg-gray-50 pt-6 px-4">
        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveSubcategory(tab)}
              className={`pb-2 whitespace-nowrap transition-colors ${
                activeSubcategory === tab
                  ? 'text-gray-900 border-b-2 border-gray-900'
                  : 'text-gray-400'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4">
        {/* Section title */}
        <section className="mb-6">
          <h2 className="mb-4">
            {category === 'breakfast' && 'завтрак, когда ты хочешь'}
            {category === 'drinks' && 'напитки на любой вкус'}
            {category === 'lunch' && 'обед, как хочется'}
            {category === 'desserts' && 'сладости для настроения'}
          </h2>

          {/* Items grid - mixed layout */}
          <div className="space-y-4">
            {filteredItems.map((item, index) => {
              // First item - horizontal card
              if (index === 0) {
                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow flex items-center gap-4"
                    onClick={() => setSelectedItem(item)}
                  >
                    <ImageWithFallback
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-xl flex-shrink-0"
                    />
                    <div className="flex-1">
                      <h3 className="mb-2">{item.name}</h3>
                      <div className="flex items-center justify-between">
                        <span>{item.price} ₽</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onAddToCart(item);
                          }}
                          className="text-gray-400"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              }

              // Grid items in pairs
              const isEven = (index - 1) % 2 === 0;
              if (!isEven) return null;

              const nextItem = filteredItems[index + 1];

              return (
                <div key={item.id} className="grid grid-cols-2 gap-4">
                  {/* Current item */}
                  <div
                    className="bg-white rounded-2xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setSelectedItem(item)}
                  >
                    <div className="aspect-square mb-3">
                      <ImageWithFallback
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>
                    <h3 className="text-sm mb-2 line-clamp-2 min-h-[2.5rem]">
                      {item.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{item.price} ₽</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddToCart(item);
                        }}
                        className="text-gray-400"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Next item if exists */}
                  {nextItem && (
                    <div
                      className="bg-white rounded-2xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => setSelectedItem(nextItem)}
                    >
                      <div className="aspect-square mb-3">
                        <ImageWithFallback
                          src={nextItem.image}
                          alt={nextItem.name}
                          className="w-full h-full object-cover rounded-xl"
                        />
                      </div>
                      <h3 className="text-sm mb-2 line-clamp-2 min-h-[2.5rem]">
                        {nextItem.name}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{nextItem.price} ₽</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onAddToCart(nextItem);
                          }}
                          className="text-gray-400"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
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
