import { useState, type ChangeEvent, type FormEvent } from 'react';
import {
  AlertCircle,
  Award,
  Bot,
  Camera,
  CheckCircle2,
  Download,
  Loader2,
  Share2,
  Trash2,
  User,
  X,
} from 'lucide-react';
import type { CertificateRecord } from '../data/curriculum';
import { compressPortraitPhoto, renderCertificateImage } from '../utils/certificateCanvas';
import type { ExamAttemptRecord } from './FinalExamSection';

interface CertificateBuilderModalProps {
  attempt: ExamAttemptRecord;
  defaultFullName?: string;
  onCertificateReady: (cert: CertificateRecord) => Promise<void> | void;
  onClose: () => void;
}

function splitInitialNames(rawName?: string): { first: string; last: string } {
  const cleaned = (rawName || '').trim();
  if (!cleaned || cleaned === 'Mehmon o‘quvchi' || cleaned === 'O‘quvchi') {
    return { first: '', last: '' };
  }
  const parts = cleaned.split(/\s+/);
  if (parts.length === 1) {
    return { first: parts[0], last: '' };
  }
  return { first: parts[0], last: parts.slice(1).join(' ') };
}

export function CertificateBuilderModal({
  attempt,
  defaultFullName,
  onCertificateReady,
  onClose,
}: CertificateBuilderModalProps) {
  const initial = splitInitialNames(
    attempt.studentName && attempt.studentName !== 'Mehmon o‘quvchi'
      ? attempt.studentName
      : defaultFullName
  );

  const [firstName, setFirstName] = useState(initial.first);
  const [lastName, setLastName] = useState(initial.last);
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [aiStatusNote, setAiStatusNote] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [generatedCert, setGeneratedCert] = useState<CertificateRecord | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [downloaded, setDownloaded] = useState(false);

  const pct =
    attempt.total > 0 ? Math.round((attempt.score / attempt.total) * 100) : 0;

  const trackTitle =
    attempt.examScope === 'programming'
      ? 'Dasturlash asoslari'
      : attempt.examScope === 'all'
        ? 'Kompyuter savodxonligi va Dasturlash asoslari'
        : 'Kompyuter savodxonligi';

  const handlePhotoChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoError(null);
    setFormError(null);
    try {
      const compressed = await compressPortraitPhoto(file);
      setPhotoDataUrl(compressed);
    } catch (err) {
      setPhotoError(
        err instanceof Error ? err.message : 'Rasmni yuklashda xatolik yuz berdi.'
      );
    }
  };

  const buildCertificate = async (allowWithoutPhoto: boolean) => {
    setFormError(null);
    setAiStatusNote(null);

    const cleanFirst = firstName.trim();
    const cleanLast = lastName.trim();
    if (!cleanFirst || !cleanLast) {
      setFormError('Iltimos, sertifikat uchun ism va familiyangizni to‘liq kiriting.');
      return;
    }
    if (!photoDataUrl && !allowWithoutPhoto) {
      setFormError('Iltimos, sertifikat uchun rasmingizni yuklang.');
      return;
    }

    const fullName = `${cleanFirst} ${cleanLast}`.slice(0, 100);
    setGenerating(true);

    let aiSummary: string | undefined;
    try {
      const res = await fetch('/api/ai-certificate-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: fullName,
          trackTitle,
          score: attempt.score,
          total: attempt.total,
          percentage: pct,
          literacyScore: attempt.literacyScore,
          literacyTotal: attempt.literacyTotal,
          programmingScore: attempt.programmingScore,
          programmingTotal: attempt.programmingTotal,
        }),
      });
      const data = (await res.json()) as { summary?: string; error?: string };
      if (res.ok && data.summary) {
        aiSummary = data.summary.trim();
      } else if (data.error) {
        setAiStatusNote(data.error);
      }
    } catch {
      setAiStatusNote(
        'AI yordamchi bilan bog‘lanib bo‘lmadi, sertifikat natijalaringiz asosida tayyorlandi.'
      );
    }

    try {
      const certId = `CC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const cert: CertificateRecord = {
        id: certId,
        attemptId: attempt.id,
        studentName: fullName,
        scope: attempt.examScope,
        trackTitle,
        score: attempt.score,
        total: attempt.total,
        percentage: Math.max(75, pct),
        gradeLabel: attempt.tierLabel,
        issuedAt: new Date().toISOString(),
        issuerName: 'BilimKod · murodillayev_dev',
        aiNote: aiSummary,
        hasPhoto: Boolean(photoDataUrl),
        photoDataUrl: photoDataUrl || undefined,
      };

      const pngUrl = await renderCertificateImage(cert);
      await onCertificateReady(cert);
      setGeneratedCert(cert);
      setGeneratedImageUrl(pngUrl);
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : 'Sertifikat rasmini yaratishda xatolik yuz berdi.'
      );
    } finally {
      setGenerating(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    void buildCertificate(false);
  };

  const handleDownload = () => {
    if (!generatedImageUrl || !generatedCert) return;
    const a = document.createElement('a');
    a.href = generatedImageUrl;
    a.download = `BilimKod_Sertifikat_${generatedCert.id}.png`;
    a.click();
    setDownloaded(true);
    window.setTimeout(() => setDownloaded(false), 3000);
  };

  const handleShare = async () => {
    if (!generatedImageUrl || !generatedCert || !navigator.share) return;
    try {
      const res = await fetch(generatedImageUrl);
      const blob = await res.blob();
      const file = new File([blob], `BilimKod_Sertifikat_${generatedCert.id}.png`, {
        type: 'image/png',
      });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `BilimKod Sertifikat — ${generatedCert.studentName}`,
          text: `${generatedCert.trackTitle} yo‘nalishi bo‘yicha ${generatedCert.percentage}% natija!`,
          files: [file],
        });
      }
    } catch {
      // User cancelled share sheet
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="Rasm sertifikat yaratish"
    >
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-xl my-auto">
        {/* Header */}
        <div className="px-4 sm:px-6 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
            <Award className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              {generatedCert
                ? `Tayyor rasm sertifikat · ${generatedCert.id}`
                : 'Sertifikatni rasm holatda chiqarish'}
            </span>
          </div>
          <button
            type="button"
            aria-label="Yopish"
            onClick={onClose}
            className="min-h-[42px] min-w-[42px] -mr-2 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!generatedCert || !generatedImageUrl ? (
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5">
            {/* Verified Exam Result Strip */}
            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold">
                  Tasdiqlangan imtihon natijasi
                </div>
                <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                  {trackTitle}
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold font-mono tabular-nums text-emerald-700 dark:text-emerald-300">
                  {attempt.score} / {attempt.total} ({pct}%)
                </div>
                <div className="text-[11px] text-slate-600 dark:text-slate-400">
                  {attempt.tierLabel}
                </div>
              </div>
            </div>

            {/* First & Last Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label
                  htmlFor="cert-first-name"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5"
                >
                  Ismingiz
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="cert-first-name"
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Masalan: Jasur"
                    className="w-full min-h-[44px] pl-9 pr-3 py-2 text-base sm:text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="cert-last-name"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5"
                >
                  Familiyangiz
                </label>
                <input
                  id="cert-last-name"
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Masalan: Aliyev"
                  className="w-full min-h-[44px] px-3.5 py-2 text-base sm:text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Portrait Photo Upload */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
                O‘quvchi rasmi (Sertifikat burchagiga qo‘yiladi)
              </label>

              <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-dashed border-slate-300 dark:border-slate-700">
                <div className="w-24 h-24 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden flex items-center justify-center shrink-0">
                  {photoDataUrl ? (
                    <img
                      src={photoDataUrl}
                      alt="Yuklangan o‘quvchi rasmi"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Camera className="w-8 h-8 text-slate-400" />
                  )}
                </div>

                <div className="flex-1 text-center sm:text-left space-y-2">
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Telefon galereyasidan yoki kameradan o‘zingizning aniq rasmingizni tanlang.
                    Rasm avtomatik kvadrat shaklga keltirilib sertifikatga joylanadi.
                  </p>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <label className="min-h-[40px] inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-sky-500 dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-sky-400 rounded-lg cursor-pointer transition-colors">
                      <Camera className="w-3.5 h-3.5 shrink-0" />
                      <span>{photoDataUrl ? 'Rasmni almashtirish' : 'Rasm tanlash'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => void handlePhotoChange(e)}
                        className="sr-only"
                      />
                    </label>
                    {photoDataUrl && (
                      <button
                        type="button"
                        onClick={() => setPhotoDataUrl(null)}
                        className="min-h-[40px] inline-flex items-center gap-1 px-3 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 rounded-lg cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Olib tashlash</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
              {photoError && (
                <p className="mt-1.5 text-xs text-rose-600 dark:text-rose-400">{photoError}</p>
              )}
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 flex items-start gap-2 text-xs text-rose-700 dark:text-rose-300">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="space-y-1.5">
                  <div>{formError}</div>
                  {!photoDataUrl && firstName.trim() && lastName.trim() && (
                    <button
                      type="button"
                      onClick={() => void buildCertificate(true)}
                      className="underline font-semibold cursor-pointer"
                    >
                      Hozircha rasmsiz yaratish
                    </button>
                  )}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-slate-200 dark:border-slate-800">
              <div className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <Bot className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
                <span>AI yordamchi natijangizga mos rasmiy xulosa yozadi</span>
              </div>

              <button
                type="submit"
                disabled={generating}
                className="min-h-[46px] inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                {generating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                    <span>Sertifikat tayyorlanmoqda...</span>
                  </>
                ) : (
                  <>
                    <Award className="w-4 h-4 shrink-0" />
                    <span>Rasm sertifikatni chiqarish</span>
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="p-4 sm:p-6 space-y-4">
            {aiStatusNote && (
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300">
                {aiStatusNote}
              </div>
            )}

            <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950">
              <img
                src={generatedImageUrl}
                alt={`${generatedCert.studentName} rasmiy sertifikati`}
                className="w-full h-auto block"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2.5">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownload}
                  className="min-h-[44px] inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors cursor-pointer"
                >
                  {downloaded ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>Saqlandi (PNG)</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 shrink-0" />
                      <span>Rasmni yuklab olish (PNG)</span>
                    </>
                  )}
                </button>

                {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
                  <button
                    type="button"
                    onClick={() => void handleShare()}
                    className="min-h-[44px] inline-flex items-center gap-1.5 px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
                  >
                    <Share2 className="w-4 h-4 shrink-0" />
                    <span>Ulashish</span>
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={onClose}
                className="min-h-[44px] px-4 py-2.5 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                Tayyor, yopish
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
