import { useEffect, useRef, useState } from 'react';
import {
  Award,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  RotateCcw,
  User,
  XCircle,
} from 'lucide-react';
import type { ExamQuestion } from '../data/curriculum';
import { ConfettiCanvas } from './ConfettiCanvas';

export interface ExamAttemptRecord {
  id: string;
  studentName: string;
  score: number;
  total: number;
  literacyScore: number;
  literacyTotal: number;
  programmingScore: number;
  programmingTotal: number;
  tier: 'perfect' | 'great' | 'average' | 'retry';
  tierLabel: string;
  completedAt: string;
}

interface FinalExamSectionProps {
  questions: ExamQuestion[];
  onRecordResult: (record: ExamAttemptRecord) => void;
  onBackToLessons: () => void;
}

interface AnswerRecord {
  questionId: number;
  selectedIndex: number;
  correctIndex: number;
  isCorrect: boolean;
}

export function FinalExamSection({
  questions,
  onRecordResult,
  onBackToLessons,
}: FinalExamSectionProps) {
  const [phase, setPhase] = useState<'intro' | 'active' | 'result'>('intro');
  const [studentName, setStudentName] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [showReview, setShowReview] = useState(false);

  const autoAdvanceTimerRef = useRef<number | null>(null);

  const clearTimer = () => {
    if (autoAdvanceTimerRef.current !== null) {
      window.clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }
  };

  useEffect(() => {
    return () => clearTimer();
  }, []);

  const totalQuestions = questions.length;
  const currentQuestion = questions[currentIndex] ?? questions[0];

  const getEvaluation = (points: number, total: number) => {
    const pct = total > 0 ? (points / total) * 100 : 0;

    if (total === 20 ? points === 20 : pct === 100) {
      return {
        tier: 'perfect' as const,
        message: "Tabriklaymiz! Siz imtihondan a'lo darajada O‘TDINGIZ!",
        containerClass: 'bg-emerald-50 border-emerald-300 text-emerald-950',
        badgeText: 'A’lo natija · 100%',
        accentText: 'text-emerald-700',
      };
    }
    if (total === 20 ? points >= 18 : pct >= 90) {
      return {
        tier: 'great' as const,
        message: "Zo‘r! Natijangiz juda yaxshi, siz bilimlarni ajoyib o‘zlashtirdingiz!",
        containerClass: 'bg-sky-50 border-sky-300 text-slate-950',
        badgeText: 'Yaxshi natija',
        accentText: 'text-sky-700',
      };
    }
    if (total === 20 ? points >= 15 : pct >= 75) {
      return {
        tier: 'average' as const,
        message:
          "O‘rtacha! Yaxshi harakat, lekin ba'zi mavzularni yana bir bor takrorlab chiqing.",
        containerClass: 'bg-amber-50 border-amber-300 text-slate-950',
        badgeText: 'O‘rtacha natija',
        accentText: 'text-amber-700',
      };
    }
    return {
      tier: 'retry' as const,
      message:
        "Afsuski, natija yetarli emas. Iltimos, darslarni qayta o‘qib, testni QAYTA URINIB ko‘ring!",
      containerClass: 'bg-rose-50 border-rose-300 text-slate-950',
      badgeText: 'Qayta tayyorgarlik tavsiya etiladi',
      accentText: 'text-rose-700',
    };
  };

  const startExam = () => {
    if (totalQuestions === 0) return;
    clearTimer();
    setPhase('active');
    setCurrentIndex(0);
    setSelectedOption(null);
    setAnswers([]);
    setShowReview(false);
  };

  const finalizeExam = (finalAnswers: AnswerRecord[]) => {
    const finalScore = finalAnswers.filter((a) => a.isCorrect).length;
    const litTotal = questions.filter((q) => q.category === 'literacy').length;
    const progTotal = questions.filter((q) => q.category === 'programming').length;
    const litScore = finalAnswers.filter(
      (a, i) => a.isCorrect && questions[i]?.category === 'literacy'
    ).length;
    const progScore = finalAnswers.filter(
      (a, i) => a.isCorrect && questions[i]?.category === 'programming'
    ).length;
    const evalInfo = getEvaluation(finalScore, totalQuestions);

    onRecordResult({
      id: `exam-${Date.now()}`,
      studentName: studentName.trim() || 'Mehmon o‘quvchi',
      score: finalScore,
      total: totalQuestions,
      literacyScore: litScore,
      literacyTotal: litTotal,
      programmingScore: progScore,
      programmingTotal: progTotal,
      tier: evalInfo.tier,
      tierLabel: evalInfo.badgeText,
      completedAt: new Date().toISOString(),
    });

    setPhase('result');
  };

  const advanceQuestion = (latestAnswers?: AnswerRecord[]) => {
    clearTimer();
    const listToUse = latestAnswers ?? answers;
    if (currentIndex + 1 < totalQuestions) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
    } else {
      finalizeExam(listToUse);
    }
  };

  const handleSelectOption = (optionIndex: number) => {
    if (selectedOption !== null || !currentQuestion) return;

    setSelectedOption(optionIndex);
    const isCorrect = optionIndex === currentQuestion.correctIndex;

    const updatedAnswers: AnswerRecord[] = [
      ...answers,
      {
        questionId: currentQuestion.id,
        selectedIndex: optionIndex,
        correctIndex: currentQuestion.correctIndex,
        isCorrect,
      },
    ];
    setAnswers(updatedAnswers);

    clearTimer();
    autoAdvanceTimerRef.current = window.setTimeout(() => {
      advanceQuestion(updatedAnswers);
    }, 1500);
  };

  const score = answers.filter((a) => a.isCorrect).length;
  const literacyTotal = questions.filter((q) => q.category === 'literacy').length;
  const programmingTotal = questions.filter((q) => q.category === 'programming').length;
  const literacyScore = answers.filter(
    (a, i) => a.isCorrect && questions[i]?.category === 'literacy'
  ).length;
  const programmingScore = answers.filter(
    (a, i) => a.isCorrect && questions[i]?.category === 'programming'
  ).length;

  const evaluation = getEvaluation(score, totalQuestions);
  const passThreshold = totalQuestions === 20 ? '15+' : `${Math.ceil(totalQuestions * 0.75)}+`;

  return (
    <section id="imtihon" className="py-16 md:py-24 bg-slate-900 text-white">
      <ConfettiCanvas
        active={phase === 'result' && totalQuestions > 0 && score === totalQuestions}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {phase === 'intro' && (
          <div className="bg-slate-800/70 border border-slate-700 rounded-2xl p-8 md:p-12 text-center">
            <p className="text-sm font-semibold text-sky-400 mb-3">Yakuniy bilim sinovi</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white text-balance mb-4">
              {totalQuestions} ta savollik yakuniy imtihonga tayyormisiz?
            </h2>
            <p className="text-base text-slate-300 max-w-2xl mx-auto leading-relaxed mb-8">
              Imtihon kompyuter savodxonligi ({literacyTotal} ta savol) va dasturlash asoslari (
              {programmingTotal} ta savol) bo‘yicha tuzilgan. Har bir savolga javob berganingizda
              natija darhol ko‘rsatiladi.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-xl mx-auto mb-8 text-left border-t border-b border-slate-700 py-5">
              <div>
                <div className="text-2xl font-bold font-mono tabular-nums text-white">
                  {totalQuestions} ta
                </div>
                <div className="text-xs text-slate-400 mt-0.5">Jami test savollari</div>
              </div>
              <div>
                <div className="text-2xl font-bold font-mono tabular-nums text-white">4 ta</div>
                <div className="text-xs text-slate-400 mt-0.5">Variant (A, B, C, D)</div>
              </div>
              <div>
                <div className="text-2xl font-bold font-mono tabular-nums text-white">
                  {passThreshold}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">O‘tish bali chegarasi</div>
              </div>
            </div>

            <div className="max-w-sm mx-auto mb-6 text-left">
              <label
                htmlFor="student-name-input"
                className="block text-xs font-medium text-slate-300 mb-1.5"
              >
                Ismingiz (natijalar jurnali uchun, ixtiyoriy)
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="student-name-input"
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Masalan: Jasur Aliyev"
                  className="w-full min-h-[44px] pl-10 pr-3.5 py-2.5 text-base sm:text-sm bg-slate-900 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
              </div>
            </div>

            {totalQuestions === 0 ? (
              <p className="text-sm text-amber-300">
                Hozircha imtihon savollari mavjud emas. Admin panel orqali savol qo‘shing.
              </p>
            ) : (
              <button
                type="button"
                onClick={startExam}
                className="w-full sm:w-auto min-h-[48px] px-7 py-3.5 text-sm font-semibold text-slate-950 bg-sky-400 hover:bg-sky-300 active:scale-[0.99] rounded-xl sm:rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer"
              >
                Imtihonni boshlash
              </button>
            )}
          </div>
        )}

        {phase === 'active' && currentQuestion && (
          <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 md:p-10">
            {/* Progress Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {currentQuestion.categoryLabel}
              </div>
              <div className="text-sm font-mono font-semibold text-slate-900 dark:text-white tabular-nums">
                Savol {currentIndex + 1} / {totalQuestions}
              </div>
            </div>

            <div
              className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-8"
              role="progressbar"
              aria-valuenow={currentIndex + 1}
              aria-valuemin={1}
              aria-valuemax={totalQuestions}
            >
              <div
                className="h-full bg-sky-600 transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
              />
            </div>

            {/* Question Prompt */}
            <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white leading-snug mb-6">
              {currentIndex + 1}. {currentQuestion.question}
            </h3>

            {/* 4 Options */}
            <div className="space-y-3">
              {currentQuestion.options.map((optionText, idx) => {
                const isAnswered = selectedOption !== null;
                const isSelected = selectedOption === idx;
                const isCorrectOption = idx === currentQuestion.correctIndex;

                let stateClasses =
                  'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-300';

                if (isAnswered) {
                  if (isCorrectOption) {
                    stateClasses =
                      'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-950 dark:text-emerald-200 font-medium';
                  } else if (isSelected && !isCorrectOption) {
                    stateClasses =
                      'bg-rose-50 dark:bg-rose-950/60 border-rose-500 text-rose-950 dark:text-rose-200 font-medium';
                  } else {
                    stateClasses =
                      'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500';
                  }
                }

                return (
                  <button
                    key={`${currentQuestion.id}-${idx}`}
                    type="button"
                    disabled={isAnswered}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full min-h-[52px] text-left px-4 py-3.5 rounded-xl border active:scale-[0.99] transition-all flex items-center justify-between gap-3 cursor-pointer disabled:cursor-default ${stateClasses}`}
                  >
                    <span className="text-sm sm:text-base">{optionText}</span>

                    {isAnswered && isCorrectOption && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 whitespace-nowrap shrink-0">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        To‘g‘ri
                      </span>
                    )}

                    {isAnswered && isSelected && !isCorrectOption && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-700 dark:text-rose-400 whitespace-nowrap shrink-0">
                        <XCircle className="w-4 h-4 shrink-0" />
                        Noto‘g‘ri
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Immediate Feedback & Next Trigger */}
            {selectedOption !== null && (
              <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="text-sm leading-relaxed">
                  <span
                    className={`font-semibold mr-2 ${
                      selectedOption === currentQuestion.correctIndex
                        ? 'text-emerald-700 dark:text-emerald-400'
                        : 'text-rose-700 dark:text-rose-400'
                    }`}
                  >
                    {selectedOption === currentQuestion.correctIndex
                      ? 'To‘g‘ri javob!'
                      : 'Noto‘g‘ri javob.'}
                  </span>
                  <span className="text-slate-600 dark:text-slate-300">
                    {currentQuestion.explanation}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => advanceQuestion()}
                  className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-slate-900 dark:bg-sky-500 dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-sky-400 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer self-end sm:self-auto"
                >
                  <span>
                    {currentIndex + 1 === totalQuestions ? 'Natijani ko‘rish' : 'Keyingi savol'}
                  </span>
                  <ChevronRight className="w-4 h-4 shrink-0" />
                </button>
              </div>
            )}
          </div>
        )}

        {phase === 'result' && (
          <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10">
            <div className={`rounded-xl border p-6 sm:p-8 ${evaluation.containerClass}`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                <div className="inline-flex items-center gap-2 text-sm font-semibold">
                  <Award className={`w-5 h-5 shrink-0 ${evaluation.accentText}`} />
                  <span className={evaluation.accentText}>{evaluation.badgeText}</span>
                </div>
                <div className="text-3xl sm:text-4xl font-bold font-mono tabular-nums">
                  {score} / {totalQuestions}
                </div>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold leading-snug mb-2">
                {evaluation.message}
              </h3>
              <p className="text-sm opacity-85">
                Foiz ko‘rsatkichi:{' '}
                <span className="font-mono font-semibold tabular-nums">
                  {totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0}%
                </span>
              </p>
            </div>

            {/* Category Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6 py-5 border-t border-b border-slate-200 dark:border-slate-800">
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                  Kompyuter savodxonligi
                </div>
                <div className="text-xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                  {literacyScore} / {literacyTotal} to‘g‘ri
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                  Dasturlash asoslari
                </div>
                <div className="text-xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                  {programmingScore} / {programmingTotal} to‘g‘ri
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={startExam}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-slate-900 dark:bg-sky-500 dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-sky-400 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4 shrink-0" />
                  <span>Qayta urinish</span>
                </button>

                <button
                  type="button"
                  onClick={onBackToLessons}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 shrink-0" />
                  <span>Darslarga qaytish</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setShowReview((prev) => !prev)}
                className="text-sm font-medium text-sky-700 dark:text-sky-400 hover:text-sky-800 whitespace-nowrap shrink-0 cursor-pointer"
              >
                {showReview ? 'Tahlilni yashirish' : 'Javoblarni tahlil qilish'}
              </button>
            </div>

            {/* Expandable Answer Review */}
            {showReview && (
              <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 space-y-4">
                <h4 className="text-base font-semibold text-slate-900 dark:text-white">
                  Barcha savollar tahlili
                </h4>
                <div className="space-y-3">
                  {questions.map((q, idx) => {
                    const record = answers[idx];
                    const isRight = record?.isCorrect;
                    return (
                      <div
                        key={q.id}
                        className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm"
                      >
                        <div className="flex items-start justify-between gap-3 mb-1.5">
                          <span className="font-semibold text-slate-900 dark:text-white">
                            {idx + 1}. {q.question}
                          </span>
                          <span
                            className={`inline-flex items-center gap-1 text-xs font-semibold whitespace-nowrap shrink-0 ${
                              isRight
                                ? 'text-emerald-700 dark:text-emerald-400'
                                : 'text-rose-700 dark:text-rose-400'
                            }`}
                          >
                            {isRight ? (
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            ) : (
                              <XCircle className="w-3.5 h-3.5" />
                            )}
                            {isRight ? 'To‘g‘ri' : 'Xato'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          To‘g‘ri javob:{' '}
                          <span className="font-medium text-slate-900 dark:text-slate-200">
                            {q.options[q.correctIndex]}
                          </span>
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
