import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import {
  ArrowRight,
  Award,
  BookOpen,
  Bot,
  CheckCircle2,
  ClipboardCheck,
  Code2,
  Keyboard,
  Lock,
  LogIn,
  Menu,
  Monitor,
  Terminal,
  UserCheck,
  Video,
} from 'lucide-react';
import type { ExamAttemptRecord, ExamScope } from './components/FinalExamSection';
import type { AppScreenId } from './components/MobileBottomNav';
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
const RulesAndShortcutsSection = lazy(() =>
  import('./components/RulesAndShortcutsSection').then((m) => ({
    default: m.RulesAndShortcutsSection,
  }))
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
  adminUnlockUserExam,
  deleteCertificateDoc,
  ensureUserProfile,
  isFirebaseBootstrapAdmin,
  loadCurriculumOverride,
  saveCertificateDoc,
  saveCurriculumOverride,
  saveExamResultDoc,
  subscribeAllUsersForAdmin,
  subscribeCertificates,
  subscribeExamResults,
  subscribeUserProfile,
  updateUserProgress,
  type PersistedExamResult,
  type UserProfileDoc,
} from './services/firestoreService';
import {
  EXAM_COOLDOWN_MS,
  formatRemainingCountdown,
  isExamScopeLocked,
} from './utils/examCooldown';

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
const STORAGE_EXAM_LOCKS = 'kodsavod_exam_locks_v1';
const STORAGE_CERTIFICATES = 'kodsavod_certificates_v1';
const STORAGE_THEME = 'kodsavod_theme_v1';
const STORAGE_TRACK = 'kodsavod_active_track_v1';
const STORAGE_MASTERED_RULES = 'codecraft_mastered_rules_v1';
const LEGACY_MASTERED_RULES = 'novacode_mastered_rules_v1';

type MashqSubTab = 'lab' | 'masalalar' | 'aiustoz' | 'bilasizmi' | 'lugat';

const DEFAULT_ATTEMPTS: Record<ExamScope, number> = {
  literacy: 0,
  programming: 0,
  all: 0,
};

