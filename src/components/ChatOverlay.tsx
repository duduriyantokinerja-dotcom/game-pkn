import React, { useState } from 'react';
import { Player, ChatMessage } from '../types/game';
import { Send, X, Smile, MessageCircle } from 'lucide-react';
import { sound } from '../utils/audio';

interface ChatOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  players: Player[];
  messages: ChatMessage[];
  onSendMessage: (playerId: number, text: string) => void;
}

const QUICK_SHOUTS = [
  'Ayo kejar aku! 🏃‍♂️',
  'Pancasila Abadi! 🇮🇩',
  'Jawaban Cerdas! ⭐',
  'Awas tersalip! ⚡',
  'Hampir tertangkap! 💨',
  'Bhinneka Tunggal Ika! 🤝',
  'Semangat terus! 🔥',
  'Keren banget! 👏',
];

const EMOJI_LIST = ['🔥', '⚡', '🏆', '🏃‍♂️', '🦅', '🇮🇩', '👏', '🎯', '✨', '😎'];

export const ChatOverlay: React.FC<ChatOverlayProps> = ({
  isOpen,
  onClose,
  players,
  messages,
  onSendMessage,
}) => {
  const [selectedPlayerId, setSelectedPlayerId] = useState<number>(players[0]?.id || 1);
  const [inputText, setInputText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  if (!isOpen) return null;

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText.trim();
    if (!text) return;
    onSendMessage(selectedPlayerId, text);
    sound.playClick();
    if (!textToSend) {
      setInputText('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-slate-900/95 backdrop-blur-xl border-l border-slate-800 shadow-2xl flex flex-col justify-between select-none animate-in slide-in-from-right duration-300">
      {/* Chat Header */}
      <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
        <div className="flex items-center gap-2">
          <MessageCircle size={20} className="text-blue-400" />
          <h3 className="font-bold text-white text-base">Obrolan Siswa (IFP Chat)</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X size={20} />
        </button>
      </div>

      {/* Select Which Player is Speaking */}
      <div className="px-4 py-2 bg-slate-950/40 border-b border-slate-800/80">
        <div className="text-[11px] font-semibold text-slate-400 mb-1.5">
          Pilih Siswa yang Berbicara:
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {players.map((p) => {
            const isSelected = p.id === selectedPlayerId;
            return (
              <button
                key={p.id}
                onClick={() => setSelectedPlayerId(p.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
                  isSelected
                    ? 'ring-2 ring-white text-white shadow-md'
                    : 'opacity-60 hover:opacity-100 text-slate-300 bg-slate-800'
                }`}
                style={{
                  backgroundColor: isSelected ? p.color : undefined,
                }}
              >
                <span>{p.avatar}</span>
                <span className="truncate max-w-[80px]">{p.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Message History Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs">
            Belum ada interaksi. Kirim seruan cepat atau pesan untuk menyemangati teman!
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className="flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-200"
            >
              <div className="flex items-baseline gap-2 mb-0.5">
                <span
                  className="text-xs font-bold"
                  style={{ color: msg.playerColor }}
                >
                  {msg.playerName}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })}
                </span>
              </div>
              <div
                className="px-3 py-2 rounded-2xl text-xs sm:text-sm text-white font-medium shadow-sm max-w-[88%] break-words self-start border"
                style={{
                  backgroundColor: `${msg.playerColor}22`,
                  borderColor: `${msg.playerColor}60`,
                }}
              >
                {msg.text}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Quick Shouts Bar (Touch-Friendly for IFP) */}
      <div className="p-3 bg-slate-950/70 border-t border-slate-800">
        <div className="text-[11px] font-semibold text-slate-400 mb-1.5 flex items-center justify-between">
          <span>Seruan Cepat (Tap Langsung di IFP):</span>
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="text-slate-400 hover:text-amber-300 transition"
          >
            <Smile size={16} />
          </button>
        </div>

        {/* Emoji Bar */}
        {showEmojiPicker && (
          <div className="flex gap-2 overflow-x-auto pb-2 mb-2">
            {EMOJI_LIST.map((emo, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(emo)}
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-lg active:scale-90 transition"
              >
                {emo}
              </button>
            ))}
          </div>
        )}

        {/* Quick Shouts Buttons */}
        <div className="grid grid-cols-2 gap-1.5 mb-3">
          {QUICK_SHOUTS.map((shout, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(shout)}
              className="text-[11px] font-bold p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-500 transition active:scale-95 truncate text-left"
            >
              {shout}
            </button>
          ))}
        </div>

        {/* Custom Text Input */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ketik pesan interaksi..."
            maxLength={60}
            className="flex-1 bg-slate-800 text-white placeholder-slate-500 text-xs sm:text-sm px-3 py-2 rounded-xl border border-slate-700 focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={() => handleSend()}
            disabled={!inputText.trim()}
            className="p-2 sm:px-3 sm:py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white rounded-xl transition active:scale-95 flex items-center justify-center shadow"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
