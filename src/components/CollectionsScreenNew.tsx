import { useState } from 'react';
import { motion } from 'motion/react';
import { MenuItem } from '../types';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Plus, Search } from 'lucide-react';
import ItemDetailSheet from './ItemDetailSheet';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

interface CollectionsScreenNewProps {
  menuItems: MenuItem[];
  onAddToCart: (item: MenuItem) => void;
}

export default function CollectionsScreenNew({ menuItems, onAddToCart }: CollectionsScreenNewProps) {
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter items based on search query
  const filteredItems = menuItems.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const favorites = filteredItems.filter(item => item.isFavorite);
  const popular = filteredItems.filter(item => item.isPopular);
  const newItems = filteredItems.filter(item => item.isNew);

  return (
    <motion.div 
      className="min-h-screen bg-gray-50 pb-24"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Hero Section */}
      <motion.div 
        className="px-4 pt-8 pb-6 bg-gradient-to-b from-blue-50 to-gray-50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="mb-2">Не жди — закажи сам!</h1>
        <p className="text-gray-600">
          Выбирайте блюда, задавайте вопросы AI-официанту и оформляйте заказ без ожидания официанта
        </p>
      </motion.div>

      {/* Search Bar */}
      <motion.div 
        className="px-4 pb-4 bg-gray-50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="Поиск блюд..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-12 py-3 bg-white rounded-2xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all text-base"
            style={{ paddingLeft: '16px' }}
          />
          <Search className="absolute right-4 text-gray-400 w-5 h-5 pointer-events-none" />
        </div>
      </motion.div>

      <div className="px-4">
        {/* Search Results */}
        {searchQuery && (
          <motion.section 
            className="mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="mb-4">Результаты поиска</h2>
            {filteredItems.length > 0 ? (
              <motion.div 
                className="grid grid-cols-2 gap-3"
                variants={containerVariants}
                initial="hidden"
                animate="show"
              >
                {filteredItems.slice(0, 6).map(item => (
                  <motion.div
                    key={item.id}
                    variants={itemVariants}
                    className="bg-white rounded-2xl p-4 shadow-sm cursor-pointer hover:shadow-lg hover:-translate-y-1 active:scale-95 transition-all"
                    onClick={() => setSelectedItem(item)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <div className="aspect-square mb-3 relative">
                      <ImageWithFallback
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>
                    <h3 className="font-medium text-sm mb-1 line-clamp-2">{item.name}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-blue-600 font-semibold">{item.price} ₽</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddToCart(item);
                        }}
                        className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>По запросу "{searchQuery}" ничего не найдено</p>
                <p className="text-sm mt-1">Попробуйте изменить поисковый запрос</p>
              </div>
            )}
          </motion.section>
        )}

        {/* Section: Избранное */}
        {!searchQuery && (
          <section className="mb-10">
            <h2 className="mb-4">Ваши любимые</h2>
          
          <motion.div 
            className="grid grid-cols-3 gap-3"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {favorites.slice(0, 3).map(item => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                className="bg-white rounded-2xl p-4 shadow-sm cursor-pointer hover:shadow-lg hover:-translate-y-1 active:scale-95 transition-all"
                onClick={() => setSelectedItem(item)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
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
                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-blue-600 hover:text-white active:scale-90 transition-all"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
          </section>
        )}

        {/* Section: Популярное */}
        {!searchQuery && (
        <section className="mb-10">
          <h2 className="mb-4">Популярное сегодня</h2>
          
          <div className="space-y-3">
            {popular.slice(0, 4).map((item, index) => {
              if (index === 0) {
                // First item - large card
                return (
                  <motion.div
                    key={item.id}
                    className="relative rounded-3xl overflow-hidden h-64 cursor-pointer group"
                    onClick={() => setSelectedItem(item)}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <ImageWithFallback
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h2 className="mb-2">{item.name}</h2>
                      <div className="flex items-center justify-between">
                        <span className="text-lg">{item.price} ₽</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onAddToCart(item);
                          }}
                          className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/40 active:scale-90 transition-all"
                        >
                          <Plus className="w-6 h-6" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              }
              
              return null;
            })}

            {/* Grid of 3 items */}
            <motion.div 
              className="grid grid-cols-3 gap-3"
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              {popular.slice(1, 4).map(item => (
                <motion.div
                  key={item.id}
                  variants={itemVariants}
                  className="bg-white rounded-2xl p-3 shadow-sm cursor-pointer hover:shadow-lg hover:-translate-y-1 active:scale-95 transition-all"
                  onClick={() => setSelectedItem(item)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <div className="aspect-square mb-2">
                    <ImageWithFallback
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>
                  <h3 className="text-xs mb-2 line-clamp-2 min-h-[2rem]">
                    {item.name}
                  </h3>
                  <span className="text-xs">{item.price} ₽</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
        )}

        {/* Section: Новинки */}
        {!searchQuery && newItems.length > 0 && (
          <section className="mb-6">
            <h2 className="mb-4">Новинки меню</h2>
            
            <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
              {newItems.map((item, idx) => (
                <motion.div
                  key={item.id}
                  className="bg-white rounded-2xl p-4 shadow-sm flex-shrink-0 w-[200px] cursor-pointer hover:shadow-lg hover:-translate-y-1 active:scale-95 transition-all"
                  onClick={() => setSelectedItem(item)}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <div className="w-full aspect-square mb-3">
                    <ImageWithFallback
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>
                  <div className="mb-2 inline-block px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs animate-pulse">
                    новинка
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
                      className="text-gray-400 hover:text-blue-600 active:scale-90 transition-all"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

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
