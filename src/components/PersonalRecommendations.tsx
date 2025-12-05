import { motion } from 'motion/react';
import { MenuItem } from '../types';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ArrowLeft } from 'lucide-react';

interface PersonalRecommendationsProps {
  recommendations: MenuItem[];
  onItemSelect: (item: MenuItem) => void;
  onClose?: () => void;
}

export default function PersonalRecommendations({
  recommendations,
  onItemSelect,
  onClose,
}: PersonalRecommendationsProps) {
  return (
    <div className="w-full bg-white min-h-screen relative">
      {/* Back button - absolute positioned */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 left-4 z-10 w-10 h-10 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Назад"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      )}

      {/* Header */}
      <div className="px-4 pt-4 pb-4">
        <h1 className="text-xl font-bold text-gray-900 mb-3">Персональные рекомендации</h1>
        <div className="h-[1px] bg-gray-300 w-full"></div>
      </div>

      {/* Recommendations List */}
      <div className="px-4 pb-24 space-y-6">
        {recommendations.map((item, index) => {
          const isEven = index % 2 === 0;
          
          return (
            <motion.div
              key={`${item.id}-${index}`}
              className={`flex items-start gap-4 cursor-pointer active:opacity-70 transition-opacity ${
                !isEven ? 'flex-row-reverse' : ''
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onItemSelect(item)}
            >
              {/* Image */}
              <div className="flex-shrink-0">
                <div className="w-24 h-24 rounded-xl overflow-hidden border border-gray-200">
                  <ImageWithFallback
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Text Content */}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-base text-gray-900 mb-2 leading-tight">{item.name}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
