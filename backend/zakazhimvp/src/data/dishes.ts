import { Dish } from '../types';

export const dishes: Dish[] = [
  {
    id: '1',
    name: 'Стейк Рибай',
    description: 'Сочный стейк из мраморной говядины с овощами гриль',
    price: 1850,
    image: '/images/gourmet-steak.jpg',
    category: 'Основные блюда',
    tags: ['popular', 'meat'],
    ingredients: ['Говядина рибай 300г', 'Овощи гриль', 'Соус демиглас', 'Специи'],
    allergens: []
  },
  {
    id: '2',
    name: 'Паста Карбонара',
    description: 'Классическая итальянская паста с беконом и сливочным соусом',
    price: 890,
    image: '/images/fresh-pasta.jpg',
    category: 'Основные блюда',
    tags: ['popular'],
    ingredients: ['Спагетти', 'Бекон', 'Яйца', 'Пармезан', 'Сливки'],
    allergens: ['Глютен', 'Яйца', 'Молочные продукты']
  },
  {
    id: '3',
    name: 'Лосось на гриле',
    description: 'Филе норвежского лосося с киноа и лимонным соусом',
    price: 1450,
    image: '/images/salmon-fillet.jpg',
    category: 'Основные блюда',
    tags: ['healthy', 'fish'],
    ingredients: ['Филе лосося 250г', 'Киноа', 'Лимонный соус', 'Шпинат', 'Оливковое масло'],
    allergens: ['Рыба']
  },
  {
    id: '4',
    name: 'Зелёный салат',
    description: 'Микс свежих овощей с авокадо и бальзамической заправкой',
    price: 650,
    image: '/images/vegetable-salad.jpg',
    category: 'Салаты',
    tags: ['vegetarian', 'healthy', 'vegan'],
    ingredients: ['Салат романо', 'Авокадо', 'Огурцы', 'Помидоры черри', 'Бальзамический уксус', 'Оливковое масло'],
    allergens: []
  },
  {
    id: '5',
    name: 'Куриная грудка',
    description: 'Нежная куриная грудка на гриле с овощами и рисом басмати',
    price: 790,
    image: '/images/grilled-chicken.jpg',
    category: 'Основные блюда',
    tags: ['healthy', 'meat'],
    ingredients: ['Куриная грудка 200г', 'Рис басмати', 'Цукини', 'Морковь', 'Специи'],
    allergens: []
  },
  {
    id: '6',
    name: 'Шоколадный торт',
    description: 'Богатый шоколадный торт с ганашем и свежими ягодами',
    price: 550,
    image: '/images/chocolate-cake.jpg',
    category: 'Десерты',
    tags: ['dessert', 'popular'],
    ingredients: ['Темный шоколад', 'Яйца', 'Сахар', 'Сливочное масло', 'Мука', 'Ягоды'],
    allergens: ['Глютен', 'Яйца', 'Молочные продукты']
  },
  {
    id: '7',
    name: 'Тирамису',
    description: 'Классический итальянский десерт с маскарпоне и кофе',
    price: 490,
    image: '/images/tiramisu.jpg',
    category: 'Десерты',
    tags: ['dessert', 'popular'],
    ingredients: ['Маскарпоне', 'Савоярди', 'Эспрессо', 'Яйца', 'Какао', 'Сахар'],
    allergens: ['Глютен', 'Яйца', 'Молочные продукты']
  },
  {
    id: '8',
    name: 'Том Ям',
    description: 'Острый тайский суп с креветками и грибами',
    price: 720,
    image: '/images/smoothie.jpg',
    category: 'Супы',
    tags: ['spicy', 'seafood', 'healthy'],
    ingredients: ['Креветки', 'Грибы', 'Лемонграсс', 'Перец чили', 'Лайм', 'Кокосовое молоко'],
    allergens: ['Морепродукты']
  }
];
