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

export default function AIAssistantNew({ menuItems, onAddToCart }: AIAssistantNewProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Здравствуйте! Я AI-официант ресторана. Могу рассказать о составе любого блюда, помочь с выбором с учётом аллергенов или диетических предпочтений. Чем могу помочь?',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

    // Check for composition/ingredients
    if (lowerMessage.includes('состав') || lowerMessage.includes('ингредиент')) {
      return 'О каком блюде хотите узнать подробнее? Назовите название, и я расскажу полный состав.';
    }

    // Default response
    return 'Спасибо за вопрос! Я могу рассказать о составе блюд, калорийности, аллергенах или помочь с выбором. Что вас интересует?';
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI thinking
    setTimeout(() => {
      const response = generateResponse(inputValue);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000);
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
              disabled={!inputValue.trim()}
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
