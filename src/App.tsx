/**
 * Catch Me If You Can! - PKn Kelas 7 IFP Edition
 * Game ini di kembangkan oleh Dudu Riyanto SMP Negeri 2 samigaluh,
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Player,
  Question,
  PlayMode,
  GamePhase,
  TargetRunner,
  ChatMessage,
  PowerUpType,
} from './types/game';
import { ALL_QUESTIONS, PKN_CHAPTERS } from './data/pknQuestions';
import { Header } from './components/Header';
import { RaceTrack } from './components/RaceTrack';
import { QuestionCard } from './components/QuestionCard';
import { PlayerStations } from './components/PlayerStations';
import { ChatOverlay } from './components/ChatOverlay';
import { LeaderboardModal } from './components/LeaderboardModal';
import { GameOverPodium } from './components/GameOverPodium';
import { SetupScreen } from './components/SetupScreen';
import { sound } from './utils/audio';

const MATCH_DURATION = 300; // 5 Menit (300 detik)

export default function App() {
  // Game Setup & State
  const [phase, setPhase] = useState<GamePhase>('SETUP');
  const [timeRemaining, setTimeRemaining] = useState<number>(MATCH_DURATION);
  const [playMode, setPlayMode] = useState<PlayMode>('simultaneous');
  const [selectedChapterId, setSelectedChapterId] = useState<string>('all');
  const [players, setPlayers] = useState<Player[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [roundLocked, setRoundLocked] = useState<boolean>(false);
  const [buzzedPlayerId, setBuzzedPlayerId] = useState<number | null>(null);

  // Catch target mascot
  const [targetRunner, setTargetRunner] = useState<TargetRunner>({
    name: 'Garuda Emas (Target)',
    distance: 180,
    baseSpeed: 1.5,
    avatar: '🦅',
  });

  // Chat & Leaderboard Overlays
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState<boolean>(false);
  const [unreadChatCount, setUnreadChatCount] = useState<number>(0);

  // Question appearance timestamp for speed bonus calculation
  const questionStartTimeRef = useRef<number>(Date.now());
  const playedQuestionsRef = useRef<Question[]>([]);

  // Get active topic title
  const currentChapter = PKN_CHAPTERS.find((c) => c.id === selectedChapterId) || PKN_CHAPTERS[0];

  // Helper to shuffle questions according to difficulty ramp
  const prepareQuestions = useCallback((chapterId: string) => {
    let pool = [...ALL_QUESTIONS];
    if (chapterId !== 'all') {
      pool = pool.filter((q) => q.chapterId === chapterId);
    }

    // Sort into levels to produce a gradual difficulty ramp: Level 1 -> Level 2 -> Level 3
    const easy = pool.filter((q) => q.level === 1).sort(() => Math.random() - 0.5);
    const medium = pool.filter((q) => q.level === 2).sort(() => Math.random() - 0.5);
    const hard = pool.filter((q) => q.level === 3).sort(() => Math.random() - 0.5);

    // Combine into ramped order
    const ordered = [...easy, ...medium, ...hard];
    // If not enough questions, repeat
    if (ordered.length < 15) {
      return [...ordered, ...ordered, ...ordered];
    }
    return ordered;
  }, []);

  // Handle Game Start from Setup Screen
  const handleStartGame = (config: {
    players: Player[];
    selectedChapterId: string;
    playMode: PlayMode;
  }) => {
    const preparedQuestions = prepareQuestions(config.selectedChapterId);
    setQuestions(preparedQuestions);
    setPlayers(config.players);
    setSelectedChapterId(config.selectedChapterId);
    setPlayMode(config.playMode);
    setTimeRemaining(MATCH_DURATION);
    setCurrentQuestionIndex(0);
    setShowExplanation(false);
    setRoundLocked(false);
    setBuzzedPlayerId(null);
    setTargetRunner({
      name: 'Garuda Emas (Target)',
      distance: 180,
      baseSpeed: 1.5,
      avatar: '🦅',
    });
    setMessages([
      {
        id: 'welcome-1',
        playerId: 0,
        playerName: 'Wasit Pertandingan',
        playerColor: '#F59E0B',
        text: 'Selamat bertanding! Kejar target dan jadilah Juara PPKn!',
        timestamp: Date.now(),
      },
    ]);
    playedQuestionsRef.current = [preparedQuestions[0]];
    questionStartTimeRef.current = Date.now();
    setPhase('PLAYING');
    sound.playClick();
  };

  // 5 Minutes Main Game Timer & Runner Movement Loop
  useEffect(() => {
    if (phase !== 'PLAYING') return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setPhase('SUMMARY');
          return 0;
        }

        // Countdown audio cue for last 10 seconds
        if (prev <= 10) {
          sound.playCountdownTick(prev === 1);
        }

        return prev - 1;
      });

      // Target runner progresses steadily
      setTargetRunner((prev) => ({
        ...prev,
        distance: prev.distance + prev.baseSpeed,
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, [phase]);

  // Current Question
  const currentQuestion = questions[currentQuestionIndex] || ALL_QUESTIONS[0];

  // Determine current leading player
  const currentLeaderId =
    players.length > 0
      ? [...players].sort((a, b) => b.distance - a.distance)[0]?.id
      : null;

  // Next Question Handler
  const advanceToNextQuestion = useCallback(() => {
    if (currentQuestionIndex + 1 < questions.length) {
      const nextIdx = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIdx);
      if (!playedQuestionsRef.current.some((q) => q.id === questions[nextIdx].id)) {
        playedQuestionsRef.current.push(questions[nextIdx]);
      }
    } else {
      // Loop or finish
      setCurrentQuestionIndex(0);
    }

    // Reset round states
    setShowExplanation(false);
    setRoundLocked(false);
    setBuzzedPlayerId(null);
    questionStartTimeRef.current = Date.now();

    // Reset player answer states for new question
    setPlayers((prev) =>
      prev.map((p) => ({
        ...p,
        hasAnsweredCurrentQuestion: false,
        selectedOptionIndex: null,
        lastAnswerStatus: null,
      }))
    );
  }, [currentQuestionIndex, questions]);

  // Handle Player Answering
  const handlePlayerAnswer = (playerId: number, optionIndex: number) => {
    if (roundLocked) return;

    const player = players.find((p) => p.id === playerId);
    if (!player || player.hasAnsweredCurrentQuestion) return;

    // Check freeze status
    if (player.activeEffects.frozenUntil > Date.now()) return;

    const isCorrect = optionIndex === currentQuestion.correctIndex;
    const answerDuration = (Date.now() - questionStartTimeRef.current) / 1000;
    const isFast = answerDuration <= 3.5;

    // Base point & meter calculation based on question difficulty level
    let earnedPoints = currentQuestion.level * 100;
    let sprintMeters = currentQuestion.level * 30; // Level 1: 30m, Level 2: 60m, Level 3: 90m

    // Speed bonus
    if (isFast && isCorrect) {
      sprintMeters += 25;
      earnedPoints += 50;
    }

    // Double point effect
    if (player.activeEffects.doublePoints) {
      earnedPoints *= 2;
    }

    if (isCorrect) {
      sound.playCorrect();
    } else {
      sound.playWrong();
    }

    setPlayers((prevPlayers) =>
      prevPlayers.map((p) => {
        if (p.id !== playerId) return p;

        const newStreak = isCorrect ? p.streak + 1 : 0;
        let newScore = isCorrect ? p.score + earnedPoints : Math.max(0, p.score - 20);
        let newDist = isCorrect ? p.distance + sprintMeters : p.distance;
        let newCatches = p.catchCount;

        // Check if player catches the target runner!
        if (newDist >= targetRunner.distance) {
          sound.playCatch();
          newCatches += 1;
          newScore += 500; // CATCH BONUS!

          // Broadcast shout in chat
          setMessages((msgs) => [
            {
              id: `catch-${Date.now()}`,
              playerId: p.id,
              playerName: p.name,
              playerColor: p.color,
              text: `👑 TERTANGKAP! ${p.name} berhasil mengejar target (+500 Poin)!`,
              timestamp: Date.now(),
            },
            ...msgs,
          ]);

          // Move target runner forward to keep chase alive!
          setTargetRunner((t) => ({
            ...t,
            distance: newDist + 160,
          }));
        }

        // Grant random power-up on 3x streak
        const newPowerUps = [...p.powerUps];
        if (newStreak === 3 && newPowerUps.length < 2) {
          const allP: PowerUpType[] = ['turbo', 'freeze', 'banana', 'shield', 'double_points'];
          const randomP = allP[Math.floor(Math.random() * allP.length)];
          newPowerUps.push(randomP);
          sound.playPowerUp();
        }

        return {
          ...p,
          score: newScore,
          distance: newDist,
          streak: newStreak,
          maxStreak: Math.max(p.maxStreak, newStreak),
          correctAnswers: isCorrect ? p.correctAnswers + 1 : p.correctAnswers,
          totalAnswers: p.totalAnswers + 1,
          hasAnsweredCurrentQuestion: true,
          selectedOptionIndex: optionIndex,
          lastAnswerStatus: isCorrect ? 'correct' : 'wrong',
          powerUps: newPowerUps,
          activeEffects: {
            ...p.activeEffects,
            doublePoints: false, // consume double point
          },
        };
      })
    );

    // If buzzer mode, finish round immediately
    if (playMode === 'buzzer') {
      setShowExplanation(true);
      setRoundLocked(true);
      setTimeout(() => {
        advanceToNextQuestion();
      }, 4000);
      return;
    }

    // In simultaneous mode, check if all players have answered
    setTimeout(() => {
      setPlayers((latestPlayers) => {
        const allAnswered = latestPlayers.every((p) => p.hasAnsweredCurrentQuestion);
        if (allAnswered) {
          setShowExplanation(true);
          setRoundLocked(true);
          setTimeout(() => {
            advanceToNextQuestion();
          }, 4500);
        }
        return latestPlayers;
      });
    }, 150);
  };

  // Buzzer Click Handler
  const handlePlayerBuzz = (playerId: number) => {
    if (buzzedPlayerId !== null || roundLocked) return;
    sound.playBuzz();
    setBuzzedPlayerId(playerId);
  };

  // Use Power-Up Handler
  const handleUsePowerUp = (playerId: number, type: PowerUpType) => {
    const user = players.find((p) => p.id === playerId);
    if (!user) return;

    sound.playPowerUp();

    setPlayers((prev) =>
      prev.map((p) => {
        if (p.id === playerId) {
          // Remove used powerup
          const updatedPUs = [...p.powerUps];
          const idx = updatedPUs.indexOf(type);
          if (idx !== -1) updatedPUs.splice(idx, 1);

          if (type === 'turbo') {
            return {
              ...p,
              distance: p.distance + 80,
              powerUps: updatedPUs,
              activeEffects: { ...p.activeEffects, turboUntil: Date.now() + 3000 },
            };
          }
          if (type === 'shield') {
            return {
              ...p,
              powerUps: updatedPUs,
              activeEffects: { ...p.activeEffects, shieldUntil: Date.now() + 6000 },
            };
          }
          if (type === 'double_points') {
            return {
              ...p,
              powerUps: updatedPUs,
              activeEffects: { ...p.activeEffects, doublePoints: true },
            };
          }
          return { ...p, powerUps: updatedPUs };
        }

        // Offensive power-ups targeting other players:
        if (type === 'freeze' && p.id !== playerId) {
          // Freeze rivals unless they have an active shield
          if (p.activeEffects.shieldUntil > Date.now()) {
            return p;
          }
          return {
            ...p,
            activeEffects: { ...p.activeEffects, frozenUntil: Date.now() + 3500 },
          };
        }

        if (type === 'banana' && p.id !== playerId) {
          // Banana slips the closest runner ahead
          if (p.distance > user.distance && p.activeEffects.shieldUntil <= Date.now()) {
            return {
              ...p,
              distance: Math.max(0, p.distance - 40),
            };
          }
        }

        return p;
      })
    );

    // Broadcast power-up action in chat
    const powerLabels: Record<PowerUpType, string> = {
      turbo: '🚀 mengaktifkan Turbo Sprint (+80m)!',
      freeze: '❄️ membekukan lawan di arena!',
      banana: '🍌 memasang jebakan kulit pisang!',
      shield: '🛡️ memasang Tameng Kebal Pancasila!',
      double_points: '⚡ mengaktifkan 2x Poin Soal!',
    };

    setMessages((prev) => [
      {
        id: `pu-${Date.now()}`,
        playerId: user.id,
        playerName: user.name,
        playerColor: user.color,
        text: `${user.name} ${powerLabels[type]}`,
        timestamp: Date.now(),
      },
      ...prev,
    ]);
  };

  // Send Chat Message Handler
  const handleSendMessage = (playerId: number, text: string) => {
    const sender = players.find((p) => p.id === playerId) || {
      id: playerId,
      name: `Pemain ${playerId}`,
      color: '#3B82F6',
    };

    const newMsg: ChatMessage = {
      id: `chat-${Date.now()}-${Math.random()}`,
      playerId: sender.id,
      playerName: sender.name,
      playerColor: sender.color,
      text,
      timestamp: Date.now(),
    };

    setMessages((prev) => [newMsg, ...prev]);

    if (!isChatOpen) {
      setUnreadChatCount((c) => c + 1);
    }
  };

  // Pause toggle
  const handleTogglePause = () => {
    sound.playClick();
    setPhase((prev) => (prev === 'PLAYING' ? 'PAUSED' : 'PLAYING'));
  };

  // Reset / Return to Setup
  const handleResetGame = () => {
    sound.playClick();
    setPhase('SETUP');
  };

  // Render Setup Screen
  if (phase === 'SETUP') {
    return <SetupScreen onStartGame={handleStartGame} />;
  }

  // Render Victory Podium Screen
  if (phase === 'SUMMARY') {
    return (
      <GameOverPodium
        players={players}
        allPlayedQuestions={playedQuestionsRef.current}
        onPlayAgain={handleResetGame}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between select-none relative overflow-x-hidden font-sans">
      {/* 1. Header with Timer, Controls, Topic & Developer Credit */}
      <Header
        timeRemaining={timeRemaining}
        totalTime={MATCH_DURATION}
        topicTitle={currentChapter.title}
        isPaused={phase === 'PAUSED'}
        onTogglePause={handleTogglePause}
        onOpenLeaderboard={() => {
          sound.playClick();
          setIsLeaderboardOpen(true);
        }}
        onToggleChat={() => {
          sound.playClick();
          setIsChatOpen(!isChatOpen);
          setUnreadChatCount(0);
        }}
        onResetGame={handleResetGame}
        unreadChatCount={unreadChatCount}
      />

      {/* Pause Screen Overlay */}
      {phase === 'PAUSED' && (
        <div className="fixed inset-0 z-40 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-4">
          <div className="text-center space-y-4 max-w-sm w-full bg-slate-900 border border-slate-700 p-6 rounded-3xl shadow-2xl">
            <h2 className="text-2xl font-black text-amber-400">PERMAINAN DIJEDA</h2>
            <p className="text-xs text-slate-300">
              Waktu dihentikan sementara. Klik lanjutkan jika siswa sudah siap kembali.
            </p>
            <div className="space-y-2 pt-2">
              <button
                onClick={handleTogglePause}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-sm text-white transition active:scale-95 shadow"
              >
                Lanjutkan Bermain
              </button>
              <button
                onClick={handleResetGame}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 font-bold text-xs text-slate-300 transition"
              >
                Kembali ke Menu Utama
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Dynamic 2D Race Track (Catch Me If You Can Arena) */}
      <RaceTrack
        players={players}
        targetRunner={targetRunner}
        recentMessages={messages}
        currentLeaderId={currentLeaderId}
      />

      {/* 3. Question Card Section (Big Legible Text for Classroom IFP) */}
      <div className="px-3 sm:px-6 py-2 max-w-5xl mx-auto w-full flex-1 flex flex-col justify-center">
        <QuestionCard
          question={currentQuestion}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={questions.length}
          showExplanation={showExplanation}
          onNextQuestion={advanceToNextQuestion}
          speedBonusActive={(Date.now() - questionStartTimeRef.current) / 1000 <= 3.5}
        />
      </div>

      {/* 4. IFP Multi-Touch Player Stations (1 to 5 Podiums) */}
      <PlayerStations
        players={players}
        playMode={playMode}
        onPlayerAnswer={handlePlayerAnswer}
        onPlayerBuzz={handlePlayerBuzz}
        onUsePowerUp={handleUsePowerUp}
        buzzedPlayerId={buzzedPlayerId}
        roundLocked={roundLocked}
      />

      {/* 5. Interactive Chat & Shouts Drawer */}
      <ChatOverlay
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        players={players}
        messages={messages}
        onSendMessage={handleSendMessage}
      />

      {/* 6. Live Leaderboard Modal */}
      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
        players={players}
      />
    </div>
  );
}
