import { BookOpen, ClipboardCheck, Home, Terminal, Video } from 'lucide-react';

export type AppScreenId = 'kirish' | 'videolar' | 'darslar' | 'mashq' | 'imtihon';

interface MobileBottomNavProps {
  activeScreen: AppScreenId;
  onSelectScreen: (screen: AppScreenId) => void;
}

export function MobileBottomNav({ activeScreen, onSelectScreen }: MobileBottomNavProps) {
  const items: Array<{ id: AppScreenId; label: string; icon: typeof Home }> = [
    { id: 'kirish', label: 'Kirish', icon: Home },
    { id: 'videolar', label: 'Videolar', icon: Video },
    { id: 'darslar', label: 'Darslar', icon: BookOpen },
    { id: 'mashq', label: 'Mashq', icon: Terminal },
    { id: 'imtihon', label: 'Imtihon', icon: ClipboardCheck },
  ];

  return (
    <nav
      aria-label="Mobil pastki menyu"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 pb-[env(safe-area-inset-bottom)]"
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
              className={`h-full min-h-[44px] flex flex-col items-center justify-center gap-0.5 transition-colors cursor-pointer ${
                isActive
                  ? 'text-sky-700 dark:text-sky-400'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5 shrink-0" strokeWidth={isActive ? 2.25 : 1.75} />
              <span className="text-[11px] font-medium tracking-tight leading-none">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
