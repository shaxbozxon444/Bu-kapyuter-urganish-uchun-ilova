import { Award, BookOpen, ClipboardCheck, Home, Video } from 'lucide-react';
import type { LessonCategory } from '../data/curriculum';

export type AppScreenId =
  | 'kirish'
  | 'yolxarita'
  | 'videolar'
  | 'darslar'
  | 'qoidalar'
  | 'mashq'
  | 'aiustoz'
  | 'imtihon'
  | 'sertifikat';

interface MobileBottomNavProps {
  activeScreen: AppScreenId;
  activeTrack?: LessonCategory;
  onSelectScreen: (screen: AppScreenId) => void;
}

export function MobileBottomNav({
  activeScreen,
  activeTrack = 'literacy',
  onSelectScreen,
}: MobileBottomNavProps) {
  const items: Array<{ id: AppScreenId; label: string; icon: typeof Home }> = [
    { id: 'kirish', label: 'Kirish', icon: Home },
    { id: 'darslar', label: 'Darslar', icon: BookOpen },
    { id: 'videolar', label: 'Videolar', icon: Video },
    { id: 'sertifikat', label: 'Natijalar', icon: Award },
    { id: 'imtihon', label: 'Imtihon', icon: ClipboardCheck },
  ];

  const activeColor =
    activeTrack === 'programming'
      ? 'text-indigo-600 dark:text-indigo-400'
      : 'text-sky-700 dark:text-sky-400';

  const indicatorBg =
    activeTrack === 'programming'
      ? 'bg-indigo-600 dark:bg-indigo-400'
      : 'bg-sky-600 dark:bg-sky-400';

  return (
    <nav
      aria-label="Mobil pastki menyu"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 pb-[env(safe-area-inset-bottom)]"
    >
      <div className="grid grid-cols-5 h-15 items-center">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeScreen === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectScreen(item.id)}
              className={`relative h-full min-h-[44px] flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer ${
                isActive
                  ? activeColor
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span
                aria-hidden="true"
                className={`absolute top-0 w-7 h-0.5 rounded-full transition-opacity ${
                  isActive ? `${indicatorBg} opacity-100` : 'opacity-0'
                }`}
              />
              <Icon className="w-5 h-5 shrink-0" strokeWidth={isActive ? 2.25 : 1.75} />
              <span className="text-[11px] font-medium tracking-tight leading-none whitespace-nowrap">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
