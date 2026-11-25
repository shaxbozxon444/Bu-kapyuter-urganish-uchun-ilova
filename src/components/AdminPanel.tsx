import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Award,
  BookA,
  BookOpen,
  CheckCircle2,
  ClipboardList,
  Clock,
  Download,
  HelpCircle,
  LayoutDashboard,
  Lock,
  Moon,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Settings,
  Sun,
  Trash2,
  Trophy,
  Unlock,
  Users,
  Video,
  X,
  XCircle,
} from 'lucide-react';
import type {
  CertificateRecord,
  DidYouKnowItem,
  ExamQuestion,
  GlossaryTerm,
  LessonCategory,
  LessonItem,
  VideoLessonItem,
  VideoVisualType,
} from '../data/curriculum';
import type { UserProfileDoc } from '../services/firestoreService';
import {
  EXAM_SCOPE_LABELS,
  formatRemainingCountdown,
  formatUnlockClock,
  isExamScopeLocked,
} from '../utils/examCooldown';
import { CertificatePreviewModal } from './CertificatePreviewModal';
import type { ExamAttemptRecord, ExamScope } from './FinalExamSection';

type AdminTab =
  | 'overview'
  | 'videos'
  | 'lessons'
  | 'dyk'
  | 'exam'
  | 'glossary'
  | 'results'
  | 'certificates'
  | 'settings';

interface AdminPanelProps {
  videoLessons: VideoLessonItem[];
  lessons: LessonItem[];
  didYouKnowCards: DidYouKnowItem[];
  examQuestions: ExamQuestion[];
  glossaryTerms: GlossaryTerm[];
  examResults: ExamAttemptRecord[];
  issuedCertificates: CertificateRecord[];
  examAttempts: Record<ExamScope, number>;
  examLockedUntil: Record<ExamScope, number>;
  cloudUsers?: UserProfileDoc[];
  maxAttempts: number;
  isDark: boolean;
  onToggleTheme: () => void;
  onSaveVideoLessons: (next: VideoLessonItem[]) => void;
  onSaveLessons: (next: LessonItem[]) => void;
  onSaveDidYouKnow: (next: DidYouKnowItem[]) => void;
  onSaveExamQuestions: (next: ExamQuestion[]) => void;
  onSaveGlossary: (next: GlossaryTerm[]) => void;
  onSaveCertificates: (next: CertificateRecord[]) => void;
  onResetExamAttempts: (scope?: ExamScope) => void;
  onUnlockCloudUserExam?: (targetUser: UserProfileDoc, scope?: ExamScope) => void;
  onClearResults: () => void;
  onResetDefaults: () => void;
  onExitAdmin: () => void;
  onGoToExam: () => void;
}

const TAB_LABELS: Record<AdminTab, string> = {
  overview: 'Umumiy ko‘rsatkichlar',
  videos: 'Videodarslarni boshqarish',
  lessons: 'Darslarni boshqarish',
  dyk: 'Bilasizmi? mashqlari',
  exam: 'Test savollari',
  glossary: 'IT Lug‘at atamalari',
  results: 'Imtihon natijalari',
  certificates: 'Sertifikatlar chiqarish',
  settings: 'Sozlamalar va zaxira',
};

const VIDEO_VISUAL_LABELS: Record<VideoVisualType, string> = {
  hardware: 'Kompyuter qismlari (CPU / RAM / SSD)',
  files: 'Fayllar va kengaytmalar',
  shortcuts: 'Klaviatura tezkor tugmalari',
  network: 'Internet, DNS va Bulutli xotira',
  security: 'Internet xavfsizligi va Fishing',
  binary: '0 va 1 ikkilik kod animatsiyasi',
  algorithm: 'Algoritm qadamlari',
  ifelse: 'Agar / Aks holda qaror mantiqi',
  functions: 'Funksiya, Parametr va Return',
  loops_web: 'Sikl va HTML / CSS / JS',
};

const WIDGET_LABELS: Record<LessonItem['widgetType'], string> = {
  hardware: 'Kompyuter qismlari (CPU / RAM / SSD)',
  os: 'Operatsion tizim taqqoslagichi',
  files: 'Fayl kengaytmalari ko‘rsatkichi',
  shortcuts: 'Klaviatura tezkor tugmalari',
  office: 'Mini Excel (=SUM) formulasi',
  network: 'DNS va IP manzil simulyatori',
  security: 'Parol mustahkamligi tekshiruvi',
  ai: 'AI Prompt sifat tekshiruvi',
  binary: '0 va 1 ikkilik kod tarjimoni',
  algorithm: 'Algoritm qadamlari simulyatori',
  datatypes: 'Ma’lumot turlari (String / Number / Boolean)',
  ifelse: 'Agar / Aks holda jonli kodi',
  loops: 'Sikl (for) va Ro‘yxat simulyatori',
  functions: 'Funksiya (Parametr va Return) mashinasi',
  webarch: 'Frontend / API / Backend oqimi',
  languages: 'Dasturlash tillari taqqoslagichi',
};

