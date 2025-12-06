import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Send, Bot, User, Plus } from 'lucide-react';
import { MenuItem } from '../types';
import { ImageWithFallback } from './figma/ImageWithFallback';
import ItemDetailSheet from './ItemDetailSheet';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestedItems?: MenuItem[];
}

interface AIAssistantNewProps {
  menuItems: MenuItem[];
  onAddToCart: (item: MenuItem) => void;
}

// URL webhook n8n - определяется в зависимости от окружения
const getN8NWebhookUrl = () => {
  // Production вебхук
  return 'https://n8n.zakazhi.online/webhook/mvp';
};

export default function AIAssistantNew({ menuItems, onAddToCart }: AIAssistantNewProps) {
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
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

  const sendToN8N = async (userMessage: string): Promise<{ message: string; suggestedItems?: MenuItem[]; sessionId?: string }> => {
    console.log('[AI Assistant] ===== НАЧАЛО ОТПРАВКИ В N8N =====');
    const webhookUrl = getN8NWebhookUrl();
    console.log('[AI Assistant] URL:', webhookUrl);
    console.log('[AI Assistant] SessionId:', sessionId);
    
    try {
      // Формируем тело запроса согласно требованиям n8n workflow
      // n8n Chat Trigger требует sessionId всегда, даже для нового сеанса
      // Ожидается: { chatInput: string, sessionId: string }
      const currentSessionId = sessionId || `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      const requestBody: { chatInput: string; sessionId: string } = {
        chatInput: userMessage.trim(),
        sessionId: currentSessionId,
      };
      
      // Сохраняем sessionId если его еще не было
      if (!sessionId) {
        setSessionId(currentSessionId);
        localStorage.setItem('chatSessionId', currentSessionId);
      }

      console.log('[AI Assistant] Тело запроса:', JSON.stringify(requestBody, null, 2));
      console.log('[AI Assistant] URL запроса:', webhookUrl);

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('[AI Assistant] HTTP статус:', response.status, response.statusText);
      console.log('[AI Assistant] Заголовки ответа:', Object.fromEntries(response.headers.entries()));
      
      // Проверяем Content-Length из заголовков
      const contentLength = response.headers.get('content-length');
      console.log('[AI Assistant] Content-Length из заголовков:', contentLength);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[AI Assistant] ❌ ОШИБКА HTTP:', response.status);
        console.error('[AI Assistant] Текст ошибки:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
      }

      // Проверяем, есть ли данные в ответе
      const responseClone = response.clone();
      const responseText = await response.text();
      console.log('[AI Assistant] Сырой ответ (текст):', responseText);
      console.log('[AI Assistant] Длина ответа:', responseText.length);
      console.log('[AI Assistant] Тип ответа:', typeof responseText);
      
      // Проверяем, что ответ не пустой
      if (!responseText || responseText.trim() === '') {
        console.error('[AI Assistant] ❌❌❌ ПУСТОЙ ОТВЕТ ОТ N8N!');
        console.error('[AI Assistant] HTTP статус был:', response.status);
        console.error('[AI Assistant] URL был:', webhookUrl);
        console.error('[AI Assistant] Тело запроса было:', JSON.stringify(requestBody, null, 2));
        console.error('[AI Assistant] ⚠️ ПРОБЛЕМА: n8n workflow не возвращает данные. Проверьте настройки workflow в n8n.');
        console.error('[AI Assistant] Используем fallback на локальную обработку');
        const fallbackResponse = generateResponse(userMessage);
        return {
          message: fallbackResponse.message,
          suggestedItems: fallbackResponse.suggestedItems,
          sessionId: sessionId,
        };
      }
      
      let data;
      try {
        data = JSON.parse(responseText);
        console.log('[AI Assistant] Парсированный ответ:', JSON.stringify(data, null, 2));
      } catch (parseError) {
        console.error('[AI Assistant] ❌ Ошибка парсинга JSON:', parseError);
        console.error('[AI Assistant] Сырой ответ был:', responseText);
        console.error('[AI Assistant] Используем fallback на локальную обработку');
        const fallbackResponse = generateResponse(userMessage);
        return {
          message: fallbackResponse.message,
          suggestedItems: fallbackResponse.suggestedItems,
          sessionId: sessionId,
        };
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
        const fallbackResponse = generateResponse(userMessage);
        return {
          message: fallbackResponse.message,
          suggestedItems: fallbackResponse.suggestedItems,
          sessionId: sessionId,
        };
      }
      
      // Пытаемся извлечь рекомендуемые блюда из ответа n8n
      let suggestedItems: MenuItem[] | undefined;
      
      // Проверяем, есть ли в ответе упоминания названий блюд
      // Используем Map для избежания дублирования по id (более надежно чем Set)
      const mentionedDishesMap = new Map<string, MenuItem>();
      const lowerResponse = responseMessage.toLowerCase();
      
      // Сортируем блюда по длине названия (от длинных к коротким), чтобы избежать частичных совпадений
      const sortedItems = [...menuItems].sort((a, b) => b.name.length - a.name.length);
      
      sortedItems.forEach(item => {
        // Пропускаем, если уже добавлено
        if (mentionedDishesMap.has(item.id)) return;
        
        const itemNameLower = item.name.toLowerCase().trim();
        // Проверяем несколько вариантов совпадения:
        // 1. Точное совпадение с границами слов
        // 2. Название блюда входит в упоминание (например, "Греческий" в "Греческий салат")
        // 3. Ключевые слова из названия присутствуют в ответе (слова длиннее 2 символов)
        const escapedName = itemNameLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const exactMatch = new RegExp(`\\b${escapedName}\\b`, 'i');
        const partialMatch = lowerResponse.includes(itemNameLower);
        
        // Проверяем ключевые слова из названия (слова длиннее 2 символов, но не слишком короткие общие слова)
        const nameWords = itemNameLower.split(/[\s\-.,;:]+/).filter(word => {
          const trimmed = word.trim();
          return trimmed.length > 2 && !['для', 'из', 'с', 'и', 'или', 'на', 'в', 'к', 'по'].includes(trimmed);
        });
        const hasKeyWords = nameWords.length > 0 && nameWords.some(word => {
          const trimmed = word.trim();
          if (trimmed.length < 3) return false;
          const wordRegex = new RegExp(`\\b${trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
          return wordRegex.test(responseMessage);
        });
        
        if (exactMatch.test(responseMessage) || partialMatch || hasKeyWords) {
          console.log('[AI Assistant] Найдено блюдо:', item.name, 'по совпадению:', { exactMatch: exactMatch.test(responseMessage), partialMatch, hasKeyWords, nameWords });
          mentionedDishesMap.set(item.id, item);
        }
      });
      
      console.log('[AI Assistant] Найдено блюд:', mentionedDishesMap.size, Array.from(mentionedDishesMap.values()).map(i => i.name));
      
      // Если найдены упоминания блюд, используем их как рекомендуемые (максимум 5)
      if (mentionedDishesMap.size > 0) {
        // Преобразуем Map в массив и убираем дубликаты еще раз на всякий случай
        suggestedItems = Array.from(
          new Map(Array.from(mentionedDishesMap.values()).map(item => [item.id, item])).values()
        ).slice(0, 5);
      } else {
        // Fallback: пытаемся извлечь названия из нумерованного списка (1., 2., 3. и т.д.)
        const numberedListRegex = /(\d+)\.\s*([^—\n·]+?)(?:\s*—|·|$)/g;
        const extractedNames: string[] = [];
        let match;
        while ((match = numberedListRegex.exec(responseMessage)) !== null && extractedNames.length < 5) {
          const dishName = match[2].trim().split('—')[0].trim().split('·')[0].trim();
          if (dishName.length > 2) {
            extractedNames.push(dishName);
          }
        }
        
        // Ищем блюда по извлеченным названиям
        if (extractedNames.length > 0) {
          const foundByNames: MenuItem[] = [];
          extractedNames.forEach(name => {
            const nameLower = name.toLowerCase();
            const found = menuItems.find(item => {
              const itemNameLower = item.name.toLowerCase();
              return itemNameLower.includes(nameLower) || nameLower.includes(itemNameLower) ||
                     itemNameLower.split(/\s+/).some(word => nameLower.includes(word) && word.length > 3);
            });
            if (found && !foundByNames.find(i => i.id === found.id)) {
              foundByNames.push(found);
            }
          });
          if (foundByNames.length > 0) {
            suggestedItems = foundByNames.slice(0, 5);
            console.log('[AI Assistant] Найдено блюд через извлечение из списка:', foundByNames.map(i => i.name));
          }
        }
        
        // Если все еще нет блюд, и в ответе есть ключевые слова о рекомендациях, ищем популярные блюда
        if (!suggestedItems && (lowerResponse.includes('рекоменд') || lowerResponse.includes('совет') || 
            lowerResponse.includes('попробуйте') || lowerResponse.includes('попробовать'))) {
          suggestedItems = menuItems.filter(item => item.isPopular).slice(0, 3);
        }
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
        suggestedItems: suggestedItems,
        sessionId: responseSessionId,
      };
    } catch (error) {
      console.error('[AI Assistant] ❌❌❌ КРИТИЧЕСКАЯ ОШИБКА!');
      console.error('[AI Assistant] Тип ошибки:', error instanceof Error ? error.constructor.name : typeof error);
      console.error('[AI Assistant] Сообщение ошибки:', error instanceof Error ? error.message : String(error));
      console.error('[AI Assistant] Stack:', error instanceof Error ? error.stack : 'No stack');
      console.error('[AI Assistant] Используем fallback на локальную обработку');
      // Fallback на локальную обработку при ошибке
      const fallbackResponse = generateResponse(userMessage);
      return {
        message: fallbackResponse.message,
        suggestedItems: fallbackResponse.suggestedItems,
        sessionId: sessionId,
      };
    }
  };

  const generateResponse = (userMessage: string): { message: string; suggestedItems?: MenuItem[] } => {
    const lowerMessage = userMessage.toLowerCase();

    // Check for allergen questions
    if (lowerMessage.includes('аллерг') || lowerMessage.includes('непереносим')) {
      if (lowerMessage.includes('глютен')) {
        const items = menuItems.filter(item => !item.allergens?.includes('глютен')).slice(0, 3);
        // Убираем дубликаты по id
        const uniqueItems = Array.from(new Map(items.map(item => [item.id, item])).values());
        return {
          message: `Без глютена у нас: ${uniqueItems.map(i => i.name).join(', ')}. Могу подробнее рассказать о любом блюде!`,
          suggestedItems: uniqueItems,
        };
      }
      if (lowerMessage.includes('молоч') || lowerMessage.includes('лактоз')) {
        const items = menuItems.filter(item => !item.allergens?.includes('молочные продукты')).slice(0, 3);
        // Убираем дубликаты по id
        const uniqueItems = Array.from(new Map(items.map(item => [item.id, item])).values());
        return {
          message: `Без молочных продуктов: ${uniqueItems.map(i => i.name).join(', ')}.`,
          suggestedItems: uniqueItems,
        };
      }
      return { message: 'Уточните, пожалуйста, на какой продукт у вас аллергия? Я подберу подходящие блюда.' };
    }

    // Check for vegetarian/vegan
    if (lowerMessage.includes('вегетариан') || lowerMessage.includes('веган')) {
      const vegItems = menuItems.filter(item => 
        item.tags.includes('вегетарианское') || !item.tags.includes('с мясом')
      ).slice(0, 4);
      // Убираем дубликаты по id
      const uniqueItems = Array.from(new Map(vegItems.map(item => [item.id, item])).values());
      return {
        message: `Вегетарианские блюда: ${uniqueItems.map(i => i.name).join(', ')}.`,
        suggestedItems: uniqueItems,
      };
    }

    // Check for specific dishes
    const matchedDish = menuItems.find(item => 
      lowerMessage.includes(item.name.toLowerCase())
    );
    
    if (matchedDish) {
      return {
        message: `${matchedDish.name}: ${matchedDish.description}. Вес: ${matchedDish.weight}. Калорийность: ${matchedDish.calories} ккал. Состав: ${matchedDish.ingredients.join(', ')}. ${matchedDish.allergens && matchedDish.allergens.length > 0 ? `Содержит аллергены: ${matchedDish.allergens.join(', ')}.` : 'Не содержит основных аллергенов.'}`,
        suggestedItems: [matchedDish],
      };
    }

    // Check for calories/diet
    if (lowerMessage.includes('калори') || lowerMessage.includes('диет') || lowerMessage.includes('легк')) {
      const lightItems = menuItems
        .filter(item => item.calories && item.calories < 400)
        .slice(0, 3);
      // Убираем дубликаты по id
      const uniqueItems = Array.from(new Map(lightItems.map(item => [item.id, item])).values());
      return {
        message: `Лёгкие блюда до 400 ккал: ${uniqueItems.map(i => `${i.name} (${i.calories} ккал)`).join(', ')}.`,
        suggestedItems: uniqueItems,
      };
    }

    // Check for recommendations
    if (lowerMessage.includes('посовет') || lowerMessage.includes('рекоменд') || lowerMessage.includes('что выбрать')) {
      const popular = menuItems.filter(item => item.isPopular).slice(0, 3);
      // Убираем дубликаты по id
      const uniqueItems = Array.from(new Map(popular.map(item => [item.id, item])).values());
      return {
        message: `Рекомендую попробовать популярные блюда: ${uniqueItems.map(i => i.name).join(', ')}.`,
        suggestedItems: uniqueItems,
      };
    }

    // Default response
    return { message: 'Спасибо за вопрос! Я могу рассказать о составе блюд, калорийности, аллергенах или помочь с выбором. Что вас интересует?' };
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
      
      // Удаляем дубликаты из suggestedItems по id и названию (более строгая проверка)
      const uniqueSuggestedItems = response.suggestedItems 
        ? (() => {
            const seenIds = new Set<string>();
            const seenNames = new Set<string>();
            const unique: MenuItem[] = [];
            for (const item of response.suggestedItems || []) {
              const idKey = item.id;
              const nameKey = item.name.toLowerCase().trim();
              
              // Пропускаем если уже видели этот id или название
              if (!seenIds.has(idKey) && !seenNames.has(nameKey)) {
                seenIds.add(idKey);
                seenNames.add(nameKey);
                unique.push(item);
              }
            }
            return unique;
          })()
        : undefined;

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.message,
        timestamp: new Date(),
        suggestedItems: uniqueSuggestedItems,
      };

      console.log('[AI Assistant] Создано сообщение ассистента с suggestedItems:', uniqueSuggestedItems?.length || 0, uniqueSuggestedItems?.map(i => i.name) || []);

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
              className={`max-w-[75%] w-full rounded-2xl px-4 py-3 ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white shadow-sm'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              
              {/* Suggested dishes cards */}
              {message.role === 'assistant' && message.suggestedItems && message.suggestedItems.length > 0 && (
                <div className="mt-4 -mx-2">
                  <div className="text-xs font-semibold text-gray-600 mb-2 px-2">Рекомендуемые блюда:</div>
                  <div className="space-y-2">
                    {(() => {
                      // Убираем дубликаты по id и названию перед отображением
                      const seenIds = new Set<string>();
                      const seenNames = new Set<string>();
                      const uniqueItems = message.suggestedItems!.filter(item => {
                        // Проверяем и по id, и по названию (на случай если id одинаковые)
                        const idKey = item.id;
                        const nameKey = item.name.toLowerCase().trim();
                        
                        if (seenIds.has(idKey) || seenNames.has(nameKey)) {
                          return false;
                        }
                        
                        seenIds.add(idKey);
                        seenNames.add(nameKey);
                        return true;
                      });
                      return uniqueItems.map((item) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          onClick={() => setSelectedItem(item)}
                          className="bg-gray-50 rounded-xl overflow-hidden hover:bg-gray-100 transition-colors cursor-pointer active:scale-[0.98] flex"
                        >
                          <ImageWithFallback
                            src={item.image}
                            alt={item.name}
                            className="w-20 h-full object-cover flex-shrink-0"
                          />
                          <div className="flex-1 flex flex-col justify-center pt-2.5 pr-2.5 pb-2.5 min-w-0" style={{ paddingLeft: '1rem' }}>
                            <h4 className="text-sm sm:text-base font-medium text-gray-900 break-words line-clamp-2 mb-2">
                              {item.name}
                            </h4>
                            <div className="flex items-center gap-2">
                              <span className="text-xs sm:text-sm font-semibold text-blue-600">
                                {item.price} ₽
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onAddToCart(item);
                                }}
                                className="p-0.5 sm:p-1 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors flex-shrink-0"
                                aria-label={`Добавить ${item.name} в корзину`}
                              >
                                <Plus size={10} className="sm:w-3 sm:h-3" style={{ width: '18px', height: '18px' }} />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ));
                    })()}
                  </div>
                </div>
              )}
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

      {/* Item Detail Sheet */}
      {selectedItem && (
        <ItemDetailSheet
          item={selectedItem}
          menuItems={menuItems}
          onClose={() => setSelectedItem(null)}
          onAddToCart={onAddToCart}
          onItemSelect={setSelectedItem}
        />
      )}

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
