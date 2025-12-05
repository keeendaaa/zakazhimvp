import { MenuItem } from '../types';
import { SelectedFilters } from '../components/DishSelectionModal';

/**
 * Алгоритм рекомендаций на основе тегов
 * Подбирает 8 самых подходящих блюд на основе выбранных фильтров
 */

// Маппинг фильтров на теги меню (как они есть в базе данных)
const FILTER_TO_TAGS_MAP: Record<string, string[]> = {
  // Ситуации
  'Бодрящий завтрак': ['популярное', 'легкое', 'здоровое'],
  'Аперитив': ['вегетарианское', 'легкое'],
  'Деловая трапеза': ['сытное', 'популярное'],
  'Для двоих': ['премиум', 'популярное'],
  'Особый вечер': ['премиум'],
  'Встреча с друзьями': ['популярное', 'сытное'],
  'Неспешный ужин': ['популярное'],
  
  // Настроения -> теги (как они есть в меню)
  'Уютное': ['популярное'],
  'Незнакомое': [],
  'Сытное': ['сытное', 'популярное'],
  'Легкое': ['легкое', 'здоровое', 'вегетарианское'],
  'Торжественное': ['премиум'],
  'Бодрое': ['освежающее'],
  
  // Вкусы
  'Свежий': ['свежее'],
  'Сладкое': ['сладкое'],
  'Острое': ['острое'],
  'Умами': [],
  'Насыщенный': ['премиум'],
  'Нежный': [],
  
  // Кухни (точное сопоставление с тегами в меню)
  'Итальянская': ['итальянское'],
  'Французская': ['французское'],
  'Японская': ['японское'],
  'Паназиатская': ['азиатское'],
  'Русская & Европейская': ['русское', 'европейское'],
  'Авторская': ['греческое', 'мексиканское', 'восточное'],
};

/**
 * Получает теги для рекомендаций на основе фильтров
 */
function getRecommendationTags(filters: SelectedFilters): string[] {
  const allTags: string[] = [];
  
  // Собираем все теги из фильтров
  [...filters.situation, ...filters.mood, ...filters.taste, ...filters.cuisine].forEach(filter => {
    const mappedTags = FILTER_TO_TAGS_MAP[filter] || [];
    if (mappedTags.length > 0) {
      allTags.push(...mappedTags);
    } else {
      // Если нет маппинга, пытаемся использовать сам фильтр как тег
      const normalizedFilter = filter.toLowerCase();
      allTags.push(normalizedFilter);
    }
  });
  
  return [...new Set(allTags)]; // Убираем дубликаты
}

/**
 * Подсчитывает количество совпадений тегов блюда с тегами фильтров
 */
function calculateTagMatchScore(
  item: MenuItem,
  recommendationTags: string[]
): number {
  if (recommendationTags.length === 0) return 0;
  
  const itemTags = item.tags.map(tag => tag.toLowerCase().trim());
  const normalizedRecTags = recommendationTags.map(tag => tag.toLowerCase().trim());
  
  // Подсчитываем точные совпадения (высокий приоритет)
  let exactMatches = 0;
  itemTags.forEach(tag => {
    if (normalizedRecTags.includes(tag)) {
      exactMatches += 2; // Точное совпадение дает больше очков
    }
  });
  
  // Подсчитываем частичные совпадения (если тег содержит ключевое слово)
  let partialMatches = 0;
  itemTags.forEach(itemTag => {
    normalizedRecTags.forEach(recTag => {
      // Проверяем, содержит ли тег блюда ключевое слово из фильтра
      if (itemTag.includes(recTag) || recTag.includes(itemTag)) {
        partialMatches += 0.5;
      }
    });
  });
  
  // Бонусы за популярность/новинки
  let bonus = 0;
  if (item.isPopular) bonus += 0.5;
  if (item.isNew) bonus += 0.3;
  if (item.isFavorite) bonus += 0.2;
  
  return exactMatches + partialMatches + bonus;
}

/**
 * Алгоритм рекомендаций на основе тегов
 * Возвращает 8 самых подходящих блюд
 */
export function getRecommendations(
  menuItems: MenuItem[],
  filters: SelectedFilters
): MenuItem[] {
  if (menuItems.length === 0) return [];
  
  // Получаем теги для поиска
  const recommendationTags = getRecommendationTags(filters);
  
  // Если нет фильтров, возвращаем популярные блюда
  if (recommendationTags.length === 0) {
    return menuItems
      .filter(item => item.isPopular)
      .slice(0, 8);
  }
  
  // Оцениваем каждое блюдо
  const scoredItems = menuItems.map(item => ({
    item,
    score: calculateTagMatchScore(item, recommendationTags),
  }));
  
  // Сортируем по убыванию счета
  scoredItems.sort((a, b) => b.score - a.score);
  
  // Берем топ-8 блюд с ненулевым счетом
  const topItems = scoredItems
    .filter(scored => scored.score > 0)
    .slice(0, 8)
    .map(scored => scored.item);
  
  // Если не набралось 8 блюд, дополняем популярными
  if (topItems.length < 8) {
    const remaining = 8 - topItems.length;
    const topIds = new Set(topItems.map(item => item.id));
    const additional = menuItems
      .filter(item => !topIds.has(item.id) && item.isPopular)
      .slice(0, remaining);
    
    return [...topItems, ...additional];
  }
  
  return topItems;
}

/**
 * Сохраняет ответы онбординга в localStorage
 */
export function saveOnboardingAnswers(filters: SelectedFilters): void {
  try {
    localStorage.setItem('onboardingAnswers', JSON.stringify(filters));
  } catch (error) {
    console.error('Ошибка при сохранении ответов онбординга:', error);
  }
}

/**
 * Загружает сохраненные ответы онбординга из localStorage
 */
export function loadOnboardingAnswers(): SelectedFilters | null {
  try {
    const stored = localStorage.getItem('onboardingAnswers');
    if (stored) {
      return JSON.parse(stored) as SelectedFilters;
    }
  } catch (error) {
    console.error('Ошибка при загрузке ответов онбординга:', error);
  }
  return null;
}