export function AdminPanel({
  videoLessons,
  lessons,
  didYouKnowCards,
  examQuestions,
  glossaryTerms,
  examResults,
  issuedCertificates,
  examAttempts,
  examLockedUntil,
  cloudUsers = [],
  maxAttempts,
  isDark,
  onToggleTheme,
  onSaveVideoLessons,
  onSaveLessons,
  onSaveDidYouKnow,
  onSaveExamQuestions,
  onSaveGlossary,
  onSaveCertificates,
  onResetExamAttempts,
  onUnlockCloudUserExam,
  onClearResults,
  onResetDefaults,
  onExitAdmin,
  onGoToExam,
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | LessonCategory>('all');
  const [confirmReset, setConfirmReset] = useState(false);
  const [confirmClearResults, setConfirmClearResults] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | number | null>(null);
  const [nowMs, setNowMs] = useState(() => Date.now());

  const scopesOrder: ExamScope[] = ['literacy', 'programming', 'all'];
  const hasLocalLock = scopesOrder.some((s) => isExamScopeLocked(examLockedUntil[s], nowMs));
  const hasCloudLock = cloudUsers.some((u) =>
    scopesOrder.some((s) => isExamScopeLocked(u.examLockedUntil?.[s], nowMs))
  );

  useEffect(() => {
    if (!hasLocalLock && !hasCloudLock) return;
    const t = window.setInterval(() => setNowMs(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, [hasLocalLock, hasCloudLock]);

  const localLockedScopes = scopesOrder.filter((s) => isExamScopeLocked(examLockedUntil[s], nowMs));
  const lockedCloudUsers = cloudUsers.filter((u) =>
    scopesOrder.some(
      (s) =>
        isExamScopeLocked(u.examLockedUntil?.[s], nowMs) || (u.examAttempts?.[s] ?? 0) >= maxAttempts
    )
  );

  // Certificate issue & preview state
  const [certIssueAttempt, setCertIssueAttempt] = useState<ExamAttemptRecord | null>(null);
  const [certStudentName, setCertStudentName] = useState('');
  const [certIssuerName, setCertIssuerName] = useState('BilimKod · murodillayev_dev');
  const [previewCertificate, setPreviewCertificate] = useState<CertificateRecord | null>(null);

  // Lesson modal state
  const [lessonModalOpen, setLessonModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<LessonItem | null>(null);
  const [lessonForm, setLessonForm] = useState<{
    title: string;
    category: LessonCategory;
    readTime: string;
    summary: string;
    analogyTitle: string;
    analogyText: string;
    keyPointsText: string;
    widgetType: LessonItem['widgetType'];
  }>({
    title: '',
    category: 'literacy',
    readTime: '3 daqiqa',
    summary: '',
    analogyTitle: 'Hayotiy misol',
    analogyText: '',
    keyPointsText: '',
    widgetType: 'hardware',
  });

  // DYK modal state
  const [dykModalOpen, setDykModalOpen] = useState(false);
  const [editingDyk, setEditingDyk] = useState<DidYouKnowItem | null>(null);
  const [dykForm, setDykForm] = useState<{
    category: LessonCategory;
    topic: string;
    question: string;
    hint: string;
    answer: string;
  }>({
    category: 'literacy',
    topic: '',
    question: '',
    hint: '',
    answer: '',
  });

  // Exam Question modal state
  const [questionModalOpen, setQuestionModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<ExamQuestion | null>(null);
  const [questionForm, setQuestionForm] = useState<{
    category: LessonCategory;
    question: string;
    optA: string;
    optB: string;
    optC: string;
    optD: string;
    correctIndex: 0 | 1 | 2 | 3;
    explanation: string;
  }>({
    category: 'literacy',
    question: '',
    optA: 'A) ',
    optB: 'B) ',
    optC: 'C) ',
    optD: 'D) ',
    correctIndex: 0,
    explanation: '',
  });

  // Glossary modal state
  const [glossaryModalOpen, setGlossaryModalOpen] = useState(false);
  const [editingGlossary, setEditingGlossary] = useState<GlossaryTerm | null>(null);
  const [glossaryForm, setGlossaryForm] = useState<{
    term: string;
    category: LessonCategory;
    shortDesc: string;
    example: string;
  }>({
    term: '',
    category: 'literacy',
    shortDesc: '',
    example: '',
  });

  // Video modal state
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<VideoLessonItem | null>(null);
  const [videoForm, setVideoForm] = useState<{
    title: string;
    category: LessonCategory;
    shortDesc: string;
    durationLabel: string;
    visualType: VideoVisualType;
    externalUrl: string;
    hookTitle: string;
    hookSubtitle: string;
    analogyTitle: string;
    analogySubtitle: string;
    demoTitle: string;
    demoSubtitle: string;
    summaryTitle: string;
    summarySubtitle: string;
    quizQuestion: string;
    quizOpt1: string;
    quizOpt2: string;
    quizOpt3: string;
    quizCorrect: 0 | 1 | 2;
  }>({
    title: '',
    category: 'literacy',
    shortDesc: '',
    durationLabel: '0:40',
    visualType: 'hardware',
    externalUrl: '',
    hookTitle: '',
    hookSubtitle: '',
    analogyTitle: '',
    analogySubtitle: '',
    demoTitle: '',
    demoSubtitle: '',
    summaryTitle: '',
    summarySubtitle: '',
    quizQuestion: '',
    quizOpt1: '',
    quizOpt2: '',
    quizOpt3: '',
    quizCorrect: 0,
  });

  const handleTabChange = (tab: AdminTab) => {
    setActiveTab(tab);
    setSearchQuery('');
    setCategoryFilter('all');
    setDeleteConfirmId(null);
  };

  // --- Certificate Helpers ---
  const isResultPassed = (r: ExamAttemptRecord) =>
    typeof r.passed === 'boolean'
      ? r.passed
      : r.tier !== 'retry' && r.total > 0 && r.score / r.total >= 0.75;

  const findExistingCertificate = (attemptId: string) =>
    issuedCertificates.find((c) => c.attemptId === attemptId);

  const openIssueCertificate = (attempt: ExamAttemptRecord) => {
    const existing = findExistingCertificate(attempt.id);
    if (existing) {
      setPreviewCertificate(existing);
      return;
    }
    setCertIssueAttempt(attempt);
    setCertStudentName(attempt.studentName);
    setCertIssuerName('BilimKod · murodillayev_dev');
  };

  const handleConfirmIssueCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certIssueAttempt) return;
    const pct =
      certIssueAttempt.total > 0
        ? Math.round((certIssueAttempt.score / certIssueAttempt.total) * 100)
        : 0;
    const scope: ExamScope =
      certIssueAttempt.examScope ??
      (certIssueAttempt.literacyTotal > 0 && certIssueAttempt.programmingTotal > 0
        ? 'all'
        : certIssueAttempt.programmingTotal > 0
          ? 'programming'
          : 'literacy');
    const trackTitle =
      scope === 'programming'
        ? 'Dasturlash asoslari'
        : scope === 'all'
          ? 'Kompyuter savodxonligi va Dasturlash asoslari'
          : 'Kompyuter savodxonligi';
    const gradeLabel =
      certIssueAttempt.tier === 'perfect'
        ? 'A’lo (100%)'
        : certIssueAttempt.tier === 'great'
          ? 'Yaxshi'
          : 'Qoniqarli';
    const randomCode = String(Math.floor(1000 + Math.random() * 9000));
    const created: CertificateRecord = {
      id: `MD-${new Date().getFullYear()}-${randomCode}`,
      attemptId: certIssueAttempt.id,
      studentName: certStudentName.trim() || certIssueAttempt.studentName,
      scope,
      trackTitle,
      score: certIssueAttempt.score,
      total: certIssueAttempt.total,
      percentage: pct,
      gradeLabel,
      issuedAt: new Date().toISOString(),
      issuerName: certIssuerName.trim() || 'murodillayev_dev',
    };
    onSaveCertificates([created, ...issuedCertificates]);
    setCertIssueAttempt(null);
    setPreviewCertificate(created);
  };

  const deleteCertificate = (id: string) => {
    onSaveCertificates(issuedCertificates.filter((c) => c.id !== id));
    setDeleteConfirmId(null);
  };

  // --- Export Helpers ---
  const exportResultsCsv = () => {
    const header = [
      'Oquvchi',
      'Savodxonlik',
      'Dasturlash',
      'Umumiy ball',
      'Jami savollar',
      'Daraja',
      'Sana',
    ];
    const rows = examResults.map((r) => [
      `"${r.studentName.replace(/"/g, '""')}"`,
      `${r.literacyScore}/${r.literacyTotal}`,
      `${r.programmingScore}/${r.programmingTotal}`,
      r.score,
      r.total,
      `"${r.tierLabel}"`,
      `"${new Date(r.completedAt).toLocaleString('uz-UZ')}"`,
    ]);
    const csv = [header.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'murodillayev_dev_natijalar.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportAllJson = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      videoLessons,
      lessons,
      didYouKnowCards,
      examQuestions,
      glossaryTerms,
      examResults,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'murodillayev_dev_zaxira.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  // --- Metrics for Overview ---
  const totalAttempts = examResults.length;
  const averagePct =
    totalAttempts > 0
      ? Math.round(
          examResults.reduce((acc, r) => acc + (r.total > 0 ? (r.score / r.total) * 100 : 0), 0) /
            totalAttempts
        )
      : 0;
  const passedCount = examResults.filter(
    (r) => r.tier === 'perfect' || r.tier === 'great' || r.tier === 'average'
  ).length;

  // --- Lesson Handlers ---
  const openNewLesson = () => {
    setEditingLesson(null);
    setLessonForm({
      title: '',
      category: 'literacy',
      readTime: '3 daqiqa',
      summary: '',
      analogyTitle: 'Hayotiy misol',
      analogyText: '',
      keyPointsText: '',
      widgetType: 'hardware',
    });
    setLessonModalOpen(true);
  };

  const openEditLesson = (lesson: LessonItem) => {
    setEditingLesson(lesson);
    setLessonForm({
      title: lesson.title,
      category: lesson.category,
      readTime: lesson.readTime,
      summary: lesson.summary,
      analogyTitle: lesson.analogyTitle,
      analogyText: lesson.analogyText,
      keyPointsText: lesson.keyPoints.join('\n'),
      widgetType: lesson.widgetType,
    });
    setLessonModalOpen(true);
  };

  const submitLessonForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lessonForm.title.trim() || !lessonForm.summary.trim()) return;

    const categoryLabel =
      lessonForm.category === 'literacy' ? 'Kompyuter savodxonligi' : 'Dasturlash asoslari';
    const keyPoints = lessonForm.keyPointsText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    if (editingLesson) {
      const updated = lessons.map((item) =>
        item.id === editingLesson.id
          ? {
              ...item,
              title: lessonForm.title.trim(),
              category: lessonForm.category,
              categoryLabel,
              readTime: lessonForm.readTime.trim() || '3 daqiqa',
              summary: lessonForm.summary.trim(),
              analogyTitle: lessonForm.analogyTitle.trim() || 'Hayotiy misol',
              analogyText: lessonForm.analogyText.trim(),
              keyPoints: keyPoints.length > 0 ? keyPoints : item.keyPoints,
              widgetType: lessonForm.widgetType,
            }
          : item
      );
      onSaveLessons(updated);
    } else {
      const nextNum = String(lessons.length + 1).padStart(2, '0');
      const created: LessonItem = {
        id: `lesson-${Date.now()}`,
        number: nextNum,
        category: lessonForm.category,
        categoryLabel,
        readTime: lessonForm.readTime.trim() || '3 daqiqa',
        title: lessonForm.title.trim(),
        summary: lessonForm.summary.trim(),
        analogyTitle: lessonForm.analogyTitle.trim() || 'Hayotiy misol',
        analogyText:
          lessonForm.analogyText.trim() ||
          'Kundalik hayotdagi oddiy tartib va mantiqiy qadamlar bilan bir xil ishlaydi.',
        keyPoints:
          keyPoints.length > 0
            ? keyPoints
            : ['Asosiy tushuncha amaliy misollar bilan mustahkamlanadi.'],
        widgetType: lessonForm.widgetType,
      };
      onSaveLessons([...lessons, created]);
    }
    setLessonModalOpen(false);
  };

  const deleteLesson = (id: string) => {
    const next = lessons
      .filter((l) => l.id !== id)
      .map((l, idx) => ({ ...l, number: String(idx + 1).padStart(2, '0') }));
    onSaveLessons(next);
    setDeleteConfirmId(null);
  };

  // --- DYK Handlers ---
  const openNewDyk = () => {
    setEditingDyk(null);
    setDykForm({ category: 'literacy', topic: '', question: '', hint: '', answer: '' });
    setDykModalOpen(true);
  };

  const openEditDyk = (card: DidYouKnowItem) => {
    setEditingDyk(card);
    setDykForm({
      category: card.category ?? 'literacy',
      topic: card.topic,
      question: card.question,
      hint: card.hint,
      answer: card.answer,
    });
    setDykModalOpen(true);
  };

  const submitDykForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dykForm.question.trim() || !dykForm.answer.trim()) return;

    if (editingDyk) {
      onSaveDidYouKnow(
        didYouKnowCards.map((c) =>
          c.id === editingDyk.id
            ? {
                ...c,
                category: dykForm.category,
                topic: dykForm.topic.trim() || 'Mantiq',
                question: dykForm.question.trim(),
                hint: dykForm.hint.trim() || 'Darsdagi tushunchalarni eslang.',
                answer: dykForm.answer.trim(),
              }
            : c
        )
      );
    } else {
      onSaveDidYouKnow([
        ...didYouKnowCards,
        {
          id: `dyk-${Date.now()}`,
          category: dykForm.category,
          topic: dykForm.topic.trim() || 'Mantiq',
          question: dykForm.question.trim(),
          hint: dykForm.hint.trim() || 'Darsdagi tushunchalarni eslang.',
          answer: dykForm.answer.trim(),
        },
      ]);
    }
    setDykModalOpen(false);
  };

  const deleteDyk = (id: string) => {
    onSaveDidYouKnow(didYouKnowCards.filter((c) => c.id !== id));
    setDeleteConfirmId(null);
  };

  // --- Exam Question Handlers ---
  const openNewQuestion = () => {
    setEditingQuestion(null);
    setQuestionForm({
      category: 'literacy',
      question: '',
      optA: 'A) ',
      optB: 'B) ',
      optC: 'C) ',
      optD: 'D) ',
      correctIndex: 0,
      explanation: '',
    });
    setQuestionModalOpen(true);
  };

  const openEditQuestion = (q: ExamQuestion) => {
    setEditingQuestion(q);
    setQuestionForm({
      category: q.category,
      question: q.question,
      optA: q.options[0],
      optB: q.options[1],
      optC: q.options[2],
      optD: q.options[3],
      correctIndex: q.correctIndex,
      explanation: q.explanation,
    });
    setQuestionModalOpen(true);
  };

  const normalizeOption = (prefix: string, val: string) => {
    const trimmed = val.trim();
    if (/^[A-D]\)\s*/i.test(trimmed)) return trimmed;
    return `${prefix}) ${trimmed}`;
  };

  const submitQuestionForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionForm.question.trim()) return;

    const categoryLabel =
      questionForm.category === 'literacy' ? 'Kompyuter savodxonligi' : 'Dasturlash asoslari';
    const options: [string, string, string, string] = [
      normalizeOption('A', questionForm.optA),
      normalizeOption('B', questionForm.optB),
      normalizeOption('C', questionForm.optC),
      normalizeOption('D', questionForm.optD),
    ];

    if (editingQuestion) {
      onSaveExamQuestions(
        examQuestions.map((q) =>
          q.id === editingQuestion.id
            ? {
                ...q,
                category: questionForm.category,
                categoryLabel,
                question: questionForm.question.trim(),
                options,
                correctIndex: questionForm.correctIndex,
                explanation: questionForm.explanation.trim() || 'To‘g‘ri javob tanlandi.',
              }
            : q
        )
      );
    } else {
      const maxId = examQuestions.reduce((m, q) => Math.max(m, q.id), 0);
      onSaveExamQuestions([
        ...examQuestions,
        {
          id: maxId + 1,
          category: questionForm.category,
          categoryLabel,
          question: questionForm.question.trim(),
          options,
          correctIndex: questionForm.correctIndex,
          explanation: questionForm.explanation.trim() || 'To‘g‘ri javob tanlandi.',
        },
      ]);
    }
    setQuestionModalOpen(false);
  };

  const deleteQuestion = (id: number) => {
    const next = examQuestions
      .filter((q) => q.id !== id)
      .map((q, idx) => ({ ...q, id: idx + 1 }));
    onSaveExamQuestions(next);
    setDeleteConfirmId(null);
  };

  // --- Glossary Handlers ---
  const openNewGlossary = () => {
    setEditingGlossary(null);
    setGlossaryForm({ term: '', category: 'literacy', shortDesc: '', example: '' });
    setGlossaryModalOpen(true);
  };

  const openEditGlossary = (item: GlossaryTerm) => {
    setEditingGlossary(item);
    setGlossaryForm({
      term: item.term,
      category: item.category,
      shortDesc: item.shortDesc,
      example: item.example,
    });
    setGlossaryModalOpen(true);
  };

  const submitGlossaryForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!glossaryForm.term.trim() || !glossaryForm.shortDesc.trim()) return;

    if (editingGlossary) {
      onSaveGlossary(
        glossaryTerms.map((g) =>
          g.id === editingGlossary.id
            ? {
                ...g,
                term: glossaryForm.term.trim(),
                category: glossaryForm.category,
                shortDesc: glossaryForm.shortDesc.trim(),
                example: glossaryForm.example.trim() || 'Amaliy qo‘llanilishi mavjud.',
              }
            : g
        )
      );
    } else {
      onSaveGlossary([
        ...glossaryTerms,
        {
          id: `term-${Date.now()}`,
          term: glossaryForm.term.trim(),
          category: glossaryForm.category,
          shortDesc: glossaryForm.shortDesc.trim(),
          example: glossaryForm.example.trim() || 'Amaliy qo‘llanilishi mavjud.',
        },
      ]);
    }
    setGlossaryModalOpen(false);
  };

  const deleteGlossary = (id: string) => {
    onSaveGlossary(glossaryTerms.filter((g) => g.id !== id));
    setDeleteConfirmId(null);
  };

  // Filtered lists
  const qLower = searchQuery.trim().toLowerCase();
  const filteredLessons = lessons.filter((l) => {
    const matchesCat = categoryFilter === 'all' || l.category === categoryFilter;
    const matchesQuery =
      !qLower ||
      l.title.toLowerCase().includes(qLower) ||
      l.summary.toLowerCase().includes(qLower);
    return matchesCat && matchesQuery;
  });

  const filteredDyk = didYouKnowCards.filter(
    (c) =>
      !qLower ||
      c.question.toLowerCase().includes(qLower) ||
      c.topic.toLowerCase().includes(qLower)
  );

  const filteredQuestions = examQuestions.filter((q) => {
    const matchesCat = categoryFilter === 'all' || q.category === categoryFilter;
    const matchesQuery = !qLower || q.question.toLowerCase().includes(qLower);
    return matchesCat && matchesQuery;
  });

  const filteredGlossary = glossaryTerms.filter((g) => {
    const matchesCat = categoryFilter === 'all' || g.category === categoryFilter;
    const matchesQuery =
      !qLower ||
      g.term.toLowerCase().includes(qLower) ||
      g.shortDesc.toLowerCase().includes(qLower);
    return matchesCat && matchesQuery;
  });

  const filteredResults = examResults.filter(
    (r) => !qLower || r.studentName.toLowerCase().includes(qLower)
  );

  // --- Video Handlers ---
  const openNewVideo = () => {
    setEditingVideo(null);
    setVideoForm({
      title: '',
      category: 'literacy',
      shortDesc: '',
      durationLabel: '0:40',
      visualType: 'hardware',
      externalUrl: '',
      hookTitle: 'Asosiy savol',
      hookSubtitle: 'Mavzuning eng muhim jihatini bilib oling.',
      analogyTitle: 'Hayotiy misol',
      analogySubtitle: 'Kundalik hayotdan oddiy qiyos.',
      demoTitle: 'Amaliy ko‘rinish',
      demoSubtitle: 'Tizim ichida jarayon qanday ishlaydi.',
      summaryTitle: 'Qisqa xulosa',
      summarySubtitle: 'O‘zlashtirilgan asosiy qoida.',
      quizQuestion: 'Mavzuni tushundingizmi?',
      quizOpt1: 'Ha, to‘liq tushunarli',
      quizOpt2: 'Yana ko‘rib chiqaman',
      quizOpt3: 'Amaliyotda sinayman',
      quizCorrect: 0,
    });
    setVideoModalOpen(true);
  };

  const openEditVideo = (vid: VideoLessonItem) => {
    setEditingVideo(vid);
    setVideoForm({
      title: vid.title,
      category: vid.category,
      shortDesc: vid.shortDesc,
      durationLabel: vid.durationLabel,
      visualType: vid.visualType,
      externalUrl: vid.externalUrl ?? '',
      hookTitle: vid.scenes[0]?.title ?? '',
      hookSubtitle: vid.scenes[0]?.subtitle ?? '',
      analogyTitle: vid.scenes[1]?.title ?? '',
      analogySubtitle: vid.scenes[1]?.subtitle ?? '',
      demoTitle: vid.scenes[2]?.title ?? '',
      demoSubtitle: vid.scenes[2]?.subtitle ?? '',
      summaryTitle: vid.scenes[3]?.title ?? '',
      summarySubtitle: vid.scenes[3]?.subtitle ?? '',
      quizQuestion: vid.quickCheck.question,
      quizOpt1: vid.quickCheck.options[0],
      quizOpt2: vid.quickCheck.options[1],
      quizOpt3: vid.quickCheck.options[2],
      quizCorrect: vid.quickCheck.correctIndex,
    });
    setVideoModalOpen(true);
  };

  const submitVideoForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoForm.title.trim()) return;
    const categoryLabel =
      videoForm.category === 'literacy' ? 'Kompyuter savodxonligi' : 'Dasturlash asoslari';
    const scenes: VideoLessonItem['scenes'] = [
      {
        label: 'Muammo',
        title: videoForm.hookTitle.trim() || videoForm.title.trim(),
        subtitle: videoForm.hookSubtitle.trim() || videoForm.shortDesc.trim(),
        durationSec: 10,
        visualKind: 'hook',
        highlightText: videoForm.title.trim(),
      },
      {
        label: 'Misol',
        title: videoForm.analogyTitle.trim() || 'Hayotiy misol',
        subtitle: videoForm.analogySubtitle.trim() || 'Oddiy misol orqali tushuntirish.',
        durationSec: 10,
        visualKind: 'analogy',
        highlightText: categoryLabel,
      },
      {
        label: 'Sxema',
        title: videoForm.demoTitle.trim() || 'Jonli ishlash sxemasi',
        subtitle: videoForm.demoSubtitle.trim() || 'Bosqichma-bosqich jarayon.',
        durationSec: 10,
        visualKind: 'demo',
        highlightText: 'Amaliy namoyish',
      },
      {
        label: 'Xulosa',
        title: videoForm.summaryTitle.trim() || 'Oltin qoida',
        subtitle: videoForm.summarySubtitle.trim() || 'Eng muhim xulosa.',
        durationSec: 10,
        visualKind: 'summary',
        highlightText: 'Yodda saqlang!',
      },
    ];

    const quickCheck: VideoLessonItem['quickCheck'] = {
      question: videoForm.quizQuestion.trim() || 'Mavzu tushunarli bo‘ldimi?',
      options: [
        videoForm.quizOpt1.trim() || 'Ha, tushunarli',
        videoForm.quizOpt2.trim() || 'Takrorlayman',
        videoForm.quizOpt3.trim() || 'Mashq qilaman',
      ],
      correctIndex: videoForm.quizCorrect,
    };

    if (editingVideo) {
      onSaveVideoLessons(
        videoLessons.map((v) =>
          v.id === editingVideo.id
            ? {
                ...v,
                title: videoForm.title.trim(),
                category: videoForm.category,
                categoryLabel,
                shortDesc: videoForm.shortDesc.trim() || v.shortDesc,
                durationLabel: videoForm.durationLabel.trim() || '0:40',
                visualType: videoForm.visualType,
                externalUrl: videoForm.externalUrl.trim() || undefined,
                scenes,
                quickCheck,
              }
            : v
        )
      );
    } else {
      const nextNum = String(videoLessons.length + 1).padStart(2, '0');
      onSaveVideoLessons([
        ...videoLessons,
        {
          id: `vid-${Date.now()}`,
          number: nextNum,
          category: videoForm.category,
          categoryLabel,
          title: videoForm.title.trim(),
          shortDesc: videoForm.shortDesc.trim() || 'Qisqa va tushunarli videodars.',
          durationLabel: videoForm.durationLabel.trim() || '0:40',
          visualType: videoForm.visualType,
          externalUrl: videoForm.externalUrl.trim() || undefined,
          scenes,
          quickCheck,
        },
      ]);
    }
    setVideoModalOpen(false);
  };

  const deleteVideo = (id: string) => {
    const next = videoLessons
      .filter((v) => v.id !== id)
      .map((v, idx) => ({ ...v, number: String(idx + 1).padStart(2, '0') }));
    onSaveVideoLessons(next);
    setDeleteConfirmId(null);
  };

  const filteredVideos = videoLessons.filter((v) => {
    const matchesCat = categoryFilter === 'all' || v.category === categoryFilter;
    const matchesQuery =
      !qLower ||
      v.title.toLowerCase().includes(qLower) ||
      v.shortDesc.toLowerCase().includes(qLower);
    return matchesCat && matchesQuery;
  });

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Sidebar Navigation */}
      <aside className="lg:w-64 shrink-0 bg-slate-900 text-white border-b lg:border-b-0 lg:border-r border-slate-800 flex flex-col">
        <div className="h-16 px-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <div
              className="text-lg font-bold tracking-tight text-white"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              BilimKod
            </div>
            <div className="text-xs text-slate-400">murodillayev_dev · Admin panel</div>
          </div>
        </div>

        <nav
          aria-label="Admin bo‘limlari"
          className="p-3 flex lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible"
        >
          {(
            [
              { id: 'overview', label: 'Umumiy ko‘rsatkichlar', icon: LayoutDashboard },
              { id: 'videos', label: 'Videodarslar', icon: Video, count: videoLessons.length },
              { id: 'lessons', label: 'Darslar', icon: BookOpen, count: lessons.length },
              { id: 'dyk', label: 'Bilasizmi?', icon: HelpCircle, count: didYouKnowCards.length },
              { id: 'exam', label: 'Test savollari', icon: ClipboardList, count: examQuestions.length },
              { id: 'glossary', label: 'IT Lug‘at', icon: BookA, count: glossaryTerms.length },
              { id: 'results', label: 'Imtihon natijalari', icon: Trophy, count: examResults.length },
              { id: 'certificates', label: 'Sertifikatlar', icon: Award, count: issuedCertificates.length },
              { id: 'settings', label: 'Sozlamalar', icon: Settings },
            ] as const
          ).map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleTabChange(item.id)}
                className={`min-h-[44px] flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-sky-500/15 text-sky-300'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span className="inline-flex items-center gap-2.5">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </span>
                {'count' in item && (
                  <span className="font-mono text-xs tabular-nums text-slate-400">
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="hidden lg:block mt-auto p-4 border-t border-slate-800 space-y-2">
          <button
            type="button"
            onClick={onToggleTheme}
            className="w-full flex items-center justify-between px-3.5 py-2 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            <span className="inline-flex items-center gap-2">
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400 shrink-0" />
              ) : (
                <Moon className="w-4 h-4 text-slate-300 shrink-0" />
              )}
              <span>{isDark ? 'Kunduzgi rejim' : 'Tungi rejim'}</span>
            </span>
          </button>

          <button
            type="button"
            onClick={onExitAdmin}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-950 bg-sky-400 hover:bg-sky-300 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 shrink-0" />
            <span>O‘quvchi sahifasiga qaytish</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar Contract */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 truncate">
            <span className="font-medium text-slate-900 dark:text-white whitespace-nowrap">
              Admin panel
            </span>
            <span aria-hidden="true">/</span>
            <span className="truncate">{TAB_LABELS[activeTab]}</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onToggleTheme}
              aria-label="Mavzuni almashtirish"
              className="lg:hidden min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-lg cursor-pointer"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={onExitAdmin}
              className="lg:hidden min-h-[44px] inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-sky-500 dark:text-slate-950 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
              <span>Saytga</span>
            </button>
          </div>
        </header>

        {/* Main Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Tizim ko‘rsatkichlari
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Platformadagi barcha o‘quv materiallari, atamalar, testlar va natijalarning
                  umumiy holati.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
                  <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    Jami mini-darslar
                  </div>
                  <div className="mt-2 text-3xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                    {lessons.length}
                  </div>
                  <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Savodxonlik: {lessons.filter((l) => l.category === 'literacy').length} ·
                    Dasturlash: {lessons.filter((l) => l.category === 'programming').length}
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
                  <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    Mantiqiy savollar
                  </div>
                  <div className="mt-2 text-3xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                    {didYouKnowCards.length}
                  </div>
                  <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    IT Lug‘at atamalari: {glossaryTerms.length} ta
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
                  <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    Yakuniy test banki
                  </div>
                  <div className="mt-2 text-3xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                    {examQuestions.length}
                  </div>
                  <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Savodxonlik: {examQuestions.filter((q) => q.category === 'literacy').length} ·
                    Dasturlash: {examQuestions.filter((q) => q.category === 'programming').length}
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
                  <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    Topshirilgan imtihonlar
                  </div>
                  <div className="mt-2 text-3xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                    {totalAttempts}
                  </div>
                  <div className="mt-1 text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                    O‘rtacha: {averagePct}% · O‘tganlar: {passedCount}
                  </div>
                </div>
              </div>

              {(localLockedScopes.length > 0 || lockedCloudUsers.length > 0) && (
                <div className="bg-rose-50 dark:bg-rose-950/35 border border-rose-200 dark:border-rose-800/80 rounded-xl p-5 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300 flex items-center justify-center shrink-0">
                        <Lock className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="text-sm sm:text-base font-bold text-rose-950 dark:text-rose-100">
                          24 soatga bloklangan imtihonlar aniqlandi
                        </h2>
                        <p className="text-xs text-rose-800 dark:text-rose-200/90 mt-0.5">
                          3 marta yiqilgan o‘quvchilar uchun imtihonni shu yerdan darhol ochishingiz mumkin.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleTabChange('results')}
                      className="min-h-[40px] px-3.5 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg whitespace-nowrap shrink-0 cursor-pointer self-start sm:self-auto"
                    >
                      Bloklarni boshqarish →
                    </button>
                  </div>

                  {localLockedScopes.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {localLockedScopes.map((scope) => (
                        <button
                          key={scope}
                          type="button"
                          onClick={() => onResetExamAttempts(scope)}
                          className="min-h-[40px] inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-emerald-900 dark:text-emerald-200 bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-700 hover:bg-emerald-50 rounded-lg cursor-pointer"
                        >
                          <Unlock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          <span>
                            {EXAM_SCOPE_LABELS[scope]} ({formatRemainingCountdown(examLockedUntil[scope], nowMs)}) — Ochish
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-3">
                  <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                    Tezkor boshqaruv
                  </h2>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Yangi o‘quv materiallarini qo‘shing — o‘quvchi sahifasi darhol yangilanadi.
                  </p>
                  <div className="pt-2 space-y-2">
                    <button
                      type="button"
                      onClick={() => {
                        handleTabChange('lessons');
                        openNewLesson();
                      }}
                      className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors cursor-pointer"
                    >
                      <span>Yangi mini-dars qo‘shish</span>
                      <Plus className="w-4 h-4 text-sky-700 dark:text-sky-400" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        handleTabChange('exam');
                        openNewQuestion();
                      }}
                      className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors cursor-pointer"
                    >
                      <span>Yangi imtihon testi qo‘shish</span>
                      <Plus className="w-4 h-4 text-sky-700 dark:text-sky-400" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        handleTabChange('glossary');
                        openNewGlossary();
                      }}
                      className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors cursor-pointer"
                    >
                      <span>IT Lug‘atga atama qo‘shish</span>
                      <Plus className="w-4 h-4 text-sky-700 dark:text-sky-400" />
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                  <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
                    <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                      So‘nggi imtihon natijalari
                    </h2>
                    <button
                      type="button"
                      onClick={() => handleTabChange('results')}
                      className="text-xs font-semibold text-sky-700 dark:text-sky-400 hover:text-sky-800 whitespace-nowrap cursor-pointer"
                    >
                      Barchasini ko‘rish →
                    </button>
                  </div>

                  {examResults.length === 0 ? (
                    <div className="p-8 text-center">
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                        Hozircha imtihon topshirilmagan. Birinchi urinishdan so‘ng natijalar shu
                        yerda tartib bilan ko‘rinadi.
                      </p>
                      <button
                        type="button"
                        onClick={onGoToExam}
                        className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-sky-500 dark:text-slate-950 rounded-lg transition-colors cursor-pointer"
                      >
                        Imtihonni sinab ko‘rish
                      </button>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-200 dark:divide-slate-800">
                      {examResults.slice(0, 5).map((r) => (
                        <div
                          key={r.id}
                          className="px-5 py-3 flex items-center justify-between gap-4 text-sm"
                        >
                          <div>
                            <div className="font-medium text-slate-900 dark:text-white">
                              {r.studentName}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">
                              {new Date(r.completedAt).toLocaleString('uz-UZ', {
                                day: '2-digit',
                                month: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-mono font-semibold tabular-nums text-slate-900 dark:text-white">
                              {r.score} / {r.total}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">
                              {r.tierLabel}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* TAB 1B: VIDEOS CRUD */}
          {activeTab === 'videos' && (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Videodarslarni boshqarish
                  </h1>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Animatsion videodarslarni tahrirlang yoki YouTube / MP4 havolasi qo‘shing.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={openNewVideo}
                  className="min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-slate-900 dark:bg-sky-500 dark:text-slate-950 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer self-stretch sm:self-auto"
                >
                  <Plus className="w-4 h-4 shrink-0" />
                  <span>Yangi videodars qo‘shish</span>
                </button>
              </div>

              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Video nomi bo‘yicha qidirish..."
                    className="w-full min-h-[44px] pl-9 pr-3 py-2 text-base sm:text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div className="flex items-center gap-1 p-1 bg-slate-200/70 dark:bg-slate-800 rounded-lg self-start overflow-x-auto max-w-full">
                  {(
                    [
                      { id: 'all', label: 'Barchasi' },
                      { id: 'literacy', label: 'Savodxonlik' },
                      { id: 'programming', label: 'Dasturlash' },
                    ] as const
                  ).map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setCategoryFilter(tab.id)}
                      className={`min-h-[40px] px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        categoryFilter === tab.id
                          ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-white shadow-sm'
                          : 'text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                {filteredVideos.length === 0 ? (
                  <div className="p-8 text-center text-sm text-slate-600 dark:text-slate-400">
                    Qidiruv bo‘yicha videodars topilmadi.
                  </div>
                ) : (
                  <div className="divide-y divide-slate-200 dark:divide-slate-800">
                    {filteredVideos.map((vid) => (
                      <div
                        key={vid.id}
                        className="p-4 sm:px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                      >
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                            <span className="font-mono font-semibold text-sky-700 dark:text-sky-400 tabular-nums">
                              {vid.number}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span>{vid.categoryLabel}</span>
                            <span aria-hidden="true">·</span>
                            <span className="font-mono tabular-nums">{vid.durationLabel}</span>
                          </div>
                          <div className="text-sm font-semibold text-slate-900 dark:text-white">
                            {vid.title}
                          </div>
                          <div className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1">
                            {vid.externalUrl ? `Tashqi video: ${vid.externalUrl}` : vid.shortDesc}
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0 self-end sm:self-center">
                          {deleteConfirmId === vid.id ? (
                            <span className="inline-flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => deleteVideo(vid.id)}
                                className="px-2.5 py-1 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded cursor-pointer"
                              >
                                O‘chirish
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeleteConfirmId(null)}
                                className="px-2 py-1 text-xs text-slate-600 dark:text-slate-300 cursor-pointer"
                              >
                                Bekor
                              </button>
                            </span>
                          ) : (
                            <>
                              <button
                                type="button"
                                aria-label="Tahrirlash"
                                onClick={() => openEditVideo(vid)}
                                className="min-h-[40px] min-w-[40px] inline-flex items-center justify-center text-slate-500 hover:text-sky-700 dark:hover:text-sky-400 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                aria-label="O‘chirish"
                                onClick={() => setDeleteConfirmId(vid.id)}
                                className="min-h-[40px] min-w-[40px] inline-flex items-center justify-center text-slate-500 hover:text-rose-600 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* TAB 2: LESSONS CRUD */}
          {activeTab === 'lessons' && (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Darslarni boshqarish
                  </h1>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Mini-darslar mazmuni, hayotiy misollar va interaktiv mashqlarni tahrirlang.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={openNewLesson}
                  className="min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-slate-900 dark:bg-sky-500 dark:text-slate-950 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer self-stretch sm:self-auto"
                >
                  <Plus className="w-4 h-4 shrink-0" />
                  <span>Yangi dars qo‘shish</span>
                </button>
              </div>

              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Dars nomi bo‘yicha qidirish..."
                    className="w-full min-h-[44px] pl-9 pr-3 py-2 text-base sm:text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div className="flex items-center gap-1 p-1 bg-slate-200/70 dark:bg-slate-800 rounded-lg self-start overflow-x-auto max-w-full">
                  {(
                    [
                      { id: 'all', label: 'Barchasi' },
                      { id: 'literacy', label: 'Savodxonlik' },
                      { id: 'programming', label: 'Dasturlash' },
                    ] as const
                  ).map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setCategoryFilter(tab.id)}
                      className={`min-h-[40px] px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        categoryFilter === tab.id
                          ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-white shadow-sm'
                          : 'text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                {filteredLessons.length === 0 ? (
                  <div className="p-8 text-center text-sm text-slate-600 dark:text-slate-400">
                    Qidiruv bo‘yicha dars topilmadi.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-semibold text-slate-500 dark:text-slate-400">
                          <th className="py-3 px-4 w-14">№</th>
                          <th className="py-3 px-4">Dars mavzusi</th>
                          <th className="py-3 px-4 whitespace-nowrap">Bo‘lim</th>
                          <th className="py-3 px-4 whitespace-nowrap">Vaqt</th>
                          <th className="py-3 px-4 text-right">Amallar</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-sm">
                        {filteredLessons.map((lesson) => (
                          <tr
                            key={lesson.id}
                            className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                          >
                            <td className="py-3 px-4 font-mono text-xs font-semibold text-sky-700 dark:text-sky-400 tabular-nums">
                              {lesson.number}
                            </td>
                            <td className="py-3 px-4">
                              <div className="font-medium text-slate-900 dark:text-white">
                                {lesson.title}
                              </div>
                              <div className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                                {lesson.summary}
                              </div>
                            </td>
                            <td className="py-3 px-4 text-xs text-slate-600 dark:text-slate-300 whitespace-nowrap">
                              {lesson.categoryLabel}
                            </td>
                            <td className="py-3 px-4 text-xs font-mono text-slate-600 dark:text-slate-300 whitespace-nowrap tabular-nums">
                              {lesson.readTime}
                            </td>
                            <td className="py-3 px-4 text-right whitespace-nowrap">
                              {deleteConfirmId === lesson.id ? (
                                <span className="inline-flex items-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => deleteLesson(lesson.id)}
                                    className="px-2.5 py-1 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded cursor-pointer"
                                  >
                                    O‘chirish
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setDeleteConfirmId(null)}
                                    className="px-2 py-1 text-xs text-slate-600 dark:text-slate-300 cursor-pointer"
                                  >
                                    Bekor
                                  </button>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1">
                                  <button
                                    type="button"
                                    aria-label="Tahrirlash"
                                    onClick={() => openEditLesson(lesson)}
                                    className="min-h-[40px] min-w-[40px] inline-flex items-center justify-center text-slate-500 hover:text-sky-700 dark:hover:text-sky-400 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                                  >
                                    <Pencil className="w-4 h-4" />
                                  </button>
                                  <button
                                    type="button"
                                    aria-label="O‘chirish"
                                    onClick={() => setDeleteConfirmId(lesson.id)}
                                    className="min-h-[40px] min-w-[40px] inline-flex items-center justify-center text-slate-500 hover:text-rose-600 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}

          {/* TAB 3: BILASIZMI? CRUD */}
          {activeTab === 'dyk' && (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                    «Bilasizmi?» mashqlari
                  </h1>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Qiziqarli mantiqiy savol-javob kartochkalarini boshqaring.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={openNewDyk}
                  className="min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-slate-900 dark:bg-sky-500 dark:text-slate-950 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer self-stretch sm:self-auto"
                >
                  <Plus className="w-4 h-4 shrink-0" />
                  <span>Yangi savol qo‘shish</span>
                </button>
              </div>

              <div className="relative max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Savol yoki mavzu bo‘yicha qidirish..."
                  className="w-full min-h-[44px] pl-9 pr-3 py-2 text-base sm:text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                {filteredDyk.length === 0 ? (
                  <div className="p-8 text-center text-sm text-slate-600 dark:text-slate-400">
                    Mantiqiy savollar topilmadi.
                  </div>
                ) : (
                  <div className="divide-y divide-slate-200 dark:divide-slate-800">
                    {filteredDyk.map((card, idx) => (
                      <div
                        key={card.id}
                        className="p-4 sm:px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                      >
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                            <span className="font-mono font-semibold text-sky-700 dark:text-sky-400 tabular-nums">
                              {String(idx + 1).padStart(2, '0')}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span>{card.topic}</span>
                          </div>
                          <div className="text-sm font-semibold text-slate-900 dark:text-white">
                            {card.question}
                          </div>
                          <div className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                            {card.answer}
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0 self-end sm:self-center">
                          {deleteConfirmId === card.id ? (
                            <span className="inline-flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => deleteDyk(card.id)}
                                className="px-2.5 py-1 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded cursor-pointer"
                              >
                                O‘chirish
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeleteConfirmId(null)}
                                className="px-2 py-1 text-xs text-slate-600 dark:text-slate-300 cursor-pointer"
                              >
                                Bekor
                              </button>
                            </span>
                          ) : (
                            <>
                              <button
                                type="button"
                                aria-label="Tahrirlash"
                                onClick={() => openEditDyk(card)}
                                className="min-h-[40px] min-w-[40px] inline-flex items-center justify-center text-slate-500 hover:text-sky-700 dark:hover:text-sky-400 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                aria-label="O‘chirish"
                                onClick={() => setDeleteConfirmId(card.id)}
                                className="min-h-[40px] min-w-[40px] inline-flex items-center justify-center text-slate-500 hover:text-rose-600 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* TAB 4: EXAM QUESTIONS CRUD */}
          {activeTab === 'exam' && (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Test savollari banki
                  </h1>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Yakuniy imtihon savollari, A/B/C/D javob variantlari va izohlarini boshqaring.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={openNewQuestion}
                  className="min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-slate-900 dark:bg-sky-500 dark:text-slate-950 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer self-stretch sm:self-auto"
                >
                  <Plus className="w-4 h-4 shrink-0" />
                  <span>Yangi test qo‘shish</span>
                </button>
              </div>

              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Test savoli matnidan qidirish..."
                    className="w-full min-h-[44px] pl-9 pr-3 py-2 text-base sm:text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div className="flex items-center gap-1 p-1 bg-slate-200/70 dark:bg-slate-800 rounded-lg self-start overflow-x-auto max-w-full">
                  {(
                    [
                      { id: 'all', label: 'Barchasi' },
                      { id: 'literacy', label: 'Savodxonlik' },
                      { id: 'programming', label: 'Dasturlash' },
                    ] as const
                  ).map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setCategoryFilter(tab.id)}
                      className={`min-h-[40px] px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        categoryFilter === tab.id
                          ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-white shadow-sm'
                          : 'text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                {filteredQuestions.length === 0 ? (
                  <div className="p-8 text-center text-sm text-slate-600 dark:text-slate-400">
                    Test savollari topilmadi.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-semibold text-slate-500 dark:text-slate-400">
                          <th className="py-3 px-4 w-12">№</th>
                          <th className="py-3 px-4">Savol matni</th>
                          <th className="py-3 px-4 whitespace-nowrap">Bo‘lim</th>
                          <th className="py-3 px-4 whitespace-nowrap">To‘g‘ri javob</th>
                          <th className="py-3 px-4 text-right">Amallar</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-sm">
                        {filteredQuestions.map((q) => (
                          <tr
                            key={q.id}
                            className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                          >
                            <td className="py-3 px-4 font-mono text-xs font-semibold text-sky-700 dark:text-sky-400 tabular-nums">
                              {String(q.id).padStart(2, '0')}
                            </td>
                            <td className="py-3 px-4 font-medium text-slate-900 dark:text-white max-w-md">
                              {q.question}
                            </td>
                            <td className="py-3 px-4 text-xs text-slate-600 dark:text-slate-300 whitespace-nowrap">
                              {q.categoryLabel}
                            </td>
                            <td className="py-3 px-4 text-xs font-medium text-emerald-700 dark:text-emerald-400 whitespace-nowrap">
                              <span className="inline-flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                                {q.options[q.correctIndex]}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right whitespace-nowrap">
                              {deleteConfirmId === q.id ? (
                                <span className="inline-flex items-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => deleteQuestion(q.id)}
                                    className="px-2.5 py-1 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded cursor-pointer"
                                  >
                                    O‘chirish
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setDeleteConfirmId(null)}
                                    className="px-2 py-1 text-xs text-slate-600 dark:text-slate-300 cursor-pointer"
                                  >
                                    Bekor
                                  </button>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1">
                                  <button
                                    type="button"
                                    aria-label="Tahrirlash"
                                    onClick={() => openEditQuestion(q)}
                                    className="min-h-[40px] min-w-[40px] inline-flex items-center justify-center text-slate-500 hover:text-sky-700 dark:hover:text-sky-400 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                                  >
                                    <Pencil className="w-4 h-4" />
                                  </button>
                                  <button
                                    type="button"
                                    aria-label="O‘chirish"
                                    onClick={() => setDeleteConfirmId(q.id)}
                                    className="min-h-[40px] min-w-[40px] inline-flex items-center justify-center text-slate-500 hover:text-rose-600 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}

          {/* TAB 5: GLOSSARY CRUD */}
          {activeTab === 'glossary' && (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                    IT Lug‘at atamalari
                  </h1>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    O‘quvchilar uchun texnologik atamalar va oddiy izohlarni boshqaring.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={openNewGlossary}
                  className="min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-slate-900 dark:bg-sky-500 dark:text-slate-950 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer self-stretch sm:self-auto"
                >
                  <Plus className="w-4 h-4 shrink-0" />
                  <span>Yangi atama qo‘shish</span>
                </button>
              </div>

              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Atama bo‘yicha qidirish..."
                    className="w-full min-h-[44px] pl-9 pr-3 py-2 text-base sm:text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div className="flex items-center gap-1 p-1 bg-slate-200/70 dark:bg-slate-800 rounded-lg self-start overflow-x-auto max-w-full">
                  {(
                    [
                      { id: 'all', label: 'Barchasi' },
                      { id: 'literacy', label: 'Savodxonlik' },
                      { id: 'programming', label: 'Dasturlash' },
                    ] as const
                  ).map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setCategoryFilter(tab.id)}
                      className={`min-h-[40px] px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        categoryFilter === tab.id
                          ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-white shadow-sm'
                          : 'text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                {filteredGlossary.length === 0 ? (
                  <div className="p-8 text-center text-sm text-slate-600 dark:text-slate-400">
                    Atamalar topilmadi.
                  </div>
                ) : (
                  <div className="divide-y divide-slate-200 dark:divide-slate-800">
                    {filteredGlossary.map((item) => (
                      <div
                        key={item.id}
                        className="p-4 sm:px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                      >
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                            <span>
                              {item.category === 'literacy'
                                ? 'Kompyuter savodxonligi'
                                : 'Dasturlash asoslari'}
                            </span>
                          </div>
                          <div className="text-sm font-semibold text-slate-900 dark:text-white">
                            {item.term}
                          </div>
                          <div className="text-xs text-slate-600 dark:text-slate-400">
                            {item.shortDesc}
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0 self-end sm:self-center">
                          {deleteConfirmId === item.id ? (
                            <span className="inline-flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => deleteGlossary(item.id)}
                                className="px-2.5 py-1 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded cursor-pointer"
                              >
                                O‘chirish
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeleteConfirmId(null)}
                                className="px-2 py-1 text-xs text-slate-600 dark:text-slate-300 cursor-pointer"
                              >
                                Bekor
                              </button>
                            </span>
                          ) : (
                            <>
                              <button
                                type="button"
                                aria-label="Tahrirlash"
                                onClick={() => openEditGlossary(item)}
                                className="min-h-[40px] min-w-[40px] inline-flex items-center justify-center text-slate-500 hover:text-sky-700 dark:hover:text-sky-400 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                aria-label="O‘chirish"
                                onClick={() => setDeleteConfirmId(item.id)}
                                className="min-h-[40px] min-w-[40px] inline-flex items-center justify-center text-slate-500 hover:text-rose-600 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* TAB 6: EXAM RESULTS */}
          {activeTab === 'results' && (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Imtihon natijalari jurnali
                  </h1>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Yakuniy testni topshirgan barcha o‘quvchilarning ballari va tahlili.
                  </p>
                </div>

                {examResults.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={exportResultsCsv}
                      className="min-h-[44px] inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 shrink-0" />
                      <span>CSV yuklash</span>
                    </button>

                    {confirmClearResults ? (
                      <div className="min-h-[44px] inline-flex items-center gap-2 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 px-3 py-1.5 rounded-lg">
                        <span className="text-xs font-medium text-rose-900 dark:text-rose-200">
                          Jurnal tozalansinmi?
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            onClearResults();
                            setConfirmClearResults(false);
                          }}
                          className="min-h-[34px] px-2.5 py-1 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded cursor-pointer"
                        >
                          Ha
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmClearResults(false)}
                          className="min-h-[34px] px-2 py-1 text-xs text-slate-600 dark:text-slate-300 cursor-pointer"
                        >
                          Yo‘q
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmClearResults(true)}
                        className="min-h-[44px] px-3.5 py-2 text-xs font-medium text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 border border-rose-200 dark:border-rose-800 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        Jurnalni tozalash
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* 24-Hour Lock & Exam Attempts Control */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 space-y-4">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                      Imtihon imkoniyatlari va 24 soatlik blok nazorati
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      3 marta yiqilganda imtihon 24 soatga yopiladi. Admin istalgan vaqtda blokni ochishi mumkin.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onResetExamAttempts()}
                    className="min-h-[42px] inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer self-start lg:self-auto"
                  >
                    <Unlock className="w-3.5 h-3.5 shrink-0" />
                    <span>Barcha imtihonlarni ochish (3/3)</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {scopesOrder.map((scope) => {
                    const lockedUntil = examLockedUntil[scope] ?? 0;
                    const locked = isExamScopeLocked(lockedUntil, nowMs);
                    const used = locked ? maxAttempts : (examAttempts[scope] ?? 0);
                    const left = locked ? 0 : Math.max(0, maxAttempts - used);
                    return (
                      <div
                        key={scope}
                        className={`p-3.5 rounded-xl border flex flex-col justify-between gap-3 ${
                          locked
                            ? 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800'
                            : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800'
                        }`}
                      >
                        <div>
                          <div className="text-xs font-semibold text-slate-900 dark:text-white">
                            {EXAM_SCOPE_LABELS[scope]}
                          </div>
                          {locked ? (
                            <div className="mt-1 space-y-0.5">
                              <div className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 dark:text-rose-400">
                                <Clock className="w-3.5 h-3.5" />
                                <span>24 soatlik blokda</span>
                              </div>
                              <div className="text-sm font-mono font-bold tabular-nums text-rose-800 dark:text-rose-300">
                                {formatRemainingCountdown(lockedUntil, nowMs)}
                              </div>
                              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                                Ochiladi: {formatUnlockClock(lockedUntil)}
                              </div>
                            </div>
                          ) : (
                            <div className="mt-1 text-xs font-mono tabular-nums text-slate-600 dark:text-slate-300">
                              Qolgan: {left}/{maxAttempts} · Ishlatilgan: {used}
                            </div>
                          )}
                        </div>

                        {(locked || used > 0) && (
                          <button
                            type="button"
                            onClick={() => onResetExamAttempts(scope)}
                            className="w-full min-h-[38px] inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors cursor-pointer"
                          >
                            <Unlock className="w-3.5 h-3.5" />
                            <span>{locked ? '24 soatlik blokni ochish' : 'Urinishlarni tiklash'}</span>
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Cloud Students 24h Lock Management (for Firebase Admin) */}
              {cloudUsers.length > 0 && onUnlockCloudUserExam && (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                  <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                      <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                        Bulutli o‘quvchilar imtihon holati ({cloudUsers.length} ta)
                      </h2>
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      Bloklanganlar: {lockedCloudUsers.length} ta
                    </span>
                  </div>

                  <div className="divide-y divide-slate-200 dark:divide-slate-800">
                    {cloudUsers.map((student) => {
                      const studentLockedScopes = scopesOrder.filter((s) =>
                        isExamScopeLocked(student.examLockedUntil?.[s], nowMs)
                      );
                      const hasUsedAny = scopesOrder.some((s) => (student.examAttempts?.[s] ?? 0) > 0);
                      return (
                        <div
                          key={student.uid}
                          className="p-4 sm:px-5 flex flex-col md:flex-row md:items-center justify-between gap-3"
                        >
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-sm font-bold text-slate-900 dark:text-white">
                                {student.displayName}
                              </span>
                              {studentLockedScopes.length > 0 && (
                                <span className="text-xs font-semibold text-rose-600 dark:text-rose-400">
                                  · 24 soatga bloklangan
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                              {student.email || student.uid}
                            </div>
                            <div className="mt-1.5 flex flex-wrap gap-3 text-[11px] font-mono tabular-nums text-slate-600 dark:text-slate-300">
                              {scopesOrder.map((s) => {
                                const lockTs = student.examLockedUntil?.[s] ?? 0;
                                const isLk = isExamScopeLocked(lockTs, nowMs);
                                return (
                                  <span
                                    key={s}
                                    className={isLk ? 'text-rose-600 dark:text-rose-400 font-semibold' : ''}
                                  >
                                    {EXAM_SCOPE_LABELS[s]}:{' '}
                                    {isLk
                                      ? `Blok (${formatRemainingCountdown(lockTs, nowMs)})`
                                      : `${student.examAttempts?.[s] ?? 0}/${maxAttempts}`}
                                  </span>
                                );
                              })}
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 shrink-0">
                            {studentLockedScopes.map((s) => (
                              <button
                                key={s}
                                type="button"
                                onClick={() => onUnlockCloudUserExam(student, s)}
                                className="min-h-[38px] inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg cursor-pointer"
                              >
                                <Unlock className="w-3.5 h-3.5" />
                                <span>{EXAM_SCOPE_LABELS[s]} ochish</span>
                              </button>
                            ))}
                            {hasUsedAny && (
                              <button
                                type="button"
                                onClick={() => onUnlockCloudUserExam(student)}
                                className="min-h-[38px] inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-800 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg cursor-pointer"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span>Barchasini tiklash</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="relative max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="O‘quvchi ismi bo‘yicha qidirish..."
                  className="w-full min-h-[44px] pl-9 pr-3 py-2 text-base sm:text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                {filteredResults.length === 0 ? (
                  <div className="p-10 text-center">
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                      {examResults.length === 0
                        ? 'Hali imtihon topshirilmagan. O‘quvchi sahifasida testni yakunlang.'
                        : 'Qidiruv bo‘yicha natija topilmadi.'}
                    </p>
                    {examResults.length === 0 && (
                      <button
                        type="button"
                        onClick={onGoToExam}
                        className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-sky-500 dark:text-slate-950 rounded-lg transition-colors cursor-pointer"
                      >
                        Imtihonga o‘tish
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-semibold text-slate-500 dark:text-slate-400">
                          <th className="py-3 px-4">O‘quvchi</th>
                          <th className="py-3 px-4 whitespace-nowrap">Savodxonlik</th>
                          <th className="py-3 px-4 whitespace-nowrap">Dasturlash</th>
                          <th className="py-3 px-4 whitespace-nowrap">Umumiy ball</th>
                          <th className="py-3 px-4 whitespace-nowrap">Daraja</th>
                          <th className="py-3 px-4 text-right whitespace-nowrap">Sertifikat</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-sm">
                        {filteredResults.map((r) => {
                          const passed = isResultPassed(r);
                          const existingCert = findExistingCertificate(r.id);
                          return (
                            <tr
                              key={r.id}
                              className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                            >
                              <td className="py-3 px-4 font-medium text-slate-900 dark:text-white">
                                <div>{r.studentName}</div>
                                <div className="text-[11px] font-mono text-slate-400">
                                  {new Date(r.completedAt).toLocaleString('uz-UZ', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </div>
                              </td>
                              <td className="py-3 px-4 font-mono text-xs tabular-nums text-slate-700 dark:text-slate-300">
                                {r.literacyScore} / {r.literacyTotal}
                              </td>
                              <td className="py-3 px-4 font-mono text-xs tabular-nums text-slate-700 dark:text-slate-300">
                                {r.programmingScore} / {r.programmingTotal}
                              </td>
                              <td className="py-3 px-4 font-mono font-semibold tabular-nums text-slate-900 dark:text-white">
                                {r.score} / {r.total} (
                                {r.total > 0 ? Math.round((r.score / r.total) * 100) : 0}%)
                              </td>
                              <td className="py-3 px-4 text-xs font-medium whitespace-nowrap">
                                <span
                                  className={
                                    r.tier === 'perfect'
                                      ? 'text-emerald-700 dark:text-emerald-400'
                                      : r.tier === 'great'
                                        ? 'text-sky-700 dark:text-sky-400'
                                        : r.tier === 'average'
                                          ? 'text-amber-700 dark:text-amber-400'
                                          : 'text-rose-700 dark:text-rose-400'
                                  }
                                >
                                  {r.tierLabel}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-right whitespace-nowrap">
                                {passed ? (
                                  <button
                                    type="button"
                                    onClick={() => openIssueCertificate(r)}
                                    className={`min-h-[36px] inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                                      existingCert
                                        ? 'text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800'
                                        : 'text-white bg-emerald-600 hover:bg-emerald-700'
                                    }`}
                                  >
                                    <Award className="w-3.5 h-3.5 shrink-0" />
                                    <span>
                                      {existingCert ? 'Sertifikatni ko‘rish' : 'Sertifikat chiqarish'}
                                    </span>
                                  </button>
                                ) : (
                                  <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                                    <XCircle className="w-3.5 h-3.5" />
                                    O‘tmagan
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}

          {/* TAB 6B: CERTIFICATES STUDIO */}
          {activeTab === 'certificates' && (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Sertifikat chiqarish markazi
                  </h1>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Faqat yakuniy testdan muvaffaqiyatli o‘tgan (kamida 75%) o‘quvchilar uchun rasmiy
                    sertifikat tayyorlang, PNG yoki PDF shaklida chiqaring.
                  </p>
                </div>
              </div>

              {/* Eligible Passed Students */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
                  <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                    Testdan o‘tgan o‘quvchilar ({examResults.filter(isResultPassed).length} ta)
                  </h2>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    O‘tish talabi: ≥ 75% (15+/20)
                  </span>
                </div>

                {examResults.filter(isResultPassed).length === 0 ? (
                  <div className="p-8 text-center space-y-3">
                    <Award className="w-9 h-9 text-slate-400 mx-auto" />
                    <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                      Hozircha testdan o‘tgan o‘quvchi natijasi yo‘q. Imtihondan kamida 75% ball
                      to‘plangach, shu yerda «Sertifikat chiqarish» tugmasi paydo bo‘ladi.
                    </p>
                    <button
                      type="button"
                      onClick={onGoToExam}
                      className="min-h-[40px] px-4 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-sky-500 dark:text-slate-950 rounded-lg cursor-pointer"
                    >
                      Imtihonga o‘tish
                    </button>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-200 dark:divide-slate-800">
                    {examResults.filter(isResultPassed).map((r) => {
                      const pct = r.total > 0 ? Math.round((r.score / r.total) * 100) : 0;
                      const existing = findExistingCertificate(r.id);
                      const scopeLabel =
                        r.examScope === 'programming'
                          ? 'Dasturlash asoslari'
                          : r.examScope === 'all'
                            ? 'Umumiy imtihon'
                            : 'Kompyuter savodxonligi';
                      return (
                        <div
                          key={r.id}
                          className="p-4 sm:px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        >
                          <div>
                            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                              <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                                Testdan o‘tgan
                              </span>
                              <span aria-hidden="true">·</span>
                              <span>{scopeLabel}</span>
                              <span aria-hidden="true">·</span>
                              <span className="font-mono tabular-nums">
                                {r.score}/{r.total} ({pct}%)
                              </span>
                            </div>
                            <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mt-0.5">
                              {r.studentName}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => openIssueCertificate(r)}
                            className={`min-h-[42px] inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                              existing
                                ? 'text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800'
                                : 'text-white bg-emerald-600 hover:bg-emerald-700'
                            }`}
                          >
                            <Award className="w-4 h-4 shrink-0" />
                            <span>
                              {existing
                                ? `Chiqarilgan (${existing.id}) · Ko‘rish`
                                : 'Sertifikat tayyorlash va chiqarish'}
                            </span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Issued Certificates Registry */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800">
                  <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                    Chiqarilgan sertifikatlar reestri ({issuedCertificates.length} ta)
                  </h2>
                </div>

                {issuedCertificates.length === 0 ? (
                  <div className="p-8 text-center text-sm text-slate-500 dark:text-slate-400">
                    Hali birorta sertifikat rasmiylashtirilmagan.
                  </div>
                ) : (
                  <div className="divide-y divide-slate-200 dark:divide-slate-800">
                    {issuedCertificates.map((cert) => (
                      <div
                        key={cert.id}
                        className="p-4 sm:px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div>
                          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                            <span className="font-mono font-semibold text-emerald-700 dark:text-emerald-400">
                              {cert.id}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span>{cert.trackTitle}</span>
                            <span aria-hidden="true">·</span>
                            <span className="font-mono tabular-nums">
                              {cert.score}/{cert.total} ({cert.percentage}%)
                            </span>
                          </div>
                          <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                            {cert.studentName}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setPreviewCertificate(cert)}
                            className="min-h-[40px] inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-sky-500 dark:text-slate-950 rounded-lg cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5 shrink-0" />
                            <span>Ko‘rish / Yuklash</span>
                          </button>

                          {deleteConfirmId === cert.id ? (
                            <span className="inline-flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => deleteCertificate(cert.id)}
                                className="px-2.5 py-1 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded cursor-pointer"
                              >
                                O‘chirish
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeleteConfirmId(null)}
                                className="px-2 py-1 text-xs text-slate-500 cursor-pointer"
                              >
                                Bekor
                              </button>
                            </span>
                          ) : (
                            <button
                              type="button"
                              aria-label="Sertifikatni o‘chirish"
                              onClick={() => setDeleteConfirmId(cert.id)}
                              className="min-h-[40px] min-w-[40px] inline-flex items-center justify-center text-slate-400 hover:text-rose-600 rounded-lg cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* TAB 7: SETTINGS & BACKUP */}
          {activeTab === 'settings' && (
            <>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Sozlamalar va zaxira
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Tashqi ko‘rinish, ma’lumotlarni eksport qilish va boshlang‘ich holatga qaytarish
                  boshqaruvi.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl divide-y divide-slate-200 dark:divide-slate-800">
                <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                      Rang mavzusi (Kunduzgi / Tungi rejim)
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Ko‘zni charchatmaslik uchun yorug‘ yoki qorong‘i rejimni tanlang.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={onToggleTheme}
                    className="min-h-[44px] inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-800 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer self-start sm:self-auto"
                  >
                    {isDark ? (
                      <Sun className="w-4 h-4 text-amber-400" />
                    ) : (
                      <Moon className="w-4 h-4 text-slate-600" />
                    )}
                    <span>{isDark ? 'Kunduzgi rejimga o‘tish' : 'Tungi rejimga o‘tish'}</span>
                  </button>
                </div>

                <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                      Barcha ma’lumotlarni zaxiralash (JSON)
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Darslar, savol-javoblar, test banki, lug‘at va natijalarni fayl sifatida
                      yuklab oling.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={exportAllJson}
                    className="min-h-[44px] inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-sky-500 dark:text-slate-950 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer self-start sm:self-auto"
                  >
                    <Download className="w-4 h-4" />
                    <span>JSON yuklab olish</span>
                  </button>
                </div>

                <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                      Boshlang‘ich o‘quv dasturini tiklash
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Tahrirlangan barcha dars, atama va testlarni asl holatiga qaytaradi.
                    </p>
                  </div>
                  {confirmReset ? (
                    <div className="min-h-[44px] inline-flex items-center gap-2 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 px-3 py-1.5 rounded-lg self-start sm:self-auto">
                      <span className="text-xs font-medium text-amber-900 dark:text-amber-200">
                        Tasdiqlaysizmi?
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          onResetDefaults();
                          setConfirmReset(false);
                        }}
                        className="min-h-[34px] px-2.5 py-1 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded cursor-pointer"
                      >
                        Ha, tiklash
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmReset(false)}
                        className="min-h-[34px] px-2 py-1 text-xs text-slate-600 dark:text-slate-300 cursor-pointer"
                      >
                        Yo‘q
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmReset(true)}
                      className="min-h-[44px] inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer self-start sm:self-auto"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Asl holatga qaytarish</span>
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      {/* MODAL 1: ADD/EDIT LESSON */}
      {lessonModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-end sm:items-center justify-center sm:p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-t-3xl sm:rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-5 sm:p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
            <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800 mb-5">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {editingLesson ? 'Darsni tahrirlash' : 'Yangi mini-dars qo‘shish'}
              </h2>
              <button
                type="button"
                aria-label="Yopish"
                onClick={() => setLessonModalOpen(false)}
                className="min-h-[44px] min-w-[44px] -mr-2 flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={submitLessonForm} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Dars sarlavhasi
                </label>
                <input
                  type="text"
                  required
                  value={lessonForm.title}
                  onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                  placeholder="Masalan: Bulutli texnologiyalar nima?"
                  className="w-full min-h-[44px] px-3 py-2 text-base sm:text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Bo‘lim
                  </label>
                  <select
                    value={lessonForm.category}
                    onChange={(e) =>
                      setLessonForm({
                        ...lessonForm,
                        category: e.target.value as LessonCategory,
                      })
                    }
                    className="w-full min-h-[44px] px-3 py-2 text-base sm:text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="literacy">Kompyuter savodxonligi</option>
                    <option value="programming">Dasturlash asoslari</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    O‘qish vaqti
                  </label>
                  <input
                    type="text"
                    value={lessonForm.readTime}
                    onChange={(e) => setLessonForm({ ...lessonForm, readTime: e.target.value })}
                    placeholder="3 daqiqa"
                    className="w-full min-h-[44px] px-3 py-2 text-base sm:text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Qisqa tushuntirish
                </label>
                <textarea
                  required
                  rows={2}
                  value={lessonForm.summary}
                  onChange={(e) => setLessonForm({ ...lessonForm, summary: e.target.value })}
                  placeholder="Mavzuning asosiy mohiyati..."
                  className="w-full px-3 py-2 text-base sm:text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Hayotiy misol (qiyos)
                </label>
                <textarea
                  rows={2}
                  value={lessonForm.analogyText}
                  onChange={(e) => setLessonForm({ ...lessonForm, analogyText: e.target.value })}
                  placeholder="Oddiy hayotdan misol..."
                  className="w-full px-3 py-2 text-base sm:text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Asosiy fikrlar (har birini yangi qatordan yozing)
                </label>
                <textarea
                  rows={3}
                  value={lessonForm.keyPointsText}
                  onChange={(e) =>
                    setLessonForm({ ...lessonForm, keyPointsText: e.target.value })
                  }
                  placeholder="1-asosiy qoida&#10;2-asosiy qoida"
                  className="w-full px-3 py-2 text-base sm:text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Interaktiv mashq turi
                </label>
                <select
                  value={lessonForm.widgetType}
                  onChange={(e) =>
                    setLessonForm({
                      ...lessonForm,
                      widgetType: e.target.value as LessonItem['widgetType'],
                    })
                  }
                  className="w-full min-h-[44px] px-3 py-2 text-base sm:text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  {Object.entries(WIDGET_LABELS).map(([k, label]) => (
                    <option key={k} value={k}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-end gap-2.5 sm:gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setLessonModalOpen(false)}
                  className="min-h-[44px] px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-lg cursor-pointer"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="min-h-[44px] px-5 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-sky-500 dark:text-slate-950 rounded-lg cursor-pointer"
                >
                  Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD/EDIT DYK */}
      {dykModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-end sm:items-center justify-center sm:p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-t-3xl sm:rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-5 sm:p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
            <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800 mb-5">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {editingDyk ? 'Savolni tahrirlash' : 'Yangi «Bilasizmi?» savoli'}
              </h2>
              <button
                type="button"
                aria-label="Yopish"
                onClick={() => setDykModalOpen(false)}
                className="min-h-[44px] min-w-[44px] -mr-2 flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={submitDykForm} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Yo‘nalish
                  </label>
                  <select
                    value={dykForm.category}
                    onChange={(e) =>
                      setDykForm({ ...dykForm, category: e.target.value as LessonCategory })
                    }
                    className="w-full min-h-[44px] px-3 py-2 text-base sm:text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg"
                  >
                    <option value="literacy">Kompyuter savodxonligi</option>
                    <option value="programming">Dasturlash asoslari</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Mavzu nomi
                  </label>
                  <input
                    type="text"
                    required
                    value={dykForm.topic}
                    onChange={(e) => setDykForm({ ...dykForm, topic: e.target.value })}
                    placeholder="Masalan: Internet tarixi"
                    className="w-full min-h-[44px] px-3 py-2 text-base sm:text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Qiziqarli savol
                </label>
                <textarea
                  required
                  rows={2}
                  value={dykForm.question}
                  onChange={(e) => setDykForm({ ...dykForm, question: e.target.value })}
                  placeholder="Foydalanuvchini o‘ylantiradigan savol..."
                  className="w-full px-3 py-2 text-base sm:text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Kichik yo‘llanma (maslahat)
                </label>
                <input
                  type="text"
                  value={dykForm.hint}
                  onChange={(e) => setDykForm({ ...dykForm, hint: e.target.value })}
                  placeholder="To‘g‘ri javobga yo‘naltiruvchi fikr..."
                  className="w-full min-h-[44px] px-3 py-2 text-base sm:text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  To‘liq javob
                </label>
                <textarea
                  required
                  rows={3}
                  value={dykForm.answer}
                  onChange={(e) => setDykForm({ ...dykForm, answer: e.target.value })}
                  placeholder="Tushunarli va qiziqarli javob..."
                  className="w-full px-3 py-2 text-base sm:text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-end gap-2.5 sm:gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setDykModalOpen(false)}
                  className="min-h-[44px] px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-lg cursor-pointer"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="min-h-[44px] px-5 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-sky-500 dark:text-slate-950 rounded-lg cursor-pointer"
                >
                  Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: ADD/EDIT EXAM QUESTION */}
      {questionModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-end sm:items-center justify-center sm:p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-t-3xl sm:rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-5 sm:p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
            <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800 mb-5">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {editingQuestion ? 'Test savolini tahrirlash' : 'Yangi test savoli qo‘shish'}
              </h2>
              <button
                type="button"
                aria-label="Yopish"
                onClick={() => setQuestionModalOpen(false)}
                className="min-h-[44px] min-w-[44px] -mr-2 flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={submitQuestionForm} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Bo‘lim
                </label>
                <select
                  value={questionForm.category}
                  onChange={(e) =>
                    setQuestionForm({
                      ...questionForm,
                      category: e.target.value as LessonCategory,
                    })
                  }
                  className="w-full min-h-[44px] px-3 py-2 text-base sm:text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="literacy">Kompyuter savodxonligi</option>
                  <option value="programming">Dasturlash asoslari</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Savol matni
                </label>
                <textarea
                  required
                  rows={2}
                  value={questionForm.question}
                  onChange={(e) => setQuestionForm({ ...questionForm, question: e.target.value })}
                  placeholder="Test savolini yozing..."
                  className="w-full px-3 py-2 text-base sm:text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="space-y-2.5">
                <div className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Javob variantlari (to‘g‘ri javobni belgilang):
                </div>
                {(
                  [
                    { key: 'optA', idx: 0 as const, label: 'A' },
                    { key: 'optB', idx: 1 as const, label: 'B' },
                    { key: 'optC', idx: 2 as const, label: 'C' },
                    { key: 'optD', idx: 3 as const, label: 'D' },
                  ] as const
                ).map((item) => (
                  <div key={item.key} className="flex items-center gap-2.5">
                    <input
                      type="radio"
                      name="correctOption"
                      checked={questionForm.correctIndex === item.idx}
                      onChange={() => setQuestionForm({ ...questionForm, correctIndex: item.idx })}
                      aria-label={`${item.label} variantini to‘g‘ri deb belgilash`}
                      className="w-5 h-5 text-emerald-600 cursor-pointer shrink-0"
                    />
                    <input
                      type="text"
                      required
                      value={questionForm[item.key]}
                      onChange={(e) =>
                        setQuestionForm({ ...questionForm, [item.key]: e.target.value })
                      }
                      placeholder={`${item.label}) Variant matni`}
                      className="flex-1 min-h-[44px] px-3 py-2 text-base sm:text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Qisqa izoh (javobdan keyin ko‘rinadi)
                </label>
                <input
                  type="text"
                  value={questionForm.explanation}
                  onChange={(e) =>
                    setQuestionForm({ ...questionForm, explanation: e.target.value })
                  }
                  placeholder="Nima uchun bu javob to‘g‘ri ekanligi..."
                  className="w-full min-h-[44px] px-3 py-2 text-base sm:text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-end gap-2.5 sm:gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setQuestionModalOpen(false)}
                  className="min-h-[44px] px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-lg cursor-pointer"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="min-h-[44px] px-5 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-sky-500 dark:text-slate-950 rounded-lg cursor-pointer"
                >
                  Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: ADD/EDIT GLOSSARY TERM */}
      {glossaryModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-end sm:items-center justify-center sm:p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-t-3xl sm:rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-5 sm:p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
            <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800 mb-5">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {editingGlossary ? 'Atamani tahrirlash' : 'Yangi IT atama qo‘shish'}
              </h2>
              <button
                type="button"
                aria-label="Yopish"
                onClick={() => setGlossaryModalOpen(false)}
                className="min-h-[44px] min-w-[44px] -mr-2 flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={submitGlossaryForm} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Atama nomi
                  </label>
                  <input
                    type="text"
                    required
                    value={glossaryForm.term}
                    onChange={(e) => setGlossaryForm({ ...glossaryForm, term: e.target.value })}
                    placeholder="Masalan: IP Manzil"
                    className="w-full min-h-[44px] px-3 py-2 text-base sm:text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Bo‘lim
                  </label>
                  <select
                    value={glossaryForm.category}
                    onChange={(e) =>
                      setGlossaryForm({
                        ...glossaryForm,
                        category: e.target.value as LessonCategory,
                      })
                    }
                    className="w-full min-h-[44px] px-3 py-2 text-base sm:text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="literacy">Kompyuter savodxonligi</option>
                    <option value="programming">Dasturlash asoslari</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Qisqa ta’rifi
                </label>
                <textarea
                  required
                  rows={2}
                  value={glossaryForm.shortDesc}
                  onChange={(e) => setGlossaryForm({ ...glossaryForm, shortDesc: e.target.value })}
                  placeholder="Atamaning tushunarli izohi..."
                  className="w-full px-3 py-2 text-base sm:text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Hayotiy misol
                </label>
                <input
                  type="text"
                  value={glossaryForm.example}
                  onChange={(e) => setGlossaryForm({ ...glossaryForm, example: e.target.value })}
                  placeholder="Masalan: Xuddi uy manzili kabi..."
                  className="w-full min-h-[44px] px-3 py-2 text-base sm:text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-end gap-2.5 sm:gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setGlossaryModalOpen(false)}
                  className="min-h-[44px] px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-lg cursor-pointer"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="min-h-[44px] px-5 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-sky-500 dark:text-slate-950 rounded-lg cursor-pointer"
                >
                  Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* MODAL 5: ADD/EDIT VIDEO LESSON */}
      {videoModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-end sm:items-center justify-center sm:p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-t-3xl sm:rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-5 sm:p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
            <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800 mb-5">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {editingVideo ? 'Videodarsni tahrirlash' : 'Yangi videodars qo‘shish'}
              </h2>
              <button
                type="button"
                aria-label="Yopish"
                onClick={() => setVideoModalOpen(false)}
                className="min-h-[44px] min-w-[44px] -mr-2 flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={submitVideoForm} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Video sarlavhasi
                </label>
                <input
                  type="text"
                  required
                  value={videoForm.title}
                  onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                  placeholder="Masalan: Kompyuter xotirasi qanday ishlaydi?"
                  className="w-full min-h-[44px] px-3 py-2 text-base sm:text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Bo‘lim
                  </label>
                  <select
                    value={videoForm.category}
                    onChange={(e) =>
                      setVideoForm({
                        ...videoForm,
                        category: e.target.value as LessonCategory,
                      })
                    }
                    className="w-full min-h-[44px] px-3 py-2 text-base sm:text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="literacy">Kompyuter savodxonligi</option>
                    <option value="programming">Dasturlash asoslari</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Davomiyligi
                  </label>
                  <input
                    type="text"
                    value={videoForm.durationLabel}
                    onChange={(e) =>
                      setVideoForm({ ...videoForm, durationLabel: e.target.value })
                    }
                    placeholder="0:40"
                    className="w-full min-h-[44px] px-3 py-2 text-base sm:text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Qisqa tavsif
                </label>
                <textarea
                  rows={2}
                  value={videoForm.shortDesc}
                  onChange={(e) => setVideoForm({ ...videoForm, shortDesc: e.target.value })}
                  placeholder="Videodars nima haqida..."
                  className="w-full px-3 py-2 text-base sm:text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Tashqi video havolasi (ixtiyoriy — YouTube yoki .mp4)
                </label>
                <input
                  type="url"
                  value={videoForm.externalUrl}
                  onChange={(e) => setVideoForm({ ...videoForm, externalUrl: e.target.value })}
                  placeholder="Bo‘sh qoldirsangiz, o‘rnatilgan animatsion video ijro etiladi"
                  className="w-full min-h-[44px] px-3 py-2 text-base sm:text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Animatsion sahna mavzusi
                </label>
                <select
                  value={videoForm.visualType}
                  onChange={(e) =>
                    setVideoForm({
                      ...videoForm,
                      visualType: e.target.value as VideoVisualType,
                    })
                  }
                  className="w-full min-h-[44px] px-3 py-2 text-base sm:text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  {Object.entries(VIDEO_VISUAL_LABELS).map(([k, label]) => (
                    <option key={k} value={k}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200 dark:border-slate-800">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    1-sahna sarlavhasi
                  </label>
                  <input
                    type="text"
                    value={videoForm.hookTitle}
                    onChange={(e) => setVideoForm({ ...videoForm, hookTitle: e.target.value })}
                    className="w-full min-h-[44px] px-3 py-2 text-base sm:text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    4-sahna xulosasi
                  </label>
                  <input
                    type="text"
                    value={videoForm.summaryTitle}
                    onChange={(e) =>
                      setVideoForm({ ...videoForm, summaryTitle: e.target.value })
                    }
                    className="w-full min-h-[44px] px-3 py-2 text-base sm:text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-end gap-2.5 sm:gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setVideoModalOpen(false)}
                  className="min-h-[44px] px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-lg cursor-pointer"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="min-h-[44px] px-5 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-sky-500 dark:text-slate-950 rounded-lg cursor-pointer"
                >
                  Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 6: ISSUE CERTIFICATE FOR PASSED STUDENT */}
      {certIssueAttempt && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-end sm:items-center justify-center sm:p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-t-3xl sm:rounded-2xl w-full max-w-md p-5 sm:p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
            <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800 mb-5">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Rasmiy sertifikat chiqarish
              </h2>
              <button
                type="button"
                aria-label="Yopish"
                onClick={() => setCertIssueAttempt(null)}
                className="min-h-[44px] min-w-[44px] -mr-2 flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmIssueCertificate} className="space-y-4">
              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200">
                Natija:{' '}
                <span className="font-mono font-bold">
                  {certIssueAttempt.score} / {certIssueAttempt.total}
                </span>{' '}
                ({certIssueAttempt.tierLabel})
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  O‘quvchi F.I.Sh. (Sertifikatda yoziladi)
                </label>
                <input
                  type="text"
                  required
                  value={certStudentName}
                  onChange={(e) => setCertStudentName(e.target.value)}
                  placeholder="Masalan: Jasur Aliyev"
                  className="w-full min-h-[44px] px-3 py-2 text-base sm:text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Tasdiqlovchi ustoz / Rahbar nomi
                </label>
                <input
                  type="text"
                  required
                  value={certIssuerName}
                  onChange={(e) => setCertIssuerName(e.target.value)}
                  className="w-full min-h-[44px] px-3 py-2 text-base sm:text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-end gap-2.5 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setCertIssueAttempt(null)}
                  className="min-h-[44px] px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-lg cursor-pointer"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="min-h-[44px] inline-flex items-center justify-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg cursor-pointer"
                >
                  <Award className="w-4 h-4 shrink-0" />
                  <span>Sertifikat yaratish va ko‘rish</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {previewCertificate && (
        <CertificatePreviewModal
          certificate={previewCertificate}
          onClose={() => setPreviewCertificate(null)}
        />
      )}
    </div>
  );
}
