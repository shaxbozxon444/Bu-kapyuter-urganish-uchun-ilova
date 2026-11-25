import { useEffect, useState } from 'react';
import { Award, CheckCircle2, Download, Loader2, Printer, Share2, X } from 'lucide-react';
import type { CertificateRecord } from '../data/curriculum';
import { renderCertificateImage } from '../utils/certificateCanvas';

interface CertificatePreviewModalProps {
  certificate: CertificateRecord;
  onClose: () => void;
}

export function CertificatePreviewModal({ certificate, onClose }: CertificatePreviewModalProps) {
  const [downloaded, setDownloaded] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [rendering, setRendering] = useState(true);

  useEffect(() => {
    let active = true;
    setRendering(true);
    void renderCertificateImage(certificate)
      .then((url) => {
        if (active) {
          setImageUrl(url);
          setRendering(false);
        }
      })
      .catch(() => {
        if (active) setRendering(false);
      });
    return () => {
      active = false;
    };
  }, [certificate]);

  const handleDownloadPng = async () => {
    const url = imageUrl || (await renderCertificateImage(certificate));
    const a = document.createElement('a');
    a.href = url;
    a.download = `BilimKod_Sertifikat_${certificate.id}.png`;
    a.click();
    setDownloaded(true);
    window.setTimeout(() => setDownloaded(false), 3000);
  };

  const handleShare = async () => {
    if (!imageUrl || !navigator.share) return;
    try {
      const res = await fetch(imageUrl);
      const blob = await res.blob();
      const file = new File([blob], `BilimKod_Sertifikat_${certificate.id}.png`, {
        type: 'image/png',
      });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `BilimKod Sertifikat — ${certificate.studentName}`,
          text: `${certificate.trackTitle} (${certificate.percentage}%)`,
          files: [file],
        });
      }
    } catch {
      // Cancelled
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="Sertifikat rasmi"
    >
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-4xl overflow-hidden shadow-xl my-auto">
        {/* Modal Action Bar */}
        <div className="px-4 sm:px-6 py-3.5 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
            <Award className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Rasmiy rasm sertifikat · {certificate.id}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => void handleDownloadPng()}
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
                  <span>Rasmni yuklash (PNG)</span>
                </>
              )}
            </button>

            {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && imageUrl && (
              <button
                type="button"
                onClick={() => void handleShare()}
                className="min-h-[42px] inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-800 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Share2 className="w-4 h-4 shrink-0" />
                <span>Ulashish</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => window.print()}
              className="hidden sm:inline-flex min-h-[42px] items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-800 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Printer className="w-4 h-4 shrink-0" />
              <span>Chop etish</span>
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

        {/* Rendered PNG Image View */}
        <div className="p-3 sm:p-6 bg-slate-100 dark:bg-slate-950">
          {rendering ? (
            <div className="py-16 flex flex-col items-center justify-center gap-2 text-xs text-slate-500">
              <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
              <span>Sertifikat rasmi tayyorlanmoqda...</span>
            </div>
          ) : imageUrl ? (
            <div id="certificate-print-area" className="max-w-3xl mx-auto rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white">
              <img
                src={imageUrl}
                alt={`${certificate.studentName} rasmiy sertifikati`}
                className="w-full h-auto block"
              />
            </div>
          ) : (
            <p className="py-12 text-center text-sm text-rose-600">
              Sertifikat rasmini ko‘rsatishda xatolik yuz berdi.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
