import { useState, useRef, useEffect } from 'react';
import { Message, Dish } from '../types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Send, Bot, User, Plus } from 'lucide-react';
import { dishes } from '../data/dishes';

interface AIAssistantProps {
  onAddToCart: (dish: Dish) => void;
}

export default function AIAssistant({ onAddToCart }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Привет! Я ваш AI-официант. Могу рассказать о составе блюд, помочь с выбором или порекомендовать что-то особенное. Чем могу помочь?',
      isBot: true,
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getAIResponse = (userMessage: string): Message => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Вопросы о глютене
    if (lowerMessage.includes('глютен') || lowerMessage.includes('без глютена')) {
      const glutenFreeDishes = dishes.filter(
        d => !d.allergens?.includes('Глютен')
      );
      return {
        id: Date.now().toString(),
        text: 'Вот блюда без глютена, которые я могу вам порекомендовать:',
        isBot: true,
        suggestedDishes: glutenFreeDishes.slice(0, 3),
      };
    }
    
    // Вопросы о стейке
    if (lowerMessage.includes('стейк')) {
      const steak = dishes.find(d => d.id === '1');
      const wine = 'красное вино (Каберне Совиньон или Мальбек)';
      return {
        id: Date.now().toString(),
        text: `К стейку Рибай отлично подойдет ${wine}, а в качестве гарнира рекомендую овощи гриль или картофель с трюфельным маслом. Также советую попробовать наш зелёный салат в качестве стартера!`,
        isBot: true,
        suggestedDishes: steak ? [steak] : [],
      };
    }
    
    // Вегетарианские блюда
    if (lowerMessage.includes('вегетариан') || lowerMessage.includes('без мяса')) {
      const vegDishes = dishes.filter(d => d.tags.includes('vegetarian'));
      return {
        id: Date.now().toString(),
        text: 'У нас есть замечательные вегетарианские блюда:',
        isBot: true,
        suggestedDishes: vegDishes,
      };
    }
    
    // Здоровая еда
    if (lowerMessage.includes('здоров') || lowerMessage.includes('пп') || lowerMessage.includes('легк')) {
      const healthyDishes = dishes.filter(d => d.tags.includes('healthy'));
      return {
        id: Date.now().toString(),
        text: 'Для здорового питания рекомендую эти блюда:',
        isBot: true,
        suggestedDishes: healthyDishes,
      };
    }
    
    // Острое
    if (lowerMessage.includes('остр')) {
      const spicyDishes = dishes.filter(d => d.tags.includes('spicy'));
      return {
        id: Date.now().toString(),
        text: 'Любите острое? Попробуйте:',
        isBot: true,
        suggestedDishes: spicyDishes,
      };
    }
    
    // Десерты
    if (lowerMessage.includes('десерт') || lowerMessage.includes('сладк')) {
      const desserts = dishes.filter(d => d.tags.includes('dessert'));
      return {
        id: Date.now().toString(),
        text: 'Наши десерты - это настоящее удовольствие:',
        isBot: true,
        suggestedDishes: desserts,
      };
    }
    
    // Популярные блюда
    if (lowerMessage.includes('популярн') || lowerMessage.includes('советуе') || lowerMessage.includes('рекоменд')) {
      const popularDishes = dishes.filter(d => d.tags.includes('popular'));
      return {
        id: Date.now().toString(),
        text: 'Наши самые популярные блюда, которые обожают гости:',
        isBot: true,
        suggestedDishes: popularDishes,
      };
    }
    
    // Аллергены
    if (lowerMessage.includes('аллерг')) {
      return {
        id: Date.now().toString(),
        text: 'Я могу помочь вам найти блюда без определённых аллергенов. Скажите, какие продукты вам нужно исключить? (например: глютен, яйца, молочные продукты, рыба, морепродукты)',
        isBot: true,
      };
    }
    
    // Default response
    return {
      id: Date.now().toString(),
      text: 'Я могу помочь вам с выбором блюд! Спросите меня о составе, аллергенах, вегетарианских опциях или попросите что-то порекомендовать. Например: "Что без глютена?", "Что посоветуете к стейку?", "Покажи здоровые блюда"',
      isBot: true,
    };
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isBot: false,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Simulate AI response delay
    setTimeout(() => {
      const aiResponse = getAIResponse(inputValue);
      setMessages(prev => [...prev, aiResponse]);
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2>AI Официант</h2>
            <p className="text-sm text-gray-500">Всегда на связи</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-24">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-4 flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
          >
            <div className={`flex gap-2 max-w-[80%] ${message.isBot ? 'flex-row' : 'flex-row-reverse'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.isBot ? 'bg-blue-600' : 'bg-gray-600'
              }`}>
                {message.isBot ? (
                  <Bot className="w-5 h-5 text-white" />
                ) : (
                  <User className="w-5 h-5 text-white" />
                )}
              </div>

              <div>
                <div className={`rounded-2xl px-4 py-3 ${
                  message.isBot
                    ? 'bg-white text-gray-800 border border-gray-200'
                    : 'bg-blue-600 text-white'
                }`}>
                  {message.text}
                </div>

                {/* Suggested Dishes */}
                {message.suggestedDishes && message.suggestedDishes.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {message.suggestedDishes.map((dish) => (
                      <Card key={dish.id} className="overflow-hidden">
                        <div className="flex gap-3 p-3">
                          <ImageWithFallback
                            src={dish.image}
                            alt={dish.name}
                            className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="mb-1 line-clamp-1">{dish.name}</h4>
                            <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                              {dish.description}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-blue-600">{dish.price} ₽</span>
                              <Button
                                size="sm"
                                onClick={() => onAddToCart(dish)}
                                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full h-7 px-3 text-xs"
                              >
                                <Plus className="w-3 h-3 mr-1" />
                                Добавить
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Задайте вопрос о меню..."
            className="flex-1 rounded-full"
          />
          <Button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-12 h-12 p-0 flex-shrink-0"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
