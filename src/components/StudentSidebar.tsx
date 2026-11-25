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
  Keyboard,
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
  | 'qoidalar'
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
  isTrackExamLocked?: boolean;
  lockedRemainingText?: string;
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
  isTrackExamLocked = false,
  lockedRemainingText,
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
    `w-full min-h-[38px] flex items-center justify-between gap-2 px-2.5 py-1.5 text-[12.5px] rounded-lg transition-colors cursor-pointer text-left ${
      active
        ? isProg
          ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold'
          : 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-semibold'
        : 'text-slate-700 dark:text-slate-200 font-medium hover:bg-slate-100/80 dark:hover:bg-slate-800/80'
    }`;

  const iconClass = (active: boolean) =>
    `w-3.5 h-3.5 shrink-0 ${
      active
        ? isProg
          ? 'text-indigo-600 dark:text-indigo-400'
          : 'text-sky-600 dark:text-sky-400'
        : 'text-slate-400 dark:text-slate-500'
    }`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-start p-3 pt-14 sm:p-4 sm:pt-16"
      role="dialog"
      aria-modal="true"
      aria-label="Chap burchak menyusi"
    >
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/50 backdrop-blur-[1px]"
      />
      <aside className="relative z-10 w-[264px] sm:w-[292px] max-w-[86vw] max-h-[78vh] flex flex-col bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-2xl shadow-2xl overflow-hidden">
        {/* Compact Menu Header */}
        <div className="h-11 px-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1.5 min-w-0">
            <span
              className="text-sm font-bold tracking-tight truncate"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              BilimKod
            </span>
            <span className="text-[11px] text-slate-400 dark:text-slate-500 truncate">
              · Menyu
            </span>
          </div>
          <button
            type="button"
            aria-label="Menyuni yopish"
            onClick={onClose}
            className="min-h-[36px] min-w-[36px] -mr-1.5 flex items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-2.5 py-2.5 space-y-2.5">
          {/* Compact Account Strip */}
          <div className="px-1 pb-2 border-b border-slate-100 dark:border-slate-800/80">
            {isAuthenticated ? (
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <UserCheck className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                      {userDisplayName || 'O‘quvchi'}
                    </div>
                    <div className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                      {userEmail || 'Saqlangan profil'}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onSignOut}
                  className="min-h-[32px] inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-md transition-colors shrink-0 cursor-pointer"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Chiqish</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                    Profil
                  </div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                    Natijalarni saqlash
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenAuth();
                  }}
                  className="min-h-[32px] inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-white bg-slate-900 dark:bg-sky-500 dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-sky-400 rounded-lg transition-colors shrink-0 cursor-pointer"
                >
                  <LogIn className="w-3 h-3" />
                  <span>Kirish</span>
                </button>
              </div>
            )}
          </div>

          {/* Track Switcher + Slim Progress */}
          <div className="space-y-2 pb-2 border-b border-slate-100 dark:border-slate-800/80">
            <div className="grid grid-cols-2 gap-1 p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg">
              <button
                type="button"
                onClick={() => onSelectTrack('literacy')}
                className={`min-h-[32px] flex items-center justify-center gap-1 px-2 py-1 text-[11px] font-medium rounded-md transition-colors cursor-pointer ${
                  activeTrack === 'literacy'
                    ? 'bg-white dark:bg-slate-950 text-sky-700 dark:text-sky-400 font-semibold shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Monitor className="w-3 h-3 shrink-0" />
                <span>Savodxonlik</span>
              </button>
              <button
                type="button"
                onClick={() => onSelectTrack('programming')}
                className={`min-h-[32px] flex items-center justify-center gap-1 px-2 py-1 text-[11px] font-medium rounded-md transition-colors cursor-pointer ${
                  activeTrack === 'programming'
                    ? 'bg-white dark:bg-slate-950 text-indigo-700 dark:text-indigo-400 font-semibold shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Code2 className="w-3 h-3 shrink-0" />
                <span>Dasturlash</span>
              </button>
            </div>

            <div className="px-1">
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="text-slate-500 dark:text-slate-400 tabular-nums">
                  {watchedVideoCount}/{videoCount} video · {completedCount}/{lessons.length} dars
                </span>
                <div className="inline-flex items-center gap-1.5">
                  <span
                    className={`font-mono font-semibold tabular-nums ${
                      isProg ? 'text-indigo-600 dark:text-indigo-400' : 'text-sky-600 dark:text-sky-400'
                    }`}
                  >
                    {progressPct}%
                  </span>
                  {(completedCount > 0 || watchedVideoCount > 0 || solvedChallengeCount > 0) && (
                    <button
                      type="button"
                      title="Progressni nolga tushirish"
                      aria-label="Progressni nolga tushirish"
                      onClick={onResetProgress}
                      className="p-0.5 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
              <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    isProg ? 'bg-indigo-600' : 'bg-sky-500'
                  }`}
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          </div>

          {/* Categorized Compact Navigation */}
          <nav aria-label="Menyu bo‘limlari" className="space-y-2.5">
            <div className="space-y-0.5">
              <div className="px-2.5 pb-0.5 text-[10px] font-semibold text-slate-400 dark:text-slate-500">
                O‘quv bo‘limi
              </div>

              <button
                type="button"
                onClick={() => onNavigateDestination('kirish')}
                className={navBtnClass(activeDestination === 'kirish')}
              >
                <span className="inline-flex items-center gap-2 min-w-0">
                  <Home className={iconClass(activeDestination === 'kirish')} />
                  <span className="truncate">Bosh sahifa</span>
                </span>
              </button>

              <button
                type="button"
                onClick={() => onNavigateDestination('yolxarita')}
                className={navBtnClass(activeDestination === 'yolxarita')}
              >
                <span className="inline-flex items-center gap-2 min-w-0">
                  <Compass className={iconClass(activeDestination === 'yolxarita')} />
                  <span className="truncate">O‘quv yo‘l xaritasi</span>
                </span>
              </button>

              <button
                type="button"
                onClick={() => onNavigateDestination('videolar')}
                className={navBtnClass(activeDestination === 'videolar')}
              >
                <span className="inline-flex items-center gap-2 min-w-0">
                  <Video className={iconClass(activeDestination === 'videolar')} />
                  <span className="truncate">Videodarslar</span>
                </span>
                <span className="font-mono text-[11px] tabular-nums text-slate-400">{videoCount}</span>
              </button>

              <div>
                <div className="flex items-center justify-between gap-1">
                  <button
                    type="button"
                    onClick={() => onNavigateDestination('darslar')}
                    className={`flex-1 min-h-[38px] flex items-center gap-2 px-2.5 py-1.5 text-[12.5px] rounded-lg transition-colors cursor-pointer text-left ${
                      activeDestination === 'darslar'
                        ? isProg
                          ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold'
                          : 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-semibold'
                        : 'text-slate-700 dark:text-slate-200 font-medium hover:bg-slate-100/80 dark:hover:bg-slate-800/80'
                    }`}
                  >
                    <BookOpen className={iconClass(activeDestination === 'darslar')} />
                    <span className="truncate">
                      {isProg ? 'Dasturlash darslari' : 'Savodxonlik darslari'}
                    </span>
                  </button>
                  <button
                    type="button"
                    aria-label="Darslar ro‘yxatini ochish yoki yopish"
                    onClick={() => setLessonsExpanded((p) => !p)}
                    className="min-h-[38px] min-w-[34px] flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg cursor-pointer"
                  >
                    {lessonsExpanded ? (
                      <ChevronDown className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                {lessonsExpanded && (
                  <div className="mt-0.5 pl-3 space-y-0.5">
                    {trackLessons.map((lesson) => {
                      const done = completedLessons.includes(lesson.id);
                      return (
                        <button
                          key={lesson.id}
                          type="button"
                          onClick={() => onNavigateLesson(lesson.id)}
                          className="w-full min-h-[34px] flex items-center gap-2 px-2 py-1 text-[11.5px] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/80 rounded-md transition-colors text-left cursor-pointer"
                        >
                          {done ? (
                            <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                          ) : (
                            <Circle className="w-3 h-3 text-slate-300 dark:text-slate-600 shrink-0" />
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

            <div className="space-y-0.5 pt-2 border-t border-slate-100 dark:border-slate-800/80">
              <div className="px-2.5 pb-0.5 text-[10px] font-semibold text-slate-400 dark:text-slate-500">
                Amaliyot va AI
              </div>

              <button
                type="button"
                onClick={() => onNavigateDestination('qoidalar')}
                className={navBtnClass(activeDestination === 'qoidalar')}
              >
                <span className="inline-flex items-center gap-2 min-w-0">
                  <Keyboard className={iconClass(activeDestination === 'qoidalar')} />
                  <span className="truncate">Qoidalar &amp; Ctrl+Shift</span>
                </span>
              </button>

              <button
                type="button"
                onClick={() => onNavigateDestination('aiustoz')}
                className={navBtnClass(activeDestination === 'aiustoz')}
              >
                <span className="inline-flex items-center gap-2 min-w-0">
                  <Bot className={iconClass(activeDestination === 'aiustoz')} />
                  <span className="truncate">AI Ustoz</span>
                </span>
              </button>

              <button
                type="button"
                onClick={() => onNavigateDestination('masalalar')}
                className={navBtnClass(activeDestination === 'masalalar')}
              >
                <span className="inline-flex items-center gap-2 min-w-0">
                  <Flame className={iconClass(activeDestination === 'masalalar')} />
                  <span className="truncate">Qiyin masalalar</span>
                </span>
                <span className="font-mono text-[11px] tabular-nums text-slate-400">
                  {solvedChallengeCount}/{challengeCount}
                </span>
              </button>

              <button
                type="button"
                onClick={() => onNavigateDestination('lab')}
                className={navBtnClass(activeDestination === 'lab')}
              >
                <span className="inline-flex items-center gap-2 min-w-0">
                  <Terminal className={iconClass(activeDestination === 'lab')} />
                  <span className="truncate">Amaliy laboratoriya</span>
                </span>
              </button>

              <button
                type="button"
                onClick={() => onNavigateDestination('bilasizmi')}
                className={navBtnClass(activeDestination === 'bilasizmi')}
              >
                <span className="inline-flex items-center gap-2 min-w-0">
                  <HelpCircle className={iconClass(activeDestination === 'bilasizmi')} />
                  <span className="truncate">Bilasizmi?</span>
                </span>
                <span className="font-mono text-[11px] tabular-nums text-slate-400">{dykCount}</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigateDestination('lugat')}
                className={navBtnClass(activeDestination === 'lugat')}
              >
                <span className="inline-flex items-center gap-2 min-w-0">
                  <BookA className={iconClass(activeDestination === 'lugat')} />
                  <span className="truncate">IT Lug‘at</span>
                </span>
                <span className="font-mono text-[11px] tabular-nums text-slate-400">{glossaryCount}</span>
              </button>
            </div>

            <div className="space-y-0.5 pt-2 border-t border-slate-100 dark:border-slate-800/80">
              <div className="px-2.5 pb-0.5 text-[10px] font-semibold text-slate-400 dark:text-slate-500">
                Imtihon va Sertifikat
              </div>

              <button
                type="button"
                onClick={() => onNavigateDestination('imtihon')}
                className={navBtnClass(activeDestination === 'imtihon')}
              >
                <span className="inline-flex items-center gap-2 min-w-0">
                  <ClipboardCheck className={iconClass(activeDestination === 'imtihon')} />
                  <span className="truncate">Yakuniy imtihon</span>
                </span>
                <span
                  className={`font-mono text-[11px] tabular-nums shrink-0 ${
                    isTrackExamLocked || remainingAttemptsForTrack === 0
                      ? 'text-rose-500 font-semibold'
                      : 'text-emerald-600 dark:text-emerald-400'
                  }`}
                >
                  {isTrackExamLocked
                    ? lockedRemainingText || '24s blok'
                    : `${remainingAttemptsForTrack}/${maxAttempts} · ${examCount}`}
                </span>
              </button>

              <button
                type="button"
                onClick={() => onNavigateDestination('sertifikat')}
                className={navBtnClass(activeDestination === 'sertifikat')}
              >
                <span className="inline-flex items-center gap-2 min-w-0">
                  <Award className={iconClass(activeDestination === 'sertifikat')} />
                  <span className="truncate">Natijalar va Sertifikat</span>
                </span>
                <span className="font-mono text-[11px] tabular-nums text-slate-400">
                  {certificateCount}
                </span>
              </button>
            </div>
          </nav>
        </div>

        {/* Compact Bottom Utility Bar */}
        <div className="p-2 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-1.5 shrink-0">
          <button
            type="button"
            onClick={onToggleTheme}
            className="min-h-[36px] flex items-center justify-center gap-1.5 px-2 py-1 text-[11.5px] font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            {isDark ? (
              <Sun className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            )}
            <span className="truncate">{isDark ? 'Kunduzgi' : 'Tungi'}</span>
          </button>

          <button
            type="button"
            onClick={onOpenAdmin}
            className="min-h-[36px] flex items-center justify-center gap-1.5 px-2 py-1 text-[11.5px] font-semibold text-white bg-slate-900 dark:bg-sky-500 dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-sky-400 rounded-lg transition-colors cursor-pointer"
          >
            <Lock className="w-3 h-3 shrink-0" />
            <span className="truncate">Admin</span>
          </button>
        </div>
      </aside>
    </div>
  );
}
