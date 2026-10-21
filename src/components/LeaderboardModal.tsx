import React from 'react';
import { Player } from '../types/game';
import { Trophy, X, Target, Zap, CheckCircle2 } from 'lucide-react';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  players: Player[];
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  onClose,
  players,
}) => {
  if (!isOpen) return null;

  // Sort players by score descending (tie-break with distance)
  const sortedPlayers = [...players].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return b.distance - a.distance;
  });

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 0:
        return { label: '🥇 Juara 1', color: 'text-amber-400 bg-amber-400/20 border-amber-400/40' };
      case 1:
        return { label: '🥈 Juara 2', color: 'text-slate-300 bg-slate-300/20 border-slate-300/40' };
      case 2:
        return { label: '🥉 Juara 3', color: 'text-amber-700 bg-amber-700/20 border-amber-700/40' };
      default:
        return { label: `#${rank + 1}`, color: 'text-slate-400 bg-slate-800 border-slate-700' };
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 select-none animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Trophy size={22} />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">Klasemen Real-Time (Live Leaderboard)</h2>
              <p className="text-xs text-slate-400 font-medium">
                Kompetisi Kejaran & Jawaban PKn Kelas 7 SMP
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Players List Table */}
        <div className="p-6 overflow-y-auto space-y-3">
          {sortedPlayers.map((player, rank) => {
            const rankInfo = getRankBadge(rank);
            const accuracy =
              player.totalAnswers > 0
                ? Math.round((player.correctAnswers / player.totalAnswers) * 100)
                : 0;

            return (
              <div
                key={player.id}
                className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 p-3.5 rounded-2xl border transition-all hover:scale-[1.01]"
                style={{
                  backgroundColor: `${player.color}15`,
                  borderColor: `${player.color}50`,
                }}
              >
                {/* Left: Rank & Avatar & Name */}
                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs font-black px-2.5 py-1 rounded-lg border ${rankInfo.color}`}
                  >
                    {rankInfo.label}
                  </span>
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold shadow text-white shrink-0 border-2"
                    style={{
                      backgroundColor: player.color,
                      borderColor: '#ffffff',
                    }}
                  >
                    {player.avatar}
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-white leading-tight">
                      {player.name}
                    </h3>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono mt-0.5">
                      <span>Jarak: <strong className="text-slate-200">{Math.round(player.distance)}m</strong></span>
                      <span>·</span>
                      <span className="flex items-center gap-0.5 text-amber-300">
                        <Target size={12} /> {player.catchCount}x Catch
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Metrics & Score */}
                <div className="flex items-center gap-4 ml-auto">
                  <div className="text-right">
                    <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                      Akurasi
                    </div>
                    <div className="text-xs font-mono font-bold text-emerald-400 flex items-center justify-end gap-1">
                      <CheckCircle2 size={12} /> {accuracy}%
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                      Max Streak
                    </div>
                    <div className="text-xs font-mono font-bold text-amber-400 flex items-center justify-end gap-0.5">
                      <Zap size={12} /> {player.maxStreak}x
                    </div>
                  </div>

                  <div className="text-right pl-3 border-l border-slate-700/60 min-w-[75px]">
                    <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                      Total Skor
                    </div>
                    <div className="text-lg font-mono font-black text-amber-300 tabular-nums">
                      {player.score}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer with Developer Credit */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 text-center">
          <p className="text-xs text-slate-400">
            Game ini di kembangkan oleh <span className="text-amber-300 font-semibold">Dudu Riyanto SMP Negeri 2 samigaluh,</span>
          </p>
        </div>
      </div>
    </div>
  );
};
