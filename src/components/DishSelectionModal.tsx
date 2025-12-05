import { useState } from 'react';
import { Sheet, SheetContent } from './ui/sheet';
import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface DishSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewDishes: (filters: SelectedFilters) => void;
}

export interface SelectedFilters {
  situation: string[];
  mood: string[];
  taste: string[];
  cuisine: string[];
}

const SITUATIONS = [
  'Бодрящий завтрак',
  'Аперитив',
  'Деловая трапеза',
  'Для двоих',
  'Особый вечер',
  'Встреча с друзьями',
  'Неспешный ужин',
];

const MOODS = [
  { name: 'Уютное', icon: '/images/mood/уютное.png' },
  { name: 'Незнакомое', icon: '/images/mood/незнакомое.png' },
  { name: 'Сытное', icon: '/images/mood/сытное.png' },
  { name: 'Легкое', icon: '/images/mood/легкое.png' },
  { name: 'Торжественное', icon: '/images/mood/торжественное.png' },
  { name: 'Бодрое', icon: '/images/mood/бодрое.png' },
];

const TASTES = [
  { name: 'Свежий', color: 'bg-lime-400', icon: '/images/vkysy/свежий.png' },
  { name: 'Сладкое', color: 'bg-pink-300', icon: '/images/vkysy/сладкое.png' },
  { name: 'Острое', color: 'bg-orange-500', icon: '/images/vkysy/остроое.png' },
  { name: 'Умами', color: 'bg-yellow-400', icon: '/images/vkysy/умами.png' },
  { name: 'Насыщенный', color: 'bg-red-700', icon: '/images/vkysy/насыщенный.png' },
  { name: 'Нежный', color: 'bg-amber-50', icon: '/images/vkysy/нежный.png' },
];

const CUISINES = [
  'Итальянская',
  'Французская',
  'Японская',
  'Паназиатская',
  'Русская & Европейская',
  'Авторская',
];

export default function DishSelectionModal({
  isOpen,
  onClose,
  onViewDishes,
}: DishSelectionModalProps) {
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({
    situation: [],
    mood: [],
    taste: [],
    cuisine: [],
  });

  const toggleFilter = (
    category: keyof SelectedFilters,
    value: string
  ) => {
    setSelectedFilters((prev) => {
      const current = prev[category];
      const newValue = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [category]: newValue };
    });
  };

  const handleReset = () => {
    setSelectedFilters({
      situation: [],
      mood: [],
      taste: [],
      cuisine: [],
    });
  };

  const handleViewDishes = () => {
    onViewDishes(selectedFilters);
    onClose();
  };

  const hasSelectedFilters = Object.values(selectedFilters).some(
    (arr: string[]) => arr.length > 0
  );

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="bottom"
        className="h-[90vh] rounded-t-3xl p-0 overflow-y-auto [&>button]:!hidden"
        style={{ background: 'linear-gradient(to bottom, #C5E1FD, #F9FAFB)' }}
      >
        <div className="flex flex-col h-full">
          {/* Header with all sections */}
          <div 
            className="sticky top-0 z-10 px-6 pt-6 pb-4 overflow-y-auto flex-1"
            style={{ background: 'linear-gradient(to bottom, #C5E1FD, #F9FAFB)' }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Подобрать блюда</h2>
              <button
                onClick={handleReset}
                className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors"
              >
                СБРОСИТЬ
              </button>
            </div>
            
            {/* ПО СИТУАЦИИ */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase text-center">
                ПО СИТУАЦИИ
              </h3>
              <div className="flex flex-nowrap gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {SITUATIONS.map((situation) => {
                  const isSelected = selectedFilters.situation.includes(situation);
                  return (
                    <button
                      key={situation}
                      onClick={() => toggleFilter('situation', situation)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                        isSelected
                          ? 'text-gray-700 shadow-md'
                          : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-300'
                      }`}
                      style={isSelected ? { backgroundColor: '#E5FFDE' } : {}}
                    >
                      {situation}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ПО НАСТРОЕНИЮ */}
            <section className="mb-8">
              <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase text-center">
                ПО НАСТРОЕНИЮ
              </h3>
              <div className="flex flex-nowrap gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {MOODS.map((mood) => {
                  const isSelected = selectedFilters.mood.includes(mood.name);
                  return (
                    <button
                      key={mood.name}
                      onClick={() => toggleFilter('mood', mood.name)}
                      className={`flex flex-col items-center p-3 rounded-2xl transition-all flex-shrink-0 ${
                        isSelected
                          ? 'shadow-md'
                          : 'bg-white border border-gray-200 hover:border-blue-300'
                      }`}
                      style={isSelected ? { backgroundColor: '#ACDAFF' } : {}}
                    >
                      <ImageWithFallback
                        src={mood.icon}
                        alt={mood.name}
                        className="w-8 h-8 mb-2 object-contain"
                      />
                      <span
                        className={`text-xs text-center whitespace-nowrap ${
                          isSelected ? 'text-gray-700' : 'text-gray-700'
                        }`}
                      >
                        {mood.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* ПО ВКУСУ */}
            <section className="mb-8">
              <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase text-center">
                ПО ВКУСУ
              </h3>
              <div className="flex flex-nowrap gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {TASTES.map((taste) => {
                  const isSelected = selectedFilters.taste.includes(taste.name);
                  return (
                    <button
                      key={taste.name}
                      onClick={() => toggleFilter('taste', taste.name)}
                      className="flex flex-col items-center flex-shrink-0"
                    >
                      <div
                        className={`w-16 h-16 rounded-full mb-2 flex items-center justify-center transition-all overflow-hidden ${
                          isSelected
                            ? 'ring-4 ring-blue-500 ring-offset-2 scale-110'
                            : 'hover:scale-105'
                        }`}
                      >
                        <ImageWithFallback
                          src={taste.icon}
                          alt={taste.name}
                          className="w-full h-full object-cover"
                          fallback={
                            <div className={`w-full h-full rounded-full ${taste.color}`} />
                          }
                        />
                      </div>
                      <span
                        className={`text-xs text-center whitespace-nowrap ${
                          isSelected ? 'text-blue-600 font-semibold' : 'text-gray-700'
                        }`}
                      >
                        {taste.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* ПО КУХНЕ */}
            <section>
              <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase text-center">
                ПО КУХНЕ
              </h3>
              <div className="flex flex-nowrap gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {CUISINES.map((cuisine) => {
                  const isSelected = selectedFilters.cuisine.includes(cuisine);
                  return (
                    <button
                      key={cuisine}
                      onClick={() => toggleFilter('cuisine', cuisine)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                        isSelected
                          ? 'text-gray-700 shadow-md'
                          : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-300'
                      }`}
                      style={isSelected ? { backgroundColor: '#C5E1FD' } : {}}
                    >
                      {cuisine}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* СМОТРЕТЬ БЛЮДА */}
            <div className="px-6 py-4">
              <motion.button
                onClick={handleViewDishes}
                className="w-full flex flex-col items-center justify-center gap-2 hover:opacity-80 transition-opacity"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-sm font-semibold text-gray-700 uppercase">
                  СМОТРЕТЬ БЛЮДА
                </span>
                <img
                  src="/images/vector-down.png"
                  alt="Стрелка вниз"
                  className="h-3 w-auto"
                />
              </motion.button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
