import { useEffect, useState } from 'react';
import {
  ArrowRight,
  BookA,
  BookOpen,
  ClipboardCheck,
  HelpCircle,
  Menu,
  PlayCircle,
  Terminal,
  Video,
} from 'lucide-react';
import { AdminPanel } from './components/AdminPanel';
import { CodePlaygroundSection } from './components/CodePlaygroundSection';
import { DidYouKnowSection } from './components/DidYouKnowSection';
import { FinalExamSection, type ExamAttemptRecord } from './components/FinalExamSection';
import { GlossarySection } from './components/GlossarySection';
import { LessonsSection } from './components/LessonsSection';
import { MobileBottomNav, type AppScreenId } from './components/MobileBottomNav';
import { ResilientImage } from './components/ResilientImage';
import { StudentSidebar, type SidebarDestination } from './components/StudentSidebar';
import { VideoLessonsSection } from './components/VideoLessonsSection';
import {
  DID_YOU_KNOW_CARDS,
  EXAM_QUESTIONS,
  GLOSSARY_TERMS,
  LESSONS,
  VIDEO_LESSONS,
  type DidYouKnowItem,
  type ExamQuestion,
  type GlossaryTerm,
  type LessonItem,
  type VideoLessonItem,
} from './data/curriculum';

const STORAGE_COMPLETED = 'kodsavod_completed_lessons_v2';
const STORAGE_WATCHED_VIDEOS = 'kodsavod_watched_videos_v1';
const STORAGE_VIDEOS = 'kodsavod_videos_v1';
const STORAGE_LESSONS = 'kodsavod_lessons_v2';
const STORAGE_DYK = 'kodsavod_dyk_v2';
const STORAGE_EXAM = 'kodsavod_exam_v2';
const STORAGE_GLOSSARY = 'kodsavod_glossary_v2';
const STORAGE_RESULTS = 'kodsavod_results_v2';
const STORAGE_THEME = 'kodsavod_theme_v1';

