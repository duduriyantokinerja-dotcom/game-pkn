import React, { useState } from 'react';
import { Chapter, PlayMode, Player } from '../types/game';
import { PKN_CHAPTERS } from '../data/pknQuestions';
import { Users, Play, Sparkles, HelpCircle, Shield, Award } from 'lucide-react';
import { sound } from '../utils/audio';

interface SetupScreenProps {
  onStartGame: (config: {
    players: Player[];
    selectedChapterId: string;
    playMode: PlayMode;
  }) => void;
}

const AVATAR_OPTIONS = [
  { icon: '🦅', name: 'Garuda Muda' },
  { icon: '🏃‍♂️', name: 'Pelari Kilat' },
  { icon: '⚡', name: 'Satria Petir' },
  { icon: '🦁', name: 'Singa Samigaluh' },
  { icon: '⭐', name: 'Bintang Prestasi' },
  { icon: '🎽', name: 'Kapten Nusantara' },
  { icon: '🔥', name: 'Prajurit Menoreh' },
  { icon: '🛡️', name: 'Pelindung NKRI' },
];

const DEFAULT_PLAYER_DATA = [
  { name: 'Budi', color: '#EF4444', avatar: '🦅', avatarName: 'Garuda Muda' },
  { name: 'Siti', color: '#3B82F6', avatar: '🏃‍♂️', avatarName: 'Pelari Kilat' },
  { name: 'Eko', color: '#10B981', avatar: '⚡', avatarName: 'Satria Petir' },
  { name: 'Dewi', color: '#F59E0B', avatar: '⭐', avatarName: 'Bintang Prestasi' },
  { name: 'Rian', color: '#8B5CF6', avatar: '🦁', avatarName: 'Singa Samigaluh' },
];

