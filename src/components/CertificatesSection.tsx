import { useState } from 'react';
import {
  Award,
  CheckCircle2,
  ClipboardCheck,
  Download,
  Lock,
  ShieldCheck,
  XCircle,
} from 'lucide-react';
import type { CertificateRecord } from '../data/curriculum';
import { CertificatePreviewModal } from './CertificatePreviewModal';
import type { ExamAttemptRecord, ExamScope } from './FinalExamSection';

interface CertificatesSectionProps {
  certificates: CertificateRecord[];
  examResults: ExamAttemptRecord[];
  examAttempts: Record<ExamScope, number>;
  maxAttempts: number;
  onGoToExam: () => void;
  onOpenAdmin: () => void;
}

export function CertificatesSection({
  certificates,
  examResults,
  examAttempts,
  maxAttempts,
  onGoToExam,
  onOpenAdmin,
}: CertificatesSectionProps) {
  const [selectedCert, setSelectedCert] = useState<CertificateRecord | null>(null);

  const scopes: Array<{ id: ExamScope; label: string }> = [
    { id: 'literacy', label: 'Kompyuter savodxonligi (20 savol)' },
    { id: 'programming', label: 'Dasturlash asoslari (20 savol)' },
    { id: 'all', label: 'Umumiy katta imtihon (40 savol)' },
  ];

  const passedResults = examResults.filter((r) => r.passed);

  return (
    <section className="py-10 md:py-14 bg-slate-50 dark:bg-slate-950 min-h-[calc(100vh-8rem)]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 mb-1.5">
              Natijalar va rasmiy tasdiq
            </p>
            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white text-balance">
              Sertifikatlarim va Imtihon imkoniyatlari
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-1.5 max-w-2xl">
              Har bir yo‘nalishdan kamida 75% ball to‘plasangiz, Admin panel orqali rasmiy
              sertifikatingiz chiqariladi va shu yerdan yuklab olishingiz mumkin.
            </p>
          </div>

          <button
            type="button"
            onClick={onGoToExam}
            className="min-h-[44px] inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-slate-900 dark:bg-sky-500 dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-sky-400 rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer self-start sm:self-auto"
          >
            <ClipboardCheck className="w-4 h-4 shrink-0" />
            <span>Imtihonga o‘tish</span>
          </button>
        </div>

        {/* Remaining Attempts Grid (3 attempts rule) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {scopes.map((s) => {
            const used = examAttempts[s.id] ?? 0;
            const left = Math.max(0, maxAttempts - used);
            const exhausted = left === 0;
            return (
              <div
                key={s.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5"
              >
                <div className="flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1.5">
                  <span>Imtihon imkoniyati</span>
                  {exhausted && (
                    <span className="inline-flex items-center gap-1 text-rose-600 dark:text-rose-400 font-semibold">
                      <Lock className="w-3.5 h-3.5" />
                      Tugagan
                    </span>
                  )}
                </div>
                <div className="text-sm font-bold text-slate-900 dark:text-white mb-3">
                  {s.label}
                </div>
                <div className="flex items-baseline justify-between gap-2">
                  <span
                    className={`text-2xl font-bold font-mono tabular-nums ${
                      exhausted
                        ? 'text-rose-600 dark:text-rose-400'
                        : 'text-emerald-700 dark:text-emerald-400'
                    }`}
                  >
                    {left} / {maxAttempts}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Ishlatilgan: {used} marta
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Issued Official Certificates */}
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-4">
            Berilgan rasmiy sertifikatlar ({certificates.length} ta)
          </h2>

          {certificates.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 text-center">
              <Award className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">
                {passedResults.length > 0
                  ? 'Siz imtihondan o‘tgansiz! Sertifikat Admin panelda chiqarilishi kutilmoqda.'
                  : 'Hozircha berilgan sertifikat yo‘q'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto mb-5">
                {passedResults.length > 0
                  ? 'Ustoz yoki Admin paneldagi «Sertifikatlar» bo‘limiga kirib, muvaffaqiyatli natija uchun rasmiy sertifikatni darhol chiqarishi mumkin.'
                  : 'Yakuniy imtihonda kamida 75% ball to‘plang. Shundan so‘ng Admin panel orqali rasmiy sertifikatingiz yaratiladi.'}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                {passedResults.length > 0 ? (
                  <button
                    type="button"
                    onClick={onOpenAdmin}
                    className="min-h-[44px] inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    <span>Admin paneldan sertifikat chiqarish</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={onGoToExam}
                    className="min-h-[44px] px-4 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-sky-500 dark:text-slate-950 rounded-xl transition-colors cursor-pointer"
                  >
                    Imtihonni boshlash
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {certificates.map((cert) => (
                <div
                  key={cert.id}
                  className="bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-800 rounded-2xl p-5 flex flex-col justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400 mb-2">
                      <span className="font-mono font-semibold text-emerald-700 dark:text-emerald-400">
                        {cert.id}
                      </span>
                      <span>
                        {new Date(cert.issuedAt).toLocaleDateString('uz-UZ')}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {cert.studentName}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-0.5">
                      {cert.trackTitle}
                    </p>
                  </div>

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
                      <span>Ko‘rish / Yuklash</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Attempt History Table */}
        {examResults.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
              Topshirilgan urinishlar tarixi ({examResults.length} ta)
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
    </section>
  );
}
