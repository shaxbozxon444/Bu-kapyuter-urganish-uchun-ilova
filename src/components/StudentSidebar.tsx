import { useState } from 'react';
import {
  Award,
  BookA,
  BookOpen,
  Bot,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Circle,
  ClipboardCheck,
  Code2,
  Compass,
  Flame,
  HelpCircle,
  Home,
  Lock,
  LogIn,
  LogOut,
  Monitor,
  Moon,
  RotateCcw,
  Sun,
  Terminal,
  UserCheck,
  Video,
  X,
} from 'lucide-react';
import type { LessonCategory, LessonItem } from '../data/curriculum';

export type SidebarDestination =
  | 'kirish'
  | 'yolxarita'
  | 'videolar'
  | 'darslar'
  | 'lab'
  | 'masalalar'
  | 'aiustoz'
  | 'bilasizmi'
  | 'lugat'
  | 'imtihon'
  | 'sertifikat';

interface StudentSidebarProps {
  lessons: LessonItem[];
  completedLessons: string[];
  videoCount: number;
  watchedVideoCount: number;
  challengeCount: number;
  solvedChallengeCount: number;
  dykCount: number;
  glossaryCount: number;
  examCount: number;
  remainingAttemptsForTrack: number;
  maxAttempts: number;
  certificateCount: number;
  activeDestination: SidebarDestination;
  activeTrack: LessonCategory;
  onSelectTrack: (track: LessonCategory) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  onNavigateDestination: (dest: SidebarDestination) => void;
  onNavigateLesson: (lessonId: string) => void;
  onResetProgress: () => void;
  onOpenAdmin: () => void;
  userDisplayName: string | null;
  userEmail: string | null;
  isAuthenticated: boolean;
  onOpenAuth: () => void;
  onSignOut: () => void;
  open: boolean;
  onClose: () => void;
}

