import React, { useState, useRef, useEffect } from 'react';
import { Send, Settings, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Message } from '../types';
import AuthModal from './AuthModal';
import toast from 'react-hot-toast';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

interface ChatInterfaceProps {
  onToggleSettings: () => void;
}

export default function ChatInterface({ onToggleSettings }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateResponse = async (userMessage: string) => {
    try {
      // Convert Date objects to ISO strings before sending
      const serializedHistory = messages.slice(-5).map(m => ({
        role: m.role,
        content: m.content
      }));

      const response = await axios.post('http://localhost:5000/api/chat', {
        message: userMessage,
        history: serializedHistory
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      return response.data.message;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error || 'Failed to generate response';
        toast.error(errorMessage);
      } else {
        toast.error('An unexpected error occurred');
      }
      throw error;
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    if (messageCount >= 5 && !localStorage.getItem('token')) {
      setShowAuthModal(true);
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setMessageCount(prev => prev + 1);
    setIsLoading(true);

    try {
      const aiResponse = await generateResponse(input);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        role: 'assistant',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      // Error is already handled in generateResponse
      console.error('Chat error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthSuccess = (token: string) => {
    localStorage.setItem('token', token);
    toast.success('Welcome! You now have unlimited access to Wingman');
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto bg-white rounded-lg shadow-2xl overflow-hidden">
      <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-8 h-8 text-white" />
          <h1 className="text-2xl font-bold text-white">Wingman </h1>
        </div>
        <button
          onClick={onToggleSettings}
          className="text-white hover:text-blue-200 transition-colors"
        >
          <Settings className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <h2 className="text-xl font-semibold text-gray-700">Welcome to Wingman </h2>
              <p>Start your journey to better conversations and connections.</p>
              <p className="text-sm">Ask me anything about dating, flirting, or relationship advice!</p>
            </motion.div>
          </div>
        )}
        
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-4 rounded-2xl shadow-md ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                    : 'bg-white text-gray-800'
                }`}
              >
                
<div className="leading-relaxed">
  <ReactMarkdown>{message.content}</ReactMarkdown>
</div>
                <span className="text-xs opacity-75 mt-2 block">
                  {formatTime(message.timestamp)}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      <div className="p-6 border-t bg-white">
        <form onSubmit={handleSend} className="space-y-4">
          <div className="flex space-x-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask for dating advice or flirting tips..."
              className="flex-1 p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50"
              disabled={isLoading}
            />
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={isLoading}
              className={`p-4 rounded-xl shadow-md ${
                isLoading
                  ? 'bg-gray-400'
                  : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
              } text-white focus:outline-none focus:ring-2 focus:ring-purple-500`}
            >
              <Send className="w-5 h-5" />
            </motion.button>
          </div>
          {messageCount > 0 && messageCount < 5 && !localStorage.getItem('token') && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-sm text-gray-600"
            >
              {5 - messageCount} free messages remaining. Sign up for unlimited access!
            </motion.p>
          )}
        </form>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
}