import { useState } from 'react';
import {
  BookA,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Circle,
  ClipboardCheck,
  HelpCircle,
  Home,
  Moon,
  RotateCcw,
  Shield,
  Sun,
  Terminal,
  Video,
  X,
} from 'lucide-react';
import type { LessonItem } from '../data/curriculum';

export type SidebarDestination =
  | 'kirish'
  | 'videolar'
  | 'darslar'
  | 'bilasizmi'
  | 'lab'
  | 'lugat'
  | 'imtihon';

interface StudentSidebarProps {
  lessons: LessonItem[];
  completedLessons: string[];
  videoCount: number;
  watchedVideoCount: number;
  dykCount: number;
  glossaryCount: number;
  examCount: number;
  activeDestination: SidebarDestination;
  isDark: boolean;
  onToggleTheme: () => void;
  onNavigateDestination: (dest: SidebarDestination) => void;
  onNavigateLesson: (lessonId: string) => void;
  onResetProgress: () => void;
  onOpenAdmin: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export function StudentSidebar({
  lessons,
  completedLessons,
  videoCount,
  watchedVideoCount,
  dykCount,
  glossaryCount,
  examCount,
  activeDestination,
  isDark,
  onToggleTheme,
  onNavigateDestination,
  onNavigateLesson,
  onResetProgress,
  onOpenAdmin,
  mobileOpen,
  onCloseMobile,
}: StudentSidebarProps) {
  const [lessonsExpanded, setLessonsExpanded] = useState(true);

  const completedCount = completedLessons.filter((id) =>
    lessons.some((l) => l.id === id)
  ).length;
  const totalItems = lessons.length + videoCount;
  const progressPct =
    totalItems > 0 ? Math.round(((completedCount + watchedVideoCount) / totalItems) * 100) : 0;

  const navBtnClass = (active: boolean) =>
    `w-full min-h-[44px] flex items-center justify-between gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer text-left ${
      active
        ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-semibold'
        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
    }`;

  const sidebarContent = (
    <div className="h-full flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100">
      {/* Mobile Drawer Header */}
      <div className="lg:hidden h-14 px-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <span
          className="text-lg font-bold tracking-tight"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          murodillayev_dev
        </span>
        <button
          type="button"
          aria-label="Menyuni yopish"
          onClick={onCloseMobile}
          className="min-h-[44px] min-w-[44px] -mr-2 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Scrollable Navigation */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Progress Summary */}
        <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs font-medium mb-2">
            <span className="text-slate-500 dark:text-slate-400">Umumiy o‘zlashtirish</span>
            <span className="font-mono font-semibold tabular-nums text-sky-700 dark:text-sky-400">
              {progressPct}%
            </span>
          </div>
          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-600 transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 tabular-nums">
            <span>Videolar: {watchedVideoCount}/{videoCount}</span>
            <span>Darslar: {completedCount}/{lessons.length}</span>
          </div>
          {(completedCount > 0 || watchedVideoCount > 0) && (
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

        {/* Primary Sections */}
        <nav aria-label="Yon menyu" className="space-y-1">
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
            onClick={() => onNavigateDestination('videolar')}
            className={navBtnClass(activeDestination === 'videolar')}
          >
            <span className="inline-flex items-center gap-2.5">
              <Video className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
              <span>Videodarslar</span>
            </span>
            <span className="font-mono text-xs tabular-nums text-slate-400">{videoCount}</span>
          </button>

          {/* Expandable Lessons Group */}
          <div>
            <div className="flex items-center justify-between gap-1">
              <button
                type="button"
                onClick={() => onNavigateDestination('darslar')}
                className={`flex-1 min-h-[44px] flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer text-left ${
                  activeDestination === 'darslar'
                    ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-semibold'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <BookOpen className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
                <span>Mini-darslar</span>
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
              <div className="mt-1 ml-3 pl-3 border-l border-slate-200 dark:border-slate-800 space-y-0.5">
                {lessons.map((lesson) => {
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

          <button
            type="button"
            onClick={() => onNavigateDestination('imtihon')}
            className={navBtnClass(activeDestination === 'imtihon')}
          >
            <span className="inline-flex items-center gap-2.5">
              <ClipboardCheck className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
              <span>Yakuniy imtihon</span>
            </span>
            <span className="font-mono text-xs tabular-nums text-slate-400">{examCount}</span>
          </button>
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
          <Shield className="w-3.5 h-3.5 shrink-0" />
          <span>Admin panelni ochish</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside className="hidden lg:block w-68 shrink-0">
        <div className="sticky top-16 h-[calc(100vh-4rem)]">{sidebarContent}</div>
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            onClick={onCloseMobile}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
          />
          <div className="relative z-10 w-72 max-w-[85vw] h-full">{sidebarContent}</div>
        </div>
      )}
    </>
  );
}
