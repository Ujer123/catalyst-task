export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface Category {
  slug: string;
  name: string;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  image: string;
}

export interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
}

export interface CartItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
  thumbnail?: string;
  images?: string[];
}

export interface CartState {
  cart: CartItem[];
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  category?: string;
  limit: string | number;
  q?: string;
}

export interface ProductGridProps {
  products: Product[];
}

export interface CategoryFilterProps {
  categories: Category[];
}

export interface AddToCartButtonProps {
  product: Product;
}