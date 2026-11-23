import { useEffect, useState } from 'react';
import { Eye, EyeOff, KeyRound, Lock, ShieldCheck, X } from 'lucide-react';

interface AdminLockModalProps {
  open: boolean;
  onClose: () => void;
  onAuthenticated: (token: string) => void;
}

export function AdminLockModal({ open, onClose, onAuthenticated }: AdminLockModalProps) {
  const [statusLoading, setStatusLoading] = useState(true);
  const [configured, setConfigured] = useState<boolean>(true);
  const [passcode, setPasscode] = useState('');
  const [confirmPasscode, setConfirmPasscode] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!open) return;
    setErrorMsg('');
    setPasscode('');
    setConfirmPasscode('');
    setStatusLoading(true);
    fetch('/api/admin/status')
      .then((res) => res.json())
      .then((data: { configured?: boolean }) => {
        setConfigured(Boolean(data.configured));
      })
      .catch(() => {
        setConfigured(true);
      })
      .finally(() => {
        setStatusLoading(false);
      });
  }, [open]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanPass = passcode.trim();
    if (!configured) {
      if (cleanPass.length < 6) {
        setErrorMsg('Admin paroli kamida 6 ta belgidan iborat bo‘lishi kerak.');
        return;
      }
      if (cleanPass !== confirmPasscode.trim()) {
        setErrorMsg('Parollar bir-biriga mos kelmadi.');
        return;
      }
    } else if (!cleanPass) {
      setErrorMsg('Admin parolini kiriting.');
      return;
    }

    setSubmitting(true);
    try {
      const endpoint = configured ? '/api/admin/login' : '/api/admin/claim';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode: cleanPass }),
      });
      const data = (await res.json()) as { token?: string; error?: string };
      if (!res.ok || !data.token) {
        setErrorMsg(data.error || 'Parolni tekshirishda xatolik yuz berdi.');
        return;
      }
      onAuthenticated(data.token);
    } catch {
      setErrorMsg('Server bilan bog‘lanib bo‘lmadi. Qayta urinib ko‘ring.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/80 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Admin panel paroli"
    >
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-900 dark:bg-sky-500 text-white dark:text-slate-950 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {configured ? 'Admin panel himoyalangan' : 'Admin parolini o‘rnatish'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {configured
                  ? 'Kirish uchun maxfiy admin parolini kiriting'
                  : 'Birinchi ishga tushirish · O‘zingizning admin parolingizni belgilang'}
              </p>
            </div>
          </div>
          <button
            type="button"
            aria-label="Yopish"
            onClick={onClose}
            className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5">
          {statusLoading ? (
            <div className="py-6 text-center text-sm text-slate-500">Tekshirilmoqda...</div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {!configured && (
                <div className="p-3 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-900/60 text-xs text-sky-900 dark:text-sky-200 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
                  <span>
                    Hali admin paroli belgilanmagan. Hozir o‘rnatadigan parolingiz serverda
                    shifrlangan holda saqlanadi va keyingi kirishlarda so‘raladi.
                  </span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {configured ? 'Admin paroli' : 'Yangi admin paroli (kamida 6 ta belgi)'}
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    placeholder="Parolni kiriting"
                    autoFocus
                    className="w-full min-h-[44px] pl-9 pr-10 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                    required
                  />
                  <button
                    type="button"
                    aria-label={showPass ? 'Yashirish' : 'Ko‘rsatish'}
                    onClick={() => setShowPass((prev) => !prev)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {!configured && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Parolni tasdiqlang
                  </label>
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={confirmPasscode}
                    onChange={(e) => setConfirmPasscode(e.target.value)}
                    placeholder="Parolni qayta kiriting"
                    className="w-full min-h-[44px] px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                    required
                  />
                </div>
              )}

              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-700 dark:text-rose-300">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full min-h-[46px] inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-slate-900 dark:bg-sky-500 dark:text-slate-950 rounded-xl hover:bg-slate-800 dark:hover:bg-sky-400 disabled:opacity-60 transition-colors cursor-pointer"
              >
                {submitting
                  ? 'Tekshirilmoqda...'
                  : configured
                  ? 'Admin panelga kirish'
                  : 'Parolni saqlash va kirish'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
