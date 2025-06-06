
import { searchProducts, getCategories, getBrands, mockProducts } from '@/data/mockProducts';
import { Product } from '@/types/Product';

interface ChatResponse {
  text: string;
  products?: Product[];
}

export const processChatMessage = async (message: string): Promise<ChatResponse> => {
  // Simulate API processing delay
  await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));

  const lowerMessage = message.toLowerCase();
  
  // Greeting patterns
  if (lowerMessage.match(/^(hi|hello|hey|good morning|good afternoon|good evening)/)) {
    return {
      text: "Hello! I'm here to help you find the perfect tech products. What are you looking for today?"
    };
  }

  // Help patterns
  if (lowerMessage.includes('help') || lowerMessage.includes('what can you do')) {
    return {
      text: "I can help you with:\n• Finding products by name, category, or brand\n• Filtering by price range\n• Comparing different products\n• Getting detailed product information\n• Checking availability and stock\n\nTry asking something like 'Show me laptops under $1500' or 'What Apple products do you have?'"
    };
  }

  // Category queries
  const categories = getCategories();
  for (const category of categories) {
    if (lowerMessage.includes(category.toLowerCase())) {
      const products = searchProducts('', { category });
      return {
        text: `Here are our ${category.toLowerCase()} products:`,
        products
      };
    }
  }

  // Brand queries
  const brands = getBrands();
  for (const brand of brands) {
    if (lowerMessage.includes(brand.toLowerCase())) {
      const products = searchProducts('', { brand });
      return {
        text: `Here are our ${brand} products:`,
        products
      };
    }
  }

  // Price range queries
  const priceMatch = lowerMessage.match(/under\s+\$?(\d+)|below\s+\$?(\d+)|less\s+than\s+\$?(\d+)/);
  if (priceMatch) {
    const maxPrice = parseInt(priceMatch[1] || priceMatch[2] || priceMatch[3]);
    const products = searchProducts('', { maxPrice });
    return {
      text: `Here are products under $${maxPrice}:`,
      products
    };
  }

  const expensiveMatch = lowerMessage.match(/over\s+\$?(\d+)|above\s+\$?(\d+)|more\s+than\s+\$?(\d+)/);
  if (expensiveMatch) {
    const minPrice = parseInt(expensiveMatch[1] || expensiveMatch[2] || expensiveMatch[3]);
    const products = searchProducts('', { minPrice });
    return {
      text: `Here are products over $${minPrice}:`,
      products
    };
  }

  // Range queries
  const rangeMatch = lowerMessage.match(/between\s+\$?(\d+)\s+and\s+\$?(\d+)|from\s+\$?(\d+)\s+to\s+\$?(\d+)/);
  if (rangeMatch) {
    const minPrice = parseInt(rangeMatch[1] || rangeMatch[3]);
    const maxPrice = parseInt(rangeMatch[2] || rangeMatch[4]);
    const products = searchProducts('', { minPrice, maxPrice });
    return {
      text: `Here are products between $${minPrice} and $${maxPrice}:`,
      products
    };
  }

  // Recommendation queries
  if (lowerMessage.includes('recommend') || lowerMessage.includes('suggest') || lowerMessage.includes('best')) {
    const highRatedProducts = mockProducts
      .filter(p => p.rating >= 4.5)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 6);
    
    return {
      text: "Here are our top-rated products that I'd recommend:",
      products: highRatedProducts
    };
  }

  // Availability queries
  if (lowerMessage.includes('available') || lowerMessage.includes('in stock')) {
    const availableProducts = mockProducts.filter(p => p.inStock);
    return {
      text: "Here are all our currently available products:",
      products: availableProducts
    };
  }

  // General search
  const products = searchProducts(message);
  
  if (products.length > 0) {
    return {
      text: `I found ${products.length} product${products.length === 1 ? '' : 's'} matching your search:`,
      products
    };
  }

  // No results
  return {
    text: "I couldn't find any products matching your search. Try searching for specific categories like 'laptops', 'smartphones', 'audio', or 'tablets'. You can also ask about specific brands like 'Apple', 'Samsung', 'Sony', or 'Dell'."
  };
};
