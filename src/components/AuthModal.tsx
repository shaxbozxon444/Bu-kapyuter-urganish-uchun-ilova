import { useState } from 'react';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth';
import {
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  LogIn,
  Mail,
  ShieldCheck,
  User,
  UserPlus,
  X,
} from 'lucide-react';
import { auth, googleProvider } from '../firebase';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

function mapAuthErrorToUzbek(code: string): string {
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Login (email) yoki parol noto‘g‘ri. Tekshirib qayta kiriting.';
    case 'auth/email-already-in-use':
      return 'Bu email bilan akkaunt allaqachon ro‘yxatdan o‘tgan. Kirish bo‘limidan foydalaning.';
    case 'auth/invalid-email':
      return 'Email manzili formati noto‘g‘ri (masalan: ism@gmail.com).';
    case 'auth/weak-password':
      return 'Parol juda oddiy. Kamida 6 ta belgi kiriting.';
    case 'auth/too-many-requests':
      return 'Juda ko‘p urinish bo‘ldi. Biroz kutib qayta urinib ko‘ring.';
    case 'auth/popup-closed-by-user':
      return 'Google oynasi yopildi. Qayta urinib ko‘ring.';
    case 'auth/operation-not-allowed':
      return 'Email/Parol kirishi Firebase Console da hali yoqilmagan. Hozircha «Google orqali kirish» tugmasidan foydalanishingiz yoki Firebase Console > Authentication > Sign-in method bo‘limidan Email/Password ni yoqishingiz mumkin.';
    default:
      return 'Tizimga kirishda xatolik yuz berdi. Qayta urinib ko‘ring.';
  }
}

export function AuthModal({ open, onClose, onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register' | 'reset'>('login');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');

  if (!open) return null;

  const resetMessages = () => {
    setErrorMsg('');
    setInfoMsg('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setErrorMsg('Email manzilini kiriting.');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'reset') {
        await sendPasswordResetEmail(auth, cleanEmail);
        setInfoMsg('Parolni tiklash havolasi emailingizga yuborildi.');
        setLoading(false);
        return;
      }

      if (password.length < 6) {
        setErrorMsg('Parol kamida 6 ta belgidan iborat bo‘lishi kerak.');
        setLoading(false);
        return;
      }

      if (mode === 'register') {
        const cleanName = fullName.trim();
        if (cleanName.length < 2) {
          setErrorMsg('Ism va familiyangizni kiriting.');
          setLoading(false);
          return;
        }
        const cred = await createUserWithEmailAndPassword(auth, cleanEmail, password);
        await updateProfile(cred.user, { displayName: cleanName });
        try {
          await sendEmailVerification(cred.user);
        } catch {
          // Optional verification email failure should not block account creation
        }
        onSuccess?.();
        onClose();
      } else {
        await signInWithEmailAndPassword(auth, cleanEmail, password);
        onSuccess?.();
        onClose();
      }
    } catch (err: unknown) {
      const code =
        typeof err === 'object' && err !== null && 'code' in err
          ? String((err as { code?: string }).code)
          : '';
      setErrorMsg(mapAuthErrorToUzbek(code));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    resetMessages();
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      onSuccess?.();
      onClose();
    } catch (err: unknown) {
      const code =
        typeof err === 'object' && err !== null && 'code' in err
          ? String((err as { code?: string }).code)
          : '';
      setErrorMsg(mapAuthErrorToUzbek(code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/75 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Akkauntga kirish"
    >
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {mode === 'login'
                ? 'Akkauntga kirish'
                : mode === 'register'
                ? 'Yangi akkaunt yaratish'
                : 'Parolni tiklash'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              murodillayev_dev · Natijalar doimiy saqlanadi
            </p>
          </div>
          <button
            type="button"
            aria-label="Oynani yopish"
            onClick={onClose}
            className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Persistence Reassurance */}
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-xs text-emerald-900 dark:text-emerald-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <span>
              Akkauntingiz bulutli ma’lumotlar bazasida saqlanadi: darslar, yechilgan masalalar,
              imtihon urinishlari va sertifikatlar o‘chib ketmaydi.
            </span>
          </div>

          {mode !== 'reset' && (
            <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  resetMessages();
                }}
                className={`min-h-[40px] inline-flex items-center justify-center gap-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  mode === 'login'
                    ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Kirish</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  resetMessages();
                }}
                className={`min-h-[40px] inline-flex items-center justify-center gap-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  mode === 'register'
                    ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Ro‘yxatdan o‘tish</span>
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Ism va familiya (sertifikatda chiqadi)
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Masalan: Jasurbek Alimov"
                    maxLength={100}
                    className="w-full min-h-[44px] pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Login (Email manzil)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ism@gmail.com"
                  maxLength={150}
                  className="w-full min-h-[44px] pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                />
              </div>
            </div>

            {mode !== 'reset' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Parol
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => {
                        setMode('reset');
                        resetMessages();
                      }}
                      className="text-[11px] font-medium text-sky-700 dark:text-sky-400 hover:underline cursor-pointer"
                    >
                      Parolni unutdingizmi?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Kamida 6 ta belgi"
                    minLength={6}
                    maxLength={128}
                    className="w-full min-h-[44px] pl-9 pr-10 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                    required
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? 'Parolni yashirish' : 'Parolni ko‘rsatish'}
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-700 dark:text-rose-300">
                {errorMsg}
              </div>
            )}

            {infoMsg && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{infoMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full min-h-[46px] inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-slate-900 dark:bg-sky-500 dark:text-slate-950 rounded-xl hover:bg-slate-800 dark:hover:bg-sky-400 disabled:opacity-60 transition-colors cursor-pointer"
            >
              {loading
                ? 'Kutilmoqda...'
                : mode === 'login'
                ? 'Akkauntga kirish'
                : mode === 'register'
                ? 'Ro‘yxatdan o‘tish'
                : 'Tiklash havolasini yuborish'}
            </button>

            {mode === 'reset' && (
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  resetMessages();
                }}
                className="w-full min-h-[40px] text-xs font-medium text-slate-600 dark:text-slate-300 hover:underline cursor-pointer"
              >
                Kirish oynasiga qaytish
              </button>
            )}
          </form>

          <div className="relative py-1">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-800" />
            </div>
            <div className="relative flex justify-center text-[11px] uppercase">
              <span className="px-2 bg-white dark:bg-slate-900 text-slate-400">yoki</span>
            </div>
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={handleGoogleSignIn}
            className="w-full min-h-[44px] inline-flex items-center justify-center gap-2.5 px-4 py-2 text-sm font-semibold text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24Z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14Z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96Z"
              />
            </svg>
            <span>Google orqali tezkor kirish</span>
          </button>
        </div>
      </div>
    </div>
  );
}
