import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface OnboardingScreenProps {
  onComplete: () => void;
}

export default function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [isToggled, setIsToggled] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handleToggle = () => {
    setIsToggled(true);
    // Сохраняем, что пользователь прошел онбординг
    localStorage.setItem('hasCompletedOnboarding', 'true');
    // Устанавливаем флаг для автоматического открытия модального окна
    localStorage.setItem('shouldOpenDishSelection', 'true');
    // Ждем завершения анимации панкейков (максимальная задержка 0.6s + время анимации)
    setTimeout(() => {
      // Запускаем анимацию закрытия
      setIsClosing(true);
      // Небольшая задержка для завершения анимации закрытия
      setTimeout(() => {
        onComplete();
      }, 500);
    }, 1000);
  };

  return (
    <AnimatePresence>
      {!isClosing && (
        <motion.div
          className="fixed inset-0 z-50 bg-gradient-to-br from-blue-50 via-white to-gray-50 flex items-center justify-center"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
      <div className="text-center px-6 max-w-md">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Добро пожаловать!
        </h1>
        <p className="text-gray-600 mb-12 text-lg">
          Переключите ползунок, чтобы мы подсказали вам лучшее блюдо
        </p>

        {/* Pancake Toggle */}
        <div className="pancake-stack-toggle flex justify-center">
          <input
            type="checkbox"
            id="onboarding-toggle"
            checked={isToggled}
            onChange={handleToggle}
          />
          <label htmlFor="onboarding-toggle">
            <div className="pancakes">
              <div className="pancake"></div>
              <div className="pancake"></div>
              <div className="pancake"></div>
              <div className="butter"></div>
            </div>
          </label>
        </div>
      </div>

      <style>{`
        .pancake-stack-toggle {
          position: relative;
          display: inline-block;
        }

        .pancake-stack-toggle input {
          height: 40px;
          left: 0;
          opacity: 0;
          position: absolute;
          top: 0;
          width: 40px;
          cursor: pointer;
        }

        .pancake-stack-toggle label {
          width: 7em;
          background: #2e394d;
          height: 3em;
          display: inline-block;
          border-radius: 50px;
          margin: 40px;
          position: relative;
          transition: all .3s ease;
          transform-origin: 20% center;
          cursor: pointer;
        }

        .pancake-stack-toggle label:before {
          content: none;
        }

        .pancake-stack-toggle .pancakes {
          transition: .6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .pancake-stack-toggle .pancake {
          background: #e27c31;
          border-radius: 50%;
          width: 2.5em;
          height: 2.5em;
          position: absolute;
          transition: .4s ease;
          top: 2px;
          left: 4px;
          box-shadow: 0 2px 0 2px #fbbe7c;
        }

        .pancake-stack-toggle .pancake:nth-child(2) {
          left: 0;
          top: -3px;
          transform: scale(0);
          transition: .2s ease .2s;
        }

        .pancake-stack-toggle .pancake:nth-child(3) {
          top: -8px;
          transform: scale(0);
          transition: .2s ease .2s;
        }

        .pancake-stack-toggle .pancake:nth-child(3):before,
        .pancake-stack-toggle .pancake:nth-child(3):after {
          content: '';
          background: #ef8927;
          border-radius: 20px;
          width: 50%;
          height: 20%;
          position: absolute;
        }

        .pancake-stack-toggle .pancake:nth-child(3):before {
          top: 20px;
          left: 5px;
        }

        .pancake-stack-toggle .pancake:nth-child(3):after {
          top: 22px;
          right: 5px;
        }

        .pancake-stack-toggle .butter {
          width: 12px;
          height: 11px;
          background: #fbdb60;
          top: 6px;
          left: 20px;
          position: absolute;
          border-radius: 4px;
          box-shadow: 0 1px 0 1px #d67823;
          transform: scale(0);
          transition: .2s ease;
        }

        .pancake-stack-toggle input:checked + label .pancakes {
          transform: translateX(70px);
        }

        .pancake-stack-toggle input:checked + label .pancake:nth-child(2) {
          transform: scale(1);
          transition-delay: .2s;
        }

        .pancake-stack-toggle input:checked + label .pancake:nth-child(3) {
          transform: scale(1);
          transition-delay: .4s;
        }

        .pancake-stack-toggle input:checked + label .butter {
          transform: scale(1);
          transition-delay: .6s;
        }
      `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

