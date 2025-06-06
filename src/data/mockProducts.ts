
import { Product } from '@/types/Product';

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'MacBook Pro 16-inch M3',
    price: 2499,
    category: 'Laptops',
    brand: 'Apple',
    description: 'Powerful laptop with M3 chip, perfect for professionals and creators.',
    image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=400&fit=crop',
    inStock: true,
    rating: 4.8,
    reviews: 1250,
    specs: {
      'Processor': 'Apple M3 Pro',
      'RAM': '16GB',
      'Storage': '512GB SSD',
      'Display': '16.2-inch Liquid Retina XDR'
    }
  },
  {
    id: '2',
    name: 'iPhone 15 Pro',
    price: 999,
    category: 'Smartphones',
    brand: 'Apple',
    description: 'Latest iPhone with titanium design and advanced camera system.',
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop',
    inStock: true,
    rating: 4.7,
    reviews: 2840,
    specs: {
      'Storage': '128GB',
      'Camera': '48MP Main',
      'Display': '6.1-inch Super Retina XDR',
      'Connectivity': '5G'
    }
  },
  {
    id: '3',
    name: 'Dell XPS 13 Plus',
    price: 1299,
    category: 'Laptops',
    brand: 'Dell',
    description: 'Ultra-thin laptop with stunning InfinityEdge display.',
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=400&fit=crop',
    inStock: true,
    rating: 4.5,
    reviews: 890,
    specs: {
      'Processor': 'Intel Core i7-1280P',
      'RAM': '16GB',
      'Storage': '512GB SSD',
      'Display': '13.4-inch OLED'
    }
  },
  {
    id: '4',
    name: 'Samsung Galaxy S24 Ultra',
    price: 1199,
    category: 'Smartphones',
    brand: 'Samsung',
    description: 'Premium Android phone with S Pen and exceptional camera.',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop',
    inStock: true,
    rating: 4.6,
    reviews: 1567,
    specs: {
      'Storage': '256GB',
      'Camera': '200MP Main',
      'Display': '6.8-inch Dynamic AMOLED 2X',
      'S Pen': 'Included'
    }
  },
  {
    id: '5',
    name: 'Sony WH-1000XM5',
    price: 399,
    category: 'Audio',
    brand: 'Sony',
    description: 'Industry-leading noise canceling wireless headphones.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
    inStock: true,
    rating: 4.8,
    reviews: 3245,
    specs: {
      'Battery Life': '30 hours',
      'Noise Canceling': 'Active',
      'Connectivity': 'Bluetooth 5.2',
      'Weight': '250g'
    }
  },
  {
    id: '6',
    name: 'iPad Pro 12.9-inch',
    price: 1099,
    category: 'Tablets',
    brand: 'Apple',
    description: 'Most advanced iPad with M2 chip and Liquid Retina XDR display.',
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop',
    inStock: false,
    rating: 4.7,
    reviews: 892,
    specs: {
      'Processor': 'Apple M2',
      'Storage': '128GB',
      'Display': '12.9-inch Liquid Retina XDR',
      'Apple Pencil': 'Compatible'
    }
  }
];

export const searchProducts = (query: string, filters?: { category?: string; minPrice?: number; maxPrice?: number; brand?: string }): Product[] => {
  let results = mockProducts;

  // Text search
  if (query.trim()) {
    const searchTerms = query.toLowerCase().split(' ');
    results = results.filter(product => 
      searchTerms.some(term => 
        product.name.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term) ||
        product.brand.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term)
      )
    );
  }

  // Apply filters
  if (filters) {
    if (filters.category) {
      results = results.filter(p => p.category.toLowerCase() === filters.category!.toLowerCase());
    }
    if (filters.brand) {
      results = results.filter(p => p.brand.toLowerCase() === filters.brand!.toLowerCase());
    }
    if (filters.minPrice !== undefined) {
      results = results.filter(p => p.price >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined) {
      results = results.filter(p => p.price <= filters.maxPrice!);
    }
  }

  return results;
};

export const getProductById = (id: string): Product | undefined => {
  return mockProducts.find(product => product.id === id);
};

export const getCategories = (): string[] => {
  return [...new Set(mockProducts.map(p => p.category))];
};

export const getBrands = (): string[] => {
  return [...new Set(mockProducts.map(p => p.brand))];
};
