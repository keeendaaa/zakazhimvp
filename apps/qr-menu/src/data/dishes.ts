import { Dish } from '../types';

export const dishes: Dish[] = [
  {
    id: '1',
    name: 'Стейк Рибай',
    description: 'Сочный стейк из мраморной говядины с овощами гриль',
    price: 1850,
    image: 'https://images.unsplash.com/photo-1705755402973-009b7877a0f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb3VybWV0JTIwc3RlYWslMjBkaW5uZXJ8ZW58MXx8fHwxNzYwOTM3MDQyfDA&ixlib=rb-4.1.0&q=80&w=1080',
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
    image: 'https://images.unsplash.com/photo-1760390952710-b0e010ec4e50?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHBhc3RhJTIwZGlzaHxlbnwxfHx8fDE3NjA5NzUyMDd8MA&ixlib=rb-4.1.0&q=80&w=1080',
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
    image: 'https://images.unsplash.com/photo-1625229466790-62bae5ab4ff4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYWxtb24lMjBmaWxsZXQlMjBtZWFsfGVufDF8fHx8MTc2MDkwNzM2OXww&ixlib=rb-4.1.0&q=80&w=1080',
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
    image: 'https://images.unsplash.com/photo-1646487793655-bbf280273d2f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZWdldGFibGUlMjBzYWxhZCUyMGJvd2x8ZW58MXx8fHwxNzYwOTg0NTAyfDA&ixlib=rb-4.1.0&q=80&w=1080',
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
    image: 'https://images.unsplash.com/photo-1670398564097-0762e1b30b3a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmlsbGVkJTIwY2hpY2tlbiUyMGJyZWFzdHxlbnwxfHx8fDE3NjA5MDQyNDZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
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
    image: 'https://images.unsplash.com/photo-1736840334919-aac2d5af73e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaG9jb2xhdGUlMjBkZXNzZXJ0JTIwY2FrZXxlbnwxfHx8fDE3NjA5ODQ1MDJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
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
    image: 'https://images.unsplash.com/photo-1698688334089-c68105801d02?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aXJhbWlzdSUyMGRlc3NlcnR8ZW58MXx8fHwxNzYwOTY0MTA1fDA&ixlib=rb-4.1.0&q=80&w=1080',
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
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=1080',
    category: 'Супы',
    tags: ['spicy', 'seafood', 'healthy'],
    ingredients: ['Креветки', 'Грибы', 'Лемонграсс', 'Перец чили', 'Лайм', 'Кокосовое молоко'],
    allergens: ['Морепродукты']
  }
];
