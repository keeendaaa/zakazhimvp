import { useState } from 'react';
import { motion } from 'motion/react';
import { MenuItem } from '../types';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Plus } from 'lucide-react';
import ItemDetailSheet from './ItemDetailSheet';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

interface MenuScreenNewProps {
  menuItems: MenuItem[];
  onAddToCart: (item: MenuItem) => void;
}

const categoryLabels = {
  appetizers: 'Закуски',
  soups: 'Супы',
  mains: 'Основные блюда',
  desserts: 'Десерты',
  drinks: 'Напитки',
};

export default function MenuScreenNew({ menuItems, onAddToCart }: MenuScreenNewProps) {
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [activeCategory, setActiveCategory] = useState<keyof typeof categoryLabels>('appetizers');

  const categories = Object.keys(categoryLabels) as Array<keyof typeof categoryLabels>;
  const filteredItems = menuItems.filter(item => item.category === activeCategory);

  return (
    <motion.div 
      className="min-h-screen bg-gray-50 pb-24"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="sticky top-0 z-40 bg-gray-50 pt-6 px-4">
        <h1 className="mb-6">Меню</h1>
        
        {/* Category tabs */}
        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
          {categories.map(category => (
            <motion.button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`pb-2 whitespace-nowrap transition-all relative ${
                activeCategory === category
                  ? 'text-gray-900'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
              whileTap={{ scale: 0.95 }}
            >
              {categoryLabels[category]}
              {activeCategory === category && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"
                  layoutId="activeTab"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="px-4">
        {/* Items list */}
        <motion.section 
          className="space-y-4"
          variants={containerVariants}
          initial="hidden"
          animate="show"
          key={activeCategory}
        >
          {filteredItems.map((item, index) => {
            // First item - horizontal card
            if (index === 0) {
              return (
                <motion.div
                  key={item.id}
                  variants={itemVariants}
                  className="bg-white rounded-2xl p-4 shadow-sm cursor-pointer hover:shadow-lg hover:-translate-y-1 active:scale-[0.98] transition-all flex items-center gap-4"
                  onClick={() => setSelectedItem(item)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <ImageWithFallback
                    src={item.image}
                    alt={item.name}
                    className="w-28 h-28 object-cover rounded-xl flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="mb-1">{item.name}</h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span>{item.price} ₽</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddToCart(item);
                        }}
                        className="text-gray-400 hover:text-blue-600 active:scale-90 transition-all"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            }

            // Grid items in pairs
            const isEven = (index - 1) % 2 === 0;
            if (!isEven) return null;

            const nextItem = filteredItems[index + 1];

            return (
              <motion.div 
                key={item.id} 
                className="grid grid-cols-2 gap-4"
                variants={itemVariants}
              >
                {/* Current item */}
                <motion.div
                  className="bg-white rounded-2xl p-4 shadow-sm cursor-pointer hover:shadow-lg hover:-translate-y-1 active:scale-95 transition-all"
                  onClick={() => setSelectedItem(item)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="aspect-square mb-3">
                    <ImageWithFallback
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>
                  <h3 className="text-sm mb-1 line-clamp-2 min-h-[2.5rem]">
                    {item.name}
                  </h3>
                  <p className="text-xs text-gray-500 mb-2 line-clamp-2">
                    {item.weight}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{item.price} ₽</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart(item);
                      }}
                      className="text-gray-400 hover:text-blue-600 active:scale-90 transition-all"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>

                {/* Next item if exists */}
                {nextItem && (
                  <motion.div
                    className="bg-white rounded-2xl p-4 shadow-sm cursor-pointer hover:shadow-lg hover:-translate-y-1 active:scale-95 transition-all"
                    onClick={() => setSelectedItem(nextItem)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="aspect-square mb-3">
                      <ImageWithFallback
                        src={nextItem.image}
                        alt={nextItem.name}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>
                    <h3 className="text-sm mb-1 line-clamp-2 min-h-[2.5rem]">
                      {nextItem.name}
                    </h3>
                    <p className="text-xs text-gray-500 mb-2 line-clamp-2">
                      {nextItem.weight}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{nextItem.price} ₽</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddToCart(nextItem);
                        }}
                        className="text-gray-400 hover:text-blue-600 active:scale-90 transition-all"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </motion.section>
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
    </motion.div>
  );
}
