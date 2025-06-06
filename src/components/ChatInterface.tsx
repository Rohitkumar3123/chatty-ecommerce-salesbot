
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { User } from '@/types/User';
import { Send, RotateCcw, LogOut, User as UserIcon } from 'lucide-react';
import ChatMessage from '@/components/ChatMessage';
import ProductCard from '@/components/ProductCard';
import { searchProducts, getCategories, getBrands } from '@/data/mockProducts';
import { Product } from '@/types/Product';
import { processChatMessage } from '@/utils/chatProcessor';

interface ChatInterfaceProps {
  user: User;
  onLogout: () => void;
}

export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
  products?: Product[];
}

const ChatInterface = ({ user, onLogout }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load chat history from localStorage
    const savedHistory = localStorage.getItem('chat_history');
    if (savedHistory) {
      setMessages(JSON.parse(savedHistory));
    } else {
      // Welcome message
      const welcomeMessage: Message = {
        id: '1',
        text: `Welcome ${user.name}! I'm your personal shopping assistant. I can help you find electronics, compare products, and answer questions about our inventory. Try asking me something like "Show me laptops under $1500" or "What smartphones do you have?"`,
        isUser: false,
        timestamp: new Date().toISOString()
      };
      setMessages([welcomeMessage]);
    }
  }, [user.name]);

  useEffect(() => {
    // Save chat history to localStorage
    if (messages.length > 0) {
      localStorage.setItem('chat_history', JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    // Scroll to bottom when new messages are added
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue.trim(),
      isUser: true,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Process the message and get response
    const response = await processChatMessage(inputValue.trim());
    
    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: response.text,
      isUser: false,
      timestamp: new Date().toISOString(),
      products: response.products
    };

    setMessages(prev => [...prev, botMessage]);
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const resetChat = () => {
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      text: `Chat reset! How can I help you find the perfect tech product today?`,
      isUser: false,
      timestamp: new Date().toISOString()
    };
    setMessages([welcomeMessage]);
    localStorage.removeItem('chat_history');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b shadow-sm p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-primary text-primary-foreground rounded-full p-2">
              <UserIcon className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-semibold">{user.name}</h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={resetChat}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset Chat
            </Button>
            <Button variant="outline" size="sm" onClick={onLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-w-6xl mx-auto w-full">
        {messages.map((message) => (
          <div key={message.id} className="animate-fade-in">
            <ChatMessage message={message} />
            {message.products && message.products.length > 0 && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {message.products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <Card className="p-4 bg-muted">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                <span className="text-sm">Assistant is typing...</span>
              </div>
            </Card>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t bg-white p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex space-x-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about products, compare items, or get recommendations..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={!inputValue.trim() || isLoading}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => setInputValue("Show me laptops under $1500")}>
              Laptops under $1500
            </Button>
            <Button variant="outline" size="sm" onClick={() => setInputValue("What smartphones do you have?")}>
              Smartphones
            </Button>
            <Button variant="outline" size="sm" onClick={() => setInputValue("Show me audio products")}>
              Audio Products
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
