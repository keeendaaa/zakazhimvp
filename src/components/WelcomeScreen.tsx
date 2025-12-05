import { ImageWithFallback } from './figma/ImageWithFallback';
import { Button } from './ui/button';
import { QrCode, Clock, Smartphone, Sparkles } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: () => void;
}

export default function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <ImageWithFallback
          src="/images/restaurant-table.jpg"
          alt="Ресторан"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/60 via-blue-900/40 to-blue-950/80"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-lg">
        <div className="mb-8 inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
          <QrCode className="w-10 h-10 text-white" />
        </div>
        
        <h1 className="text-white mb-4">
          Не жди — закажи сам!
        </h1>
        
        <p className="text-white/90 mb-10">
          Быстро, удобно, без ожидания
        </p>

        <Button
          size="lg"
          onClick={onStart}
          className="w-full max-w-xs bg-blue-600 hover:bg-blue-700 text-white shadow-lg h-14 rounded-full"
        >
          Посмотреть меню
        </Button>

        {/* Benefits */}
        <div className="mt-12 grid grid-cols-3 gap-4 text-white/80">
          <div className="flex flex-col items-center gap-2">
            <Clock className="w-6 h-6" />
            <span className="text-sm">Быстро</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Smartphone className="w-6 h-6" />
            <span className="text-sm">Удобно</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Sparkles className="w-6 h-6" />
            <span className="text-sm">AI официант</span>
          </div>
        </div>
      </div>
    </div>
  );
}
