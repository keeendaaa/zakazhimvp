export interface Nutrients {
  proteins: number;
  fats: number;
  carbs: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'appetizers' | 'soups' | 'mains' | 'desserts' | 'drinks';
  subcategory?: string;
  calories?: number;
  nutrients?: Nutrients;
  weight?: string;
  ingredients: string[];
  allergens?: string[];
  tags: string[];
  isFavorite?: boolean;
  isNew?: boolean;
  isPopular?: boolean;
}

export interface CartItem {
  item: MenuItem;
  quantity: number;
}

export type ViewMode = 'collections' | 'menu' | 'assistant' | 'cart';
