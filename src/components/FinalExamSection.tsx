import { useEffect, useRef, useState } from 'react';
import {
  AlertTriangle,
  Award,
  BookOpen,
  Bot,
  Camera,
  CheckCircle2,
  ChevronRight,
  Clock,
  Code2,
  Layers,
  Lock,
  Monitor,
  RotateCcw,
  User,
  XCircle,
} from 'lucide-react';
import type { CertificateRecord, ExamQuestion, LessonCategory } from '../data/curriculum';
import {
  formatRemainingCountdown,
  formatUnlockClock,
  isExamScopeLocked,
} from '../utils/examCooldown';
import { CertificateBuilderModal } from './CertificateBuilderModal';
import { ConfettiCanvas } from './ConfettiCanvas';

export type ExamScope = LessonCategory | 'all';

export interface ExamAttemptRecord {
  id: string;
  studentName: string;
  examScope: ExamScope;
  score: number;
  total: number;
  passed: boolean;
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
  activeTrack: LessonCategory;
  examAttempts: Record<ExamScope, number>;
  examLockedUntil: Record<ExamScope, number>;
  examResults?: ExamAttemptRecord[];
  issuedCertificates?: CertificateRecord[];
  defaultStudentName?: string;
  readinessSummary?: {
    lessonsDone: number;
    lessonsTotal: number;
    videosDone: number;
    videosTotal: number;
    challengesDone: number;
    challengesTotal: number;
  };
  maxAttempts?: number;
  onConsumeAttempt: (scope: ExamScope) => void;
  onLockExam24h: (scope: ExamScope) => void;
  onRecordResult: (record: ExamAttemptRecord) => void;
  onCreateCertificate?: (cert: CertificateRecord) => Promise<void> | void;
  onBackToLessons: () => void;
  onGoToChallenges?: () => void;
  onGoToCertificates?: () => void;
  onOpenAdmin?: () => void;
}

interface AnswerRecord {
  questionId: number;
  selectedIndex: number;
  correctIndex: number;
  isCorrect: boolean;
}