type MashqSubTab = 'lab' | 'bilasizmi' | 'lugat';

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [viewMode, setViewMode] = useState<'learn' | 'admin'>('learn');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeScreen, setActiveScreen] = useState<AppScreenId>('kirish');
  const [mashqSubTab, setMashqSubTab] = useState<MashqSubTab>('lab');
  const [focusedLessonId, setFocusedLessonId] = useState<string | null>(null);

  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_THEME) === 'dark';
    } catch {
      return false;
    }
  });

  const [videoLessons, setVideoLessons] = useState<VideoLessonItem[]>(() =>
    loadFromStorage(STORAGE_VIDEOS, VIDEO_LESSONS)
  );
  const [lessons, setLessons] = useState<LessonItem[]>(() =>
    loadFromStorage(STORAGE_LESSONS, LESSONS)
  );
  const [didYouKnowCards, setDidYouKnowCards] = useState<DidYouKnowItem[]>(() =>
    loadFromStorage(STORAGE_DYK, DID_YOU_KNOW_CARDS)
  );
  const [examQuestions, setExamQuestions] = useState<ExamQuestion[]>(() =>
    loadFromStorage(STORAGE_EXAM, EXAM_QUESTIONS)
  );
  const [glossaryTerms, setGlossaryTerms] = useState<GlossaryTerm[]>(() =>
    loadFromStorage(STORAGE_GLOSSARY, GLOSSARY_TERMS)
  );
  const [examResults, setExamResults] = useState<ExamAttemptRecord[]>(() =>
    loadFromStorage(STORAGE_RESULTS, [])
  );
  const [completedLessons, setCompletedLessons] = useState<string[]>(() =>
    loadFromStorage(STORAGE_COMPLETED, [])
  );
  const [watchedVideos, setWatchedVideos] = useState<string[]>(() =>
    loadFromStorage(STORAGE_WATCHED_VIDEOS, [])
  );

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    try {
      localStorage.setItem(STORAGE_THEME, isDark ? 'dark' : 'light');
    } catch {
      // Ignore storage errors
    }
  }, [isDark]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_VIDEOS, JSON.stringify(videoLessons));
    } catch {
      // Ignore storage quota errors
    }
  }, [videoLessons]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_LESSONS, JSON.stringify(lessons));
    } catch {
      // Ignore storage quota errors
    }
  }, [lessons]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_DYK, JSON.stringify(didYouKnowCards));
    } catch {
      // Ignore storage quota errors
    }
  }, [didYouKnowCards]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_EXAM, JSON.stringify(examQuestions));
    } catch {
      // Ignore storage quota errors
    }
  }, [examQuestions]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_GLOSSARY, JSON.stringify(glossaryTerms));
    } catch {
      // Ignore storage quota errors
    }
  }, [glossaryTerms]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_RESULTS, JSON.stringify(examResults));
    } catch {
      // Ignore storage quota errors
    }
  }, [examResults]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_COMPLETED, JSON.stringify(completedLessons));
    } catch {
      // Ignore storage quota errors
    }
  }, [completedLessons]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_WATCHED_VIDEOS, JSON.stringify(watchedVideos));
    } catch {
      // Ignore storage quota errors
    }
  }, [watchedVideos]);

  const handleToggleLesson = (id: string) => {
    setCompletedLessons((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleMarkVideoWatched = (id: string, forceValue?: boolean) => {
    setWatchedVideos((prev) => {
      const exists = prev.includes(id);
      if (forceValue === true) {
        return exists ? prev : [...prev, id];
      }
      if (forceValue === false) {
        return exists ? prev.filter((item) => item !== id) : prev;
      }
      return exists ? prev.filter((item) => item !== id) : [...prev, id];
    });
  };

  const handleRecordResult = (record: ExamAttemptRecord) => {
    setExamResults((prev) => [record, ...prev]);
  };

  const handleResetDefaults = () => {
    setVideoLessons(VIDEO_LESSONS);
    setLessons(LESSONS);
    setDidYouKnowCards(DID_YOU_KNOW_CARDS);
    setExamQuestions(EXAM_QUESTIONS);
    setGlossaryTerms(GLOSSARY_TERMS);
    setCompletedLessons([]);
    setWatchedVideos([]);
  };

  const navigateScreen = (screen: AppScreenId) => {
    setMobileMenuOpen(false);
    setViewMode('learn');
    setActiveScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateDestination = (dest: SidebarDestination) => {
    setMobileMenuOpen(false);
    setViewMode('learn');
    if (dest === 'lab' || dest === 'bilasizmi' || dest === 'lugat') {
      setActiveScreen('mashq');
      setMashqSubTab(dest);
    } else {
      setActiveScreen(dest);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToLesson = (lessonId: string) => {
    setMobileMenuOpen(false);
    setViewMode('learn');
    setFocusedLessonId(lessonId);
    setActiveScreen('darslar');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeDestination: SidebarDestination =
    activeScreen === 'mashq' ? mashqSubTab : activeScreen;

  const watchedVideoCount = watchedVideos.filter((id) =>
    videoLessons.some((v) => v.id === id)
  ).length;
  const completedLessonCount = completedLessons.filter((id) =>
    lessons.some((l) => l.id === id)
  ).length;

  if (viewMode === 'admin') {
    return (
      <AdminPanel
        videoLessons={videoLessons}
        lessons={lessons}
        didYouKnowCards={didYouKnowCards}
        examQuestions={examQuestions}
        glossaryTerms={glossaryTerms}
        examResults={examResults}
        isDark={isDark}
        onToggleTheme={() => setIsDark((prev) => !prev)}
        onSaveVideoLessons={setVideoLessons}
        onSaveLessons={setLessons}
        onSaveDidYouKnow={setDidYouKnowCards}
        onSaveExamQuestions={setExamQuestions}
        onSaveGlossary={setGlossaryTerms}
        onClearResults={() => setExamResults([])}
        onResetDefaults={handleResetDefaults}
        onExitAdmin={() => {
          setViewMode('learn');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onGoToExam={() => navigateScreen('imtihon')}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-20 lg:pb-0">
      {/* Top Bar: compact static on mobile (keeps sticky height <= 15%), sticky on desktop */}
      <header className="relative lg:sticky lg:top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white">
        <div className="w-full px-4 sm:px-6 lg:px-8 h-14 lg:h-16 flex items-center justify-between gap-4 lg:gap-8">
          {/* Zone 1: Mobile drawer button + Brand wordmark */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              aria-label="Yon menyuni ochish"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden min-h-[44px] min-w-[44px] -ml-2 flex items-center justify-center text-slate-200 hover:text-white rounded-lg cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => navigateScreen('kirish')}
              className="text-lg sm:text-xl font-bold tracking-tight text-white whitespace-nowrap shrink-0 cursor-pointer"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              murodillayev_dev
            </button>
          </div>

          {/* Zone 2: Desktop top navigation */}
          <nav
            aria-label="Asosiy menyu"
            className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300"
          >
            {(
              [
                { id: 'kirish', label: 'Kirish' },
                { id: 'videolar', label: 'Videolar' },
                { id: 'darslar', label: 'Darslar' },
                { id: 'mashq', label: 'Mashqlar' },
              ] as const
            ).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => navigateScreen(item.id)}
                className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  activeScreen === item.id
                    ? 'text-white underline underline-offset-4'
                    : 'hover:text-white hover:underline underline-offset-4'
                }`}
              >
                {item.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setViewMode('admin');
                window.scrollTo({ top: 0 });
              }}
              className="text-sky-300 hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Admin panel
            </button>
          </nav>

          {/* Zone 3: Primary action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => navigateScreen('imtihon')}
              className="min-h-[40px] px-3.5 sm:px-4 py-2 text-xs font-semibold text-slate-950 bg-sky-400 hover:bg-sky-300 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Imtihonni boshlash
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout: Left Side Menu + Active Screen Content */}
      <div className="flex-1 flex">
        <StudentSidebar
          lessons={lessons}
          completedLessons={completedLessons}
          videoCount={videoLessons.length}
          watchedVideoCount={watchedVideoCount}
          dykCount={didYouKnowCards.length}
          glossaryCount={glossaryTerms.length}
          examCount={examQuestions.length}
          activeDestination={activeDestination}
          isDark={isDark}
          onToggleTheme={() => setIsDark((prev) => !prev)}
          onNavigateDestination={navigateDestination}
          onNavigateLesson={navigateToLesson}
          onResetProgress={() => {
            setCompletedLessons([]);
            setWatchedVideos([]);
          }}
          onOpenAdmin={() => {
            setMobileMenuOpen(false);
            setViewMode('admin');
            window.scrollTo({ top: 0 });
          }}
          mobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />

        <div className="flex-1 min-w-0 flex flex-col">
          <main className="flex-1">
            {/* Screen 1: Kirish / Phone App Launchpad */}
            {activeScreen === 'kirish' && (
              <div className="bg-slate-50 dark:bg-slate-950">
                <section className="bg-slate-900 text-white pt-7 pb-10 sm:pt-12 sm:pb-14">
                  <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
                      <div className="lg:col-span-6 flex flex-col justify-center">
                        <p className="text-xs sm:text-sm font-semibold text-sky-400 mb-2">
                          Kompyuter savodxonligi va dasturlash asoslari
                        </p>
                        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-[1.15] text-balance mb-3.5 sm:mb-5">
                          Qisqa videolar va jonli mashqlar bilan tez o‘rganing
                        </h1>
                        <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6 max-w-xl">
                          Uzun matnlarni pastga tushirib o‘tirish shart emas — kerakli bo‘limni
                          tanlang: qisqa animatsion videodarslar, bittadan ko‘rsatiladigan
                          mini-darslar, amaliy laboratoriya va yakuniy test.
                        </p>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                          <button
                            type="button"
                            onClick={() => navigateScreen('videolar')}
                            className="w-full sm:w-auto min-h-[48px] inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-slate-950 bg-sky-400 hover:bg-sky-300 active:scale-[0.99] rounded-xl sm:rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer"
                          >
                            <PlayCircle className="w-4 h-4 shrink-0" />
                            <span>Videodarslardan boshlash</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => navigateScreen('darslar')}
                            className="w-full sm:w-auto min-h-[48px] inline-flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-medium text-slate-200 hover:text-white border border-slate-700 hover:border-slate-500 active:scale-[0.99] rounded-xl sm:rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer"
                          >
                            <span>Mini-darslarni o‘qish</span>
                            <ArrowRight className="w-4 h-4 shrink-0" />
                          </button>
                        </div>
                      </div>

                      <div className="lg:col-span-6">
                        <div className="h-full min-h-[190px] sm:min-h-[250px] rounded-2xl overflow-hidden border border-slate-800 bg-slate-800">
                          <ResilientImage
                            src="/src/assets/images/hero_coding_studio_1795163267457.jpg"
                            alt="Zamonaviy kompyuter va dasturlash o‘quv ish stoli illyustratsiyasi"
                            fallbackTitle="Kompyuter va dasturlash o‘quv muhiti"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    </div>

                    {/* 4-Column Quick Stats */}
                    <div className="mt-8 sm:mt-10 pt-6 border-t border-slate-800 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                      <div>
                        <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-white">
                          {watchedVideoCount}/{videoLessons.length}
                        </div>
                        <div className="text-xs sm:text-sm text-slate-400 mt-0.5">
                          Videodarslar ko‘rildi
                        </div>
                      </div>
                      <div>
                        <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-white">
                          {completedLessonCount}/{lessons.length}
                        </div>
                        <div className="text-xs sm:text-sm text-slate-400 mt-0.5">
                          Mini-darslar o‘qildi
                        </div>
                      </div>
                      <div>
                        <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-white">
                          {glossaryTerms.length} ta
                        </div>
                        <div className="text-xs sm:text-sm text-slate-400 mt-0.5">
                          Muhim IT atamalari
                        </div>
                      </div>
                      <div>
                        <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-white">
                          {examQuestions.length} ta
                        </div>
                        <div className="text-xs sm:text-sm text-slate-400 mt-0.5">
                          Yakuniy imtihon savoli
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Phone-First Quick App Grid: 1-tap access without vertical scrolling */}
                <section className="py-7 sm:py-10">
                  <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <div>
                        <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                          Tezkor bo‘limlar
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                          Bir bosishda kerakli o‘quv oynasiga o‘ting
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                      <button
                        type="button"
                        onClick={() => navigateDestination('videolar')}
                        className="text-left p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-sky-400 dark:hover:border-sky-500 rounded-2xl transition-colors cursor-pointer flex flex-col justify-between gap-3"
                      >
                        <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-400 flex items-center justify-center">
                          <Video className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white">
                            Videodarslar
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            {videoLessons.length} ta qisqa animatsion video
                          </div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => navigateDestination('darslar')}
                        className="text-left p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-sky-400 dark:hover:border-sky-500 rounded-2xl transition-colors cursor-pointer flex flex-col justify-between gap-3"
                      >
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 flex items-center justify-center">
                          <BookOpen className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white">
                            Mini-darslar
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            {lessons.length} ta bittadan ochiladigan dars
                          </div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => navigateDestination('lab')}
                        className="text-left p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-sky-400 dark:hover:border-sky-500 rounded-2xl transition-colors cursor-pointer flex flex-col justify-between gap-3"
                      >
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
                          <Terminal className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white">
                            Amaliy laboratoriya
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            Kod yozish, tez terish va xavfsizlik
                          </div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => navigateDestination('bilasizmi')}
                        className="text-left p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-sky-400 dark:hover:border-sky-500 rounded-2xl transition-colors cursor-pointer flex flex-col justify-between gap-3"
                      >
                        <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center">
                          <HelpCircle className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white">
                            Bilasizmi?
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            {didYouKnowCards.length} ta mantiqiy savol-javob
                          </div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => navigateDestination('lugat')}
                        className="text-left p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-sky-400 dark:hover:border-sky-500 rounded-2xl transition-colors cursor-pointer flex flex-col justify-between gap-3"
                      >
                        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center">
                          <BookA className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white">
                            IT Lug‘at
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            {glossaryTerms.length} ta asosiy atama
                          </div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => navigateDestination('imtihon')}
                        className="text-left p-4 sm:p-5 bg-slate-900 dark:bg-sky-500 text-white dark:text-slate-950 border border-slate-900 dark:border-sky-500 hover:bg-slate-800 dark:hover:bg-sky-400 rounded-2xl transition-colors cursor-pointer flex flex-col justify-between gap-3"
                      >
                        <div className="w-10 h-10 rounded-xl bg-white/10 dark:bg-slate-950/15 flex items-center justify-center">
                          <ClipboardCheck className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-sm sm:text-base font-semibold">
                            Yakuniy imtihon
                          </div>
                          <div className="text-xs opacity-80 mt-0.5">
                            {examQuestions.length} ta tezkor test savoli
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {/* Screen 2: Videodarslar */}
            {activeScreen === 'videolar' && (
              <VideoLessonsSection
                videos={videoLessons}
                watchedVideos={watchedVideos}
                onMarkWatched={handleMarkVideoWatched}
                onGoToLessons={() => navigateScreen('darslar')}
                onStartExam={() => navigateScreen('imtihon')}
              />
            )}

            {/* Screen 3: Mini-darslar (Step-by-step phone pager by default) */}
            {activeScreen === 'darslar' && (
              <LessonsSection
                lessons={lessons}
                completedLessons={completedLessons}
                focusedLessonId={focusedLessonId}
                onToggleLesson={handleToggleLesson}
                onOpenVideos={() => navigateScreen('videolar')}
                onStartExam={() => navigateScreen('imtihon')}
              />
            )}

            {/* Screen 4: Mashqlar Workspace (Laboratoriya | Bilasizmi? | IT Lug'at) */}
            {activeScreen === 'mashq' && (
              <div className="bg-slate-50 dark:bg-slate-950">
                <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 lg:px-8 py-3">
                  <div className="max-w-5xl mx-auto">
                    <div
                      role="tablist"
                      aria-label="Mashq bo‘limlari"
                      className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl max-w-lg"
                    >
                      <button
                        type="button"
                        role="tab"
                        aria-selected={mashqSubTab === 'lab'}
                        onClick={() => setMashqSubTab('lab')}
                        className={`min-h-[42px] px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                          mashqSubTab === 'lab'
                            ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-white shadow-sm'
                            : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        Laboratoriya
                      </button>
                      <button
                        type="button"
                        role="tab"
                        aria-selected={mashqSubTab === 'bilasizmi'}
                        onClick={() => setMashqSubTab('bilasizmi')}
                        className={`min-h-[42px] px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                          mashqSubTab === 'bilasizmi'
                            ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-white shadow-sm'
                            : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        Bilasizmi? ({didYouKnowCards.length})
                      </button>
                      <button
                        type="button"
                        role="tab"
                        aria-selected={mashqSubTab === 'lugat'}
                        onClick={() => setMashqSubTab('lugat')}
                        className={`min-h-[42px] px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                          mashqSubTab === 'lugat'
                            ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-white shadow-sm'
                            : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        IT Lug‘at ({glossaryTerms.length})
                      </button>
                    </div>
                  </div>
                </div>

                {mashqSubTab === 'lab' && <CodePlaygroundSection />}
                {mashqSubTab === 'bilasizmi' && <DidYouKnowSection cards={didYouKnowCards} />}
                {mashqSubTab === 'lugat' && <GlossarySection terms={glossaryTerms} />}
              </div>
            )}

            {/* Screen 5: Yakuniy imtihon */}
            {activeScreen === 'imtihon' && (
              <FinalExamSection
                questions={examQuestions}
                onRecordResult={handleRecordResult}
                onBackToLessons={() => navigateScreen('darslar')}
              />
            )}
          </main>

          {/* Clean Footer */}
          <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 py-7">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
              <p>
                © {new Date().getFullYear()} murodillayev_dev. Kompyuter savodxonligi va dasturlash
                asoslari.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-6">
                <button
                  type="button"
                  onClick={() => navigateScreen('kirish')}
                  className="py-1 hover:text-white transition-colors cursor-pointer"
                >
                  Kirish
                </button>
                <button
                  type="button"
                  onClick={() => navigateScreen('videolar')}
                  className="py-1 hover:text-white transition-colors cursor-pointer"
                >
                  Videolar
                </button>
                <button
                  type="button"
                  onClick={() => navigateScreen('darslar')}
                  className="py-1 hover:text-white transition-colors cursor-pointer"
                >
                  Darslar
                </button>
                <button
                  type="button"
                  onClick={() => navigateDestination('lugat')}
                  className="py-1 hover:text-white transition-colors cursor-pointer"
                >
                  IT Lug‘at
                </button>
                <button
                  type="button"
                  onClick={() => navigateScreen('imtihon')}
                  className="py-1 hover:text-white transition-colors cursor-pointer"
                >
                  Imtihon
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setViewMode('admin');
                    window.scrollTo({ top: 0 });
                  }}
                  className="py-1 text-sky-400 hover:text-sky-300 transition-colors cursor-pointer"
                >
                  Admin panel
                </button>
              </div>
            </div>
          </footer>
        </div>
      </div>

      {/* Fixed Thumb-Zone Bottom Navigation Bar on Mobile */}
      <MobileBottomNav
        activeScreen={activeScreen}
        onSelectScreen={navigateScreen}
      />
    </div>
  );
}
