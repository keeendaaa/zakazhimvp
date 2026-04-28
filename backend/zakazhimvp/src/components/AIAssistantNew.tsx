import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Send, Bot, User } from 'lucide-react';
import { MenuItem } from '../types';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIAssistantNewProps {
  menuItems: MenuItem[];
  onAddToCart: (item: MenuItem) => void;
}

// URL webhook n8n - определяется в зависимости от окружения
const getN8NWebhookUrl = () => {
  const isDevelopment = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  return isDevelopment
    ? '/api/n8n/webhook/939aba8e-36b3-4011-ac35-13fc37dc9712'
    : 'https://n8n.zakazhi.online/webhook/939aba8e-36b3-4011-ac35-13fc37dc9712';
};

export default function AIAssistantNew({ menuItems, onAddToCart }: AIAssistantNewProps) {
  // Восстанавливаем сообщения из localStorage при инициализации
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const stored = localStorage.getItem('chatMessages');
      if (stored) {
        const parsed = JSON.parse(stored);
        // Преобразуем timestamp обратно в Date объекты
        return parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
      }
    } catch (error) {
      console.error('[AI Assistant] Ошибка при восстановлении сообщений из localStorage:', error);
    }
    // Значение по умолчанию, если нет сохраненных сообщений
    return [
      {
        id: '1',
        role: 'assistant',
        content: 'Здравствуйте! Я AI-официант ресторана. Могу рассказать о составе любого блюда, помочь с выбором с учётом аллергенов или диетических предпочтений. Чем могу помочь?',
        timestamp: new Date(),
      },
    ];
  });
  
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState(() => {
    // Создаем уникальный ID сессии или используем существующий из localStorage
    const stored = localStorage.getItem('chatSessionId');
    if (stored) return stored;
    const newId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('chatSessionId', newId);
    return newId;
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Сохраняем сообщения в localStorage при каждом изменении
  useEffect(() => {
    try {
      localStorage.setItem('chatMessages', JSON.stringify(messages));
    } catch (error) {
      console.error('[AI Assistant] Ошибка при сохранении сообщений в localStorage:', error);
      // Если localStorage переполнен, пытаемся очистить старые сообщения
      try {
        // Оставляем только последние 50 сообщений
        const recentMessages = messages.slice(-50);
        localStorage.setItem('chatMessages', JSON.stringify(recentMessages));
      } catch (e) {
        console.error('[AI Assistant] Не удалось сохранить даже урезанную версию:', e);
      }
    }
  }, [messages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendToN8N = async (userMessage: string): Promise<{ message: string; sessionId?: string }> => {
    console.log('[AI Assistant] ===== НАЧАЛО ОТПРАВКИ В N8N =====');
    const webhookUrl = getN8NWebhookUrl();
    console.log('[AI Assistant] URL:', webhookUrl);
    console.log('[AI Assistant] SessionId:', sessionId);
    
    try {
      // Формируем тело запроса согласно требованиям n8n workflow
      // Ожидается: { chatInput: string, sessionId?: string }
      const requestBody: { chatInput: string; sessionId?: string } = {
        chatInput: userMessage.trim(),
      };
      
      // Добавляем sessionId только если он есть
      if (sessionId) {
        requestBody.sessionId = sessionId;
      }

      console.log('[AI Assistant] Тело запроса:', JSON.stringify(requestBody, null, 2));

      const webhookUrl = getN8NWebhookUrl();
      console.log('[AI Assistant] URL:', webhookUrl);

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('[AI Assistant] HTTP статус:', response.status, response.statusText);
      console.log('[AI Assistant] Заголовки ответа:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[AI Assistant] ❌ ОШИБКА HTTP:', response.status);
        console.error('[AI Assistant] Текст ошибки:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
      }

      const responseText = await response.text();
      console.log('[AI Assistant] Сырой ответ (текст):', responseText);
      
      let data;
      try {
        data = JSON.parse(responseText);
        console.log('[AI Assistant] Парсированный ответ:', JSON.stringify(data, null, 2));
      } catch (parseError) {
        console.error('[AI Assistant] ❌ Ошибка парсинга JSON:', parseError);
        console.error('[AI Assistant] Сырой ответ был:', responseText);
        throw new Error(`Failed to parse response as JSON: ${responseText}`);
      }
      
      // n8n возвращает ответ в формате { message: string, sessionId?: string }
      // согласно ноде "Форматирование ответа"
      let responseMessage = data.message;
      
      console.log('[AI Assistant] Извлеченное message:', responseMessage);
      
      // Если message пустой или undefined, проверяем другие возможные поля
      if (!responseMessage || responseMessage.trim() === '') {
        console.warn('[AI Assistant] ⚠️ message пустой, проверяем другие поля...');
        responseMessage = data.output || data.text || data.response || data.content;
        console.log('[AI Assistant] Найденное значение:', responseMessage);
      }
      
      // Если все еще нет ответа, используем fallback
      if (!responseMessage || responseMessage.trim() === '') {
        console.error('[AI Assistant] ❌❌❌ ПУСТОЙ ОТВЕТ ОТ N8N!');
        console.error('[AI Assistant] Полный объект ответа:', data);
        console.error('[AI Assistant] Используем fallback на локальную обработку');
        return {
          message: generateResponse(userMessage),
          sessionId: sessionId,
        };
      }
      
      console.log('[AI Assistant] ✅ Успешный ответ от n8n:', responseMessage.substring(0, 100) + '...');
      
      const responseSessionId = data.sessionId || sessionId;
      
      // Обновляем sessionId если он вернулся из n8n
      if (responseSessionId && responseSessionId !== sessionId) {
        console.log('[AI Assistant] Обновляем sessionId:', responseSessionId);
        setSessionId(responseSessionId);
        localStorage.setItem('chatSessionId', responseSessionId);
      }
      
      console.log('[AI Assistant] ===== УСПЕШНО ЗАВЕРШЕНО =====');
      return {
        message: responseMessage,
        sessionId: responseSessionId,
      };
    } catch (error) {
      console.error('[AI Assistant] ❌❌❌ КРИТИЧЕСКАЯ ОШИБКА!');
      console.error('[AI Assistant] Тип ошибки:', error instanceof Error ? error.constructor.name : typeof error);
      console.error('[AI Assistant] Сообщение ошибки:', error instanceof Error ? error.message : String(error));
      console.error('[AI Assistant] Stack:', error instanceof Error ? error.stack : 'No stack');
      console.error('[AI Assistant] Используем fallback на локальную обработку');
      // Fallback на локальную обработку при ошибке
      return {
        message: generateResponse(userMessage),
        sessionId: sessionId,
      };
    }
  };

  const generateResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    // Check for allergen questions
    if (lowerMessage.includes('аллерг') || lowerMessage.includes('непереносим')) {
      if (lowerMessage.includes('глютен')) {
        const items = menuItems.filter(item => !item.allergens?.includes('глютен'));
        return `Без глютена у нас: ${items.map(i => i.name).slice(0, 3).join(', ')}. Могу подробнее рассказать о любом блюде!`;
      }
      if (lowerMessage.includes('молоч') || lowerMessage.includes('лактоз')) {
        const items = menuItems.filter(item => !item.allergens?.includes('молочные продукты'));
        return `Без молочных продуктов: ${items.map(i => i.name).slice(0, 3).join(', ')}.`;
      }
      return 'Уточните, пожалуйста, на какой продукт у вас аллергия? Я подберу подходящие блюда.';
    }

    // Check for vegetarian/vegan
    if (lowerMessage.includes('вегетариан') || lowerMessage.includes('веган')) {
      const vegItems = menuItems.filter(item => 
        item.tags.includes('вегетарианское') || !item.tags.includes('с мясом')
      );
      return `Вегетарианские блюда: ${vegItems.map(i => i.name).slice(0, 4).join(', ')}.`;
    }

    // Check for specific dishes
    const matchedDish = menuItems.find(item => 
      lowerMessage.includes(item.name.toLowerCase())
    );
    
    if (matchedDish) {
      return `${matchedDish.name}: ${matchedDish.description}. Вес: ${matchedDish.weight}. Калорийность: ${matchedDish.calories} ккал. Состав: ${matchedDish.ingredients.join(', ')}. ${matchedDish.allergens && matchedDish.allergens.length > 0 ? `Содержит аллергены: ${matchedDish.allergens.join(', ')}.` : 'Не содержит основных аллергенов.'}`;
    }

    // Check for calories/diet
    if (lowerMessage.includes('калори') || lowerMessage.includes('диет') || lowerMessage.includes('легк')) {
      const lightItems = menuItems
        .filter(item => item.calories && item.calories < 400)
        .slice(0, 3);
      return `Лёгкие блюда до 400 ккал: ${lightItems.map(i => `${i.name} (${i.calories} ккал)`).join(', ')}.`;
    }

    // Check for recommendations
    if (lowerMessage.includes('посовет') || lowerMessage.includes('рекоменд') || lowerMessage.includes('что выбрать')) {
      const popular = menuItems.filter(item => item.isPopular).slice(0, 3);
      return `Рекомендую попробовать популярные блюда: ${popular.map(i => i.name).join(', ')}.`;
    }

    // Default response
    return 'Спасибо за вопрос! Я могу рассказать о составе блюд, калорийности, аллергенах или помочь с выбором. Что вас интересует?';
  };

  const handleSend = async () => {
    console.log('[AI Assistant] 🔵 handleSend вызван!');
    console.log('[AI Assistant] inputValue:', inputValue);
    
    if (!inputValue.trim()) {
      console.log('[AI Assistant] ⚠️ inputValue пустой, выходим');
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    console.log('[AI Assistant] Создано сообщение пользователя:', userMessage);
    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsTyping(true);

    console.log('[AI Assistant] Вызываем sendToN8N с:', currentInput);
    try {
      // Отправляем запрос в n8n
      const response = await sendToN8N(currentInput);
      console.log('[AI Assistant] Получен ответ от sendToN8N:', response);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.message,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Извините, произошла ошибка. Попробуйте еще раз.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <motion.div 
      className="min-h-screen bg-gray-50 pb-24 flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
            <Bot className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="mb-1">AI-официант</h2>
            <p className="text-sm text-gray-500">Всегда на связи</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        <AnimatePresence mode="popLayout">
          {messages.map(message => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.role === 'user' ? 'bg-gray-200' : 'bg-blue-100'
              }`}
            >
              {message.role === 'user' ? (
                <User className="w-4 h-4 text-gray-600" />
              ) : (
                <Bot className="w-4 h-4 text-blue-600" />
              )}
            </div>

            <div
              className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white shadow-sm'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            </div>
          </motion.div>
        ))}
        </AnimatePresence>

        <AnimatePresence>
          {isTyping && (
            <motion.div 
              className="flex gap-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-blue-600" />
              </div>
              <div className="bg-white shadow-sm rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Quick suggestions */}
      <div className="px-4 pb-3">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          <motion.button
            onClick={() => setInputValue('Есть ли вегетарианские блюда?')}
            className="px-4 py-2 bg-white rounded-full text-sm whitespace-nowrap shadow-sm hover:shadow-md transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Вегетарианские блюда
          </motion.button>
          <motion.button
            onClick={() => setInputValue('Что посоветуете?')}
            className="px-4 py-2 bg-white rounded-full text-sm whitespace-nowrap shadow-sm hover:shadow-md transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Что посоветуете?
          </motion.button>
          <motion.button
            onClick={() => setInputValue('Есть ли аллергены?')}
            className="px-4 py-2 bg-white rounded-full text-sm whitespace-nowrap shadow-sm hover:shadow-md transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Аллергены
          </motion.button>
        </div>
      </div>

      {/* Input */}
      <div className="sticky bottom-20 bg-white border-t border-gray-100 px-4 py-3">
        <div className="flex gap-2 items-end">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Задайте вопрос..."
            className="flex-1 px-4 py-3 bg-gray-50 rounded-2xl outline-none resize-none"
          />
          <motion.div whileTap={{ scale: 0.9 }}>
            <Button
              onClick={handleSend}
              disabled={!inputValue.trim() || isTyping}
              className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center flex-shrink-0 disabled:opacity-50 transition-all"
            >
              <Send className="w-5 h-5" />
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
