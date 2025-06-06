
import { Card } from '@/components/ui/card';
import { Message } from '@/components/ChatInterface';
import { Bot, User } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  return (
    <div className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex items-start space-x-3 max-w-2xl ${message.isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
        <div className={`rounded-full p-2 ${message.isUser ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
          {message.isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
        </div>
        <Card className={`p-4 ${message.isUser ? 'bg-primary text-primary-foreground' : 'bg-background'}`}>
          <p className="text-sm whitespace-pre-wrap">{message.text}</p>
          <p className={`text-xs mt-2 opacity-70`}>
            {new Date(message.timestamp).toLocaleTimeString()}
          </p>
        </Card>
      </div>
    </div>
  );
};

export default ChatMessage;
