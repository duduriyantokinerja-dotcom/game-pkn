import React from 'react';
import { Question } from '../types/game';
import { HelpCircle, Award, CheckCircle2, ChevronRight } from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  showExplanation: boolean;
  onNextQuestion?: () => void;
  speedBonusActive?: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  questionNumber,
  totalQuestions,
  showExplanation,
  onNextQuestion,
  speedBonusActive,
}) => {
  const getLevelBadge = (level: 1 | 2 | 3) => {
    switch (level) {
      case 1:
        return {
          label: 'Level 1: Pemahaman Dasar',
          points: '+100 Poin',
          color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
        };
      case 2:
        return {
          label: 'Level 2: Analisis & Penerapan',
          points: '+200 Poin',
          color: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
        };
      case 3:
        return {
          label: 'Level 3: HOTS & Evaluasi Kritis',
          points: '+300 Poin',
          color: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
        };
    }
  };

  const badge = getLevelBadge(question.level);

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl relative overflow-hidden select-none">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Meta Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 sm:mb-4 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold bg-slate-800 text-slate-300 px-2.5 py-1 rounded-md border border-slate-700">
            Soal #{questionNumber} / {totalQuestions}
          </span>
          <span
            className={`text-xs font-bold px-2.5 py-1 rounded-md border ${badge.color}`}
          >
            {badge.label}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {speedBonusActive && (
            <span className="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-md animate-pulse">
              ⚡ Bonus Kecepatan Aktif (+25m)
            </span>
          )}
          <span className="text-xs font-black text-amber-300 flex items-center gap-1">
            <Award size={14} /> {badge.points}
          </span>
        </div>
      </div>

      {/* Chapter Subtitle */}
      <div className="text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
        {question.chapterTitle}
      </div>

      {/* Big Question Prompt */}
      <h2 className="text-lg sm:text-2xl font-bold text-white tracking-tight leading-snug mb-5 text-balance">
        {question.question}
      </h2>

      {/* Question Options Reference List (Large, Clear) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3 mb-4">
        {question.options.map((opt, idx) => {
          const letter = String.fromCharCode(65 + idx);
          const isCorrect = idx === question.correctIndex;
          const showState = showExplanation;

          return (
            <div
              key={idx}
              className={`flex items-start gap-3 p-3 sm:p-3.5 rounded-xl border text-sm sm:text-base font-medium transition-all ${
                showState && isCorrect
                  ? 'bg-emerald-950/40 border-emerald-500 text-emerald-200 ring-2 ring-emerald-500/50'
                  : 'bg-slate-800/60 border-slate-700/60 text-slate-200'
              }`}
            >
              <span
                className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs shrink-0 ${
                  showState && isCorrect
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'bg-slate-700 text-slate-300'
                }`}
              >
                {letter}
              </span>
              <span className="leading-relaxed">{opt}</span>
              {showState && isCorrect && (
                <CheckCircle2 size={20} className="text-emerald-400 ml-auto shrink-0 mt-0.5" />
              )}
            </div>
          );
        })}
      </div>

      {/* Explanation Box (Visible between rounds or after answering) */}
      {showExplanation && (
        <div className="mt-4 p-4 rounded-xl bg-blue-950/40 border border-blue-500/40 text-blue-200 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-300 uppercase tracking-wider">
              <HelpCircle size={16} />
              <span>Pembahasan Materi PKn:</span>
            </div>
            {onNextQuestion && (
              <button
                onClick={onNextQuestion}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition shadow"
              >
                <span>Soal Selanjutnya</span>
                <ChevronRight size={14} />
              </button>
            )}
          </div>
          <p className="text-xs sm:text-sm text-blue-100 leading-relaxed font-sans">
            {question.explanation}
          </p>
        </div>
      )}
    </div>
  );
};