export const SetupScreen: React.FC<SetupScreenProps> = ({ onStartGame }) => {
  const [playerCount, setPlayerCount] = useState<number>(5);
  const [selectedChapterId, setSelectedChapterId] = useState<string>('all');
  const [playMode, setPlayMode] = useState<PlayMode>('simultaneous');
  const [playerNames, setPlayerNames] = useState<string[]>(
    DEFAULT_PLAYER_DATA.map((p) => p.name)
  );
  const [playerAvatars, setPlayerAvatars] = useState<string[]>(
    DEFAULT_PLAYER_DATA.map((p) => p.avatar)
  );
  const [showRulesModal, setShowRulesModal] = useState(false);

  const handleStart = () => {
    sound.playClick();
    const configuredPlayers: Player[] = [];

    for (let i = 0; i < playerCount; i++) {
      const def = DEFAULT_PLAYER_DATA[i];
      configuredPlayers.push({
        id: i + 1,
        name: playerNames[i]?.trim() || `Pemain ${i + 1}`,
        color: def.color,
        bgGradient: `from-[${def.color}] to-slate-900`,
        avatar: playerAvatars[i] || def.avatar,
        avatarName: def.avatarName,
        score: 0,
        distance: 0,
        catchCount: 0,
        streak: 0,
        maxStreak: 0,
        correctAnswers: 0,
        totalAnswers: 0,
        powerUps: [],
        activeEffects: {
          frozenUntil: 0,
          shieldUntil: 0,
          doublePoints: false,
          turboUntil: 0,
        },
        hasAnsweredCurrentQuestion: false,
      });
    }

    onStartGame({
      players: configuredPlayers,
      selectedChapterId,
      playMode,
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4 sm:p-6 select-none font-sans">
      {/* Top Bar with Developer Credit */}
      <div className="max-w-5xl mx-auto w-full flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></span>
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
            SMP NEGERI 2 SAMIGALUH · KELAS 7 PKn
          </span>
        </div>
        <button
          onClick={() => setShowRulesModal(true)}
          className="text-xs text-amber-300 hover:text-amber-200 flex items-center gap-1.5 font-bold transition"
        >
          <HelpCircle size={15} />
          <span>Cara Bermain</span>
        </button>
      </div>

      {/* Main Container */}
      <div className="max-w-5xl mx-auto w-full my-4 flex-1">
        {/* Hero Section with Generated Graphic */}
        <div className="relative rounded-3xl overflow-hidden border border-slate-800 shadow-2xl mb-6 bg-slate-900">
          <div className="relative h-44 sm:h-64 w-full overflow-hidden">
            <img
              src="/src/assets/images/pkn_game_banner_1792556783860.jpg"
              alt="Catch Me If You Can Game Banner"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center brightness-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:bottom-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600 text-white text-xs font-black uppercase tracking-wider mb-2 shadow">
                ⚡ IFP Interactive Flat Panel Edition
              </div>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white uppercase tracking-tight drop-shadow-md">
                Catch Me If You Can!
              </h1>
              <p className="text-xs sm:text-sm text-slate-200 max-w-xl font-medium drop-shadow">
                Game balapan kejar-kejaran seru materi PKn Kelas 7 Kurikulum Merdeka. Jawab cepat, tangkap lawan, dan rebut posisi juara!
              </p>
            </div>
          </div>
        </div>

        {/* Configuration Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column: Player Count & Setup */}
          <div className="lg:col-span-7 space-y-5">
            {/* 1. Pilih Jumlah Pemain (1 - 5) */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-bold text-white flex items-center gap-2">
                  <Users size={18} className="text-amber-400" />
                  <span>1. Pilih Jumlah Siswa yang Bermain (1 - 5 Pemain):</span>
                </label>
                <span className="text-xs font-bold text-amber-400 font-mono">
                  {playerCount} Siswa
                </span>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    onClick={() => {
                      setPlayerCount(num);
                      sound.playClick();
                    }}
                    className={`py-3 rounded-xl font-black text-base sm:text-lg transition active:scale-95 border ${
                      playerCount === num
                        ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-lg shadow-amber-500/20'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    {num} P
                  </button>
                ))}
              </div>

              {/* Player Names and Avatar customization */}
              <div className="mt-4 pt-3 border-t border-slate-800 space-y-2">
                <span className="text-xs font-semibold text-slate-400">
                  Sesuaikan Nama Siswa (Sentuh untuk mengetik):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[...Array(playerCount)].map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 p-2 rounded-xl bg-slate-950/70 border"
                      style={{ borderColor: `${DEFAULT_PLAYER_DATA[i].color}80` }}
                    >
                      {/* Avatar Picker trigger */}
                      <button
                        onClick={() => {
                          const currentIdx = AVATAR_OPTIONS.findIndex(
                            (a) => a.icon === playerAvatars[i]
                          );
                          const nextIdx = (currentIdx + 1) % AVATAR_OPTIONS.length;
                          const nextAvatars = [...playerAvatars];
                          nextAvatars[i] = AVATAR_OPTIONS[nextIdx].icon;
                          setPlayerAvatars(nextAvatars);
                          sound.playClick();
                        }}
                        title="Ganti Avatar"
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-lg active:scale-90 transition border border-white/20"
                        style={{ backgroundColor: DEFAULT_PLAYER_DATA[i].color }}
                      >
                        {playerAvatars[i]}
                      </button>

                      {/* Name input */}
                      <input
                        type="text"
                        value={playerNames[i]}
                        onChange={(e) => {
                          const newNames = [...playerNames];
                          newNames[i] = e.target.value;
                          setPlayerNames(newNames);
                        }}
                        maxLength={12}
                        className="bg-transparent text-xs sm:text-sm font-bold text-white focus:outline-none w-full"
                        placeholder={`Pemain ${i + 1}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 2. Mode Bermain IFP */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg">
              <label className="text-sm font-bold text-white flex items-center gap-2 mb-3">
                <Sparkles size={18} className="text-blue-400" />
                <span>2. Mode Interaksi di Layar IFP:</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    setPlayMode('simultaneous');
                    sound.playClick();
                  }}
                  className={`p-3 rounded-xl border text-left transition ${
                    playMode === 'simultaneous'
                      ? 'bg-blue-600/20 border-blue-500 text-white ring-2 ring-blue-500/40'
                      : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="font-bold text-sm mb-1 text-blue-300">
                    ⚡ Sentuh Serentak (Multi-Touch)
                  </div>
                  <div className="text-xs text-slate-400">
                    Semua siswa memiliki tombol podium A-B-C-D di layar IFP dan menjawab bersamaan.
                  </div>
                </button>

                <button
                  onClick={() => {
                    setPlayMode('buzzer');
                    sound.playClick();
                  }}
                  className={`p-3 rounded-xl border text-left transition ${
                    playMode === 'buzzer'
                      ? 'bg-amber-600/20 border-amber-500 text-white ring-2 ring-amber-500/40'
                      : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="font-bold text-sm mb-1 text-amber-300">
                    🔔 Rebutan Bel Cepat (Buzzer Race)
                  </div>
                  <div className="text-xs text-slate-400">
                    Siswa memencet bel secepat mungkin; yang tercepat mengunci giliran menjawab!
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Topics Selection & Start CTA */}
          <div className="lg:col-span-5 space-y-5">
            {/* 3. Pilihan Materi PKn */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg">
              <label className="text-sm font-bold text-white flex items-center gap-2 mb-3">
                <Award size={18} className="text-emerald-400" />
                <span>3. Pilih Materi PKn Kelas 7:</span>
              </label>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {PKN_CHAPTERS.map((chap) => {
                  const isSelected = selectedChapterId === chap.id;
                  return (
                    <button
                      key={chap.id}
                      onClick={() => {
                        setSelectedChapterId(chap.id);
                        sound.playClick();
                      }}
                      className={`w-full p-2.5 rounded-xl border text-left transition flex items-center gap-3 ${
                        isSelected
                          ? 'bg-emerald-600/20 border-emerald-500 text-white ring-1 ring-emerald-500'
                          : 'bg-slate-800/50 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <span className="text-2xl">{chap.icon}</span>
                      <div className="truncate">
                        <div className="text-xs sm:text-sm font-bold truncate">
                          {chap.title}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate">
                          {chap.description}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Match Specs */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 space-y-1.5">
              <div className="flex justify-between">
                <span>⏱️ Durasi Lomba:</span>
                <span className="font-bold text-amber-300 font-mono">5 Menit (300 Detik)</span>
              </div>
              <div className="flex justify-between">
                <span>📈 Tingkat Kesulitan:</span>
                <span className="font-bold text-emerald-400">Bertahap (Mudah → HOTS)</span>
              </div>
              <div className="flex justify-between">
                <span>🎯 Mekanisme Catch:</span>
                <span className="font-bold text-blue-400">Jarak Tempuh & Kejar Target</span>
              </div>
            </div>

            {/* Start Button */}
            <button
              onClick={handleStart}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:brightness-110 active:scale-95 text-white font-black text-lg tracking-wide uppercase shadow-xl shadow-red-600/30 transition flex items-center justify-center gap-3"
            >
              <Play size={22} className="fill-current" />
              <span>Mulai Bertanding Sekarang!</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mandatory Credit Section at Bottom */}
      <footer className="max-w-5xl mx-auto w-full text-center border-t border-slate-800 pt-3">
        <p className="text-xs sm:text-sm text-slate-400 font-medium">
          Game ini di kembangkan oleh{' '}
          <span className="font-bold text-amber-300">
            Dudu Riyanto SMP Negeri 2 samigaluh,
          </span>
        </p>
      </footer>

      {/* Rules Modal */}
      {showRulesModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="font-black text-white text-base flex items-center gap-2">
                <Shield size={18} className="text-amber-400" />
                <span>Aturan Main Catch Me If You Can</span>
              </h3>
              <button
                onClick={() => setShowRulesModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="text-xs text-slate-300 space-y-2.5 leading-relaxed">
              <p>
                <strong>1. Konsep Kejar-Kejaran:</strong> Seluruh siswa berlari di lintasan. Target pelari utama berada di depan. Jawab soal dengan benar dan cepat untuk mempercepat lari Anda!
              </p>
              <p>
                <strong>2. Tingkat Bertahap:</strong> Soal dimulai dari Level 1 (Pemahaman Dasar 100 pt), lalu Level 2 (Penerapan Kasus 200 pt), dan Level 3 (Evaluasi Kritis HOTS 300 pt).
              </p>
              <p>
                <strong>3. Menangkap Target (CATCH):</strong> Saat jarak Anda menyalip target, Anda mendapat bonus tangkapan 500 poin dan mahkota juara terkejar!
              </p>
              <p>
                <strong>4. Power-Up:</strong> Kumpulkan combo 3x berturut-turut untuk membuka item Turbo 🚀, Es Beku ❄️, atau Tameng 🛡️!
              </p>
              <p>
                <strong>5. Durasi 5 Menit:</strong> Siswa dengan total skor dan tangkapan terbanyak saat waktu habis dinobatkan sebagai Juara di Panggung Kehormatan!
              </p>
            </div>
            <button
              onClick={() => setShowRulesModal(false)}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition"
            >
              Mengerti & Siap Bermain
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
