import { useState } from 'react';
import { MenuItem } from '../types';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Plus, ArrowLeft, X } from 'lucide-react';
import { Button } from './ui/button';
import { Sheet, SheetContent } from './ui/sheet';
import { motion, AnimatePresence } from 'motion/react';

interface ItemDetailSheetProps {
  item: MenuItem;
  menuItems: MenuItem[];
  onClose: () => void;
  onAddToCart: (item: MenuItem, removedIngredients?: string[]) => void;
  onItemSelect?: (item: MenuItem) => void;
}

export default function ItemDetailSheet({
  item,
  menuItems,
  onClose,
  onAddToCart,
  onItemSelect,
}: ItemDetailSheetProps) {
  const [showComposition, setShowComposition] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [removedIngredients, setRemovedIngredients] = useState<string[]>([]);

  // Find similar items in same category
  const similarItems = menuItems
    .filter(i => i.category === item.category && i.id !== item.id)
    .slice(0, 2);

  const handleAddToCart = () => {
    onAddToCart(item, removedIngredients.length > 0 ? removedIngredients : undefined);
    onClose();
  };

  const toggleIngredient = (ingredient: string) => {
    setRemovedIngredients(prev => 
      prev.includes(ingredient)
        ? prev.filter(ing => ing !== ingredient)
        : [...prev, ingredient]
    );
  };

  return (
    <Sheet open={true} onOpenChange={onClose}>
      <SheetContent 
        side="bottom" 
        className="h-[90vh] rounded-t-3xl p-0 overflow-y-auto [&>button]:!hidden"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: isTransitioning ? 0.7 : 1, 
              y: 0,
              scale: isTransitioning ? 0.98 : 1
            }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ 
              duration: 0.2,
              ease: "easeInOut"
            }}
          >
        {/* Header with back button, price and volume */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          {/* Back button - left side */}
          <button
            onClick={onClose}
            className="rounded-full bg-white/90 backdrop-blur-sm p-2 hover:bg-white transition-colors shadow-lg mr-3 flex-shrink-0"
            aria-label="Назад"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          {/* Volume - middle */}
          <div className="flex-1">
            {item.volume && (
              <span className="text-gray-600">{item.volume}</span>
            )}
          </div>
          
          {/* Add to cart button - right side */}
          <button
            onClick={handleAddToCart}
            className="flex items-center gap-2 bg-blue-600 text-white rounded-full px-5 py-2.5 hover:bg-blue-700 transition-colors shadow-sm ml-auto"
          >
            <Plus className="w-5 h-5" />
            <span>{item.price} ₽</span>
          </button>
        </div>

        {/* Main item name */}
        <div className="px-6">
          <h1 className="text-3xl font-black text-gray-900">{item.name}</h1>
        </div>

        {/* Main item image */}
        <div className="px-6 py-4">
          <ImageWithFallback
            src={item.image}
            alt={item.name}
            className="w-full h-64 object-cover rounded-2xl"
          />
        </div>

        {/* Ингредиенты под фото */}
        {item.ingredients && item.ingredients.length > 0 && (
          <div className="px-6 pb-4">
            <h3 className="text-sm font-semibold mb-2 text-gray-700">Ингредиенты</h3>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {item.ingredients.map((ingredient) => {
                const isRemoved = removedIngredients.includes(ingredient);
                return (
                  <button
                    key={ingredient}
                    onClick={() => toggleIngredient(ingredient)}
                    className={`flex-shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      isRemoved
                        ? 'bg-gray-200 text-gray-400 line-through'
                        : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                    }`}
                  >
                    {ingredient}
                    {isRemoved && <X className="w-3 h-3" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Similar items horizontal scroll */}
        {similarItems.length > 0 && (
          <div className="px-6 py-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Похожие блюда</h3>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {similarItems.map((similar, index) => (
                <motion.div
                  key={similar.id}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ 
                    duration: 0.3, 
                    delay: index * 0.1,
                    ease: "easeOut"
                  }}
                  onClick={() => {
                    if (onItemSelect) {
                      setIsTransitioning(true);
                      setTimeout(() => {
                        onItemSelect(similar);
                        setIsTransitioning(false);
                      }, 150);
                    } else {
                      onClose();
                    }
                  }}
                  className="flex-shrink-0 w-72 bg-gray-50 rounded-2xl p-4 flex gap-3 cursor-pointer hover:bg-gray-100 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ImageWithFallback
                    src={similar.image}
                    alt={similar.name}
                    className="w-28 h-28 object-cover rounded-xl flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="mb-1 line-clamp-2">{similar.name}</h4>
                    <span className="text-sm text-gray-600">{similar.price} ₽</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Main item details */}
        <div className="px-6 py-6">

          {/* Description */}
          <p className="text-gray-600 mb-4">{item.description}</p>

          {/* Weight */}
          {item.weight && (
            <div className="mb-4">
              <span className="text-sm text-gray-500">Вес: </span>
              <span>{item.weight}</span>
            </div>
          )}

          {/* Nutrition info */}
          {item.calories && item.nutrients && (
            <div className="bg-gray-50 rounded-2xl p-6 mb-4">
              <p className="text-gray-600 text-sm mb-2">пищевая ценность</p>
              <div className="mb-4">
                {item.calories} ккал
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-gray-600 text-sm mb-1">белки</p>
                  <span>{item.nutrients.proteins} г</span>
                </div>
                <div>
                  <p className="text-gray-600 text-sm mb-1">жиры</p>
                  <span>{item.nutrients.fats} г</span>
                </div>
                <div>
                  <p className="text-gray-600 text-sm mb-1">углеводы</p>
                  <span>{item.nutrients.carbs} г</span>
                </div>
              </div>
            </div>
          )}

          {/* Allergens */}
          {item.allergens && item.allergens.length > 0 && (
            <div className="mb-4 p-4 bg-orange-50 rounded-xl">
              <p className="text-sm text-orange-800">
                <strong>Содержит аллергены:</strong> {item.allergens.join(', ')}
              </p>
            </div>
          )}

          {/* Composition button */}
          <Button
            variant="outline"
            onClick={() => setShowComposition(!showComposition)}
            className="w-full mt-4 h-12 rounded-full border-2 border-gray-200 text-blue-600 hover:bg-blue-50"
          >
            Состав
          </Button>

          {showComposition && (
            <div className="mt-4 p-4 bg-blue-50 rounded-2xl">
              <p className="text-gray-700 mb-2">
                <strong>Ингредиенты:</strong>
              </p>
              <p className="text-gray-700">
                {item.ingredients ? item.ingredients.join(', ') : 'Подробный состав блюда доступен у персонала.'}
              </p>
            </div>
          )}
        </div>
          </motion.div>
        </AnimatePresence>
      </SheetContent>
    </Sheet>
  );
}
