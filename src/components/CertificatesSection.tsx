import { useEffect, useState } from 'react';
import {
  Award,
  Camera,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  Download,
  Lock,
  ShieldCheck,
  XCircle,
} from 'lucide-react';
import type { CertificateRecord } from '../data/curriculum';
import { formatRemainingCountdown, isExamScopeLocked } from '../utils/examCooldown';
import { CertificateBuilderModal } from './CertificateBuilderModal';
import { CertificatePreviewModal } from './CertificatePreviewModal';
import type { ExamAttemptRecord, ExamScope } from './FinalExamSection';

interface CertificatesSectionProps {
  certificates: CertificateRecord[];
  examResults: ExamAttemptRecord[];
  examAttempts: Record<ExamScope, number>;
  examLockedUntil: Record<ExamScope, number>;
  maxAttempts: number;
  readinessSummary?: {
    lessonsDone: number;
    lessonsTotal: number;
    videosDone: number;
    videosTotal: number;
    challengesDone: number;
    challengesTotal: number;
  };
  defaultStudentName?: string;
  onCreateCertificate?: (cert: CertificateRecord) => Promise<void> | void;
  onGoToExam: (scope?: ExamScope) => void;
}

export function CertificatesSection({
  certificates,
  examResults,
  examAttempts,
  examLockedUntil,
  maxAttempts,
  readinessSummary,
  defaultStudentName = '',
  onCreateCertificate,
  onGoToExam,
}: CertificatesSectionProps) {
  const [selectedCert, setSelectedCert] = useState<CertificateRecord | null>(null);
  const [builderAttempt, setBuilderAttempt] = useState<ExamAttemptRecord | null>(null);
  const [nowMs, setNowMs] = useState(() => Date.now());

  const hasAnyLock =
    isExamScopeLocked(examLockedUntil.literacy, nowMs) ||
    isExamScopeLocked(examLockedUntil.programming, nowMs) ||
    isExamScopeLocked(examLockedUntil.all, nowMs);

  useEffect(() => {
    if (!hasAnyLock) return;
    const t = window.setInterval(() => setNowMs(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, [hasAnyLock]);

  const scopes: Array<{ id: ExamScope; label: string }> = [
    { id: 'literacy', label: 'Kompyuter savodxonligi' },
    { id: 'programming', label: 'Dasturlash asoslari' },
    { id: 'all', label: 'Umumiy imtihon' },
  ];

  const passedWithoutCert = examResults.filter(
    (r) => r.passed && !certificates.some((c) => c.attemptId === r.id)
  );

  const totalLearningItems = readinessSummary
    ? readinessSummary.lessonsTotal + readinessSummary.videosTotal + readinessSummary.challengesTotal
    : 0;
  const doneLearningItems = readinessSummary
    ? readinessSummary.lessonsDone + readinessSummary.videosDone + readinessSummary.challengesDone
    : 0;
  const learningPct =
    totalLearningItems > 0 ? Math.round((doneLearningItems / totalLearningItems) * 100) : 0;

  return (
    <section className="py-8 md:py-12 bg-slate-50 dark:bg-slate-950 min-h-[calc(100vh-8rem)]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-7">
        {/* Clean Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-xs sm:text-sm font-semibold text-emerald-700 dark:text-emerald-400 mb-1">
              Shaxsiy kabinet · Natija va ruxsat tekshiruvi
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white text-balance">
              Natijalarim, Imkoniyatlar va Sertifikatlar
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl">
              Imtihonga kirishdan oldin qolgan imkoniyatingiz va tayyorgarligingizni tekshiring.
              Imtihondan o‘tsangiz, darhol rasm holatda sertifikat chiqarishingiz mumkin.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onGoToExam()}
            className="min-h-[44px] inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-slate-900 dark:bg-sky-500 dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-sky-400 rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer self-start sm:self-auto"
          >
            <ClipboardCheck className="w-4 h-4 shrink-0" />
            <span>Imtihonga kirish</span>
          </button>
        </div>

        {/* Learning Readiness Summary Bar */}
        {readinessSummary && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-sm font-bold text-slate-900 dark:text-white">
                O‘quv tayyorgarligingiz
              </div>
              <div className="text-xs font-mono font-bold tabular-nums text-sky-700 dark:text-sky-400">
                {learningPct}% o‘zlashtirilgan
              </div>
            </div>
            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-600 transition-all duration-300"
                style={{ width: `${learningPct}%` }}
              />
            </div>
            <div className="grid grid-cols-3 gap-3 pt-1 text-center sm:text-left">
              <div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">Videodarslar</div>
                <div className="text-sm sm:text-base font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                  {readinessSummary.videosDone} / {readinessSummary.videosTotal}
                </div>
              </div>
              <div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">Mini-darslar</div>
                <div className="text-sm sm:text-base font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                  {readinessSummary.lessonsDone} / {readinessSummary.lessonsTotal}
                </div>
              </div>
              <div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">Qiyin masalalar</div>
                <div className="text-sm sm:text-base font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                  {readinessSummary.challengesDone} / {readinessSummary.challengesTotal}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Exam Eligibility & Attempts Check Grid */}
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-3">
            Imtihon imkoniyatini tekshirish (Har yo‘nalishda 3 ta urinish)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {scopes.map((s) => {
              const lockedUntil = examLockedUntil[s.id] ?? 0;
              const locked = isExamScopeLocked(lockedUntil, nowMs);
              const used = locked ? maxAttempts : (examAttempts[s.id] ?? 0);
              const left = locked ? 0 : Math.max(0, maxAttempts - used);
              const eligible = !locked && left > 0;

              const scopeAttempts = examResults.filter((r) => r.examScope === s.id);
              const best = scopeAttempts.reduce<ExamAttemptRecord | null>((acc, curr) => {
                if (!acc) return curr;
                return curr.score / Math.max(1, curr.total) > acc.score / Math.max(1, acc.total)
                  ? curr
                  : acc;
              }, null);

              return (
                <div
                  key={s.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex flex-col justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 text-xs mb-1.5">
                      <span className="text-slate-500 dark:text-slate-400">Imkoniyat holati</span>
                      {locked ? (
                        <span className="inline-flex items-center gap-1 text-rose-600 dark:text-rose-400 font-semibold">
                          <Clock className="w-3.5 h-3.5" />
                          24 soatlik blok
                        </span>
                      ) : eligible ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-semibold">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          Ruxsat bor
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-rose-600 dark:text-rose-400 font-semibold">
                          <Lock className="w-3.5 h-3.5" />
                          Tugagan
                        </span>
                      )}
                    </div>

                    <div className="text-base font-bold text-slate-900 dark:text-white mb-3">
                      {s.label}
                    </div>

                    <div className="flex items-baseline justify-between gap-2">
                      <span
                        className={`text-2xl font-bold font-mono tabular-nums ${
                          !eligible
                            ? 'text-rose-600 dark:text-rose-400'
                            : 'text-emerald-700 dark:text-emerald-400'
                        }`}
                      >
                        {left} / {maxAttempts}
                      </span>
                      <span className="text-xs font-mono tabular-nums text-slate-500 dark:text-slate-400">
                        {locked
                          ? `Ochiladi: ${formatRemainingCountdown(lockedUntil, nowMs)}`
                          : best
                            ? `Eng yaxshi: ${best.score}/${best.total}`
                            : 'Hali topshirilmagan'}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={!eligible}
                    onClick={() => onGoToExam(s.id)}
                    className={`w-full min-h-[42px] px-4 py-2 text-xs font-semibold rounded-xl transition-colors ${
                      eligible
                        ? 'bg-slate-900 dark:bg-sky-500 text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-sky-400 cursor-pointer'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    {locked
                      ? '24 soatdan keyin ochiladi'
                      : eligible
                        ? 'Tekshirildi · Imtihonga kirish'
                        : 'Imkoniyat tugagan'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Ready-to-claim passed attempts without certificate */}
        {passedWithoutCert.length > 0 && (
          <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-4 sm:p-5 space-y-3">
            <div className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
              Sertifikat chiqarishga tayyor natijalar ({passedWithoutCert.length} ta)
            </div>
            <div className="space-y-2.5">
              {passedWithoutCert.map((r) => {
                const pct = r.total > 0 ? Math.round((r.score / r.total) * 100) : 0;
                return (
                  <div
                    key={r.id}
                    className="bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white">
                        {r.examScope === 'programming'
                          ? 'Dasturlash asoslari'
                          : r.examScope === 'all'
                            ? 'Umumiy imtihon'
                            : 'Kompyuter savodxonligi'}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums mt-0.5">
                        Ball: {r.score}/{r.total} ({pct}%) · {new Date(r.completedAt).toLocaleDateString('uz-UZ')}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setBuilderAttempt(r)}
                      className="min-h-[42px] inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <Camera className="w-4 h-4 shrink-0" />
                      <span>Ism va rasm bilan sertifikat chiqarish</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Issued Image Certificates */}
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-3">
            Olingan rasm sertifikatlar ({certificates.length} ta)
          </h2>

          {certificates.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-center">
              <Award className="w-9 h-9 text-slate-400 mx-auto mb-2.5" />
              <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white mb-1">
                Hozircha rasm sertifikat chiqarilmagan
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                Imtihondan kamida 75% ball to‘plashingiz bilan ism-familiyangiz va rasmingizni
                qo‘yib rasm sertifikat chiqarishingiz mumkin.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {certificates.map((cert) => (
                <div
                  key={cert.id}
                  className="bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5">
                    {cert.photoDataUrl && (
                      <img
                        src={cert.photoDataUrl}
                        alt={cert.studentName}
                        className="w-14 h-14 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
                        <span className="font-mono font-semibold text-emerald-700 dark:text-emerald-400">
                          {cert.id}
                        </span>
                        <span>{new Date(cert.issuedAt).toLocaleDateString('uz-UZ')}</span>
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">
                        {cert.studentName}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-0.5">
                        {cert.trackTitle}
                      </p>
                    </div>
                  </div>

                  {cert.aiNote && (
                    <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-950 rounded-lg p-2.5">
                      {cert.aiNote}
                    </p>
                  )}

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                    <div className="text-xs font-mono tabular-nums text-slate-700 dark:text-slate-200">
                      Natija: <span className="font-bold">{cert.score}/{cert.total}</span> (
                      {cert.percentage}%)
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedCert(cert)}
                      className="min-h-[40px] inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 shrink-0" />
                      <span>Rasmni ko‘rish / Yuklash</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Attempt History */}
        {examResults.length > 0 && (
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-3">
              Topshirilgan imtihonlar tarixi ({examResults.length} ta)
            </h2>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-semibold text-slate-500 dark:text-slate-400">
                      <th className="py-3 px-4">O‘quvchi</th>
                      <th className="py-3 px-4">Yo‘nalish</th>
                      <th className="py-3 px-4">Ball</th>
                      <th className="py-3 px-4">Holat</th>
                      <th className="py-3 px-4 text-right">Sana</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-sm">
                    {examResults.map((r) => (
                      <tr key={r.id}>
                        <td className="py-3 px-4 font-medium text-slate-900 dark:text-white">
                          {r.studentName}
                        </td>
                        <td className="py-3 px-4 text-xs text-slate-600 dark:text-slate-300">
                          {r.examScope === 'programming'
                            ? 'Dasturlash asoslari'
                            : r.examScope === 'all'
                              ? 'Umumiy imtihon'
                              : 'Kompyuter savodxonligi'}
                        </td>
                        <td className="py-3 px-4 font-mono tabular-nums font-semibold">
                          {r.score} / {r.total}
                        </td>
                        <td className="py-3 px-4 text-xs font-semibold">
                          {r.passed ? (
                            <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              O‘tdi
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-rose-700 dark:text-rose-400">
                              <XCircle className="w-3.5 h-3.5" />
                              O‘tmadi
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right text-xs font-mono tabular-nums text-slate-500">
                          {new Date(r.completedAt).toLocaleDateString('uz-UZ')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {selectedCert && (
        <CertificatePreviewModal
          certificate={selectedCert}
          onClose={() => setSelectedCert(null)}
        />
      )}

      {builderAttempt && (
        <CertificateBuilderModal
          attempt={builderAttempt}
          defaultFullName={defaultStudentName}
          onCertificateReady={async (cert) => {
            if (onCreateCertificate) {
              await onCreateCertificate(cert);
            }
          }}
          onClose={() => setBuilderAttempt(null)}
        />
      )}
    </section>
  );
}
