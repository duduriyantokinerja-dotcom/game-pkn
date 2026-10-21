import React from 'react';
import { Volume2, VolumeX, Maximize, Minimize, Trophy, MessageSquare, Play, Pause, RotateCcw } from 'lucide-react';
import { sound } from '../utils/audio';

interface HeaderProps {
  timeRemaining: number; // in seconds
  totalTime: number; // usually 300 (5 minutes)
  topicTitle: string;
  isPaused: boolean;
  onTogglePause: () => void;
  onOpenLeaderboard: () => void;
  onToggleChat: () => void;
  onResetGame: () => void;
  unreadChatCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  timeRemaining,
  totalTime,
  topicTitle,
  isPaused,
  onTogglePause,
  onOpenLeaderboard,
  onToggleChat,
  onResetGame,
  unreadChatCount,
}) => {
  const [isMuted, setIsMuted] = React.useState(sound.getMuted());
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
    if (!muted) sound.playClick();
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  const timeProgress = (timeRemaining / totalTime) * 100;
  const isUrgent = timeRemaining <= 60;

  return (
    <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-white px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-lg select-none">
      {/* Brand & Developer Credit */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-red-500 to-rose-600 flex items-center justify-center font-black text-xl shadow-md shadow-red-500/20 text-white shrink-0">
          ⚡
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-black tracking-tight text-white uppercase font-sans">
              Catch Me If You Can!
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase tracking-wider">
              PPKn Kelas 7 IFP
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium truncate max-w-[260px] sm:max-w-md">
            Materi: <span className="text-slate-200 font-semibold">{topicTitle}</span>
          </p>
        </div>
      </div>

      {/* Center: 5 Minutes Digital Countdown Timer */}
      <div className="flex items-center gap-3 bg-slate-950/80 px-4 py-1.5 rounded-xl border border-slate-800 shadow-inner">
        <div className="text-right">
          <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Sisa Waktu (5 Menit)
          </div>
          <div
            className={`font-mono text-xl sm:text-2xl font-black tracking-wider tabular-nums ${
              isUrgent ? 'text-red-400 animate-pulse' : 'text-amber-400'
            }`}
          >
            {formatTime(timeRemaining)}
          </div>
        </div>
        <div className="relative w-8 h-8 flex items-center justify-center">
          <svg className="w-8 h-8 transform -rotate-90">
            <circle
              cx="16"
              cy="16"
              r="13"
              stroke="currentColor"
              strokeWidth="3"
              fill="transparent"
              className="text-slate-800"
            />
            <circle
              cx="16"
              cy="16"
              r="13"
              stroke="currentColor"
              strokeWidth="3"
              fill="transparent"
              strokeDasharray={2 * Math.PI * 13}
              strokeDashoffset={2 * Math.PI * 13 * (1 - timeProgress / 100)}
              className={`transition-all duration-1000 ${
                isUrgent ? 'text-red-500' : 'text-amber-500'
              }`}
            />
          </svg>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        <button
          onClick={onTogglePause}
          title={isPaused ? 'Lanjutkan' : 'Jeda Permainan'}
          className="p-2 sm:px-3 sm:py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition flex items-center gap-1.5 text-xs font-semibold"
        >
          {isPaused ? <Play size={16} className="text-emerald-400" /> : <Pause size={16} />}
          <span className="hidden md:inline">{isPaused ? 'Lanjut' : 'Jeda'}</span>
        </button>

        <button
          onClick={onOpenLeaderboard}
          title="Klasemen Real-time"
          className="p-2 sm:px-3 sm:py-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 transition flex items-center gap-1.5 text-xs font-semibold"
        >
          <Trophy size={16} className="text-amber-400" />
          <span className="hidden md:inline">Klasemen</span>
        </button>

        <button
          onClick={onToggleChat}
          title="Obrolan Siswa / Shouts"
          className="relative p-2 sm:px-3 sm:py-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30 transition flex items-center gap-1.5 text-xs font-semibold"
        >
          <MessageSquare size={16} className="text-blue-400" />
          <span className="hidden md:inline">Chat</span>
          {unreadChatCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">
              {unreadChatCount}
            </span>
          )}
        </button>

        <button
          onClick={toggleSound}
          title={isMuted ? 'Nyalakan Suara' : 'Bisukan Suara'}
          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
        >
          {isMuted ? <VolumeX size={18} className="text-red-400" /> : <Volume2 size={18} className="text-emerald-400" />}
        </button>

        <button
          onClick={toggleFullscreen}
          title="Mode Layar Penuh IFP"
          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
        >
          {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
        </button>

        <button
          onClick={onResetGame}
          title="Mulai Ulang / Pilih Materi"
          className="p-2 rounded-lg bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-300 transition"
        >
          <RotateCcw size={18} />
        </button>
      </div>

      {/* Credit Bar Banner in Header */}
      <div className="w-full text-center py-0.5 border-t border-slate-800/80 mt-1">
        <p className="text-[11px] text-slate-400">
          Game ini di kembangkan oleh <span className="font-semibold text-amber-300">Dudu Riyanto SMP Negeri 2 samigaluh,</span>
        </p>
      </div>
    </header>
  );
};
