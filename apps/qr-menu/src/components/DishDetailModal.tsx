import { Dish } from '../types';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Badge } from './ui/badge';
import { X, Plus } from 'lucide-react';

interface DishDetailModalProps {
  dish: Dish;
  onClose: () => void;
  onAddToCart: (dish: Dish) => void;
}

export default function DishDetailModal({ dish, onClose, onAddToCart }: DishDetailModalProps) {
  const handleAddToCart = () => {
    onAddToCart(dish);
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-white/90 p-2 hover:bg-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative w-full h-64">
          <ImageWithFallback
            src={dish.image}
            alt={dish.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-6">
          <DialogHeader>
            <DialogTitle className="mb-2">{dish.name}</DialogTitle>
          </DialogHeader>

          <div className="flex gap-2 mb-4">
            {dish.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag === 'popular' && '⭐ Популярное'}
                {tag === 'vegetarian' && '🌱 Вегетарианское'}
                {tag === 'spicy' && '🌶️ Острое'}
                {tag === 'healthy' && '💚 Здоровое'}
                {tag === 'vegan' && '🌿 Веган'}
                {tag === 'meat' && '🥩 Мясо'}
                {tag === 'fish' && '🐟 Рыба'}
                {tag === 'seafood' && '🦐 Морепродукты'}
                {tag === 'dessert' && '🍰 Десерт'}
              </Badge>
            ))}
          </div>

          <p className="text-gray-600 mb-6">{dish.description}</p>

          <div className="mb-6">
            <h3 className="mb-3">Состав:</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              {dish.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
          </div>

          {dish.allergens && dish.allergens.length > 0 && (
            <div className="mb-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
              <h4 className="mb-2 text-amber-900">⚠️ Аллергены:</h4>
              <p className="text-amber-800">{dish.allergens.join(', ')}</p>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <Button
              onClick={handleAddToCart}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6"
            >
              <Plus className="w-5 h-5 mr-2" />
              {dish.price} ₽
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
