/**
 * KUMBH SARTHI - AI Pilgrim Assistant ("AI Sarthi")
 */

import React, { useState } from 'react';
import { Bot, Send, X, Sparkles, Volume2, ShieldAlert } from 'lucide-react';
import { TRANSLATIONS } from '../lib/translations';

interface AiSarthiAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'en' | 'hi' | 'mr';
}

export const AiSarthiAssistant: React.FC<AiSarthiAssistantProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  const [messages, setMessages] = useState<
    { sender: 'user' | 'bot'; text: string; source?: string }[]
  >([
    {
      sender: 'bot',
      text:
        language === 'hi'
          ? 'जय श्री राम! मैं कुम्भ सारथी एआई सहायक हूँ। मैं आपको शाही स्नान समय, सुरक्षित मार्ग, अन्नछत्र एवं आपातकालीन सेवाओं की जानकारी दे सकता हूँ। आप क्या पूछना चाहते हैं?'
          : language === 'mr'
          ? 'नमस्कार! मी कुंभ सारथी AI सहाय्यक आहे. मी तुम्हाला शाही स्नान वेळापत्रक, सुरक्षित मार्ग आणि सुविधांबद्दल मदत करू शकतो. मी तुम्हाला कशी मदत करू?'
          : 'Greetings! I am Kumbh Sarthi AI Assistant. I can help you with Shahi Snan timings, safe low-crowd routes, free food hubs, and emergency help in Nashik. How may I assist your holy pilgrimage today?',
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [loading, setLoading] = useState(false);

  const t = TRANSLATIONS[language];

  const quickQuestions = [
    'What are the auspicious Shahi Snan dates?',
    'Which route to Ramkund has lowest crowd?',
    'Where is free food (Annachatra) near Panchavati?',
    'What are the emergency helpline numbers?',
  ];

  const handleSend = async (textToSend?: string) => {
    const prompt = textToSend || inputPrompt;
    if (!prompt.trim()) return;

    const userMsg = { sender: 'user' as const, text: prompt };
    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/guide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          language,
        }),
      });

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: data.reply || 'Kumbh Sarthi is always ready to guide you.',
          source: data.source,
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: 'Panchavati and Ramkund Ghat medical and police posts are operational 24x7. For emergency dispatch call 112 or 108.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-slate-900 border border-amber-500/40 rounded-t-3xl sm:rounded-3xl w-full max-w-lg h-[85vh] sm:h-[650px] flex flex-col shadow-2xl overflow-hidden">
        {/* Top Header Bar */}
        <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 p-4 flex items-center justify-between text-white shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-950 flex items-center justify-center text-amber-400 font-bold">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm flex items-center space-x-1">
                <span>AI KUMBH SARTHI</span>
                <Sparkles className="w-3.5 h-3.5" />
              </h3>
              <p className="text-[10px] text-amber-100 uppercase tracking-widest font-mono">
                Multilingual AI Pilgrim Assistant
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-900/40 rounded-full transition text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message History */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-950/80 text-xs">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-orange-500 text-slate-950 font-semibold rounded-br-none'
                    : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none shadow-md'
                }`}
              >
                <p>{m.text}</p>
                {m.source && (
                  <p className="text-[9px] text-amber-400/80 mt-1 font-mono">
                    Powered by {m.source}
                  </p>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center space-x-2 text-slate-400 text-xs py-2">
              <Bot className="w-4 h-4 animate-bounce text-amber-400" />
              <span>AI Sarthi is generating guidance...</span>
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-2.5 bg-slate-900 border-t border-slate-800 flex items-center space-x-2 overflow-x-auto scrollbar-none shrink-0">
          {quickQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSend(q)}
              className="text-[10px] bg-slate-800 hover:bg-slate-700 text-amber-300 px-3 py-1.5 rounded-full border border-slate-700 whitespace-nowrap transition"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Prompt Input Footer */}
        <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center space-x-2 shrink-0">
          <input
            type="text"
            placeholder="Ask AI Sarthi about Snan, routes, food, emergency..."
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-orange-500"
          />
          <button
            onClick={() => handleSend()}
            disabled={loading}
            className="p-2.5 bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold rounded-xl transition shadow"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
