import React, { useEffect, useRef } from 'react';
import { cn } from './ui/utils';
import { ITelegramUser } from '../types';

declare global {
  interface Window {
    onTelegramAuth: (user: ITelegramUser) => void;
  }
}

interface LoginFormProps {
  className?: string;
  onLogin?: (user: ITelegramUser) => void;
  botName?: string; // Имя бота для Telegram виджета
}

export function LoginForm({ className, onLogin, botName = 'zakazhiorg_bot' }: LoginFormProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Очищаем предыдущий виджет, если есть
    const existingScript = document.querySelector('script[data-telegram-login]');
    if (existingScript) {
      existingScript.remove();
    }

    // Создаем скрипт для Telegram виджета
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.setAttribute('data-telegram-login', botName);
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-radius', '20');
    script.setAttribute('data-onauth', 'onTelegramAuth');
    script.setAttribute('data-request-access', 'write');

    // Добавляем скрипт в контейнер
    if (containerRef.current) {
      containerRef.current.appendChild(script);
    }

    // Глобальная функция для обработки авторизации
    window.onTelegramAuth = function (user: ITelegramUser) {
      console.log('Telegram auth success:', user);
      
      // Вызываем callback с данными пользователя
      if (onLogin) {
        onLogin(user);
      }
    };

    // Очистка при размонтировании
    return () => {
      if (existingScript && existingScript.parentNode) {
        existingScript.parentNode.removeChild(existingScript);
      }
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [botName, onLogin]);

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold mb-2">Войдите в аккаунт</h3>
          <p className="text-sm text-gray-600">
            Так мы сможем предложить вам персонализированные рекомендации
          </p>
        </div>
        <div className="flex justify-center items-center">
          <div ref={containerRef} id="telegram-widget-container" className="w-full flex justify-center"></div>
        </div>
      </div>

      <p className="px-4 text-center text-xs text-gray-500">
        Продолжая, вы соглашаетесь с нашими <a href="#" className="underline">Условиями использования</a>{" "}
        и <a href="#" className="underline">Политикой конфиденциальности</a>.
      </p>
    </div>
  );
}

