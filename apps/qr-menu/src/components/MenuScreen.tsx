import { useState } from 'react';
import { Dish } from '../types';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Plus } from 'lucide-react';
import DishDetailModal from './DishDetailModal';

interface MenuScreenProps {
  dishes: Dish[];
  onAddToCart: (dish: Dish) => void;
}

export default function MenuScreen({ dishes, onAddToCart }: MenuScreenProps) {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);

  const filters = [
    { id: 'all', label: 'Все блюда' },
    { id: 'popular', label: 'Популярное' },
    { id: 'vegetarian', label: 'Вегетарианское' },
    { id: 'spicy', label: 'Острое' },
    { id: 'dessert', label: 'Десерты' },
    { id: 'healthy', label: 'Здоровое' },
  ];

  const filteredDishes = dishes.filter(dish => {
    if (selectedFilter === 'all') return true;
    return dish.tags.includes(selectedFilter);
  });

  const categories = Array.from(new Set(filteredDishes.map(d => d.category)));

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 pt-6 pb-4">
          <h1 className="mb-4">Меню</h1>
          
          {/* Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {filters.map((filter) => (
              <Button
                key={filter.id}
                variant={selectedFilter === filter.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFilter(filter.id)}
                className={`whitespace-nowrap rounded-full ${
                  selectedFilter === filter.id
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="px-4 py-4">
        {categories.map((category) => {
          const categoryDishes = filteredDishes.filter(d => d.category === category);
          
          return (
            <div key={category} className="mb-8">
              <h2 className="mb-4">{category}</h2>
              
              <div className="grid gap-4">
                {categoryDishes.map((dish) => (
                  <Card
                    key={dish.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => setSelectedDish(dish)}
                  >
                    <div className="flex gap-4">
                      <div className="w-28 h-28 flex-shrink-0">
                        <ImageWithFallback
                          src={dish.image}
                          alt={dish.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-1 py-3 pr-3 flex flex-col justify-between min-w-0">
                        <div>
                          <h3 className="mb-1 line-clamp-1">{dish.name}</h3>
                          <p className="text-gray-600 text-sm line-clamp-2">{dish.description}</p>
                          
                          {dish.tags.length > 0 && (
                            <div className="flex gap-1 mt-2">
                              {dish.tags.slice(0, 2).map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag === 'popular' && '⭐ Популярное'}
                                  {tag === 'vegetarian' && '🌱 Вегетарианское'}
                                  {tag === 'spicy' && '🌶️ Острое'}
                                  {tag === 'healthy' && '💚 Здоровое'}
                                  {tag === 'vegan' && '🌿 Веган'}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-blue-600">{dish.price} ₽</span>
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onAddToCart(dish);
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full h-8 px-3"
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            Добавить
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Dish Detail Modal */}
      {selectedDish && (
        <DishDetailModal
          dish={selectedDish}
          onClose={() => setSelectedDish(null)}
          onAddToCart={onAddToCart}
        />
      )}
    </div>
  );
}
