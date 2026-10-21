import React from 'react';
import { Player, PlayMode, PowerUpType } from '../types/game';
import { Zap, Shield, Snowflake, Flame } from 'lucide-react';

interface PlayerStationsProps {
  players: Player[];
  playMode: PlayMode;
  onPlayerAnswer: (playerId: number, optionIndex: number) => void;
  onPlayerBuzz: (playerId: number) => void;
  onUsePowerUp: (playerId: number, type: PowerUpType) => void;
  buzzedPlayerId: number | null;
  roundLocked: boolean;
}

export const PlayerStations: React.FC<PlayerStationsProps> = ({
  players,
  playMode,
  onPlayerAnswer,
  onPlayerBuzz,
  onUsePowerUp,
  buzzedPlayerId,
  roundLocked,
}) => {
  const getPowerUpIcon = (type: PowerUpType) => {
    switch (type) {
      case 'turbo':
        return { icon: <Zap size={14} />, label: 'Turbo +80m', bg: 'bg-amber-500' };
      case 'freeze':
        return { icon: <Snowflake size={14} />, label: 'Bekukan Lawan', bg: 'bg-cyan-500' };
      case 'banana':
        return { icon: <span>🍌</span>, label: 'Kulit Pisang', bg: 'bg-yellow-500' };
      case 'shield':
        return { icon: <Shield size={14} />, label: 'Tameng Kebal', bg: 'bg-indigo-500' };
      case 'double_points':
        return { icon: <Flame size={14} />, label: '2x Poin', bg: 'bg-red-500' };
    }
  };

  return (
    <div className="w-full bg-slate-950/90 border-t border-slate-800 p-2 sm:p-4 select-none">
      <div className="text-center mb-2">
        <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400">
          STASIUN LAYAR SENTUH SISWA (IFP MULTI-TOUCH STATIONS)
        </span>
      </div>

      {/* Grid of 1 to 5 Player Stations */}
      <div
        className="grid gap-2 sm:gap-3"
        style={{
          gridTemplateColumns: `repeat(${players.length}, minmax(0, 1fr))`,
        }}
      >
        {players.map((player, idx) => {
          const isFrozen = player.activeEffects.frozenUntil > Date.now();
          const hasAnswered = player.hasAnsweredCurrentQuestion;
          const isBuzzerWinner = buzzedPlayerId === player.id;
          const canAnswerInBuzzer = playMode === 'buzzer' ? isBuzzerWinner : true;
          const disabled = roundLocked || isFrozen || hasAnswered || !canAnswerInBuzzer;

          return (
            <div
              key={player.id}
              className={`flex flex-col justify-between rounded-2xl p-2.5 sm:p-3 transition-all duration-300 relative border-2 ${
                isBuzzerWinner
                  ? 'ring-4 ring-amber-400 scale-[1.02]'
                  : ''
              }`}
              style={{
                backgroundColor: `${player.color}12`,
                borderColor: player.color,
              }}
            >
              {/* Player Station Header */}
              <div className="flex items-center justify-between gap-1 mb-2">
                <div className="flex items-center gap-1.5 truncate">
                  <div
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-sm font-bold shadow text-white shrink-0"
                    style={{ backgroundColor: player.color }}
                  >
                    {player.avatar}
                  </div>
                  <div className="truncate">
                    <div className="text-xs sm:text-sm font-bold text-white truncate leading-tight">
                      P{idx + 1}: {player.name}
                    </div>
                    <div className="text-[10px] font-mono text-slate-300">
                      Skor: <span className="font-bold text-amber-300 tabular-nums">{player.score}</span>
                    </div>
                  </div>
                </div>

                {/* Streak Badge */}
                {player.streak >= 2 && (
                  <span className="text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded-full shrink-0">
                    🔥{player.streak}x
                  </span>
                )}
              </div>

              {/* Buzzer Mode View */}
              {playMode === 'buzzer' && (
                <div className="my-2">
                  {buzzedPlayerId === null ? (
                    <button
                      onClick={() => onPlayerBuzz(player.id)}
                      disabled={roundLocked || isFrozen}
                      className="w-full py-6 rounded-xl font-black text-sm uppercase tracking-wider text-slate-950 bg-amber-400 hover:bg-amber-300 active:scale-95 transition-all shadow-lg shadow-amber-500/30 disabled:opacity-50 disabled:pointer-events-none"
                    >
                      🔔 PENCET BEL!
                    </button>
                  ) : isBuzzerWinner ? (
                    <div className="text-center py-1 text-xs font-bold text-amber-400 animate-pulse">
                      ⚡ Giliran Menjawab!
                    </div>
                  ) : (
                    <div className="text-center py-2 text-[11px] text-slate-500">
                      Terkunci oleh Pemain #{buzzedPlayerId}
                    </div>
                  )}
                </div>
              )}

              {/* Answer Buttons [A] [B] [C] [D] for this Player */}
              <div className="grid grid-cols-2 gap-1.5 sm:gap-2 my-1">
                {(['A', 'B', 'C', 'D'] as const).map((letter, optIdx) => {
                  const isSelected = player.selectedOptionIndex === optIdx;
                  let btnColor = 'bg-slate-800 hover:bg-slate-700 text-slate-100 border-slate-700';

                  if (hasAnswered && isSelected) {
                    if (player.lastAnswerStatus === 'correct') {
                      btnColor = 'bg-emerald-600 text-white border-emerald-400 ring-2 ring-emerald-300';
                    } else if (player.lastAnswerStatus === 'wrong') {
                      btnColor = 'bg-rose-600 text-white border-rose-400 ring-2 ring-rose-300';
                    } else {
                      btnColor = 'bg-blue-600 text-white border-blue-400';
                    }
                  }

                  return (
                    <button
                      key={letter}
                      disabled={disabled}
                      onClick={() => onPlayerAnswer(player.id, optIdx)}
                      className={`h-12 sm:h-14 rounded-xl font-black text-base sm:text-lg border transition-all active:scale-95 flex items-center justify-center gap-1.5 shadow-sm touch-manipulation disabled:opacity-40 disabled:pointer-events-none ${btnColor}`}
                    >
                      <span className="font-mono">{letter}</span>
                      {hasAnswered && isSelected && (
                        <span className="text-xs">
                          {player.lastAnswerStatus === 'correct' ? '✓' : '✗'}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Station Footer: Power-Up Inventory & Status */}
              <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between gap-1">
                {/* Power-up button if available */}
                {player.powerUps.length > 0 ? (
                  <div className="flex gap-1 overflow-x-auto py-0.5">
                    {player.powerUps.map((pType, pIdx) => {
                      const pInfo = getPowerUpIcon(pType);
                      return (
                        <button
                          key={pIdx}
                          onClick={() => onUsePowerUp(player.id, pType)}
                          disabled={isFrozen || roundLocked}
                          className={`px-2 py-1 rounded-lg text-[10px] font-bold text-white shadow flex items-center gap-1 hover:brightness-110 active:scale-95 transition whitespace-nowrap ${pInfo.bg}`}
                          title={`Gunakan: ${pInfo.label}`}
                        >
                          {pInfo.icon}
                          <span className="hidden sm:inline">{pInfo.label}</span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <span className="text-[10px] text-slate-500 font-mono">
                    Combo 3x = Power-Up
                  </span>
                )}

                {/* Status Indicator */}
                <div className="text-right">
                  {isFrozen ? (
                    <span className="text-[10px] font-bold text-cyan-300 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-500/40">
                      ❄️ Beku
                    </span>
                  ) : hasAnswered ? (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        player.lastAnswerStatus === 'correct'
                          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                          : 'bg-rose-950/80 text-rose-300 border border-rose-500/40'
                      }`}
                    >
                      {player.lastAnswerStatus === 'correct' ? 'Tepat! +Lari' : 'Kurang Tepat'}
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400">Siap</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
