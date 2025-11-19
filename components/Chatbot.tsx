import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Minimize2, Maximize2 } from 'lucide-react';
import { ChatMessage } from '../types';

export const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      text: "Hi there! 👋 I'm the Diamond D virtual assistant. How can I help you with your vehicle today?",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen, isMinimized]);

  const getBotResponse = (text: string): string => {
    const lower = text.toLowerCase();
    if (lower.includes('service') || lower.includes('oil') || lower.includes('what do you do')) {
      return "We offer premium oil changes with Amsoil and Mobil 1 synthetic oils, general maintenance, and DOT/Commercial inspections (Gilmer location only).";
    } 
    if (lower.includes('price') || lower.includes('cost') || lower.includes('how much')) {
      return "For the most current pricing, please give us a call. We offer competitive rates and premium service quality!";
    } 
    if (lower.includes('location') || lower.includes('address') || lower.includes('where')) {
      return "We have two locations: Gilmer (1125 US Hwy 271 S) and Longview (2903 Estes Pkwy). Both are open Mon-Sat.";
    } 
    if (lower.includes('hours') || lower.includes('open')) {
      return "Both locations are open Mon-Fri: 8AM-5PM, Sat: 8AM-12PM. We are closed on Sundays.";
    } 
    if (lower.includes('schedule') || lower.includes('appointment')) {
      return "You can drive up anytime for service! For our Pickup Service (within 15 miles), you can schedule online via the 'Book Now' buttons on our site.";
    }
    if (lower.includes('inspection') || lower.includes('dot')) {
      return "DOT/Commercial vehicle inspections are available exclusively at our Gilmer location. We have licensed inspectors available.";
    }
    return "I'd be happy to help! I can provide info about our services, locations, hours, or scheduling. Or call us directly at (903) 843-4494.";
  };

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      text: input,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Simulate network delay
    setTimeout(() => {
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(userMsg.text),
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
    }, 600);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-brand-red text-white p-4 rounded-full shadow-lg hover:bg-brand-darkRed transition-all z-50 animate-bounce"
        aria-label="Open Chat"
      >
        <MessageCircle size={28} />
      </button>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 bg-white rounded-xl shadow-2xl z-50 border border-gray-200 flex flex-col transition-all duration-300 ${isMinimized ? 'w-72 h-16' : 'w-80 sm:w-96 h-[500px] max-h-[80vh]'}`}>
      {/* Header */}
      <div className="bg-brand-red text-white p-4 rounded-t-xl flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2">
          <MessageCircle size={20} />
          <span className="font-semibold">Diamond D Assistant</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setIsMinimized(!isMinimized)} className="hover:text-gray-200">
            {isMinimized ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
          </button>
          <button onClick={() => setIsOpen(false)} className="hover:text-gray-200">
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Body */}
      {!isMinimized && (
        <>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg text-sm ${
                    msg.isBot
                      ? 'bg-white text-gray-800 border border-gray-200 rounded-tl-none shadow-sm'
                      : 'bg-brand-red text-white rounded-tr-none shadow-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-200 shrink-0">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about hours, services..."
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red"
              />
              <button
                type="submit"
                className="bg-brand-red text-white p-2 rounded-full hover:bg-brand-darkRed transition-colors"
                disabled={!input.trim()}
              >
                <Send size={18} />
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};