const DEFAULT_LOCKS: Record<ExamScope, number> = {
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
  const [profileDisplayName, setProfileDisplayName] = useState<string | null>(null);
  const pendingExamSavesRef = useRef<Map<string, Promise<void>>>(new Map());

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
  const [examLockedUntil, setExamLockedUntil] = useState<Record<ExamScope, number>>(() => {
    const saved = loadFromStorage<Partial<Record<ExamScope, number>>>(
      STORAGE_EXAM_LOCKS,
      DEFAULT_LOCKS
    );
    return {
      literacy: typeof saved.literacy === 'number' ? saved.literacy : 0,
      programming: typeof saved.programming === 'number' ? saved.programming : 0,
      all: typeof saved.all === 'number' ? saved.all : 0,
    };
  });
  const [cloudUsers, setCloudUsers] = useState<UserProfileDoc[]>([]);
  const [nowMs, setNowMs] = useState(() => Date.now());
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
  const [masteredRules, setMasteredRules] = useState<string[]>(() => {
    const primary = loadFromStorage<string[]>(STORAGE_MASTERED_RULES, []);
    if (primary.length > 0) return primary;
    return loadFromStorage<string[]>(LEGACY_MASTERED_RULES, []);
  });

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
    let unsubAdminUsers: (() => void) | undefined;

    const unsubAuth = onAuthStateChanged(auth, async (user) => {
      unsubProfile?.();
      unsubResults?.();
      unsubCerts?.();
      unsubAdminUsers?.();

      setAuthUser(user);

      if (!user) {
        setProfileDisplayName(null);
        setCloudUsers([]);
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
          examLockedUntil,
        });

        setProfileDisplayName(profile.displayName);
        setCompletedLessons(profile.completedLessons);
        setWatchedVideos(profile.watchedVideos);
        setSolvedChallenges(profile.solvedChallenges);
        setExamAttempts(profile.examAttempts);
        setExamLockedUntil(profile.examLockedUntil);
        setActiveTrack(profile.activeTrack);

        unsubProfile = subscribeUserProfile(user.uid, (nextProfile) => {
          setProfileDisplayName(nextProfile.displayName);
          setCompletedLessons(nextProfile.completedLessons);
          setWatchedVideos(nextProfile.watchedVideos);
          setSolvedChallenges(nextProfile.solvedChallenges);
          setExamAttempts(nextProfile.examAttempts);
          setExamLockedUntil(nextProfile.examLockedUntil);
          setActiveTrack(nextProfile.activeTrack);
        });

        const adminUser = isFirebaseBootstrapAdmin(user);
        unsubResults = subscribeExamResults(user.uid, adminUser, (items) => {
          setExamResults(normalizeExamResults(items));
        });

        unsubCerts = subscribeCertificates(user.uid, adminUser, (certs) => {
          setIssuedCertificates(certs);
        });

        if (adminUser) {
          unsubAdminUsers = subscribeAllUsersForAdmin((users) => {
            setCloudUsers(users);
          });
        } else {
          setCloudUsers([]);
        }
      } catch (err) {
        console.error('Failed to initialize user cloud profile:', err);
      }
    });

    return () => {
      unsubAuth();
      unsubProfile?.();
      unsubResults?.();
      unsubCerts?.();
      unsubAdminUsers?.();
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
      localStorage.setItem(STORAGE_EXAM_LOCKS, JSON.stringify(examLockedUntil));
    } catch {
      // Ignore storage quota errors
    }
  }, [examLockedUntil]);

  const hasAnyActiveExamLock =
    examLockedUntil.literacy > 0 ||
    examLockedUntil.programming > 0 ||
    examLockedUntil.all > 0;

  useEffect(() => {
    if (!hasAnyActiveExamLock) return;
    const interval = window.setInterval(() => {
      const current = Date.now();
      setNowMs(current);

      const expiredScopes = (['literacy', 'programming', 'all'] as ExamScope[]).filter(
        (s) => examLockedUntil[s] > 0 && current >= examLockedUntil[s]
      );
      if (expiredScopes.length > 0) {
        const nextLocks = { ...examLockedUntil };
        const nextAttempts = { ...examAttempts };
        for (const s of expiredScopes) {
          nextLocks[s] = 0;
          nextAttempts[s] = 0;
        }
        setExamLockedUntil(nextLocks);
        setExamAttempts(nextAttempts);
        if (authUser) {
          void updateUserProgress(authUser.uid, {
            examAttempts: nextAttempts,
            examLockedUntil: nextLocks,
          });
        }
      }
    }, 1000);
    return () => window.clearInterval(interval);
  }, [hasAnyActiveExamLock, examLockedUntil, examAttempts, authUser]);

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

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_MASTERED_RULES, JSON.stringify(masteredRules));
    } catch {
      // Ignore storage quota errors
    }
  }, [masteredRules]);

  const handleToggleMasteredRule = (id: string) => {
    setMasteredRules((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

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

  const handleLockExam24h = (scope: ExamScope) => {
    const unlockAt = Date.now() + EXAM_COOLDOWN_MS;
    setNowMs(Date.now());
    setExamLockedUntil((prev) => {
      const next: Record<ExamScope, number> = {
        ...prev,
        [scope]: unlockAt,
      };
      if (authUser) {
        void updateUserProgress(authUser.uid, { examLockedUntil: next });
      }
      return next;
    });
  };

  const handleResetExamAttempts = (scope?: ExamScope) => {
    const nextAttempts: Record<ExamScope, number> = !scope
      ? { literacy: 0, programming: 0, all: 0 }
      : { ...examAttempts, [scope]: 0 };
    const nextLocks: Record<ExamScope, number> = !scope
      ? { literacy: 0, programming: 0, all: 0 }
      : { ...examLockedUntil, [scope]: 0 };

    setExamAttempts(nextAttempts);
    setExamLockedUntil(nextLocks);
    if (authUser) {
      void updateUserProgress(authUser.uid, {
        examAttempts: nextAttempts,
        examLockedUntil: nextLocks,
      });
    }
  };

  const handleUnlockCloudUserExam = (targetUser: UserProfileDoc, scope?: ExamScope) => {
    void adminUnlockUserExam(targetUser, scope);
  };

  const handleRecordResult = (record: ExamAttemptRecord) => {
    const enriched: PersistedExamResult = {
      ...record,
      userId: authUser?.uid,
    };
    setExamResults((prev) => [enriched, ...prev]);
    if (authUser) {
      const savePromise = saveExamResultDoc(authUser.uid, record)
        .catch((err) => {
          console.error('Failed to persist exam result:', err);
        })
        .finally(() => {
          pendingExamSavesRef.current.delete(record.id);
        });
      pendingExamSavesRef.current.set(record.id, savePromise);
    }
  };

  const handleCreateStudentCertificate = async (cert: CertificateRecord) => {
    setIssuedCertificates((prev) => [cert, ...prev.filter((c) => c.id !== cert.id)]);
    if (authUser) {
      const pendingExamWrite = pendingExamSavesRef.current.get(cert.attemptId);
      if (pendingExamWrite) {
        await pendingExamWrite;
      }
      await saveCertificateDoc(cert, authUser.uid, cert.attemptId);
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
      setExamLockedUntil({ literacy: 0, programming: 0, all: 0 });
      setExamResults([]);
      setIssuedCertificates([]);
      setCloudUsers([]);
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

  const activeTrackLockedUntil = examLockedUntil[activeTrack] ?? 0;
  const isTrackExamLocked = isExamScopeLocked(activeTrackLockedUntil, nowMs);
  const trackUsedAttempts = isTrackExamLocked
    ? MAX_EXAM_ATTEMPTS
    : (examAttempts[activeTrack] ?? 0);
  const remainingAttemptsForTrack = isTrackExamLocked
    ? 0
    : Math.max(0, MAX_EXAM_ATTEMPTS - trackUsedAttempts);
  const trackLockCountdownText = isTrackExamLocked
    ? formatRemainingCountdown(activeTrackLockedUntil, nowMs)
    : undefined;

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
          examLockedUntil={examLockedUntil}
          cloudUsers={cloudUsers}
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
          onUnlockCloudUserExam={handleUnlockCloudUserExam}
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
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Very Top Bar — Only Brand Name */}
      <header
        className={`border-b text-white transition-colors ${
          isProg
            ? 'bg-slate-950 border-indigo-900/60'
            : 'bg-slate-900 border-slate-800'
        }`}
      >
        <div className="max-w-6xl mx-auto px-3.5 sm:px-6 lg:px-8 h-11 flex items-center justify-center sm:justify-start">
          <button
            type="button"
            onClick={() => navigateScreen('kirish')}
            className="text-base sm:text-lg font-bold tracking-tight text-white whitespace-nowrap truncate cursor-pointer"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            BilimKod
          </button>
        </div>
      </header>

      {/* Upper Menu Strip — Directly Below Brand Name Bar */}
      <div className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-3.5 sm:px-6 lg:px-8 h-11 flex items-center justify-between gap-2">
          <button
            type="button"
            aria-label="Menyuni ochish"
            aria-expanded={cornerMenuOpen}
            onClick={() => setCornerMenuOpen((prev) => !prev)}
            className={`min-h-[34px] inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              isProg
                ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-950'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 border-slate-200 dark:border-slate-700 hover:bg-slate-200/80 dark:hover:bg-slate-700'
            }`}
          >
            <Menu className="w-3.5 h-3.5 shrink-0" />
            <span>Menyu</span>
          </button>

          <button
            type="button"
            onClick={() => (authUser ? setCornerMenuOpen(true) : setAuthModalOpen(true))}
            className="min-h-[34px] inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/80 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {authUser ? (
              <>
                <UserCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="max-w-[100px] sm:max-w-[140px] truncate">
                  {profileDisplayName || authUser.displayName || 'Akkaunt'}
                </span>
              </>
            ) : (
              <>
                <LogIn className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0" />
                <span>Kirish</span>
              </>
            )}
          </button>
        </div>
      </div>

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
        isTrackExamLocked={isTrackExamLocked}
        lockedRemainingText={trackLockCountdownText}
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
          {/* Screen 1: Clean Mobile-First Launchpad */}
          {activeScreen === 'kirish' && (
            <div className="bg-slate-50 dark:bg-slate-950">
              <section
                className={`text-white pt-6 pb-8 sm:pt-10 sm:pb-12 transition-colors ${
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
                        BilimKod · murodillayev_dev
                      </p>
                      <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-[1.15] text-balance mb-3.5 sm:mb-4">
                        {isProg
                          ? 'Dasturlash va algoritmlarni chuqur mashq qilib o‘rganing'
                          : 'Kompyuter savodxonligini chuqur tahlil bilan egallang'}
                      </h1>
                      <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6 max-w-xl">
                        {isProg
                          ? '0 va 1 tili, algoritmlar, sikl va massiv masalalari, fikr beruvchi AI Ustoz hamda tezkor rasm sertifikat.'
                          : 'Kompyuter arxitekturasi, fayl tizimlari, Excel formulalari, kiberxavfsizlik, AI Ustoz va rasmiy rasm sertifikat.'}
                      </p>

                      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <button
                          type="button"
                          onClick={() => navigateScreen('darslar')}
                          className={`w-full sm:w-auto min-h-[48px] inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold active:scale-[0.99] rounded-xl sm:rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                            isProg
                              ? 'text-white bg-indigo-500 hover:bg-indigo-400'
                              : 'text-slate-950 bg-sky-400 hover:bg-sky-300'
                          }`}
                        >
                          <BookOpen className="w-4 h-4 shrink-0" />
                          <span>Darslarni boshlash</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => navigateScreen('sertifikat')}
                          className="w-full sm:w-auto min-h-[48px] inline-flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-medium text-slate-200 hover:text-white border border-slate-700 hover:border-slate-500 active:scale-[0.99] rounded-xl sm:rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer"
                        >
                          <Award className="w-4 h-4 shrink-0" />
                          <span>Natija va Imkoniyatim</span>
                          <ArrowRight className="w-4 h-4 shrink-0" />
                        </button>
                      </div>
                    </div>

                    <div className="lg:col-span-6">
                      <div className="h-full min-h-[180px] sm:min-h-[240px] rounded-2xl overflow-hidden border border-slate-800 bg-slate-800">
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

                  {/* Clean 4-Column Quick Stats */}
                  <div className="mt-7 sm:mt-9 pt-5 border-t border-slate-800/90 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
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
                        Yechilgan masalalar
                      </div>
                    </div>
                    <div>
                      <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-white">
                        {isTrackExamLocked
                          ? trackLockCountdownText
                          : `${remainingAttemptsForTrack} / ${MAX_EXAM_ATTEMPTS}`}
                      </div>
                      <div className="text-xs sm:text-sm text-slate-400 mt-0.5">
                        {isTrackExamLocked
                          ? '24 soatlik blok'
                          : 'Imtihon imkoniyati'}
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Track Selector + Clean 6-Tile Mobile Launchpad */}
              <section className="py-5 sm:py-8">
                <div className="max-w-5xl mx-auto px-3.5 sm:px-6 lg:px-8 space-y-6">
                  <div>
                    <div className="mb-2.5">
                      <h2 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white">
                        O‘quv yo‘nalishi
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Yo‘nalishni tanlang — alohida darslar va 3 martalik imtihon
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
                      <button
                        type="button"
                        onClick={() => handleSelectTrackAndGo('literacy')}
                        className={`text-left p-3.5 sm:p-5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-2.5 ${
                          !isProg
                            ? 'bg-white dark:bg-slate-900 border-sky-500 ring-1 ring-sky-500/20 shadow-xs'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-sky-300'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-400 flex items-center justify-center shrink-0">
                            <Monitor className="w-4 h-4 sm:w-5 sm:h-5" />
                          </div>
                          {!isProg && (
                            <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-sky-700 dark:text-sky-400">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Faol</span>
                            </span>
                          )}
                        </div>
                        <div>
                          <h3 className="text-[13px] sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
                            Kompyuter savodxonligi
                          </h3>
                          <p className="hidden sm:block text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                            CPU/RAM/SSD, Fayl/ZIP, Excel formulalari, DNS/HTTP va kiberxavfsizlik.
                          </p>
                        </div>
                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] sm:text-xs font-mono tabular-nums text-slate-500 dark:text-slate-400">
                          {literacyStats.lessons} dars · {literacyStats.exam} test
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSelectTrackAndGo('programming')}
                        className={`text-left p-3.5 sm:p-5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-2.5 ${
                          isProg
                            ? 'bg-white dark:bg-slate-900 border-indigo-500 ring-1 ring-indigo-500/20 shadow-xs'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-300'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 flex items-center justify-center shrink-0">
                            <Code2 className="w-4 h-4 sm:w-5 sm:h-5" />
                          </div>
                          {isProg && (
                            <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-indigo-700 dark:text-indigo-400">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Faol</span>
                            </span>
                          )}
                        </div>
                        <div>
                          <h3 className="text-[13px] sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
                            Dasturlash asoslari
                          </h3>
                          <p className="hidden sm:block text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                            0 va 1 tili, algoritmlar, sikl tahlili, funksiyalar, massivlar va veb.
                          </p>
                        </div>
                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] sm:text-xs font-mono tabular-nums text-slate-500 dark:text-slate-400">
                          {programmingStats.lessons} dars · {programmingStats.exam} test
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Clean 6-Tile App Grid */}
                  <div className="space-y-3">
                    <div>
                      <h2 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white">
                        {isProg ? 'Dasturlash bo‘limlari' : 'Savodxonlik bo‘limlari'}
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Kerakli bo‘limni bitta bosishda oching
                      </p>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3.5">
                      <button
                        type="button"
                        onClick={() => navigateDestination('videolar')}
                        className="text-left p-3 sm:p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-sky-400 dark:hover:border-indigo-500 rounded-xl transition-colors cursor-pointer flex flex-col justify-between gap-2.5"
                      >
                        <div
                          className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center ${
                            isProg
                              ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400'
                              : 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-400'
                          }`}
                        >
                          <Video className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-[13px] sm:text-sm font-semibold text-slate-900 dark:text-white">
                            Videodarslar
                          </div>
                          <div className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5 tabular-nums">
                            {trackVideos.length} ta video
                          </div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => navigateDestination('darslar')}
                        className="text-left p-3 sm:p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-sky-400 dark:hover:border-indigo-500 rounded-xl transition-colors cursor-pointer flex flex-col justify-between gap-2.5"
                      >
                        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 flex items-center justify-center">
                          <BookOpen className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-[13px] sm:text-sm font-semibold text-slate-900 dark:text-white">
                            Mini-darslar
                          </div>
                          <div className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5 tabular-nums">
                            {trackLessons.length} ta dars
                          </div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => navigateDestination('qoidalar')}
                        className="text-left p-3 sm:p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-sky-400 rounded-xl transition-colors cursor-pointer flex flex-col justify-between gap-2.5"
                      >
                        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-400 flex items-center justify-center">
                          <Keyboard className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-[13px] sm:text-sm font-semibold text-slate-900 dark:text-white">
                            Qoidalar &amp; Ctrl+Shift
                          </div>
                          <div className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                            Tezkor tugmalar
                          </div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => navigateDestination('lab')}
                        className="text-left p-3 sm:p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-400 rounded-xl transition-colors cursor-pointer flex flex-col justify-between gap-2.5"
                      >
                        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
                          <Terminal className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-[13px] sm:text-sm font-semibold text-slate-900 dark:text-white">
                            Mashq va Lab
                          </div>
                          <div className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5 tabular-nums">
                            {trackChallenges.length} ta masala
                          </div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => navigateDestination('aiustoz')}
                        className="text-left p-3 sm:p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-sky-400 rounded-xl transition-colors cursor-pointer flex flex-col justify-between gap-2.5"
                      >
                        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-400 flex items-center justify-center">
                          <Bot className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-[13px] sm:text-sm font-semibold text-slate-900 dark:text-white">
                            AI Ustoz
                          </div>
                          <div className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                            Yo‘naltiruvchi fikr
                          </div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => navigateDestination('sertifikat')}
                        className="text-left p-3 sm:p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-400 rounded-xl transition-colors cursor-pointer flex flex-col justify-between gap-2.5"
                      >
                        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
                          <Award className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-[13px] sm:text-sm font-semibold text-slate-900 dark:text-white">
                            Natijam va Sertifikat
                          </div>
                          <div className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5 tabular-nums">
                            {examResults.length} urinish · {issuedCertificates.length} sertifikat
                          </div>
                        </div>
                      </button>
                    </div>

                    {/* Clean Primary Exam Action Bar */}
                    <button
                      type="button"
                      onClick={() => navigateDestination('imtihon')}
                      className={`w-full text-left p-3.5 sm:p-4 rounded-xl border transition-colors cursor-pointer flex items-center justify-between gap-3 ${
                        isTrackExamLocked
                          ? 'bg-rose-950 text-white border-rose-800 hover:bg-rose-900'
                          : isProg
                            ? 'bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-500'
                            : 'bg-slate-900 dark:bg-sky-500 text-white dark:text-slate-950 border-slate-900 dark:border-sky-500 hover:bg-slate-800 dark:hover:bg-sky-400'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-lg bg-white/15 dark:bg-slate-950/15 flex items-center justify-center shrink-0">
                          {isTrackExamLocked ? (
                            <Lock className="w-4 h-4 text-rose-300" />
                          ) : (
                            <ClipboardCheck className="w-4 h-4" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="text-[13px] sm:text-sm font-semibold truncate">
                            Imtihon imkoniyatini tekshirish ({trackExamQuestions.length} savol)
                          </div>
                          <div className="text-[11px] sm:text-xs opacity-90 mt-0.5 font-mono tabular-nums truncate">
                            {isTrackExamLocked
                              ? `3 marta yiqilgan · ${trackLockCountdownText}`
                              : `Imkoniyat: ${remainingAttemptsForTrack} / ${MAX_EXAM_ATTEMPTS} · O‘tish: 75%+`}
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 shrink-0" />
                    </button>
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

            {/* Screen 3b: Bolalar uchun Qoidalar va Ctrl+Shift tugmalari */}
            {activeScreen === 'qoidalar' && (
              <RulesAndShortcutsSection
                masteredIds={masteredRules}
                onToggleMastered={handleToggleMasteredRule}
                onGoToLessons={() => navigateScreen('darslar')}
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
                      className="flex overflow-x-auto sm:grid sm:grid-cols-5 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-full"
                    >
                      <button
                        type="button"
                        role="tab"
                        aria-selected={mashqSubTab === 'lab'}
                        onClick={() => setMashqSubTab('lab')}
                        className={`min-h-[42px] px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
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
                        className={`min-h-[42px] px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
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
                        className={`min-h-[42px] px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
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
                        className={`min-h-[42px] px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
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
                        className={`min-h-[42px] px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
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
                examLockedUntil={examLockedUntil}
                examResults={examResults}
                issuedCertificates={issuedCertificates}
                defaultStudentName={profileDisplayName || authUser?.displayName || ''}
                readinessSummary={{
                  lessonsDone: trackCompletedLessons,
                  lessonsTotal: trackLessons.length,
                  videosDone: trackWatchedVideos,
                  videosTotal: trackVideos.length,
                  challengesDone: trackSolvedChallenges,
                  challengesTotal: trackChallenges.length,
                }}
                maxAttempts={MAX_EXAM_ATTEMPTS}
                onConsumeAttempt={handleConsumeAttempt}
                onLockExam24h={handleLockExam24h}
                onRecordResult={handleRecordResult}
                onCreateCertificate={handleCreateStudentCertificate}
                onBackToLessons={() => navigateScreen('darslar')}
                onGoToChallenges={() => navigateDestination('masalalar')}
                onGoToCertificates={() => navigateScreen('sertifikat')}
                onOpenAdmin={() => void openAdminWithAuth()}
              />
            )}

            {/* Screen 6: Natijalarim, Imkoniyat va Sertifikatlar */}
            {activeScreen === 'sertifikat' && (
              <CertificatesSection
                certificates={issuedCertificates}
                examResults={examResults}
                examAttempts={examAttempts}
                examLockedUntil={examLockedUntil}
                maxAttempts={MAX_EXAM_ATTEMPTS}
                readinessSummary={{
                  lessonsDone: completedLessons.length,
                  lessonsTotal: lessons.length,
                  videosDone: watchedVideoCount,
                  videosTotal: videoLessons.length,
                  challengesDone: solvedChallenges.length,
                  challengesTotal: PRACTICE_CHALLENGES.length,
                }}
                defaultStudentName={profileDisplayName || authUser?.displayName || ''}
                onCreateCertificate={handleCreateStudentCertificate}
                onGoToExam={(scope) => {
                  if (scope === 'literacy' || scope === 'programming') {
                    handleSelectTrack(scope);
                  }
                  navigateScreen('imtihon');
                }}
              />
            )}
          </Suspense>
        </main>

        {/* Minimal Footer */}
        <footer className="bg-slate-950 text-slate-500 border-t border-slate-800/80 py-4 text-center text-xs px-4">
          <p>© {new Date().getFullYear()} BilimKod · murodillayev_dev</p>
        </footer>
      </div>

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
