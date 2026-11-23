import { Suspense, lazy, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import {
  ArrowRight,
  Award,
  BookA,
  BookOpen,
  Bot,
  ClipboardCheck,
  Code2,
  Compass,
  Flame,
  HelpCircle,
  Lock,
  LogIn,
  Menu,
  Monitor,
  ShieldCheck,
  Terminal,
  UserCheck,
  Video,
} from 'lucide-react';
import type { ExamAttemptRecord, ExamScope } from './components/FinalExamSection';
import { MobileBottomNav, type AppScreenId } from './components/MobileBottomNav';
import { ResilientImage } from './components/ResilientImage';
import { StudentSidebar, type SidebarDestination } from './components/StudentSidebar';

const AdminLockModal = lazy(() =>
  import('./components/AdminLockModal').then((m) => ({ default: m.AdminLockModal }))
);
const AdminPanel = lazy(() =>
  import('./components/AdminPanel').then((m) => ({ default: m.AdminPanel }))
);
const AiTutorSection = lazy(() =>
  import('./components/AiTutorSection').then((m) => ({ default: m.AiTutorSection }))
);
const AuthModal = lazy(() =>
  import('./components/AuthModal').then((m) => ({ default: m.AuthModal }))
);
const CertificatesSection = lazy(() =>
  import('./components/CertificatesSection').then((m) => ({ default: m.CertificatesSection }))
);
const ChallengesSection = lazy(() =>
  import('./components/ChallengesSection').then((m) => ({ default: m.ChallengesSection }))
);
const CodePlaygroundSection = lazy(() =>
  import('./components/CodePlaygroundSection').then((m) => ({ default: m.CodePlaygroundSection }))
);
const DidYouKnowSection = lazy(() =>
  import('./components/DidYouKnowSection').then((m) => ({ default: m.DidYouKnowSection }))
);
const FinalExamSection = lazy(() =>
  import('./components/FinalExamSection').then((m) => ({ default: m.FinalExamSection }))
);
const GlossarySection = lazy(() =>
  import('./components/GlossarySection').then((m) => ({ default: m.GlossarySection }))
);
const LessonsSection = lazy(() =>
  import('./components/LessonsSection').then((m) => ({ default: m.LessonsSection }))
);
const RoadmapSection = lazy(() =>
  import('./components/RoadmapSection').then((m) => ({ default: m.RoadmapSection }))
);
const VideoLessonsSection = lazy(() =>
  import('./components/VideoLessonsSection').then((m) => ({ default: m.VideoLessonsSection }))
);

function SectionFallback() {
  return (
    <div className="py-16 px-4 text-center text-sm text-slate-500 dark:text-slate-400">
      Bo‘lim yuklanmoqda...
    </div>
  );
}
import {
  DID_YOU_KNOW_CARDS,
  EXAM_QUESTIONS,
  GLOSSARY_TERMS,
  LESSONS,
  PRACTICE_CHALLENGES,
  VIDEO_LESSONS,
  type CertificateRecord,
  type DidYouKnowItem,
  type ExamQuestion,
  type GlossaryTerm,
  type LessonCategory,
  type LessonItem,
  type VideoLessonItem,
} from './data/curriculum';
import { auth } from './firebase';
import {
  deleteCertificateDoc,
  ensureUserProfile,
  isFirebaseBootstrapAdmin,
  loadCurriculumOverride,
  saveCertificateDoc,
  saveCurriculumOverride,
  saveExamResultDoc,
  subscribeCertificates,
  subscribeExamResults,
  subscribeUserProfile,
  updateUserProgress,
  type PersistedExamResult,
} from './services/firestoreService';

const MAX_EXAM_ATTEMPTS = 3;

const STORAGE_COMPLETED = 'kodsavod_completed_lessons_v3';
const STORAGE_WATCHED_VIDEOS = 'kodsavod_watched_videos_v3';
const STORAGE_SOLVED_CHALLENGES = 'kodsavod_solved_challenges_v1';
const STORAGE_VIDEOS = 'kodsavod_videos_v3';
const STORAGE_LESSONS = 'kodsavod_lessons_v4';
const STORAGE_DYK = 'kodsavod_dyk_v3';
const STORAGE_EXAM = 'kodsavod_exam_v4';
const STORAGE_GLOSSARY = 'kodsavod_glossary_v3';
const STORAGE_RESULTS = 'kodsavod_results_v2';
const STORAGE_EXAM_ATTEMPTS = 'kodsavod_exam_attempts_v1';
const STORAGE_CERTIFICATES = 'kodsavod_certificates_v1';
const STORAGE_THEME = 'kodsavod_theme_v1';
const STORAGE_TRACK = 'kodsavod_active_track_v1';

type MashqSubTab = 'lab' | 'masalalar' | 'aiustoz' | 'bilasizmi' | 'lugat';

const DEFAULT_ATTEMPTS: Record<ExamScope, number> = {
  literacy: 0,
  programming: 0,
  all: 0,
};

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function normalizeExamResults(records: PersistedExamResult[]): PersistedExamResult[] {
  if (!Array.isArray(records)) return [];
  return records.map((r) => {
    const inferredScope: ExamScope =
      r.examScope ??
      (r.literacyTotal > 0 && r.programmingTotal === 0
        ? 'literacy'
        : r.programmingTotal > 0 && r.literacyTotal === 0
          ? 'programming'
          : 'all');
    const inferredPassed =
      typeof r.passed === 'boolean'
        ? r.passed
        : r.tier !== 'retry' && r.total > 0 && r.score / r.total >= 0.75;
    return {
      ...r,
      examScope: inferredScope,
      passed: inferredPassed,
    };
  });
}

export default function App() {
  const [viewMode, setViewMode] = useState<'learn' | 'admin'>('learn');
  const [cornerMenuOpen, setCornerMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [adminLockOpen, setAdminLockOpen] = useState(false);
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [activeScreen, setActiveScreen] = useState<AppScreenId>('kirish');
  const [mashqSubTab, setMashqSubTab] = useState<MashqSubTab>('lab');
  const [focusedLessonId, setFocusedLessonId] = useState<string | null>(null);

  const [authUser, setAuthUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [profileDisplayName, setProfileDisplayName] = useState<string | null>(null);

  const [activeTrack, setActiveTrack] = useState<LessonCategory>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_TRACK);
      return saved === 'programming' ? 'programming' : 'literacy';
    } catch {
      return 'literacy';
    }
  });

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
  const [examResults, setExamResults] = useState<PersistedExamResult[]>(() =>
    normalizeExamResults(loadFromStorage(STORAGE_RESULTS, []))
  );
  const [examAttempts, setExamAttempts] = useState<Record<ExamScope, number>>(() => {
    const saved = loadFromStorage<Partial<Record<ExamScope, number>>>(
      STORAGE_EXAM_ATTEMPTS,
      DEFAULT_ATTEMPTS
    );
    return {
      literacy: typeof saved.literacy === 'number' ? saved.literacy : 0,
      programming: typeof saved.programming === 'number' ? saved.programming : 0,
      all: typeof saved.all === 'number' ? saved.all : 0,
    };
  });
  const [issuedCertificates, setIssuedCertificates] = useState<CertificateRecord[]>(() =>
    loadFromStorage(STORAGE_CERTIFICATES, [])
  );
  const [completedLessons, setCompletedLessons] = useState<string[]>(() =>
    loadFromStorage(STORAGE_COMPLETED, [])
  );
  const [watchedVideos, setWatchedVideos] = useState<string[]>(() =>
    loadFromStorage(STORAGE_WATCHED_VIDEOS, [])
  );
  const [solvedChallenges, setSolvedChallenges] = useState<string[]>(() =>
    loadFromStorage(STORAGE_SOLVED_CHALLENGES, [])
  );

  // Load any admin curriculum override stored in Firestore on boot
  useEffect(() => {
    void loadCurriculumOverride().then((override) => {
      if (!override) return;
      if (Array.isArray(override.videoLessons) && override.videoLessons.length > 0) {
        setVideoLessons(override.videoLessons);
      }
      if (Array.isArray(override.lessons) && override.lessons.length > 0) {
        setLessons(override.lessons);
      }
      if (Array.isArray(override.didYouKnowCards) && override.didYouKnowCards.length > 0) {
        setDidYouKnowCards(override.didYouKnowCards);
      }
      if (Array.isArray(override.examQuestions) && override.examQuestions.length > 0) {
        setExamQuestions(override.examQuestions);
      }
      if (Array.isArray(override.glossaryTerms) && override.glossaryTerms.length > 0) {
        setGlossaryTerms(override.glossaryTerms);
      }
    });
  }, []);

  // Firebase Authentication & Persistent Cloud Sync
  useEffect(() => {
    let unsubProfile: (() => void) | undefined;
    let unsubResults: (() => void) | undefined;
    let unsubCerts: (() => void) | undefined;

    const unsubAuth = onAuthStateChanged(auth, async (user) => {
      unsubProfile?.();
      unsubResults?.();
      unsubCerts?.();

      setAuthUser(user);
      setAuthReady(true);

      if (!user) {
        setProfileDisplayName(null);
        return;
      }

      try {
        const profile = await ensureUserProfile(user, {
          displayName: user.displayName || user.email?.split('@')[0] || 'O‘quvchi',
          activeTrack,
          completedLessons,
          watchedVideos,
          solvedChallenges,
          examAttempts,
        });

        setProfileDisplayName(profile.displayName);
        setCompletedLessons(profile.completedLessons);
        setWatchedVideos(profile.watchedVideos);
        setSolvedChallenges(profile.solvedChallenges);
        setExamAttempts(profile.examAttempts);
        setActiveTrack(profile.activeTrack);

        unsubProfile = subscribeUserProfile(user.uid, (nextProfile) => {
          setProfileDisplayName(nextProfile.displayName);
          setCompletedLessons(nextProfile.completedLessons);
          setWatchedVideos(nextProfile.watchedVideos);
          setSolvedChallenges(nextProfile.solvedChallenges);
          setExamAttempts(nextProfile.examAttempts);
          setActiveTrack(nextProfile.activeTrack);
        });

        const adminUser = isFirebaseBootstrapAdmin(user);
        unsubResults = subscribeExamResults(user.uid, adminUser, (items) => {
          setExamResults(normalizeExamResults(items));
        });

        unsubCerts = subscribeCertificates(user.uid, adminUser, (certs) => {
          setIssuedCertificates(certs);
        });
      } catch (err) {
        console.error('Failed to initialize user cloud profile:', err);
      }
    });

    return () => {
      unsubAuth();
      unsubProfile?.();
      unsubResults?.();
      unsubCerts?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      localStorage.setItem(STORAGE_TRACK, activeTrack);
    } catch {
      // Ignore storage errors
    }
  }, [activeTrack]);

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
      localStorage.setItem(STORAGE_EXAM_ATTEMPTS, JSON.stringify(examAttempts));
    } catch {
      // Ignore storage quota errors
    }
  }, [examAttempts]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_CERTIFICATES, JSON.stringify(issuedCertificates));
    } catch {
      // Ignore storage quota errors
    }
  }, [issuedCertificates]);

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

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_SOLVED_CHALLENGES, JSON.stringify(solvedChallenges));
    } catch {
      // Ignore storage quota errors
    }
  }, [solvedChallenges]);

  const handleSelectTrack = (track: LessonCategory) => {
    setActiveTrack(track);
    if (authUser) {
      void updateUserProgress(authUser.uid, { activeTrack: track });
    }
  };

  const handleToggleLesson = (id: string) => {
    setCompletedLessons((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      if (authUser) {
        void updateUserProgress(authUser.uid, { completedLessons: next });
      }
      return next;
    });
  };

  const handleMarkVideoWatched = (id: string, forceValue?: boolean) => {
    setWatchedVideos((prev) => {
      const exists = prev.includes(id);
      let next = prev;
      if (forceValue === true) {
        next = exists ? prev : [...prev, id];
      } else if (forceValue === false) {
        next = exists ? prev.filter((item) => item !== id) : prev;
      } else {
        next = exists ? prev.filter((item) => item !== id) : [...prev, id];
      }
      if (authUser && next !== prev) {
        void updateUserProgress(authUser.uid, { watchedVideos: next });
      }
      return next;
    });
  };

  const handleToggleChallenge = (id: string, solved: boolean) => {
    setSolvedChallenges((prev) => {
      const exists = prev.includes(id);
      let next = prev;
      if (solved) {
        next = exists ? prev : [...prev, id];
      } else {
        next = exists ? prev.filter((item) => item !== id) : prev;
      }
      if (authUser && next !== prev) {
        void updateUserProgress(authUser.uid, { solvedChallenges: next });
      }
      return next;
    });
  };

  const handleConsumeAttempt = (scope: ExamScope) => {
    setExamAttempts((prev) => {
      const next: Record<ExamScope, number> = {
        ...prev,
        [scope]: Math.min(MAX_EXAM_ATTEMPTS, (prev[scope] ?? 0) + 1),
      };
      if (authUser) {
        void updateUserProgress(authUser.uid, { examAttempts: next });
      }
      return next;
    });
  };

  const handleResetExamAttempts = (scope?: ExamScope) => {
    setExamAttempts((prev) => {
      const next: Record<ExamScope, number> = !scope
        ? { literacy: 0, programming: 0, all: 0 }
        : { ...prev, [scope]: 0 };
      if (authUser) {
        void updateUserProgress(authUser.uid, { examAttempts: next });
      }
      return next;
    });
  };

  const handleRecordResult = (record: ExamAttemptRecord) => {
    const enriched: PersistedExamResult = {
      ...record,
      userId: authUser?.uid,
    };
    setExamResults((prev) => [enriched, ...prev]);
    if (authUser) {
      void saveExamResultDoc(authUser.uid, record);
    }
  };

  const handleSaveCertificates = (nextCerts: CertificateRecord[]) => {
    const prevIds = new Set(issuedCertificates.map((c) => c.id));
    const nextIds = new Set(nextCerts.map((c) => c.id));

    const added = nextCerts.filter((c) => !prevIds.has(c.id));
    const removed = issuedCertificates.filter((c) => !nextIds.has(c.id));

    setIssuedCertificates(nextCerts);

    if (authUser) {
      for (const cert of added) {
        const match = examResults.find((r) => r.id === cert.attemptId);
        const ownerUid = match?.userId || authUser.uid;
        void saveCertificateDoc(cert, ownerUid, cert.attemptId);
      }
      if (isFirebaseBootstrapAdmin(authUser)) {
        for (const cert of removed) {
          void deleteCertificateDoc(cert.id);
        }
      }
    }
  };

  const syncCurriculumToCloud = (bundle: {
    videoLessons: VideoLessonItem[];
    lessons: LessonItem[];
    didYouKnowCards: DidYouKnowItem[];
    examQuestions: ExamQuestion[];
    glossaryTerms: GlossaryTerm[];
  }) => {
    if (authUser && isFirebaseBootstrapAdmin(authUser)) {
      void saveCurriculumOverride(bundle);
    }
  };

  const handleResetDefaults = () => {
    setVideoLessons(VIDEO_LESSONS);
    setLessons(LESSONS);
    setDidYouKnowCards(DID_YOU_KNOW_CARDS);
    setExamQuestions(EXAM_QUESTIONS);
    setGlossaryTerms(GLOSSARY_TERMS);
    setCompletedLessons([]);
    setWatchedVideos([]);
    setSolvedChallenges([]);
    if (authUser) {
      void updateUserProgress(authUser.uid, {
        completedLessons: [],
        watchedVideos: [],
        solvedChallenges: [],
      });
      syncCurriculumToCloud({
        videoLessons: VIDEO_LESSONS,
        lessons: LESSONS,
        didYouKnowCards: DID_YOU_KNOW_CARDS,
        examQuestions: EXAM_QUESTIONS,
        glossaryTerms: GLOSSARY_TERMS,
      });
    }
  };

  const openAdminWithAuth = async () => {
    setCornerMenuOpen(false);
    if (adminToken) {
      try {
        const res = await fetch('/api/admin/verify', {
          headers: { Authorization: `Bearer ${adminToken}` },
        });
        if (res.ok) {
          setViewMode('admin');
          window.scrollTo({ top: 0 });
          return;
        }
      } catch {
        // Fall through to prompt
      }
      setAdminToken(null);
    }
    setAdminLockOpen(true);
  };

  const handleSignOutUser = async () => {
    try {
      await signOut(auth);
      setCompletedLessons([]);
      setWatchedVideos([]);
      setSolvedChallenges([]);
      setExamAttempts({ literacy: 0, programming: 0, all: 0 });
      setExamResults([]);
      setIssuedCertificates([]);
      setCornerMenuOpen(false);
    } catch (err) {
      console.error('Sign out failed:', err);
    }
  };

  const navigateScreen = (screen: AppScreenId) => {
    setCornerMenuOpen(false);
    setViewMode('learn');
    setActiveScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateDestination = (dest: SidebarDestination) => {
    setCornerMenuOpen(false);
    setViewMode('learn');
    if (
      dest === 'lab' ||
      dest === 'masalalar' ||
      dest === 'bilasizmi' ||
      dest === 'lugat'
    ) {
      setActiveScreen('mashq');
      setMashqSubTab(dest);
    } else {
      setActiveScreen(dest);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToLesson = (lessonId: string) => {
    setCornerMenuOpen(false);
    setViewMode('learn');
    setFocusedLessonId(lessonId);
    setActiveScreen('darslar');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectTrackAndGo = (track: LessonCategory, targetScreen?: AppScreenId) => {
    handleSelectTrack(track);
    if (targetScreen) {
      navigateScreen(targetScreen);
    }
  };

  const activeDestination: SidebarDestination =
    activeScreen === 'mashq' ? mashqSubTab : activeScreen;

  const watchedVideoCount = watchedVideos.filter((id) =>
    videoLessons.some((v) => v.id === id)
  ).length;

  const trackVideos = videoLessons.filter((v) => v.category === activeTrack);
  const trackLessons = lessons.filter((l) => l.category === activeTrack);
  const trackChallenges = PRACTICE_CHALLENGES.filter((c) => c.category === activeTrack);
  const trackDyk = didYouKnowCards.filter((d) => d.category === activeTrack);
  const trackGlossary = glossaryTerms.filter((g) => g.category === activeTrack);
  const trackExamQuestions = examQuestions.filter((q) => q.category === activeTrack);

  const trackWatchedVideos = watchedVideos.filter((id) =>
    trackVideos.some((v) => v.id === id)
  ).length;
  const trackCompletedLessons = completedLessons.filter((id) =>
    trackLessons.some((l) => l.id === id)
  ).length;
  const trackSolvedChallenges = solvedChallenges.filter((id) =>
    trackChallenges.some((c) => c.id === id)
  ).length;

  const trackUsedAttempts = examAttempts[activeTrack] ?? 0;
  const remainingAttemptsForTrack = Math.max(0, MAX_EXAM_ATTEMPTS - trackUsedAttempts);

  const literacyStats = {
    videos: videoLessons.filter((v) => v.category === 'literacy').length,
    lessons: lessons.filter((l) => l.category === 'literacy').length,
    challenges: PRACTICE_CHALLENGES.filter((c) => c.category === 'literacy').length,
    exam: examQuestions.filter((q) => q.category === 'literacy').length,
  };

  const programmingStats = {
    videos: videoLessons.filter((v) => v.category === 'programming').length,
    lessons: lessons.filter((l) => l.category === 'programming').length,
    challenges: PRACTICE_CHALLENGES.filter((c) => c.category === 'programming').length,
    exam: examQuestions.filter((q) => q.category === 'programming').length,
  };

  const isProg = activeTrack === 'programming';

  if (viewMode === 'admin' && adminToken) {
    return (
      <Suspense fallback={<SectionFallback />}>
        <AdminPanel
          videoLessons={videoLessons}
          lessons={lessons}
          didYouKnowCards={didYouKnowCards}
          examQuestions={examQuestions}
          glossaryTerms={glossaryTerms}
          examResults={examResults}
          issuedCertificates={issuedCertificates}
          examAttempts={examAttempts}
          maxAttempts={MAX_EXAM_ATTEMPTS}
          isDark={isDark}
          onToggleTheme={() => setIsDark((prev) => !prev)}
          onSaveVideoLessons={(next) => {
            setVideoLessons(next);
            syncCurriculumToCloud({
              videoLessons: next,
              lessons,
              didYouKnowCards,
              examQuestions,
              glossaryTerms,
            });
          }}
          onSaveLessons={(next) => {
            setLessons(next);
            syncCurriculumToCloud({
              videoLessons,
              lessons: next,
              didYouKnowCards,
              examQuestions,
              glossaryTerms,
            });
          }}
          onSaveDidYouKnow={(next) => {
            setDidYouKnowCards(next);
            syncCurriculumToCloud({
              videoLessons,
              lessons,
              didYouKnowCards: next,
              examQuestions,
              glossaryTerms,
            });
          }}
          onSaveExamQuestions={(next) => {
            setExamQuestions(next);
            syncCurriculumToCloud({
              videoLessons,
              lessons,
              didYouKnowCards,
              examQuestions: next,
              glossaryTerms,
            });
          }}
          onSaveGlossary={(next) => {
            setGlossaryTerms(next);
            syncCurriculumToCloud({
              videoLessons,
              lessons,
              didYouKnowCards,
              examQuestions,
              glossaryTerms: next,
            });
          }}
          onSaveCertificates={handleSaveCertificates}
          onResetExamAttempts={handleResetExamAttempts}
          onClearResults={() => setExamResults([])}
          onResetDefaults={handleResetDefaults}
          onExitAdmin={() => {
            setViewMode('learn');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onGoToExam={() => navigateScreen('imtihon')}
        />
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-20 lg:pb-0">
      {/* Minimal Clean Top Bar — Menu in Top-Left Corner */}
      <header
        className={`sticky top-0 z-40 border-b text-white transition-colors ${
          isProg
            ? 'bg-slate-950 border-indigo-900/60'
            : 'bg-slate-900 border-slate-800'
        }`}
      >
        <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 h-14 lg:h-16 flex items-center justify-between gap-2.5">
          {/* Left Corner: Menu Button + Brand Wordmark + Active Track Tag */}
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              type="button"
              aria-label="Chap burchak menyusini ochish"
              onClick={() => setCornerMenuOpen(true)}
              className={`min-h-[42px] inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                isProg
                  ? 'bg-indigo-500 hover:bg-indigo-400 text-white'
                  : 'bg-sky-400 hover:bg-sky-300 text-slate-950'
              }`}
            >
              <Menu className="w-4 h-4 shrink-0" />
              <span>Menyu</span>
            </button>

            <button
              type="button"
              onClick={() => navigateScreen('kirish')}
              className="text-base sm:text-xl font-bold tracking-tight text-white whitespace-nowrap truncate cursor-pointer"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              murodillayev_dev
            </button>
            <span
              className={`hidden sm:inline-block text-[11px] font-medium whitespace-nowrap ${
                isProg ? 'text-indigo-300' : 'text-sky-300'
              }`}
            >
              · {isProg ? 'Dasturlash' : 'Savodxonlik'}
            </span>
          </div>

          {/* Right Corner: Account Quick Trigger */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => (authUser ? setCornerMenuOpen(true) : setAuthModalOpen(true))}
              className="min-h-[42px] inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {authUser ? (
                <>
                  <UserCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="max-w-[92px] sm:max-w-[140px] truncate">
                    {profileDisplayName || authUser.displayName || 'Akkaunt'}
                  </span>
                </>
              ) : (
                <>
                  <LogIn className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <span>Kirish</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Corner Slide-Over Menu Drawer (holds all moved top-bar items, track switcher, AI Ustoz, account & Admin) */}
      <StudentSidebar
        lessons={lessons}
        completedLessons={completedLessons}
        videoCount={videoLessons.length}
        watchedVideoCount={watchedVideoCount}
        challengeCount={PRACTICE_CHALLENGES.length}
        solvedChallengeCount={solvedChallenges.length}
        dykCount={didYouKnowCards.length}
        glossaryCount={glossaryTerms.length}
        examCount={examQuestions.length}
        remainingAttemptsForTrack={remainingAttemptsForTrack}
        maxAttempts={MAX_EXAM_ATTEMPTS}
        certificateCount={issuedCertificates.length}
        activeDestination={activeDestination}
        activeTrack={activeTrack}
        onSelectTrack={handleSelectTrack}
        isDark={isDark}
        onToggleTheme={() => setIsDark((prev) => !prev)}
        onNavigateDestination={navigateDestination}
        onNavigateLesson={navigateToLesson}
        onResetProgress={() => {
          setCompletedLessons([]);
          setWatchedVideos([]);
          setSolvedChallenges([]);
          if (authUser) {
            void updateUserProgress(authUser.uid, {
              completedLessons: [],
              watchedVideos: [],
              solvedChallenges: [],
            });
          }
        }}
        onOpenAdmin={() => void openAdminWithAuth()}
        userDisplayName={profileDisplayName || authUser?.displayName || null}
        userEmail={authUser?.email || null}
        isAuthenticated={Boolean(authUser)}
        onOpenAuth={() => setAuthModalOpen(true)}
        onSignOut={() => void handleSignOutUser()}
        open={cornerMenuOpen}
        onClose={() => setCornerMenuOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 min-w-0 flex flex-col">
        <main className="flex-1">
          {/* Cloud Account Banner if not signed in yet */}
          {authReady && !authUser && activeScreen === 'kirish' && (
            <div className="bg-emerald-950 text-emerald-100 border-b border-emerald-900/70 px-4 sm:px-6 lg:px-8 py-2.5">
              <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    Darslar, masalalar, imtihon urinishlari va sertifikatlar o‘chib ketmasligi
                    uchun login-parol bilan akkauntga kiring.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setAuthModalOpen(true)}
                  className="self-start sm:self-auto px-3 py-1.5 font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Akkauntga kirish / Ro‘yxatdan o‘tish
                </button>
              </div>
            </div>
          )}

          {/* Screen 1: Kirish / Dual-Track Launchpad */}
          {activeScreen === 'kirish' && (
            <div className="bg-slate-50 dark:bg-slate-950">
              <section
                className={`text-white pt-6 pb-9 sm:pt-11 sm:pb-13 transition-colors ${
                  isProg
                    ? 'bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900'
                    : 'bg-slate-900'
                }`}
              >
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 lg:gap-12 items-stretch">
                    <div className="lg:col-span-6 flex flex-col justify-center">
                      <p
                        className={`text-xs sm:text-sm font-semibold mb-2 ${
                          isProg ? 'text-indigo-400' : 'text-sky-400'
                        }`}
                      >
                        {isProg
                          ? '2-YO‘NALISH · DASTURLASH ASOSLARI MUHITI'
                          : '1-YO‘NALISH · KOMPYUTER SAVODXONLIGI'}
                      </p>
                      <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-[1.15] text-balance mb-3.5 sm:mb-4">
                        {isProg
                          ? 'Dasturlash va algoritmlarni chuqur mashq qilib o‘rganing'
                          : 'Kompyuter savodxonligini chuqur tahlil bilan egallang'}
                      </h1>
                      <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6 max-w-xl">
                        {isProg
                          ? '0 va 1 tili, algoritmlar, kod tahlili, sikl va massiv masalalari, fikr beruvchi AI Ustoz, 3 martalik qattiq imtihon va rasmiy sertifikat.'
                          : 'Kompyuter arxitekturasi, fayl tizimlari, Excel formulalari, DNS/tarmoq va kiberxavfsizlik — AI Ustoz yordami, 3 martalik imtihon va rasmiy sertifikat.'}
                      </p>

                      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <button
                          type="button"
                          onClick={() => navigateScreen('yolxarita')}
                          className={`w-full sm:w-auto min-h-[48px] inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold active:scale-[0.99] rounded-xl sm:rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                            isProg
                              ? 'text-white bg-indigo-500 hover:bg-indigo-400'
                              : 'text-slate-950 bg-sky-400 hover:bg-sky-300'
                          }`}
                        >
                          <Compass className="w-4 h-4 shrink-0" />
                          <span>O‘rganishni boshlash</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => navigateScreen('aiustoz')}
                          className="w-full sm:w-auto min-h-[48px] inline-flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-medium text-slate-200 hover:text-white border border-slate-700 hover:border-slate-500 active:scale-[0.99] rounded-xl sm:rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer"
                        >
                          <Bot className="w-4 h-4 shrink-0" />
                          <span>AI Ustozdan fikr olish</span>
                          <ArrowRight className="w-4 h-4 shrink-0" />
                        </button>
                      </div>
                    </div>

                    <div className="lg:col-span-6">
                      <div className="h-full min-h-[190px] sm:min-h-[250px] rounded-2xl overflow-hidden border border-slate-800 bg-slate-800">
                        <ResilientImage
                          src={
                            isProg
                              ? '/src/assets/images/programming_logic_visual_1795163270407.jpg'
                              : '/src/assets/images/hero_coding_studio_1795163267457.jpg'
                          }
                          alt={
                            isProg
                              ? 'Dasturlash algoritmi va kod yozish muhiti'
                              : 'Zamonaviy kompyuter va dasturlash o‘quv ish stoli illyustratsiyasi'
                          }
                          fallbackTitle={
                            isProg
                              ? 'Dasturlash asoslari o‘quv muhiti'
                              : 'Kompyuter savodxonligi muhiti'
                          }
                          priority={true}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Track-specific 4-Column Quick Stats */}
                  <div className="mt-7 sm:mt-10 pt-5 border-t border-slate-800/90 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    <div>
                      <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-white">
                        {trackWatchedVideos}/{trackVideos.length}
                      </div>
                      <div className="text-xs sm:text-sm text-slate-400 mt-0.5">
                        Ko‘rilgan videolar
                      </div>
                    </div>
                    <div>
                      <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-white">
                        {trackCompletedLessons}/{trackLessons.length}
                      </div>
                      <div className="text-xs sm:text-sm text-slate-400 mt-0.5">
                        Tugallangan darslar
                      </div>
                    </div>
                    <div>
                      <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-white">
                        {trackSolvedChallenges}/{trackChallenges.length}
                      </div>
                      <div className="text-xs sm:text-sm text-slate-400 mt-0.5">
                        Yechilgan qiyin masalalar
                      </div>
                    </div>
                    <div>
                      <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-white">
                        {remainingAttemptsForTrack} / {MAX_EXAM_ATTEMPTS}
                      </div>
                      <div className="text-xs sm:text-sm text-slate-400 mt-0.5">
                        Qolgan imtihon imkoniyati
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Dedicated Track Selector Cards + Quick App Launchpad */}
              <section className="py-6 sm:py-9">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-7">
                  <div>
                    <div className="mb-3">
                      <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                        Alohida o‘quv yo‘nalishlari (Tema)
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                        Savodxonlik va Dasturlash alohida bo‘limlarga ajratilgan — har birida
                        3 martagacha imtihon topshirish imkoniyati mavjud
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => handleSelectTrackAndGo('literacy')}
                        className={`text-left p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                          !isProg
                            ? 'bg-white dark:bg-slate-900 border-sky-500 shadow-sm'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-sky-300'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="w-11 h-11 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-400 flex items-center justify-center shrink-0">
                            <Monitor className="w-6 h-6" />
                          </div>
                          <span
                            className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${
                              !isProg
                                ? 'bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                            }`}
                          >
                            {!isProg ? 'Tanlangan' : 'Tanlash'}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                            1. Kompyuter savodxonligi
                          </h3>
                          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                            CPU/RAM/SSD, Fayl/ZIP, Excel formulalari, DNS/HTTP, Kiberxavfsizlik va
                            AI savodxonligi.
                          </p>
                        </div>
                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-2.5 text-xs font-mono text-slate-500 dark:text-slate-400">
                          <span>{literacyStats.videos} video</span>
                          <span>·</span>
                          <span>{literacyStats.lessons} dars</span>
                          <span>·</span>
                          <span>{literacyStats.challenges} masala</span>
                          <span>·</span>
                          <span>{literacyStats.exam} test</span>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSelectTrackAndGo('programming')}
                        className={`text-left p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                          isProg
                            ? 'bg-white dark:bg-slate-900 border-indigo-500 shadow-sm'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-300'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 flex items-center justify-center shrink-0">
                            <Code2 className="w-6 h-6" />
                          </div>
                          <span
                            className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${
                              isProg
                                ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                            }`}
                          >
                            {isProg ? 'Tanlangan' : 'Tanlash'}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                            2. Dasturlash asoslari (Alohida tema)
                          </h3>
                          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                            0 va 1 tili, Algoritmlar, shart va sikl tahlili, Funksiyalar,
                            Massiv/JSON va Veb-dasturlash.
                          </p>
                        </div>
                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-2.5 text-xs font-mono text-slate-500 dark:text-slate-400">
                          <span>{programmingStats.videos} video</span>
                          <span>·</span>
                          <span>{programmingStats.lessons} dars</span>
                          <span>·</span>
                          <span>{programmingStats.challenges} masala</span>
                          <span>·</span>
                          <span>{programmingStats.exam} test</span>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Quick App Grid */}
                  <div>
                    <div className="mb-3">
                      <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                        {isProg
                          ? 'Dasturlash bo‘limlari (Tezkor kirish)'
                          : 'Savodxonlik bo‘limlari (Tezkor kirish)'}
                      </h2>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                      <button
                        type="button"
                        onClick={() => navigateDestination('aiustoz')}
                        className="text-left p-4 sm:p-5 bg-white dark:bg-slate-900 border border-sky-200 dark:border-sky-900/60 hover:border-sky-400 dark:hover:border-indigo-500 rounded-2xl transition-colors cursor-pointer flex flex-col justify-between gap-3"
                      >
                        <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-400 flex items-center justify-center">
                          <Bot className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white">
                            AI Ustoz (Fikr beruvchi)
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            Javobsiz, faqat yo‘naltiruvchi fikr
                          </div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => navigateDestination('yolxarita')}
                        className="text-left p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-sky-400 dark:hover:border-indigo-500 rounded-2xl transition-colors cursor-pointer flex flex-col justify-between gap-3"
                      >
                        <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-400 flex items-center justify-center">
                          <Compass className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white">
                            O‘quv yo‘l xaritasi
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            5 bosqichli tayyorgarlik rejasi
                          </div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => navigateDestination('videolar')}
                        className="text-left p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-sky-400 dark:hover:border-indigo-500 rounded-2xl transition-colors cursor-pointer flex flex-col justify-between gap-3"
                      >
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            isProg
                              ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400'
                              : 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-400'
                          }`}
                        >
                          <Video className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white">
                            Videodarslar
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            {trackVideos.length} ta animatsion video
                          </div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => navigateDestination('darslar')}
                        className="text-left p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-sky-400 dark:hover:border-indigo-500 rounded-2xl transition-colors cursor-pointer flex flex-col justify-between gap-3"
                      >
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 flex items-center justify-center">
                          <BookOpen className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white">
                            Mini-darslar
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            {trackLessons.length} ta chuqur dars
                          </div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => navigateDestination('masalalar')}
                        className="text-left p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-500 rounded-2xl transition-colors cursor-pointer flex flex-col justify-between gap-3"
                      >
                        <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center">
                          <Flame className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white">
                            Qiyin masalalar
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            {trackChallenges.length} ta amaliy tahlil mashqi
                          </div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => navigateDestination('lab')}
                        className="text-left p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-sky-400 dark:hover:border-indigo-500 rounded-2xl transition-colors cursor-pointer flex flex-col justify-between gap-3"
                      >
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
                          <Terminal className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white">
                            Amaliy laboratoriya
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            {isProg ? 'Jonli kod sinagichi' : 'Xotira, tez terish va xavfsizlik'}
                          </div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => navigateDestination('bilasizmi')}
                        className="text-left p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-sky-400 dark:hover:border-indigo-500 rounded-2xl transition-colors cursor-pointer flex flex-col justify-between gap-3"
                      >
                        <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center">
                          <HelpCircle className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white">
                            Bilasizmi?
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            {trackDyk.length} ta mantiqiy savol-javob
                          </div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => navigateDestination('lugat')}
                        className="text-left p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-sky-400 dark:hover:border-indigo-500 rounded-2xl transition-colors cursor-pointer flex flex-col justify-between gap-3"
                      >
                        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center">
                          <BookA className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white">
                            IT Lug‘at
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            {trackGlossary.length} ta asosiy atama
                          </div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => navigateDestination('sertifikat')}
                        className="text-left p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-500 rounded-2xl transition-colors cursor-pointer flex flex-col justify-between gap-3"
                      >
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
                          <Award className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white">
                            Sertifikatlarim
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            {issuedCertificates.length} ta tasdiqlangan sertifikat
                          </div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => navigateDestination('imtihon')}
                        className={`col-span-2 lg:col-span-3 text-left p-4 sm:p-5 rounded-2xl border transition-colors cursor-pointer flex items-center justify-between gap-4 ${
                          isProg
                            ? 'bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-500'
                            : 'bg-slate-900 dark:bg-sky-500 text-white dark:text-slate-950 border-slate-900 dark:border-sky-500 hover:bg-slate-800 dark:hover:bg-sky-400'
                        }`}
                      >
                        <div className="flex items-center gap-3.5">
                          <div className="w-11 h-11 rounded-xl bg-white/15 dark:bg-slate-950/15 flex items-center justify-center shrink-0">
                            <ClipboardCheck className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-sm sm:text-base font-semibold">
                              Yakuniy imtihon ({trackExamQuestions.length} ta savol)
                            </div>
                            <div className="text-xs opacity-85 mt-0.5">
                              Qolgan imkoniyat: {remainingAttemptsForTrack} / {MAX_EXAM_ATTEMPTS} ·
                              O‘tish bali: 75%+
                            </div>
                          </div>
                        </div>
                        <ArrowRight className="w-5 h-5 shrink-0" />
                      </button>
                    </div>
                  </div>

                  {/* Engaging Topic Illustrations Gallery */}
                  <div className="cv-auto">
                    <div className="mb-3 flex items-end justify-between gap-3">
                      <div>
                        <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                          Qiziqarli mavzular galereyasi
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                          Har bir rasm ustiga bosib tegishli bo‘limni darhol oching
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
                      <button
                        type="button"
                        onClick={() => handleSelectTrackAndGo('literacy', 'darslar')}
                        className="group text-left bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-sky-400 rounded-2xl overflow-hidden transition-colors cursor-pointer flex flex-col"
                      >
                        <div className="aspect-[4/3] w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                          <ResilientImage
                            src="/src/assets/images/computer_hardware_diagram_1795163268376.jpg"
                            alt="Kompyuter ichki qismlari: CPU, RAM va SSD sxemasi"
                            fallbackTitle="Apparat qismlari"
                            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                          />
                        </div>
                        <div className="p-3.5">
                          <div className="text-xs font-semibold text-sky-700 dark:text-sky-400">
                            Savodxonlik
                          </div>
                          <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                            CPU, RAM va SSD qanday ishlaydi?
                          </div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSelectTrackAndGo('literacy', 'darslar')}
                        className="group text-left bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-sky-400 rounded-2xl overflow-hidden transition-colors cursor-pointer flex flex-col"
                      >
                        <div className="aspect-[4/3] w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                          <ResilientImage
                            src="/src/assets/images/spreadsheet_network_lab_1795425391913.jpg"
                            alt="Excel jadvallari, formulalar va internet DNS tarmog‘i illyustratsiyasi"
                            fallbackTitle="Excel va Internet"
                            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                          />
                        </div>
                        <div className="p-3.5">
                          <div className="text-xs font-semibold text-sky-700 dark:text-sky-400">
                            Ofis va Tarmoq
                          </div>
                          <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                            Excel formulalari va DNS sirlari
                          </div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          handleSelectTrack('literacy');
                          navigateDestination('masalalar');
                        }}
                        className="group text-left bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-400 rounded-2xl overflow-hidden transition-colors cursor-pointer flex flex-col"
                      >
                        <div className="aspect-[4/3] w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                          <ResilientImage
                            src="/src/assets/images/cyber_security_shield_1795425392051.jpg"
                            alt="Kiberxavfsizlik, kuchli parollar va fishingdan himoya qalqoni"
                            fallbackTitle="Kiberxavfsizlik"
                            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                          />
                        </div>
                        <div className="p-3.5">
                          <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                            Himoya va Tahlil
                          </div>
                          <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                            Kiberxavfsizlik va qiyin masalalar
                          </div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => navigateDestination('aiustoz')}
                        className="group text-left bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 rounded-2xl overflow-hidden transition-colors cursor-pointer flex flex-col"
                      >
                        <div className="aspect-[4/3] w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                          <ResilientImage
                            src="/src/assets/images/ai_mentor_learning_1795425392617.jpg"
                            alt="AI Ustoz bilan birga fikrlash va mustaqil kod yozish illyustratsiyasi"
                            fallbackTitle="AI Ustoz"
                            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                          />
                        </div>
                        <div className="p-3.5">
                          <div className="text-xs font-semibold text-indigo-700 dark:text-indigo-400">
                            Sokratik Mentor
                          </div>
                          <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                            AI Ustozdan yo‘naltiruvchi fikr
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* Lazy-Loaded Screens for Low-RAM Phone Performance */}
          <Suspense fallback={<SectionFallback />}>
            {/* Screen 1b: O'quv yo'l xaritasi */}
            {activeScreen === 'yolxarita' && (
              <RoadmapSection
                activeTrack={activeTrack}
                onSelectTrack={handleSelectTrack}
                videos={videoLessons}
                watchedVideos={watchedVideos}
                lessons={lessons}
                completedLessons={completedLessons}
                challenges={PRACTICE_CHALLENGES}
                solvedChallenges={solvedChallenges}
                attemptsUsed={trackUsedAttempts}
                maxAttempts={MAX_EXAM_ATTEMPTS}
                certificates={issuedCertificates}
                onGoVideos={() => navigateScreen('videolar')}
                onGoLessons={() => navigateScreen('darslar')}
                onGoChallenges={() => navigateDestination('masalalar')}
                onGoExam={() => navigateScreen('imtihon')}
                onGoCertificates={() => navigateScreen('sertifikat')}
              />
            )}

            {/* Screen 2: Videodarslar */}
            {activeScreen === 'videolar' && (
              <VideoLessonsSection
                videos={videoLessons}
                watchedVideos={watchedVideos}
                activeTrack={activeTrack}
                onSelectTrack={handleSelectTrack}
                onMarkWatched={handleMarkVideoWatched}
                onGoToLessons={() => navigateScreen('darslar')}
                onStartExam={() => navigateScreen('imtihon')}
              />
            )}

            {/* Screen 3: Mini-darslar */}
            {activeScreen === 'darslar' && (
              <LessonsSection
                lessons={lessons}
                completedLessons={completedLessons}
                activeTrack={activeTrack}
                onSelectTrack={handleSelectTrack}
                focusedLessonId={focusedLessonId}
                onToggleLesson={handleToggleLesson}
                onOpenVideos={() => navigateScreen('videolar')}
                onStartExam={() => navigateScreen('imtihon')}
              />
            )}

            {/* Screen 4: Mashqlar Workspace */}
            {activeScreen === 'mashq' && (
              <div className="bg-slate-50 dark:bg-slate-950">
                <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 lg:px-8 py-3">
                  <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div
                      role="tablist"
                      aria-label="Mashq bo‘limlari"
                      className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-full"
                    >
                      <button
                        type="button"
                        role="tab"
                        aria-selected={mashqSubTab === 'lab'}
                        onClick={() => setMashqSubTab('lab')}
                        className={`min-h-[42px] px-3 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
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
                        aria-selected={mashqSubTab === 'masalalar'}
                        onClick={() => setMashqSubTab('masalalar')}
                        className={`min-h-[42px] px-3 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                          mashqSubTab === 'masalalar'
                            ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-white shadow-sm'
                            : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        Qiyin masalalar ({trackChallenges.length})
                      </button>
                      <button
                        type="button"
                        role="tab"
                        aria-selected={mashqSubTab === 'aiustoz'}
                        onClick={() => setMashqSubTab('aiustoz')}
                        className={`min-h-[42px] px-3 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                          mashqSubTab === 'aiustoz'
                            ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-white shadow-sm'
                            : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        AI Ustoz
                      </button>
                      <button
                        type="button"
                        role="tab"
                        aria-selected={mashqSubTab === 'bilasizmi'}
                        onClick={() => setMashqSubTab('bilasizmi')}
                        className={`min-h-[42px] px-3 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                          mashqSubTab === 'bilasizmi'
                            ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-white shadow-sm'
                            : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        Bilasizmi? ({trackDyk.length})
                      </button>
                      <button
                        type="button"
                        role="tab"
                        aria-selected={mashqSubTab === 'lugat'}
                        onClick={() => setMashqSubTab('lugat')}
                        className={`min-h-[42px] px-3 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                          mashqSubTab === 'lugat'
                            ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-white shadow-sm'
                            : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        IT Lug‘at ({trackGlossary.length})
                      </button>
                    </div>
                  </div>
                </div>

                {mashqSubTab === 'lab' && <CodePlaygroundSection activeTrack={activeTrack} />}
                {mashqSubTab === 'masalalar' && (
                  <ChallengesSection
                    challenges={PRACTICE_CHALLENGES}
                    solvedIds={solvedChallenges}
                    activeTrack={activeTrack}
                    onSelectTrack={handleSelectTrack}
                    onToggleSolved={handleToggleChallenge}
                  />
                )}
                {mashqSubTab === 'aiustoz' && (
                  <AiTutorSection activeTrack={activeTrack} onSelectTrack={handleSelectTrack} />
                )}
                {mashqSubTab === 'bilasizmi' && (
                  <DidYouKnowSection
                    cards={didYouKnowCards}
                    activeTrack={activeTrack}
                    onSelectTrack={handleSelectTrack}
                  />
                )}
                {mashqSubTab === 'lugat' && (
                  <GlossarySection
                    terms={glossaryTerms}
                    activeTrack={activeTrack}
                    onSelectTrack={handleSelectTrack}
                  />
                )}
              </div>
            )}

            {/* Screen 4b: Dedicated AI Ustoz */}
            {activeScreen === 'aiustoz' && (
              <AiTutorSection activeTrack={activeTrack} onSelectTrack={handleSelectTrack} />
            )}

            {/* Screen 5: Yakuniy imtihon */}
            {activeScreen === 'imtihon' && (
              <FinalExamSection
                questions={examQuestions}
                activeTrack={activeTrack}
                examAttempts={examAttempts}
                maxAttempts={MAX_EXAM_ATTEMPTS}
                onConsumeAttempt={handleConsumeAttempt}
                onRecordResult={handleRecordResult}
                onBackToLessons={() => navigateScreen('darslar')}
                onGoToChallenges={() => navigateDestination('masalalar')}
                onGoToCertificates={() => navigateScreen('sertifikat')}
              />
            )}

            {/* Screen 6: Sertifikatlarim */}
            {activeScreen === 'sertifikat' && (
              <CertificatesSection
                certificates={issuedCertificates}
                examResults={examResults}
                examAttempts={examAttempts}
                maxAttempts={MAX_EXAM_ATTEMPTS}
                onGoToExam={() => navigateScreen('imtihon')}
                onOpenAdmin={() => void openAdminWithAuth()}
              />
            )}
          </Suspense>
        </main>

        {/* Clean Footer */}
        <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 py-7">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <p>
              © {new Date().getFullYear()} murodillayev_dev. Kompyuter savodxonligi va dasturlash
              asoslari.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-5">
              <button
                type="button"
                onClick={() => handleSelectTrackAndGo('literacy', 'darslar')}
                className="py-1 hover:text-white transition-colors cursor-pointer"
              >
                Savodxonlik
              </button>
              <button
                type="button"
                onClick={() => handleSelectTrackAndGo('programming', 'darslar')}
                className="py-1 hover:text-white transition-colors cursor-pointer"
              >
                Dasturlash
              </button>
              <button
                type="button"
                onClick={() => navigateScreen('aiustoz')}
                className="py-1 hover:text-white transition-colors cursor-pointer"
              >
                AI Ustoz
              </button>
              <button
                type="button"
                onClick={() => navigateScreen('sertifikat')}
                className="py-1 hover:text-white transition-colors cursor-pointer"
              >
                Sertifikatlar
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
                onClick={() => void openAdminWithAuth()}
                className={`py-1 inline-flex items-center gap-1 transition-colors cursor-pointer ${
                  isProg
                    ? 'text-indigo-400 hover:text-indigo-300'
                    : 'text-sky-400 hover:text-sky-300'
                }`}
              >
                <Lock className="w-3 h-3" />
                <span>Admin panel</span>
              </button>
            </div>
          </div>
        </footer>
      </div>

      {/* Fixed Thumb-Zone Bottom Navigation Bar on Mobile */}
      <MobileBottomNav
        activeScreen={activeScreen}
        activeTrack={activeTrack}
        onSelectScreen={navigateScreen}
      />

      {/* Login / Register Modal (only mounted when open to save RAM) */}
      {authModalOpen && (
        <Suspense fallback={null}>
          <AuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} />
        </Suspense>
      )}

      {/* Server-Verified Admin Passcode Modal (only mounted when open to save RAM) */}
      {adminLockOpen && (
        <Suspense fallback={null}>
          <AdminLockModal
            open={adminLockOpen}
            onClose={() => setAdminLockOpen(false)}
            onAuthenticated={(token) => {
              setAdminToken(token);
              setAdminLockOpen(false);
              setViewMode('admin');
              window.scrollTo({ top: 0 });
            }}
          />
        </Suspense>
      )}
    </div>
  );
}
