
export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  brand: string;
  description: string;
  image: string;
  inStock: boolean;
  rating: number;
  reviews: number;
  specs: Record<string, string>;
}
