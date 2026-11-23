import { useState } from 'react';
import { Award, CheckCircle2, Download, Printer, ShieldCheck, X } from 'lucide-react';
import type { CertificateRecord } from '../data/curriculum';

interface CertificatePreviewModalProps {
  certificate: CertificateRecord;
  onClose: () => void;
}

export function CertificatePreviewModal({ certificate, onClose }: CertificatePreviewModalProps) {
  const [downloaded, setDownloaded] = useState(false);

  const formattedDate = new Date(certificate.issuedAt).toLocaleDateString('uz-UZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const isProg = certificate.scope === 'programming';
  const accentHex = isProg ? '#4f46e5' : certificate.scope === 'all' ? '#059669' : '#0284c7';

  const handleDownloadPng = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1600;
    canvas.height = 1130;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 1600, 1130);

    // Subtle corner tint
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(48, 48, 1504, 1034);

    // Outer thick frame
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 10;
    ctx.strokeRect(48, 48, 1504, 1034);

    // Inner accent frame
    ctx.strokeStyle = accentHex;
    ctx.lineWidth = 3;
    ctx.strokeRect(72, 72, 1456, 986);

    // Top accent bar inside frame
    ctx.fillStyle = accentHex;
    ctx.fillRect(72, 72, 1456, 16);

    // Brand wordmark
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 34px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('murodillayev_dev', 800, 165);

    ctx.fillStyle = '#64748b';
    ctx.font = '600 20px "Plus Jakarta Sans", sans-serif';
    ctx.fillText("KOMPYUTER SAVODXONLIGI VA DASTURLASH TA'LIM PLATFORMASI", 800, 205);

    // Main title
    ctx.fillStyle = accentHex;
    ctx.font = 'bold 74px Outfit, sans-serif';
    ctx.fillText('SERTIFIKAT', 800, 320);

    ctx.fillStyle = '#475569';
    ctx.font = '500 26px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Ushbu rasmiy hujjat quyidagi o‘quvchiga taqdim etiladi:', 800, 385);

    // Student Name
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 62px Outfit, sans-serif';
    ctx.fillText(certificate.studentName, 800, 485);

    // Underline under name
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(360, 515);
    ctx.lineTo(1240, 515);
    ctx.stroke();

    // Description
    ctx.fillStyle = '#334155';
    ctx.font = '500 28px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(
      `«${certificate.trackTitle}» yo‘nalishi bo‘yicha barcha o‘quv dasturi`,
      800,
      585
    );
    ctx.fillText(
      'hamda yakuniy nazorat imtihonini muvaffaqiyatli tamomlaganligi uchun berildi.',
      800,
      628
    );

    // Score Summary Box
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(320, 685, 960, 128);
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 2;
    ctx.strokeRect(320, 685, 960, 128);

    // 3 metrics inside box
    const colCenters = [480, 800, 1120];
    const labels = ['TO‘PLANGAN BALL', 'DARAJA', 'SERTIFIKAT RAQAMI'];
    const values = [
      `${certificate.score} / ${certificate.total} (${certificate.percentage}%)`,
      certificate.gradeLabel,
      certificate.id,
    ];

    colCenters.forEach((cx, i) => {
      ctx.fillStyle = '#64748b';
      ctx.font = '600 18px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(labels[i], cx, 730);

      ctx.fillStyle = i === 1 ? accentHex : '#0f172a';
      ctx.font = 'bold 30px "JetBrains Mono", monospace';
      ctx.fillText(values[i], cx, 778);
    });

    // Footer Signatures
    ctx.textAlign = 'left';
    ctx.fillStyle = '#64748b';
    ctx.font = '500 20px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('BERILGAN SANA', 150, 935);
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 26px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(formattedDate, 150, 975);

    ctx.textAlign = 'right';
    ctx.fillStyle = '#64748b';
    ctx.font = '500 20px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('PLATFORMASI RAHBARI / USTOZ', 1450, 935);
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 26px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(certificate.issuerName, 1450, 975);

    // Center seal circle
    ctx.textAlign = 'center';
    ctx.beginPath();
    ctx.arc(800, 945, 58, 0, Math.PI * 2);
    ctx.fillStyle = accentHex;
    ctx.fill();
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px Outfit, sans-serif';
    ctx.fillText('TASDIQLANGAN', 800, 942);
    ctx.font = '600 16px "JetBrains Mono", monospace';
    ctx.fillText(`${certificate.percentage}%`, 800, 968);

    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `Sertifikat_${certificate.id}.png`;
    a.click();
    setDownloaded(true);
    window.setTimeout(() => setDownloaded(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-4xl overflow-hidden shadow-xl my-auto">
        {/* Modal Action Bar */}
        <div className="px-4 sm:px-6 py-3.5 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
            <Award className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Rasmiy sertifikat · {certificate.id}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadPng}
              className="min-h-[42px] inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {downloaded ? (
                <>
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Yuklab olindi</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 shrink-0" />
                  <span>PNG yuklash</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="min-h-[42px] inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-800 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Printer className="w-4 h-4 shrink-0" />
              <span>Chop etish / PDF</span>
            </button>

            <button
              type="button"
              aria-label="Yopish"
              onClick={onClose}
              className="min-h-[42px] min-w-[42px] flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Certificate Canvas */}
        <div className="p-4 sm:p-6 bg-slate-100 dark:bg-slate-950 overflow-x-auto">
          <div
            id="certificate-print-area"
            className="bg-white text-slate-900 border-[6px] border-slate-900 p-3 sm:p-5 mx-auto max-w-3xl"
          >
            <div
              className={`border-2 p-6 sm:p-10 relative ${
                isProg
                  ? 'border-indigo-600'
                  : certificate.scope === 'all'
                    ? 'border-emerald-600'
                    : 'border-sky-600'
              }`}
            >
              {/* Top Accent Bar */}
              <div
                className={`h-2 w-full mb-6 ${
                  isProg
                    ? 'bg-indigo-600'
                    : certificate.scope === 'all'
                      ? 'bg-emerald-600'
                      : 'bg-sky-600'
                }`}
              />

              <div className="text-center space-y-2 mb-6">
                <div
                  className="text-base sm:text-lg font-bold tracking-tight text-slate-900"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  murodillayev_dev
                </div>
                <p className="text-[11px] font-semibold tracking-wider text-slate-500">
                  KOMPYUTER SAVODXONLIGI VA DASTURLASH TA’LIM PLATFORMASI
                </p>
              </div>

              <div className="text-center mb-6">
                <h2
                  className={`text-3xl sm:text-5xl font-bold tracking-wide mb-3 ${
                    isProg
                      ? 'text-indigo-700'
                      : certificate.scope === 'all'
                        ? 'text-emerald-700'
                        : 'text-sky-700'
                  }`}
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  SERTIFIKAT
                </h2>
                <p className="text-xs sm:text-sm text-slate-600">
                  Ushbu rasmiy hujjat quyidagi o‘quvchiga muvaffaqiyatli yakunlaganligi uchun taqdim
                  etiladi:
                </p>
              </div>

              <div className="text-center pb-3 border-b-2 border-slate-200 max-w-lg mx-auto mb-6">
                <div
                  className="text-2xl sm:text-4xl font-bold text-slate-900"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {certificate.studentName}
                </div>
              </div>

              <p className="text-center text-sm sm:text-base text-slate-700 max-w-xl mx-auto leading-relaxed mb-7">
                «<span className="font-semibold text-slate-900">{certificate.trackTitle}</span>»
                yo‘nalishi bo‘yicha o‘quv dasturini hamda yakuniy nazorat imtihonini muvaffaqiyatli
                topshirganligini tasdiqlaydi.
              </p>

              {/* Metrics Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border border-slate-200 bg-slate-50 rounded-xl p-4 text-center mb-8">
                <div>
                  <div className="text-[11px] font-semibold text-slate-500">TO‘PLANGAN BALL</div>
                  <div className="text-base sm:text-lg font-bold font-mono tabular-nums text-slate-900 mt-0.5">
                    {certificate.score} / {certificate.total} ({certificate.percentage}%)
                  </div>
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-slate-500">BAHOLASH DARAJASI</div>
                  <div
                    className={`text-base sm:text-lg font-bold mt-0.5 ${
                      isProg
                        ? 'text-indigo-700'
                        : certificate.scope === 'all'
                          ? 'text-emerald-700'
                          : 'text-sky-700'
                    }`}
                  >
                    {certificate.gradeLabel}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-slate-500">SERTIFIKAT ID</div>
                  <div className="text-base sm:text-lg font-bold font-mono tabular-nums text-slate-900 mt-0.5">
                    {certificate.id}
                  </div>
                </div>
              </div>

              {/* Footer Signatures & Seal */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4 border-t border-slate-200">
                <div className="text-center sm:text-left">
                  <div className="text-[11px] font-semibold text-slate-500">BERILGAN SANA</div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">{formattedDate}</div>
                </div>

                <div
                  className={`w-20 h-20 rounded-full border-4 border-slate-900 flex flex-col items-center justify-center text-white shrink-0 ${
                    isProg
                      ? 'bg-indigo-600'
                      : certificate.scope === 'all'
                        ? 'bg-emerald-600'
                        : 'bg-sky-600'
                  }`}
                >
                  <ShieldCheck className="w-6 h-6" />
                  <span className="text-[10px] font-mono font-bold mt-0.5">
                    {certificate.percentage}%
                  </span>
                </div>

                <div className="text-center sm:text-right">
                  <div className="text-[11px] font-semibold text-slate-500">MAS’UL RAHBAR</div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">
                    {certificate.issuerName}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
