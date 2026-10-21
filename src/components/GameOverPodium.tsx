import React, { useEffect, useState } from 'react';
import { Player, Question } from '../types/game';
import confetti from 'canvas-confetti';
import { Trophy, RotateCcw, BookOpen, CheckCircle, XCircle } from 'lucide-react';
import { sound } from '../utils/audio';

interface GameOverPodiumProps {
  players: Player[];
  allPlayedQuestions: Question[];
  onPlayAgain: () => void;
}

export const GameOverPodium: React.FC<GameOverPodiumProps> = ({
  players,
  allPlayedQuestions,
  onPlayAgain,
}) => {
  const [activeTab, setActiveTab] = useState<'podium' | 'review'>('podium');

  // Sort players by score descending
  const sortedPlayers = [...players].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return b.distance - a.distance;
  });

  const winner = sortedPlayers[0];
  const second = sortedPlayers[1];
  const third = sortedPlayers[2];

  useEffect(() => {
    sound.playVictory();
    // Confetti burst
    const end = Date.now() + 3.5 * 1000;
    const colors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ffffff'];

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen w-full bg-slate-950 text-white flex flex-col justify-between p-4 sm:p-8 select-none">
      {/* Top Banner */}
      <div className="max-w-4xl mx-auto w-full text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs sm:text-sm font-bold uppercase tracking-wider mb-2 animate-bounce">
          🏆 Waktu 5 Menit Berakhir! Babak Selesai!
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase font-sans">
          PANGGUNG JUARA (VICTORY PODIUM)
        </h1>
        <p className="text-sm sm:text-base text-slate-400 mt-1">
          Pertandingan Kejar-kejaran Materi PKn Kelas 7 SMP telah tuntas.
        </p>

        {/* Tab switch between Podium and Learning Review */}
        <div className="flex justify-center gap-2 mt-5">
          <button
            onClick={() => setActiveTab('podium')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition flex items-center gap-2 ${
              activeTab === 'podium'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Trophy size={16} />
            <span>Panggung Juara</span>
          </button>
          <button
            onClick={() => setActiveTab('review')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition flex items-center gap-2 ${
              activeTab === 'review'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <BookOpen size={16} />
            <span>Pembahasan & Evaluasi Soal ({allPlayedQuestions.length})</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-4xl mx-auto w-full my-6 flex-1">
        {activeTab === 'podium' ? (
          <div>
            {/* Visual 3-Tier Podium */}
            <div className="flex items-end justify-center gap-2 sm:gap-6 pt-12 pb-6 max-w-xl mx-auto">
              {/* 2nd Place */}
              {second && (
                <div className="flex-1 flex flex-col items-center">
                  <div className="text-2xl mb-1">{second.avatar}</div>
                  <div className="text-xs sm:text-sm font-bold text-slate-200 truncate max-w-[100px]">
                    {second.name}
                  </div>
                  <div className="text-xs font-mono font-bold text-slate-400">
                    {second.score} pts
                  </div>
                  <div className="w-full h-32 sm:h-40 bg-gradient-to-t from-slate-800 to-slate-700 rounded-t-2xl border-t-4 border-slate-300 flex flex-col items-center justify-center p-2 shadow-lg mt-2">
                    <span className="text-2xl sm:text-3xl font-black text-slate-300">2</span>
                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Perak</span>
                  </div>
                </div>
              )}

              {/* 1st Place Champion */}
              {winner && (
                <div className="flex-1 flex flex-col items-center">
                  <div className="relative">
                    <div className="text-4xl mb-1 animate-bounce">{winner.avatar}</div>
                    <div className="absolute -top-4 -right-2 text-xl">👑</div>
                  </div>
                  <div className="text-sm sm:text-base font-black text-amber-300 truncate max-w-[120px]">
                    {winner.name}
                  </div>
                  <div className="text-xs sm:text-sm font-mono font-black text-amber-400">
                    {winner.score} pts
                  </div>
                  <div className="w-full h-44 sm:h-56 bg-gradient-to-t from-amber-600 to-yellow-500 rounded-t-2xl border-t-4 border-yellow-200 flex flex-col items-center justify-center p-2 shadow-2xl shadow-amber-500/30 mt-2">
                    <span className="text-3xl sm:text-5xl font-black text-slate-950">1</span>
                    <span className="text-xs font-black text-slate-950 uppercase tracking-wider">EMAS / JUARA 1</span>
                    <span className="text-[10px] font-bold text-slate-900 mt-1 font-mono">
                      {Math.round(winner.distance)}m · {winner.catchCount}x Catch
                    </span>
                  </div>
                </div>
              )}

              {/* 3rd Place */}
              {third && (
                <div className="flex-1 flex flex-col items-center">
                  <div className="text-2xl mb-1">{third.avatar}</div>
                  <div className="text-xs sm:text-sm font-bold text-slate-300 truncate max-w-[100px]">
                    {third.name}
                  </div>
                  <div className="text-xs font-mono font-bold text-slate-400">
                    {third.score} pts
                  </div>
                  <div className="w-full h-24 sm:h-28 bg-gradient-to-t from-amber-950 to-amber-900 rounded-t-2xl border-t-4 border-amber-600 flex flex-col items-center justify-center p-2 shadow-lg mt-2">
                    <span className="text-xl sm:text-2xl font-black text-amber-500">3</span>
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Perunggu</span>
                  </div>
                </div>
              )}
            </div>

            {/* Complete Ranking List 1-5 */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 mt-4 max-w-2xl mx-auto shadow-xl">
              <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-3">
                Hasil Lengkap Seluruh Peserta:
              </h3>
              <div className="space-y-2">
                {sortedPlayers.map((player, idx) => {
                  const accuracy =
                    player.totalAnswers > 0
                      ? Math.round((player.correctAnswers / player.totalAnswers) * 100)
                      : 0;

                  return (
                    <div
                      key={player.id}
                      className="flex items-center justify-between p-2.5 rounded-xl border bg-slate-950/60"
                      style={{ borderColor: `${player.color}60` }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 font-mono text-xs font-bold text-slate-400">
                          #{idx + 1}
                        </span>
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white shadow"
                          style={{ backgroundColor: player.color }}
                        >
                          {player.avatar}
                        </div>
                        <div>
                          <span className="text-sm font-bold text-white">
                            {player.name}
                          </span>
                          <span className="text-xs text-slate-400 ml-2 font-mono">
                            ({Math.round(player.distance)}m · {player.catchCount} Tangkapan)
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-xs font-mono">
                        <span className="text-slate-300">
                          Akurasi: <strong className="text-emerald-400">{accuracy}%</strong>
                        </span>
                        <span className="text-sm font-black text-amber-300 tabular-nums">
                          {player.score} pts
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* Learning Review Mode (For Teachers & Students on IFP) */
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 max-w-3xl mx-auto max-h-[60vh] overflow-y-auto space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">
                Kunci Jawaban & Pembahasan Materi PKn Kelas 7
              </h3>
              <span className="text-xs text-slate-400 font-mono">
                {allPlayedQuestions.length} Soal Dibahas
              </span>
            </div>

            {allPlayedQuestions.map((q, idx) => (
              <div
                key={q.id}
                className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 text-left"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-mono font-bold text-slate-400">
                    Soal #{idx + 1} · {q.chapterTitle}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    Level {q.level} ({q.difficulty})
                  </span>
                </div>

                <p className="text-sm font-semibold text-white leading-relaxed">
                  {q.question}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                  {q.options.map((opt, optIdx) => {
                    const isCorrect = optIdx === q.correctIndex;
                    return (
                      <div
                        key={optIdx}
                        className={`p-2 rounded-lg border flex items-center gap-2 ${
                          isCorrect
                            ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-300 font-bold'
                            : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}
                      >
                        {isCorrect ? (
                          <CheckCircle size={14} className="text-emerald-400 shrink-0" />
                        ) : (
                          <XCircle size={14} className="text-slate-600 shrink-0" />
                        )}
                        <span>
                          {String.fromCharCode(65 + optIdx)}. {opt}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="text-xs bg-blue-950/30 border border-blue-500/20 text-blue-200 p-2.5 rounded-lg mt-2 leading-relaxed">
                  <strong>Pembahasan:</strong> {q.explanation}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Action & Mandatory Developer Credit */}
      <div className="max-w-xl mx-auto w-full text-center space-y-4 pt-4 border-t border-slate-900">
        <button
          onClick={onPlayAgain}
          className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:brightness-110 active:scale-95 text-white font-black text-base rounded-2xl shadow-xl shadow-red-600/30 transition flex items-center justify-center gap-2 mx-auto"
        >
          <RotateCcw size={20} />
          <span>Main Lagi / Pilih Materi Baru</span>
        </button>

        {/* Developer Credit */}
        <div className="pt-2">
          <p className="text-xs sm:text-sm text-slate-400">
            Game ini di kembangkan oleh{' '}
            <span className="font-bold text-amber-300">
              Dudu Riyanto SMP Negeri 2 samigaluh,
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};
