import type { User } from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  type Unsubscribe,
} from 'firebase/firestore';
import type { ExamAttemptRecord, ExamScope } from '../components/FinalExamSection';
import type {
  CertificateRecord,
  DidYouKnowItem,
  ExamQuestion,
  GlossaryTerm,
  LessonCategory,
  LessonItem,
  VideoLessonItem,
} from '../data/curriculum';
import { db, handleFirestoreError, OperationType } from '../firebase';

export const ADMIN_EMAIL = 'shaxbozxon444@gmail.com';

export function isFirebaseBootstrapAdmin(user: User | null): boolean {
  return Boolean(user && user.email === ADMIN_EMAIL && user.emailVerified);
}

export interface UserProfileDoc {
  uid: string;
  displayName: string;
  email: string;
  role: 'student' | 'admin';
  activeTrack: LessonCategory;
  completedLessons: string[];
  watchedVideos: string[];
  solvedChallenges: string[];
  examAttempts: Record<ExamScope, number>;
}

export interface PersistedExamResult extends ExamAttemptRecord {
  userId?: string;
}

export interface PersistedCertificate extends CertificateRecord {
  userId?: string;
  resultId?: string;
}

export async function ensureUserProfile(
  user: User,
  initial: {
    displayName?: string;
    activeTrack: LessonCategory;
    completedLessons: string[];
    watchedVideos: string[];
    solvedChallenges: string[];
    examAttempts: Record<ExamScope, number>;
  }
): Promise<UserProfileDoc> {
  const path = `users/${user.uid}`;
  const ref = doc(db, 'users', user.uid);
  try {
    const snap = await getDoc(ref);
    if (snap.exists()) {
      const data = snap.data() as Partial<UserProfileDoc>;
      return {
        uid: user.uid,
        displayName:
          typeof data.displayName === 'string' && data.displayName.trim()
            ? data.displayName
            : user.displayName || user.email?.split('@')[0] || 'O‘quvchi',
        email: typeof data.email === 'string' ? data.email : user.email || '',
        role: data.role === 'admin' ? 'admin' : 'student',
        activeTrack: data.activeTrack === 'programming' ? 'programming' : 'literacy',
        completedLessons: Array.isArray(data.completedLessons) ? data.completedLessons.slice(0, 100) : [],
        watchedVideos: Array.isArray(data.watchedVideos) ? data.watchedVideos.slice(0, 100) : [],
        solvedChallenges: Array.isArray(data.solvedChallenges) ? data.solvedChallenges.slice(0, 100) : [],
        examAttempts: {
          literacy: Math.min(3, Math.max(0, Number(data.examAttempts?.literacy ?? 0))),
          programming: Math.min(3, Math.max(0, Number(data.examAttempts?.programming ?? 0))),
          all: Math.min(3, Math.max(0, Number(data.examAttempts?.all ?? 0))),
        },
      };
    }

    const safeName = (
      initial.displayName ||
      user.displayName ||
      user.email?.split('@')[0] ||
      'O‘quvchi'
    )
      .trim()
      .slice(0, 100);

    const payload = {
      uid: user.uid,
      displayName: safeName,
      email: (user.email || '').slice(0, 150),
      role: 'student' as const,
      activeTrack: initial.activeTrack,
      completedLessons: initial.completedLessons.slice(0, 100),
      watchedVideos: initial.watchedVideos.slice(0, 100),
      solvedChallenges: initial.solvedChallenges.slice(0, 100),
      examAttempts: {
        literacy: Math.min(3, Math.max(0, initial.examAttempts.literacy || 0)),
        programming: Math.min(3, Math.max(0, initial.examAttempts.programming || 0)),
        all: Math.min(3, Math.max(0, initial.examAttempts.all || 0)),
      },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(ref, payload);

    return {
      uid: user.uid,
      displayName: payload.displayName,
      email: payload.email,
      role: 'student',
      activeTrack: payload.activeTrack,
      completedLessons: payload.completedLessons,
      watchedVideos: payload.watchedVideos,
      solvedChallenges: payload.solvedChallenges,
      examAttempts: payload.examAttempts,
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export function subscribeUserProfile(
  uid: string,
  onData: (profile: UserProfileDoc) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const path = `users/${uid}`;
  return onSnapshot(
    doc(db, 'users', uid),
    (snap) => {
      if (!snap.exists()) return;
      const data = snap.data() as Partial<UserProfileDoc>;
      onData({
        uid,
        displayName:
          typeof data.displayName === 'string' && data.displayName.trim()
            ? data.displayName
            : 'O‘quvchi',
        email: typeof data.email === 'string' ? data.email : '',
        role: data.role === 'admin' ? 'admin' : 'student',
        activeTrack: data.activeTrack === 'programming' ? 'programming' : 'literacy',
        completedLessons: Array.isArray(data.completedLessons) ? data.completedLessons.slice(0, 100) : [],
        watchedVideos: Array.isArray(data.watchedVideos) ? data.watchedVideos.slice(0, 100) : [],
        solvedChallenges: Array.isArray(data.solvedChallenges) ? data.solvedChallenges.slice(0, 100) : [],
        examAttempts: {
          literacy: Math.min(3, Math.max(0, Number(data.examAttempts?.literacy ?? 0))),
          programming: Math.min(3, Math.max(0, Number(data.examAttempts?.programming ?? 0))),
          all: Math.min(3, Math.max(0, Number(data.examAttempts?.all ?? 0))),
        },
      });
    },
    (error) => {
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

export async function updateUserProgress(
  uid: string,
  patch: Partial<{
    displayName: string;
    activeTrack: LessonCategory;
    completedLessons: string[];
    watchedVideos: string[];
    solvedChallenges: string[];
    examAttempts: Record<ExamScope, number>;
  }>
): Promise<void> {
  const path = `users/${uid}`;
  try {
    const cleanPatch: Record<string, unknown> = {
      updatedAt: serverTimestamp(),
    };
    if (typeof patch.displayName === 'string' && patch.displayName.trim()) {
      cleanPatch.displayName = patch.displayName.trim().slice(0, 100);
    }
    if (patch.activeTrack) {
      cleanPatch.activeTrack = patch.activeTrack;
    }
    if (patch.completedLessons) {
      cleanPatch.completedLessons = patch.completedLessons.slice(0, 100);
    }
    if (patch.watchedVideos) {
      cleanPatch.watchedVideos = patch.watchedVideos.slice(0, 100);
    }
    if (patch.solvedChallenges) {
      cleanPatch.solvedChallenges = patch.solvedChallenges.slice(0, 100);
    }
    if (patch.examAttempts) {
      cleanPatch.examAttempts = {
        literacy: Math.min(3, Math.max(0, patch.examAttempts.literacy || 0)),
        programming: Math.min(3, Math.max(0, patch.examAttempts.programming || 0)),
        all: Math.min(3, Math.max(0, patch.examAttempts.all || 0)),
      };
    }
    await updateDoc(doc(db, 'users', uid), cleanPatch);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function saveExamResultDoc(uid: string, record: ExamAttemptRecord): Promise<void> {
  const safeId = record.id.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 128);
  const path = `examResults/${safeId}`;
  try {
    await setDoc(doc(db, 'examResults', safeId), {
      id: safeId,
      userId: uid,
      studentName: record.studentName.trim().slice(0, 100) || 'O‘quvchi',
      examScope: record.examScope,
      score: Math.max(0, Math.min(record.total, Math.trunc(record.score))),
      total: Math.max(1, Math.min(100, Math.trunc(record.total))),
      passed: Boolean(record.passed),
      literacyScore: Math.max(0, Math.trunc(record.literacyScore)),
      literacyTotal: Math.max(0, Math.trunc(record.literacyTotal)),
      programmingScore: Math.max(0, Math.trunc(record.programmingScore)),
      programmingTotal: Math.max(0, Math.trunc(record.programmingTotal)),
      tier: record.tier,
      tierLabel: record.tierLabel.slice(0, 200),
      completedAt: record.completedAt.slice(0, 80),
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export function subscribeExamResults(
  uid: string,
  isAdminUser: boolean,
  onData: (results: PersistedExamResult[]) => void
): Unsubscribe {
  const path = 'examResults';
  const q = isAdminUser
    ? query(collection(db, 'examResults'))
    : query(collection(db, 'examResults'), where('userId', '==', uid));

  return onSnapshot(
    q,
    (snapshot) => {
      const items = snapshot.docs.map((d) => {
        const data = d.data() as PersistedExamResult;
        return data;
      });
      items.sort((a, b) => b.id.localeCompare(a.id));
      onData(items);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

export async function saveCertificateDoc(
  cert: CertificateRecord,
  userId: string,
  resultId: string
): Promise<void> {
  const safeId = cert.id.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 128);
  const safeResultId = (resultId || cert.attemptId).replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 128);
  const path = `certificates/${safeId}`;
  try {
    await setDoc(doc(db, 'certificates', safeId), {
      id: safeId,
      userId,
      resultId: safeResultId,
      studentName: cert.studentName.trim().slice(0, 100),
      track: cert.scope,
      trackTitle: cert.trackTitle.slice(0, 120),
      score: Math.trunc(cert.score),
      total: Math.trunc(cert.total),
      percentage: Math.max(75, Math.min(100, Math.trunc(cert.percentage))),
      tierLabel: cert.gradeLabel.slice(0, 200),
      issuedAt: cert.issuedAt.slice(0, 80),
      issuerName: cert.issuerName.slice(0, 120),
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteCertificateDoc(certId: string): Promise<void> {
  const safeId = certId.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 128);
  const path = `certificates/${safeId}`;
  try {
    await deleteDoc(doc(db, 'certificates', safeId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export function subscribeCertificates(
  uid: string,
  isAdminUser: boolean,
  onData: (certs: PersistedCertificate[]) => void
): Unsubscribe {
  const path = 'certificates';
  const q = isAdminUser
    ? query(collection(db, 'certificates'))
    : query(collection(db, 'certificates'), where('userId', '==', uid));

  return onSnapshot(
    q,
    (snapshot) => {
      const items = snapshot.docs.map((d) => {
        const raw = d.data() as Record<string, unknown>;
        return {
          id: String(raw.id || d.id),
          attemptId: String(raw.resultId || raw.attemptId || ''),
          userId: typeof raw.userId === 'string' ? raw.userId : undefined,
          resultId: typeof raw.resultId === 'string' ? raw.resultId : undefined,
          studentName: String(raw.studentName || ''),
          scope:
            raw.track === 'programming' || raw.track === 'all'
              ? raw.track
              : raw.scope === 'programming' || raw.scope === 'all'
                ? raw.scope
                : 'literacy',
          trackTitle: String(raw.trackTitle || ''),
          score: Number(raw.score || 0),
          total: Number(raw.total || 0),
          percentage: Number(raw.percentage || 0),
          gradeLabel: String(raw.tierLabel || raw.gradeLabel || ''),
          issuedAt: String(raw.issuedAt || ''),
          issuerName: String(raw.issuerName || 'murodillayev_dev'),
        } satisfies PersistedCertificate;
      });
      onData(items);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

export async function loadCurriculumOverride(): Promise<{
  videoLessons?: VideoLessonItem[];
  lessons?: LessonItem[];
  didYouKnowCards?: DidYouKnowItem[];
  examQuestions?: ExamQuestion[];
  glossaryTerms?: GlossaryTerm[];
} | null> {
  const path = 'curriculum/default';
  try {
    const snap = await getDoc(doc(db, 'curriculum', 'default'));
    if (!snap.exists()) return null;
    return snap.data() as {
      videoLessons?: VideoLessonItem[];
      lessons?: LessonItem[];
      didYouKnowCards?: DidYouKnowItem[];
      examQuestions?: ExamQuestion[];
      glossaryTerms?: GlossaryTerm[];
    };
  } catch {
    return null;
  }
}

export async function saveCurriculumOverride(bundle: {
  videoLessons: VideoLessonItem[];
  lessons: LessonItem[];
  didYouKnowCards: DidYouKnowItem[];
  examQuestions: ExamQuestion[];
  glossaryTerms: GlossaryTerm[];
}): Promise<void> {
  const path = 'curriculum/default';
  try {
    await setDoc(doc(db, 'curriculum', 'default'), {
      videoLessons: bundle.videoLessons.slice(0, 100),
      lessons: bundle.lessons.slice(0, 100),
      didYouKnowCards: bundle.didYouKnowCards.slice(0, 100),
      examQuestions: bundle.examQuestions.slice(0, 200),
      glossaryTerms: bundle.glossaryTerms.slice(0, 200),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}
