import { Dish } from '../types';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Plus, TrendingUp, Heart, Sparkles, Clock } from 'lucide-react';

interface CollectionsScreenProps {
  dishes: Dish[];
  onAddToCart: (dish: Dish) => void;
  onNavigateToMenu: () => void;
}

export default function CollectionsScreen({
  dishes,
  onAddToCart,
  onNavigateToMenu,
}: CollectionsScreenProps) {
  const popularDishes = dishes.filter(d => d.tags.includes('popular'));
  const healthyDishes = dishes.filter(d => d.tags.includes('healthy'));

  const collections = [
    {
      id: 'popular',
      title: 'Популярное',
      subtitle: 'То, что заказывают чаще всего',
      icon: TrendingUp,
      dishes: popularDishes,
      color: 'from-orange-500 to-red-500',
    },
    {
      id: 'healthy',
      title: 'Здоровое меню',
      subtitle: 'Легкие и полезные блюда',
      icon: Heart,
      dishes: healthyDishes,
      color: 'from-green-500 to-emerald-500',
    },
    {
      id: 'quick',
      title: 'Быстро готовим',
      subtitle: 'Готовность за 15 минут',
      icon: Clock,
      dishes: dishes.slice(0, 3),
      color: 'from-blue-500 to-cyan-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white px-4 pt-8 pb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h1 className="mb-1">Подборки</h1>
            <p className="text-blue-100">Специально для вас</p>
          </div>
        </div>
      </div>

      {/* Collections */}
      <div className="px-4 -mt-6">
        <div className="space-y-6">
          {collections.map((collection) => {
            const Icon = collection.icon;
            
            return (
              <div key={collection.id}>
                {/* Collection Header */}
                <div className={`bg-gradient-to-r ${collection.color} rounded-2xl p-6 mb-4 shadow-lg`}>
                  <div className="flex items-center gap-3 text-white">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="mb-1">{collection.title}</h2>
                      <p className="text-white/90 text-sm">{collection.subtitle}</p>
                    </div>
                  </div>
                </div>

                {/* Dishes */}
                <div className="grid gap-4">
                  {collection.dishes.map((dish) => (
                    <Card
                      key={dish.id}
                      className="overflow-hidden hover:shadow-lg transition-shadow"
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
                            <p className="text-gray-600 text-sm line-clamp-2">
                              {dish.description}
                            </p>
                          </div>

                          <div className="flex items-center justify-between mt-2">
                            <span className="text-blue-600">{dish.price} ₽</span>
                            <Button
                              size="sm"
                              onClick={() => onAddToCart(dish)}
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

        {/* See All Menu */}
        <div className="mt-8 mb-4">
          <Button
            onClick={onNavigateToMenu}
            variant="outline"
            className="w-full h-12 rounded-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
          >
            Посмотреть всё меню
          </Button>
        </div>
      </div>
    </div>
  );
}
