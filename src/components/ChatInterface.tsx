
import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { User } from '@/types/User';
import { LogOut, Send, RotateCcw, Search, Filter } from 'lucide-react';
import ChatMessage from './ChatMessage';
import ProductCard from './ProductCard';
import CartSidebar from './CartSidebar';
import { processChatMessage } from '@/utils/chatProcessor';
import { searchProducts, getCategories, getBrands } from '@/data/mockProducts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
  products?: any[];
}

interface ChatInterfaceProps {
  user: User;
  onLogout: () => void;
}

const ChatInterface = ({ user, onLogout }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 5000 });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const categories = getCategories();
  const brands = getBrands();

  useEffect(() => {
    const savedMessages = localStorage.getItem('chat_history');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else {
      const welcomeMessage: Message = {
        id: '1',
        text: `Welcome ${user.name}! I'm your shopping assistant. I can help you find products, answer questions about our inventory, and assist with your shopping needs. Try asking me something like "Show me laptops" or "Find Apple products"!`,
        isUser: false,
        timestamp: new Date().toISOString(),
      };
      setMessages([welcomeMessage]);
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('chat_history', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await processChatMessage(inputValue);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.text,
        isUser: false,
        timestamp: new Date().toISOString(),
        products: response.products,
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error. Please try again.',
        isUser: false,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    const filters = {
      category: selectedCategory === 'all' ? undefined : selectedCategory,
      brand: selectedBrand === 'all' ? undefined : selectedBrand,
      minPrice: priceRange.min,
      maxPrice: priceRange.max,
    };

    const products = searchProducts(searchQuery, filters);
    
    const searchMessage: Message = {
      id: Date.now().toString(),
      text: searchQuery ? `Search results for "${searchQuery}"` : 'Here are the filtered products:',
      isUser: false,
      timestamp: new Date().toISOString(),
      products: products,
    };

    setMessages(prev => [...prev, searchMessage]);
  };

  const resetChat = () => {
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      text: `Chat reset! How can I help you today, ${user.name}?`,
      isUser: false,
      timestamp: new Date().toISOString(),
    };
    setMessages([welcomeMessage]);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedBrand('all');
    setPriceRange({ min: 0, max: 5000 });
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="border-b bg-card p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary">E-Commerce Assistant</h1>
            <p className="text-sm text-muted-foreground">
              Logged in as {user.name} • {new Date(user.loginTime).toLocaleString()}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <CartSidebar />
            <Button variant="outline" onClick={resetChat}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset Chat
            </Button>
            <Button variant="outline" onClick={onLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="border-b bg-card p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-64">
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedBrand} onValueChange={setSelectedBrand}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Brand" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Brands</SelectItem>
              {brands.map(brand => (
                <SelectItem key={brand} value={brand}>{brand}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button onClick={handleSearch}>
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>

          <Button variant="outline" onClick={clearFilters}>
            <Filter className="h-4 w-4 mr-2" />
            Clear
          </Button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className="space-y-4">
            <ChatMessage message={message} />
            {message.products && message.products.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ml-12">
                {message.products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-lg p-4 max-w-xs">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                <span className="text-sm">Thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <div className="border-t bg-card p-4">
        <div className="flex space-x-2">
          <Input
            placeholder="Type your message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            disabled={isLoading}
          />
          <Button onClick={handleSendMessage} disabled={isLoading || !inputValue.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
