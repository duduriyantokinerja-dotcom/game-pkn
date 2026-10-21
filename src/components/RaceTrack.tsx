import React from 'react';
import { Player, TargetRunner, ChatMessage } from '../types/game';

interface RaceTrackProps {
  players: Player[];
  targetRunner: TargetRunner;
  recentMessages: ChatMessage[];
  currentLeaderId: number | null;
}

export const RaceTrack: React.FC<RaceTrackProps> = ({
  players,
  targetRunner,
  recentMessages,
  currentLeaderId,
}) => {
  // Find highest distance among players to dynamically scale the track
  const maxDistance = Math.max(
    targetRunner.distance,
    ...players.map((p) => p.distance),
    300
  );

  // Helper to calculate % position on track
  const getPositionPercent = (dist: number) => {
    // Leave margin at edges (5% to 92%)
    const pct = 5 + (dist / (maxDistance + 60)) * 87;
    return Math.min(95, Math.max(4, pct));
  };

  return (
    <div className="relative w-full bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border-y border-slate-800 p-3 sm:p-4 overflow-hidden shadow-2xl select-none">
      {/* Dynamic Background Track Details */}
      <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px]"></div>

      {/* Track HUD Header */}
      <div className="flex items-center justify-between text-xs text-slate-400 mb-2 relative z-10 px-2 font-mono">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
          <span className="font-bold text-slate-200">ARENA KEJAR-KEJARAN (CATCH ME IF YOU CAN)</span>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <span>Garis Start (0m)</span>
          <span className="text-amber-400 font-bold">Target Terkejar: {Math.round(targetRunner.distance)}m</span>
        </div>
      </div>

      {/* Main Track Surface */}
      <div className="relative bg-slate-900/80 rounded-2xl border border-slate-700/60 p-2 sm:p-3 overflow-hidden shadow-inner">
        {/* Track Line Markings */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
          {[...Array(players.length + 1)].map((_, i) => (
            <div key={i} className="border-b border-dashed border-slate-400 w-full h-full" />
          ))}
        </div>

        {/* Vertical Distance Markers */}
        <div className="absolute inset-y-0 left-[25%] border-r border-slate-800/80 pointer-events-none"></div>
        <div className="absolute inset-y-0 left-[50%] border-r border-slate-800/80 pointer-events-none"></div>
        <div className="absolute inset-y-0 left-[75%] border-r border-slate-800/80 pointer-events-none"></div>

        {/* Lanes Container */}
        <div className="relative space-y-3 sm:space-y-4 py-1">
          {/* Target Runner Lane (The Mascot to Catch) */}
          <div className="relative h-12 flex items-center bg-amber-950/20 rounded-xl px-2 border border-amber-500/20">
            <span className="absolute left-2 text-[10px] font-bold text-amber-500/70 uppercase tracking-wider font-mono">
              TARGET PELARI UTAMA
            </span>

            {/* Target Mascot Runner */}
            <div
              className="absolute transition-all duration-700 ease-out flex items-center z-20"
              style={{ left: `${getPositionPercent(targetRunner.distance)}%` }}
            >
              <div className="relative flex flex-col items-center -translate-x-1/2">
                {/* Crown / Golden Marker */}
                <div className="text-[10px] font-black bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 px-2 py-0.5 rounded-full shadow-lg shadow-amber-500/30 whitespace-nowrap animate-bounce flex items-center gap-1">
                  👑 <span>{targetRunner.name}</span>
                </div>
                {/* Target Avatar */}
                <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 border-2 border-white shadow-xl flex items-center justify-center text-xl">
                  {targetRunner.avatar}
                  <div className="absolute -bottom-1 -right-1 text-[10px] bg-slate-950 text-amber-400 font-bold px-1 rounded border border-amber-500/40">
                    {Math.round(targetRunner.distance)}m
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Active Players Lanes (1 to 5) */}
          {players.map((player, idx) => {
            const isLeader = player.id === currentLeaderId;
            const isFrozen = player.activeEffects.frozenUntil > Date.now();
            const isShielded = player.activeEffects.shieldUntil > Date.now();
            const isTurbo = player.activeEffects.turboUntil > Date.now();
            const distPercent = getPositionPercent(player.distance);

            // Check if there is a recent chat message from this player
            const playerMsg = recentMessages.find(
              (m) => m.playerId === player.id && Date.now() - m.timestamp < 4500
            );

            return (
              <div
                key={player.id}
                className="relative h-12 sm:h-14 flex items-center rounded-xl px-2 transition-all duration-300"
                style={{
                  backgroundColor: `${player.color}15`,
                  borderColor: `${player.color}40`,
                  borderWidth: '1px',
                }}
              >
                {/* Lane Label */}
                <div className="absolute left-2 flex items-center gap-1.5 z-0 opacity-80">
                  <span
                    className="w-4 h-4 rounded text-[10px] font-bold flex items-center justify-center text-white"
                    style={{ backgroundColor: player.color }}
                  >
                    {idx + 1}
                  </span>
                  <span className="text-[11px] font-bold text-slate-300 truncate max-w-[80px] sm:max-w-[120px]">
                    {player.name}
                  </span>
                  {player.streak >= 2 && (
                    <span className="text-[10px] font-black text-amber-400 animate-pulse">
                      🔥 {player.streak}x
                    </span>
                  )}
                </div>

                {/* Runner Avatar & Effects Container */}
                <div
                  className="absolute transition-all duration-700 ease-out flex items-center z-20"
                  style={{ left: `${distPercent}%` }}
                >
                  <div className="relative flex flex-col items-center -translate-x-1/2">
                    {/* Floating Speech Bubble from Chat */}
                    {playerMsg && (
                      <div className="absolute -top-9 z-30 animate-in fade-in zoom-in-75 duration-200">
                        <div
                          className="px-2.5 py-1 rounded-xl text-xs font-bold text-white shadow-lg whitespace-nowrap border flex items-center gap-1"
                          style={{
                            backgroundColor: player.color,
                            borderColor: '#ffffff',
                          }}
                        >
                          <span>{playerMsg.text}</span>
                        </div>
                        <div
                          className="w-2 h-2 mx-auto rotate-45 -mt-1"
                          style={{ backgroundColor: player.color }}
                        />
                      </div>
                    )}

                    {/* Leader Star */}
                    {isLeader && !playerMsg && (
                      <div className="text-[10px] font-bold bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded-full shadow mb-0.5 whitespace-nowrap">
                        ⭐ Memimpin ({Math.round(player.distance)}m)
                      </div>
                    )}

                    {/* Main Character Node */}
                    <div
                      className={`relative w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-lg sm:text-xl border-2 shadow-lg transition-transform ${
                        player.lastAnswerStatus === 'correct'
                          ? 'scale-125 duration-300 ring-4 ring-emerald-400'
                          : player.lastAnswerStatus === 'wrong'
                          ? 'animate-shake ring-4 ring-red-400'
                          : ''
                      } ${isTurbo ? 'animate-bounce' : ''}`}
                      style={{
                        backgroundColor: player.color,
                        borderColor: '#ffffff',
                      }}
                    >
                      {/* Character Avatar */}
                      <span>{player.avatar}</span>

                      {/* Effects Overlays */}
                      {isFrozen && (
                        <div className="absolute inset-0 bg-cyan-400/60 rounded-full flex items-center justify-center text-xs animate-pulse">
                          ❄️
                        </div>
                      )}
                      {isShielded && (
                        <div className="absolute -inset-1 rounded-full border-2 border-amber-300 bg-amber-300/20 animate-spin" />
                      )}
                      {isTurbo && (
                        <div className="absolute -left-3 text-sm animate-ping">
                          🚀
                        </div>
                      )}
                    </div>

                    {/* Distance Meter Label */}
                    <div className="text-[9px] font-mono font-bold text-slate-300 bg-slate-950/80 px-1 rounded mt-0.5">
                      {Math.round(player.distance)}m
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
