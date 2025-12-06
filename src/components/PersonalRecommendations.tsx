import { motion } from 'motion/react';
import { MenuItem } from '../types';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ArrowLeft, X } from 'lucide-react';

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
    <div className="w-full bg-white min-h-screen">
      {/* Header */}
      <div className="px-4 pt-6 pb-4">
        {onClose && (
          <div className="mb-4 flex items-center justify-between">
            <button
              onClick={onClose}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors -ml-1"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="Закрыть"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
        <h1 className="text-2xl font-bold text-gray-900 mb-3 pb-3 border-b border-gray-900">Персональные рекомендации</h1>
      </div>

      {/* Recommendations List */}
      <div className="px-4 pb-24 space-y-4">
        {recommendations.map((item, index) => {
          const isEven = index % 2 === 0;
          
          return (
            <motion.div
              key={`${item.id}-${index}`}
              className="bg-white rounded-2xl p-4 shadow-sm cursor-pointer active:opacity-70 transition-all hover:shadow-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onItemSelect(item)}
            >
              <div className={`flex items-start gap-4 ${
                !isEven ? 'flex-row-reverse' : ''
              }`}>
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
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
