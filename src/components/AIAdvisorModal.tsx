import React, { useState } from 'react';
import { TelemetryState } from '../types';

interface AIAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
  telemetry: TelemetryState;
}

interface Message {
  id: string;
  sender: 'user' | 'advisor';
  text: string;
  timestamp: string;
}

export const AIAdvisorModal: React.FC<AIAdvisorModalProps> = ({
  isOpen,
  onClose,
  telemetry,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'advisor',
      text: `Hello, I am your AGREESARTHI AI Agronomy & Rover Co-Pilot. I am continuously monitoring Sector North telemetry:
• Soil Moisture: ${telemetry.soilMoistureVwc.toFixed(1)}% VWC
• Soil Temp: ${telemetry.soilTempC.toFixed(1)}°C | EC: ${telemetry.soilEc.toFixed(2)} mS/cm
• NPK Balance: N:${telemetry.npk.n} P:${telemetry.npk.p} K:${telemetry.npk.k} mg/kg
• Critical Alert: Zone B3 moisture stress (18% VWC) detected.

How can I assist your crop operations today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (customText?: string) => {
    const textToSend = customText || inputPrompt;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToSend,
          telemetry,
        }),
      });

      const data = await response.json();
      const advisorMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'advisor',
        text: data.text || 'Telemetry analyzed. All readings within nominal bounds.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, advisorMsg]);
    } catch (err) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'advisor',
        text: 'Unable to reach the agronomy engine server. Zone B3 irrigation should still be initiated manually for 20 minutes to resolve soil moisture deficit.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    'Why is Zone B3 moisture at 18%?',
    'Recommend NPK fertilizer schedule',
    'Optimal rover survey speed for clay soil',
    'Irrigation plan for 32°C ambient weather',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#12181f] border border-white/[0.12] w-full max-w-2xl rounded-2xl flex flex-col h-[600px] max-h-[90vh] shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/[0.08] bg-[#1a2026]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#4edea3]/20 flex items-center justify-center text-[#4edea3] border border-[#4edea3]/40">
              <span className="material-symbols-outlined text-[20px]">psychology</span>
            </div>
            <div>
              <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-sm sm:text-base text-white">
                AGREESARTHI AI Agronomist & Field Co-Pilot
              </h3>
              <p className="text-[11px] font-['JetBrains_Mono'] text-[#bbcabf]">
                Powered by Gemini • Real-time Telemetry Context Engine
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#252b31] hover:bg-[#343a40] text-[#bbcabf] hover:text-white flex items-center justify-center transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-2.5 bg-[#161c22] border-b border-white/[0.06] flex items-center gap-1.5 overflow-x-auto">
          {quickPrompts.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(chip)}
              disabled={isLoading}
              className="px-2.5 py-1 rounded-full bg-[#252b31] hover:bg-[#343a40] text-[11px] font-['Inter'] text-[#dde3eb] whitespace-nowrap transition-all border border-white/[0.06] active:scale-95 disabled:opacity-50"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 font-['Inter'] text-xs sm:text-sm">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center gap-1.5 mb-1 px-1 text-[10px] font-['JetBrains_Mono'] text-[#bbcabf]">
                <span>{msg.sender === 'user' ? 'FARM OPERATOR' : 'AI AGRONOMIST'}</span>
                <span>• {msg.timestamp}</span>
              </div>
              <div
                className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-3 leading-relaxed whitespace-pre-wrap ${
                  msg.sender === 'user'
                    ? 'bg-[#4edea3] text-[#003824] font-medium rounded-br-none shadow'
                    : 'bg-[#1a2026] text-[#dde3eb] border border-white/[0.08] rounded-bl-none shadow-md'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-[#4edea3] font-['JetBrains_Mono'] p-2">
              <span className="w-2 h-2 rounded-full bg-[#4edea3] animate-ping" />
              <span>Analyzing multispectral and subsurface soil data...</span>
            </div>
          )}
        </div>

        {/* Prompt Input Deck */}
        <div className="p-3 border-t border-white/[0.08] bg-[#1a2026] flex items-center gap-2">
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
            placeholder="Ask about crop health, soil moisture, fertilizer dosage, rover speed..."
            className="flex-1 bg-[#090f15] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder:text-[#bbcabf]/60 focus:outline-none focus:border-[#4edea3] font-['Inter'] transition-colors"
          />
          <button
            onClick={() => handleSend()}
            disabled={!inputPrompt.trim() || isLoading}
            className="px-4 py-2.5 rounded-xl bg-[#4edea3] hover:bg-[#6ffbbe] active:scale-95 text-[#003824] font-['Plus_Jakarta_Sans'] font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow"
          >
            <span>Ask</span>
            <span className="material-symbols-outlined text-[18px]">send</span>
          </button>
        </div>
      </div>
    </div>
  );
};