export function StudentSidebar({
  lessons,
  completedLessons,
  videoCount,
  watchedVideoCount,
  challengeCount,
  solvedChallengeCount,
  dykCount,
  glossaryCount,
  examCount,
  remainingAttemptsForTrack,
  maxAttempts,
  certificateCount,
  activeDestination,
  activeTrack,
  onSelectTrack,
  isDark,
  onToggleTheme,
  onNavigateDestination,
  onNavigateLesson,
  onResetProgress,
  onOpenAdmin,
  userDisplayName,
  userEmail,
  isAuthenticated,
  onOpenAuth,
  onSignOut,
  open,
  onClose,
}: StudentSidebarProps) {
  const [lessonsExpanded, setLessonsExpanded] = useState(false);

  if (!open) return null;

  const isProg = activeTrack === 'programming';
  const trackLessons = lessons.filter((l) => l.category === activeTrack);
  const completedCount = completedLessons.filter((id) =>
    lessons.some((l) => l.id === id)
  ).length;
  const totalItems = lessons.length + videoCount + challengeCount;
  const progressPct =
    totalItems > 0
      ? Math.round(((completedCount + watchedVideoCount + solvedChallengeCount) / totalItems) * 100)
      : 0;

  const navBtnClass = (active: boolean) =>
    `w-full min-h-[44px] flex items-center justify-between gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer text-left ${
      active
        ? isProg
          ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold'
          : 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-semibold'
        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
    }`;

  const iconAccent = isProg
    ? 'text-indigo-600 dark:text-indigo-400'
    : 'text-sky-600 dark:text-sky-400';

  return (
    <div
      className="fixed inset-0 z-50 flex justify-start"
      role="dialog"
      aria-modal="true"
      aria-label="Asosiy chap burchak menyusi"
    >
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/65"
      />
      <aside className="relative z-10 w-80 sm:w-88 max-w-[88vw] h-full flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 shadow-xl">
        {/* Corner Drawer Header */}
        <div className="h-14 lg:h-16 px-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div>
            <div
              className="text-base font-bold tracking-tight"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              murodillayev_dev
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              Barcha bo‘limlar va sozlamalar
            </div>
          </div>
          <button
            type="button"
            aria-label="Menyuni yopish"
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] -mr-2 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {/* Account Card inside Corner Menu */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            {isAuthenticated ? (
              <div className="space-y-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {userDisplayName || 'O‘quvchi'}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {userEmail || 'Bulutli akkaunt faol'}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onSignOut}
                  className="w-full min-h-[38px] inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-950/70 rounded-lg transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Akkauntdan chiqish</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Natijalaringiz va sertifikatlaringiz o‘chib ketmasligi uchun akkauntga kiring.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenAuth();
                  }}
                  className="w-full min-h-[42px] inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-sky-500 dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-sky-400 rounded-lg transition-colors cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Login / Parol bilan kirish</span>
                </button>
              </div>
            )}
          </div>

          {/* Track / Tema Switcher */}
          <div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
              Yo‘nalish (Tema)
            </div>
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
              <button
                type="button"
                onClick={() => onSelectTrack('literacy')}
                className={`min-h-[40px] flex items-center justify-center gap-1.5 px-2 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  activeTrack === 'literacy'
                    ? 'bg-white dark:bg-slate-950 text-sky-700 dark:text-sky-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                <Monitor className="w-3.5 h-3.5 shrink-0" />
                <span>Savodxonlik</span>
              </button>
              <button
                type="button"
                onClick={() => onSelectTrack('programming')}
                className={`min-h-[40px] flex items-center justify-center gap-1.5 px-2 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  activeTrack === 'programming'
                    ? 'bg-white dark:bg-slate-950 text-indigo-700 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                <Code2 className="w-3.5 h-3.5 shrink-0" />
                <span>Dasturlash</span>
              </button>
            </div>
          </div>

          {/* Progress Summary */}
          <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs font-medium mb-2">
              <span className="text-slate-500 dark:text-slate-400">Umumiy o‘zlashtirish</span>
              <span
                className={`font-mono font-semibold tabular-nums ${
                  isProg ? 'text-indigo-700 dark:text-indigo-400' : 'text-sky-700 dark:text-sky-400'
                }`}
              >
                {progressPct}%
              </span>
            </div>
            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  isProg ? 'bg-indigo-600' : 'bg-emerald-600'
                }`}
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 tabular-nums">
              <span>Videolar: {watchedVideoCount}/{videoCount}</span>
              <span>Darslar: {completedCount}/{lessons.length}</span>
            </div>
            {(completedCount > 0 || watchedVideoCount > 0 || solvedChallengeCount > 0) && (
              <button
                type="button"
                onClick={onResetProgress}
                className="mt-2 min-h-[36px] inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3 shrink-0" />
                <span>Progressni nolga tushirish</span>
              </button>
            )}
          </div>

          {/* Categorized Navigation */}
          <nav aria-label="Menyu bo‘limlari" className="space-y-4">
            <div className="space-y-1">
              <div className="px-2 text-[11px] font-semibold text-slate-400 dark:text-slate-500">
                O‘quv bo‘limi
              </div>

              <button
                type="button"
                onClick={() => onNavigateDestination('kirish')}
                className={navBtnClass(activeDestination === 'kirish')}
              >
                <span className="inline-flex items-center gap-2.5">
                  <Home className="w-4 h-4 shrink-0" />
                  <span>Bosh sahifa</span>
                </span>
              </button>

              <button
                type="button"
                onClick={() => onNavigateDestination('yolxarita')}
                className={navBtnClass(activeDestination === 'yolxarita')}
              >
                <span className="inline-flex items-center gap-2.5">
                  <Compass className={`w-4 h-4 shrink-0 ${iconAccent}`} />
                  <span>O‘quv yo‘l xaritasi</span>
                </span>
              </button>

              <button
                type="button"
                onClick={() => onNavigateDestination('videolar')}
                className={navBtnClass(activeDestination === 'videolar')}
              >
                <span className="inline-flex items-center gap-2.5">
                  <Video className={`w-4 h-4 shrink-0 ${iconAccent}`} />
                  <span>Videodarslar</span>
                </span>
                <span className="font-mono text-xs tabular-nums text-slate-400">{videoCount}</span>
              </button>

              <div>
                <div className="flex items-center justify-between gap-1">
                  <button
                    type="button"
                    onClick={() => onNavigateDestination('darslar')}
                    className={`flex-1 min-h-[44px] flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer text-left ${
                      activeDestination === 'darslar'
                        ? isProg
                          ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold'
                          : 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-semibold'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <BookOpen className={`w-4 h-4 shrink-0 ${iconAccent}`} />
                    <span className="truncate">
                      {isProg ? 'Dasturlash darslari' : 'Savodxonlik darslari'}
                    </span>
                  </button>
                  <button
                    type="button"
                    aria-label="Darslar ro‘yxatini ochish yoki yopish"
                    onClick={() => setLessonsExpanded((p) => !p)}
                    className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg cursor-pointer"
                  >
                    {lessonsExpanded ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {lessonsExpanded && (
                  <div className="mt-1 pl-4 space-y-0.5">
                    {trackLessons.map((lesson) => {
                      const done = completedLessons.includes(lesson.id);
                      return (
                        <button
                          key={lesson.id}
                          type="button"
                          onClick={() => onNavigateLesson(lesson.id)}
                          className="w-full min-h-[40px] flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors text-left cursor-pointer"
                        >
                          {done ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          ) : (
                            <Circle className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 shrink-0" />
                          )}
                          <span className="truncate">
                            {lesson.number}. {lesson.title}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="px-2 text-[11px] font-semibold text-slate-400 dark:text-slate-500">
                Amaliyot va AI Ustoz
              </div>

              <button
                type="button"
                onClick={() => onNavigateDestination('aiustoz')}
                className={navBtnClass(activeDestination === 'aiustoz')}
              >
                <span className="inline-flex items-center gap-2.5">
                  <Bot className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
                  <span>AI Ustoz (Fikr beruvchi)</span>
                </span>
              </button>

              <button
                type="button"
                onClick={() => onNavigateDestination('masalalar')}
                className={navBtnClass(activeDestination === 'masalalar')}
              >
                <span className="inline-flex items-center gap-2.5">
                  <Flame className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span>Qiyin masalalar</span>
                </span>
                <span className="font-mono text-xs tabular-nums text-slate-400">
                  {solvedChallengeCount}/{challengeCount}
                </span>
              </button>

              <button
                type="button"
                onClick={() => onNavigateDestination('lab')}
                className={navBtnClass(activeDestination === 'lab')}
              >
                <span className="inline-flex items-center gap-2.5">
                  <Terminal className="w-4 h-4 shrink-0" />
                  <span>Amaliy laboratoriya</span>
                </span>
              </button>

              <button
                type="button"
                onClick={() => onNavigateDestination('bilasizmi')}
                className={navBtnClass(activeDestination === 'bilasizmi')}
              >
                <span className="inline-flex items-center gap-2.5">
                  <HelpCircle className="w-4 h-4 shrink-0" />
                  <span>Bilasizmi?</span>
                </span>
                <span className="font-mono text-xs tabular-nums text-slate-400">{dykCount}</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigateDestination('lugat')}
                className={navBtnClass(activeDestination === 'lugat')}
              >
                <span className="inline-flex items-center gap-2.5">
                  <BookA className="w-4 h-4 shrink-0" />
                  <span>IT Lug‘at</span>
                </span>
                <span className="font-mono text-xs tabular-nums text-slate-400">{glossaryCount}</span>
              </button>
            </div>

            <div className="space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="px-2 text-[11px] font-semibold text-slate-400 dark:text-slate-500">
                Imtihon va Sertifikat
              </div>

              <button
                type="button"
                onClick={() => onNavigateDestination('imtihon')}
                className={navBtnClass(activeDestination === 'imtihon')}
              >
                <span className="inline-flex items-center gap-2.5">
                  <ClipboardCheck className={`w-4 h-4 shrink-0 ${iconAccent}`} />
                  <span>Yakuniy imtihon</span>
                </span>
                <span
                  className={`font-mono text-xs tabular-nums ${
                    remainingAttemptsForTrack === 0
                      ? 'text-rose-500'
                      : 'text-emerald-600 dark:text-emerald-400'
                  }`}
                >
                  {remainingAttemptsForTrack}/{maxAttempts} · {examCount}
                </span>
              </button>

              <button
                type="button"
                onClick={() => onNavigateDestination('sertifikat')}
                className={navBtnClass(activeDestination === 'sertifikat')}
              >
                <span className="inline-flex items-center gap-2.5">
                  <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Sertifikatlarim</span>
                </span>
                <span className="font-mono text-xs tabular-nums text-slate-400">
                  {certificateCount}
                </span>
              </button>
            </div>
          </nav>
        </div>

        {/* Bottom Utility Actions */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-2 pb-[calc(1rem+env(safe-area-inset-bottom))]">
          <button
            type="button"
            onClick={onToggleTheme}
            className="w-full min-h-[44px] flex items-center justify-between gap-2 px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            <span className="inline-flex items-center gap-2">
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400 shrink-0" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600 shrink-0" />
              )}
              <span>{isDark ? 'Kunduzgi rejim' : 'Tungi rejim'}</span>
            </span>
          </button>

          <button
            type="button"
            onClick={onOpenAdmin}
            className="w-full min-h-[44px] flex items-center justify-center gap-2 px-3.5 py-2.5 text-xs font-semibold text-white bg-slate-900 dark:bg-sky-500 dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-sky-400 rounded-lg transition-colors cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5 shrink-0" />
            <span>Admin panel (Parolli)</span>
          </button>
        </div>
      </aside>
    </div>
  );
}