export function FinalExamSection({
  questions,
  activeTrack,
  examAttempts,
  examLockedUntil,
  examResults = [],
  issuedCertificates = [],
  defaultStudentName = '',
  readinessSummary,
  maxAttempts = 3,
  onConsumeAttempt,
  onLockExam24h,
  onRecordResult,
  onCreateCertificate,
  onBackToLessons,
  onGoToChallenges,
  onGoToCertificates,
  onOpenAdmin,
}: FinalExamSectionProps) {
  const [examScope, setExamScope] = useState<ExamScope>(activeTrack);
  const [phase, setPhase] = useState<'intro' | 'active' | 'result'>('intro');
  const [studentName, setStudentName] = useState(defaultStudentName);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [showReview, setShowReview] = useState(false);
  const [activeScopeLocked, setActiveScopeLocked] = useState<ExamScope>(activeTrack);
  const [nowMs, setNowMs] = useState(() => Date.now());
  const [lastAttemptRecord, setLastAttemptRecord] = useState<ExamAttemptRecord | null>(null);
  const [certBuilderOpen, setCertBuilderOpen] = useState(false);

  const autoAdvanceTimerRef = useRef<number | null>(null);

  const hasAnyActiveLock =
    isExamScopeLocked(examLockedUntil.literacy, nowMs) ||
    isExamScopeLocked(examLockedUntil.programming, nowMs) ||
    isExamScopeLocked(examLockedUntil.all, nowMs);

  useEffect(() => {
    if (!hasAnyActiveLock) return;
    const timer = window.setInterval(() => {
      setNowMs(Date.now());
    }, 1000);
    return () => window.clearInterval(timer);
  }, [hasAnyActiveLock]);

  useEffect(() => {
    if (phase === 'intro') {
      setExamScope(activeTrack);
    }
  }, [activeTrack, phase]);

  const clearTimer = () => {
    if (autoAdvanceTimerRef.current !== null) {
      window.clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }
  };

  useEffect(() => {
    return () => clearTimer();
  }, []);

  const currentScope = phase === 'intro' ? examScope : activeScopeLocked;
  const activeQuestions =
    currentScope === 'all' ? questions : questions.filter((q) => q.category === currentScope);

  const totalQuestions = activeQuestions.length;
  const currentQuestion = activeQuestions[currentIndex] ?? activeQuestions[0];

  const litCount = questions.filter((q) => q.category === 'literacy').length;
  const progCount = questions.filter((q) => q.category === 'programming').length;

  const currentLockedUntil = examLockedUntil[currentScope] ?? 0;
  const isCurrentScopeLocked = isExamScopeLocked(currentLockedUntil, nowMs);
  const usedAttemptsForScope = isCurrentScopeLocked
    ? maxAttempts
    : (examAttempts[currentScope] ?? 0);
  const remainingAttempts = isCurrentScopeLocked
    ? 0
    : Math.max(0, maxAttempts - usedAttemptsForScope);

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

  const startExam = (scopeToStart: ExamScope = examScope) => {
    const questionsForStart =
      scopeToStart === 'all' ? questions : questions.filter((q) => q.category === scopeToStart);
    if (questionsForStart.length === 0) return;

    const lockedUntil = examLockedUntil[scopeToStart] ?? 0;
    if (isExamScopeLocked(lockedUntil, Date.now())) return;

    const used = examAttempts[scopeToStart] ?? 0;
    if (used >= maxAttempts) return;

    clearTimer();
    onConsumeAttempt(scopeToStart);
    setActiveScopeLocked(scopeToStart);
    setPhase('active');
    setCurrentIndex(0);
    setSelectedOption(null);
    setAnswers([]);
    setShowReview(false);
  };

  const finalizeExam = (finalAnswers: AnswerRecord[]) => {
    const finalScore = finalAnswers.filter((a) => a.isCorrect).length;
    const litTotal = activeQuestions.filter((q) => q.category === 'literacy').length;
    const progTotal = activeQuestions.filter((q) => q.category === 'programming').length;
    const litScore = finalAnswers.filter(
      (a, i) => a.isCorrect && activeQuestions[i]?.category === 'literacy'
    ).length;
    const progScore = finalAnswers.filter(
      (a, i) => a.isCorrect && activeQuestions[i]?.category === 'programming'
    ).length;
    const evalInfo = getEvaluation(finalScore, totalQuestions);
    const passed = evalInfo.tier !== 'retry';

    if (!passed && (examAttempts[activeScopeLocked] ?? 0) >= maxAttempts) {
      onLockExam24h(activeScopeLocked);
      setNowMs(Date.now());
    }

    const record: ExamAttemptRecord = {
      id: `exam-${Date.now()}`,
      studentName: studentName.trim() || defaultStudentName || 'Mehmon o‘quvchi',
      examScope: activeScopeLocked,
      score: finalScore,
      total: totalQuestions,
      passed,
      literacyScore: litScore,
      literacyTotal: litTotal,
      programmingScore: progScore,
      programmingTotal: progTotal,
      tier: evalInfo.tier,
      tierLabel: evalInfo.badgeText,
      completedAt: new Date().toISOString(),
    };

    setLastAttemptRecord(record);
    onRecordResult(record);
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
  const literacyTotal = activeQuestions.filter((q) => q.category === 'literacy').length;
  const programmingTotal = activeQuestions.filter((q) => q.category === 'programming').length;
  const literacyScore = answers.filter(
    (a, i) => a.isCorrect && activeQuestions[i]?.category === 'literacy'
  ).length;
  const programmingScore = answers.filter(
    (a, i) => a.isCorrect && activeQuestions[i]?.category === 'programming'
  ).length;

  const evaluation = getEvaluation(score, totalQuestions);
  const passThreshold = totalQuestions === 20 ? '15+' : `${Math.ceil(totalQuestions * 0.75)}+`;
  const isPassed = evaluation.tier !== 'retry';

  const isProgTheme = currentScope === 'programming';

  const scopeAttemptLeft = (scope: ExamScope) => {
    if (isExamScopeLocked(examLockedUntil[scope], nowMs)) return 0;
    return Math.max(0, maxAttempts - (examAttempts[scope] ?? 0));
  };

  const renderScopeFooterStatus = (scope: ExamScope) => {
    const lockedUntil = examLockedUntil[scope] ?? 0;
    if (isExamScopeLocked(lockedUntil, nowMs)) {
      return `24s blok · ${formatRemainingCountdown(lockedUntil, nowMs)}`;
    }
    return `Imkoniyat: ${scopeAttemptLeft(scope)} / ${maxAttempts}`;
  };

  return (
    <section
      id="imtihon"
      className={`py-10 md:py-16 text-white min-h-[calc(100vh-8rem)] ${
        isProgTheme ? 'bg-slate-950' : 'bg-slate-900'
      }`}
    >
      <ConfettiCanvas
        active={phase === 'result' && totalQuestions > 0 && score === totalQuestions}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {phase === 'intro' && (
          <div className="bg-slate-800/70 border border-slate-700 rounded-2xl p-6 sm:p-8 md:p-10 text-center">
            <p
              className={`text-sm font-semibold mb-2 ${
                isProgTheme ? 'text-indigo-400' : 'text-sky-400'
              }`}
            >
              Yakuniy bilim sinovi · Maksimal {maxAttempts} marta imkoniyat
            </p>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white text-balance mb-3">
              {examScope === 'literacy'
                ? `Kompyuter savodxonligi imtihoni (${totalQuestions} ta savol)`
                : examScope === 'programming'
                  ? `Dasturlash asoslari imtihoni (${totalQuestions} ta savol)`
                  : `Umumiy katta imtihon (${totalQuestions} ta savol)`}
            </h2>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed mb-6">
              Savollar murakkablashtirilgan — hisob-kitob, kod tahlili va xavfsizlik ssenariylari
              beriladi. Har bir yo‘nalish uchun{' '}
              <span className="font-semibold text-white">jami {maxAttempts} marta</span> imkoniyat
              ajratilgan.
            </p>

            {/* Dedicated Exam Scope Cards with Remaining Attempts */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto mb-7 text-left">
              <button
                type="button"
                onClick={() => setExamScope('literacy')}
                className={`min-h-[88px] p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  examScope === 'literacy'
                    ? 'bg-sky-500/20 border-sky-400 text-white'
                    : 'bg-slate-900/60 border-slate-700 text-slate-300 hover:border-slate-500'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-sky-400 mb-1">
                    <Monitor className="w-4 h-4 shrink-0" />
                    <span>1-Yo‘nalish</span>
                  </div>
                  <div className="text-sm font-bold text-white">Savodxonlik</div>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">{litCount} ta savol</div>
                </div>
                <div
                  className={`mt-2 pt-2 border-t border-slate-700/70 text-[11px] font-mono tabular-nums ${
                    scopeAttemptLeft('literacy') === 0 ? 'text-rose-400' : 'text-emerald-300'
                  }`}
                >
                  {renderScopeFooterStatus('literacy')}
                </div>
              </button>

              <button
                type="button"
                onClick={() => setExamScope('programming')}
                className={`min-h-[88px] p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  examScope === 'programming'
                    ? 'bg-indigo-500/20 border-indigo-400 text-white'
                    : 'bg-slate-900/60 border-slate-700 text-slate-300 hover:border-slate-500'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 mb-1">
                    <Code2 className="w-4 h-4 shrink-0" />
                    <span>2-Yo‘nalish</span>
                  </div>
                  <div className="text-sm font-bold text-white">Dasturlash</div>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">{progCount} ta savol</div>
                </div>
                <div
                  className={`mt-2 pt-2 border-t border-slate-700/70 text-[11px] font-mono tabular-nums ${
                    scopeAttemptLeft('programming') === 0 ? 'text-rose-400' : 'text-emerald-300'
                  }`}
                >
                  {renderScopeFooterStatus('programming')}
                </div>
              </button>

              <button
                type="button"
                onClick={() => setExamScope('all')}
                className={`min-h-[88px] p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  examScope === 'all'
                    ? 'bg-emerald-500/20 border-emerald-400 text-white'
                    : 'bg-slate-900/60 border-slate-700 text-slate-300 hover:border-slate-500'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-1">
                    <Layers className="w-4 h-4 shrink-0" />
                    <span>Ikkala fan</span>
                  </div>
                  <div className="text-sm font-bold text-white">Umumiy imtihon</div>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">
                    {questions.length} ta savol
                  </div>
                </div>
                <div
                  className={`mt-2 pt-2 border-t border-slate-700/70 text-[11px] font-mono tabular-nums ${
                    scopeAttemptLeft('all') === 0 ? 'text-rose-400' : 'text-emerald-300'
                  }`}
                >
                  {renderScopeFooterStatus('all')}
                </div>
              </button>
            </div>

            {/* Pre-Exam Eligibility & Personal Results Check */}
            {(() => {
              const scopeHistory = examResults.filter((r) => r.examScope === examScope);
              const bestAttempt = scopeHistory.reduce<ExamAttemptRecord | null>((best, curr) => {
                if (!best) return curr;
                const currPct = curr.total > 0 ? curr.score / curr.total : 0;
                const bestPct = best.total > 0 ? best.score / best.total : 0;
                return currPct > bestPct ? curr : best;
              }, null);
              const bestPct =
                bestAttempt && bestAttempt.total > 0
                  ? Math.round((bestAttempt.score / bestAttempt.total) * 100)
                  : 0;

              return (
                <div className="max-w-2xl mx-auto mb-6 p-4 rounded-xl bg-slate-900/70 border border-slate-700 text-left space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-slate-300">
                      Imtihon ruxsati va natija tekshiruvi
                    </span>
                    <span
                      className={`text-xs font-semibold ${
                        isCurrentScopeLocked || remainingAttempts === 0
                          ? 'text-rose-400'
                          : 'text-emerald-400'
                      }`}
                    >
                      {isCurrentScopeLocked
                        ? '24 soatlik tanaffus'
                        : remainingAttempts > 0
                          ? 'Imtihonga ruxsat bor'
                          : 'Imkoniyat tugagan'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-800">
                    <div>
                      <div className="text-[11px] text-slate-400">Savollar</div>
                      <div className="text-base font-bold font-mono tabular-nums text-white">
                        {totalQuestions} ta ({passThreshold})
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-400">Qolgan imkoniyat</div>
                      <div
                        className={`text-base font-bold font-mono tabular-nums ${
                          remainingAttempts === 0 ? 'text-rose-400' : 'text-emerald-400'
                        }`}
                      >
                        {remainingAttempts} / {maxAttempts}
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-400">Eng yaxshi natija</div>
                      <div className="text-base font-bold font-mono tabular-nums text-white">
                        {bestAttempt ? `${bestAttempt.score}/${bestAttempt.total} (${bestPct}%)` : 'Yo‘q'}
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-400">Tayyorgarlik</div>
                      <div className="text-base font-bold font-mono tabular-nums text-white">
                        {readinessSummary
                          ? `${readinessSummary.lessonsDone}/${readinessSummary.lessonsTotal} dars`
                          : `${scopeHistory.length} urinish`}
                      </div>
                    </div>
                  </div>

                  {onGoToCertificates && (
                    <div className="pt-1 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <span className="text-slate-400">
                        Kirishdan oldin barcha urinish va sertifikatlaringizni ko‘rishingiz mumkin.
                      </span>
                      <button
                        type="button"
                        onClick={onGoToCertificates}
                        className="font-semibold text-sky-400 hover:text-sky-300 underline cursor-pointer"
                      >
                        Barcha natijalarimni tekshirish
                      </button>
                    </div>
                  )}
                </div>
              );
            })()}

            <div className="max-w-sm mx-auto mb-6 text-left">
              <label
                htmlFor="student-name-input"
                className="block text-xs font-medium text-slate-300 mb-1.5"
              >
                Ism va familiyangiz
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
                Hozircha bu yo‘nalishda imtihon savollari mavjud emas.
              </p>
            ) : remainingAttempts <= 0 || isCurrentScopeLocked ? (
              <div className="max-w-lg mx-auto rounded-xl bg-rose-950/60 border border-rose-700 p-5 text-left space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-rose-300">
                  <Lock className="w-4 h-4 shrink-0" />
                  <span>
                    {isCurrentScopeLocked
                      ? '3 marta yiqilganingiz sababli imtihon 24 soatdan keyin ochiladi'
                      : `Bu yo‘nalish uchun 3 ta imkoniyat tugadi (0 / ${maxAttempts})`}
                  </span>
                </div>

                {isCurrentScopeLocked && (
                  <div className="p-3.5 rounded-lg bg-slate-950/70 border border-rose-800/70 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-xs text-rose-200">
                      <Clock className="w-4 h-4 text-rose-400 shrink-0" />
                      <div>
                        <div className="font-semibold">Qayta ochilish vaqti</div>
                        <div className="text-[11px] text-rose-300/80">
                          {formatUnlockClock(currentLockedUntil)}
                        </div>
                      </div>
                    </div>
                    <div className="text-lg sm:text-xl font-bold font-mono tabular-nums text-white">
                      {formatRemainingCountdown(currentLockedUntil, nowMs)}
                    </div>
                  </div>
                )}

                <p className="text-xs sm:text-sm text-rose-100/90 leading-relaxed">
                  {isCurrentScopeLocked
                    ? 'Imtihondan 3 marta o‘ta olmaganingiz uchun tizim 24 soatlik tanaffus belgiladi. Bu vaqtda darslarni takrorlang — 24 soatdan keyin avtomatik ochiladi yoki ustoz Admin panel orqali hoziroq ochishi mumkin.'
                    : `Siz ushbu imtihondan maksimal ${maxAttempts} marta foydalanib bo‘ldingiz. Bilimingizni mustahkamlash uchun darslar va amaliy masalalarga qayting yoki ustozdan (Admin panel orqali) qayta ochishni so‘rang.`}
                </p>

                <div className="flex flex-wrap gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={onBackToLessons}
                    className="min-h-[42px] px-4 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-lg cursor-pointer"
                  >
                    Darslarni takrorlash
                  </button>
                  {onGoToChallenges && (
                    <button
                      type="button"
                      onClick={onGoToChallenges}
                      className="min-h-[42px] px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg cursor-pointer"
                    >
                      Masalalarni yechish
                    </button>
                  )}
                  {onOpenAdmin && (
                    <button
                      type="button"
                      onClick={onOpenAdmin}
                      className="min-h-[42px] inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-sky-200 bg-slate-900 border border-slate-700 hover:border-sky-400 rounded-lg cursor-pointer"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Admin orqali ochish</span>
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="inline-flex items-center gap-1.5 text-xs text-amber-300">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    Boshlash tugmasi bosilganda 1 ta imkoniyat hisoblanadi ({remainingAttempts} ta
                    qolgan).
                  </span>
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => startExam(examScope)}
                    className={`w-full sm:w-auto min-h-[48px] px-7 py-3.5 text-sm font-semibold active:scale-[0.99] rounded-xl sm:rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                      isProgTheme
                        ? 'text-white bg-indigo-500 hover:bg-indigo-400'
                        : 'text-slate-950 bg-sky-400 hover:bg-sky-300'
                    }`}
                  >
                    Imtihonni boshlash ({totalQuestions} ta savol)
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {phase === 'active' && currentQuestion && (
          <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-8 md:p-10">
            {/* Progress Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {currentQuestion.categoryLabel} · Urinish {usedAttemptsForScope}/{maxAttempts}
              </div>
              <div className="text-sm font-mono font-semibold text-slate-900 dark:text-white tabular-nums">
                Savol {currentIndex + 1} / {totalQuestions}
              </div>
            </div>

            <div
              className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-7"
              role="progressbar"
              aria-valuenow={currentIndex + 1}
              aria-valuemin={1}
              aria-valuemax={totalQuestions}
            >
              <div
                className={`h-full transition-all duration-300 ${
                  currentQuestion.category === 'programming' ? 'bg-indigo-600' : 'bg-sky-600'
                }`}
                style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
              />
            </div>

            <h3 className="text-lg sm:text-2xl font-semibold text-slate-900 dark:text-white leading-snug mb-6">
              {currentIndex + 1}. {currentQuestion.question}
            </h3>

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
                </span>{' '}
                · Qolgan imkoniyat:{' '}
                <span className="font-mono font-semibold tabular-nums">
                  {remainingAttempts} / {maxAttempts}
                </span>
              </p>
            </div>

            {isPassed && lastAttemptRecord && (
              <div className="mt-5 p-4 sm:p-5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                      <Bot className="w-4 h-4 shrink-0" />
                      <span>AI yordamchi orqali rasm sertifikat tayyor</span>
                    </div>
                    <p className="text-xs sm:text-sm text-emerald-950 dark:text-emerald-100">
                      Ism-familiyangiz va rasmingizni yuklang — natijalaringiz bilan darhol rasmiy PNG
                      sertifikat chiqariladi.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setCertBuilderOpen(true)}
                      className="min-h-[44px] inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors whitespace-nowrap cursor-pointer"
                    >
                      <Camera className="w-4 h-4 shrink-0" />
                      <span>
                        {issuedCertificates.some((c) => c.attemptId === lastAttemptRecord.id)
                          ? 'Yangi rasm sertifikat chiqarish'
                          : 'Hoziroq sertifikat chiqarish'}
                      </span>
                    </button>

                    {onGoToCertificates && (
                      <button
                        type="button"
                        onClick={onGoToCertificates}
                        className="min-h-[44px] px-3.5 py-2.5 text-xs font-semibold text-emerald-800 dark:text-emerald-200 bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-700 rounded-xl whitespace-nowrap cursor-pointer"
                      >
                        Sertifikatlarim
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Category Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6 py-5 border-t border-b border-slate-200 dark:border-slate-800">
              {literacyTotal > 0 && (
                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                    Kompyuter savodxonligi
                  </div>
                  <div className="text-xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                    {literacyScore} / {literacyTotal} to‘g‘ri
                  </div>
                </div>
              )}
              {programmingTotal > 0 && (
                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                    Dasturlash asoslari
                  </div>
                  <div className="text-xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                    {programmingScore} / {programmingTotal} to‘g‘ri
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3">
                {remainingAttempts > 0 && !isCurrentScopeLocked ? (
                  <button
                    type="button"
                    onClick={() => startExam(activeScopeLocked)}
                    className="min-h-[44px] inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-slate-900 dark:bg-sky-500 dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-sky-400 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4 shrink-0" />
                    <span>Qayta urinish ({remainingAttempts} ta qoldi)</span>
                  </button>
                ) : (
                  <span className="min-h-[44px] inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 rounded-lg">
                    <Clock className="w-4 h-4 shrink-0" />
                    <span>
                      {isCurrentScopeLocked
                        ? `3 marta yiqildingiz · 24 soatdan keyin ochiladi (${formatRemainingCountdown(currentLockedUntil, nowMs)})`
                        : '3 ta imkoniyat tugadi'}
                    </span>
                  </span>
                )}

                <button
                  type="button"
                  onClick={() => setPhase('intro')}
                  className="min-h-[44px] inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span>Boshqa imtihon tanlash</span>
                </button>

                <button
                  type="button"
                  onClick={onBackToLessons}
                  className="min-h-[44px] inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 shrink-0" />
                  <span>Darslarga qaytish</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setShowReview((prev) => !prev)}
                className="min-h-[44px] text-sm font-medium text-sky-700 dark:text-sky-400 hover:text-sky-800 whitespace-nowrap shrink-0 cursor-pointer"
              >
                {showReview ? 'Tahlilni yashirish' : 'Javoblarni tahlil qilish'}
              </button>
            </div>

            {showReview && (
              <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 space-y-4">
                <h4 className="text-base font-semibold text-slate-900 dark:text-white">
                  Barcha savollar tahlili
                </h4>
                <div className="space-y-3">
                  {activeQuestions.map((q, idx) => {
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

      {certBuilderOpen && lastAttemptRecord && (
        <CertificateBuilderModal
          attempt={lastAttemptRecord}
          defaultFullName={studentName || defaultStudentName}
          onCertificateReady={async (cert) => {
            if (onCreateCertificate) {
              await onCreateCertificate(cert);
            }
          }}
          onClose={() => setCertBuilderOpen(false)}
        />
      )}
    </section>
  );
}
